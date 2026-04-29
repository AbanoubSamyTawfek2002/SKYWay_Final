import { Request, Response } from 'express';
import { Booking } from '../models/Booking.js';
import mongoose from 'mongoose';
import { applyHotelPricing } from './hotelController.js';

export const createBooking = async (req: any, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, flightId, hotelId, carId, rooms, passengers, paymentIntentId, nights = 1 } = req.body;

    let finalAmount = 0;
    let adjacencyWarning: string | null = null;
    let priceBreakdown: any = null;
    let totalGuests: number = 1;
    
    if (type === 'hotel') {
      let hotel = await mongoose.model('Hotel').findById(hotelId).populate('rooms').session(session).lean();
      if (!hotel) throw new Error("Hotel not found");

      hotel = applyHotelPricing(hotel, rooms, nights); // calculates complete final pricing for all nights

      // Validate rooms
      if (!rooms || rooms.length === 0) throw new Error("No rooms selected");

      let totalRequestedRoomsForAdjacency = rooms.length;
      let allowAdjacencyCheckPassed = true;

      for (const requestedRoom of rooms) {
        const roomType = await mongoose.model('Room').findById(requestedRoom.roomTypeId).session(session) as any;
        if (!roomType) throw new Error(`Room type not found: ${requestedRoom.roomTypeId}`);
        if (roomType.hotelId.toString() !== hotelId) throw new Error("Room does not belong to the selected hotel");

        // Available rooms check (prevent overbooking)
        if (roomType.inventory.availableRooms < 1) {
           throw new Error(`Not enough availability for room type: ${roomType.name}`);
        }

        const reqAdults = requestedRoom.adults || 1;
        const reqChildren = requestedRoom.children || 0;
        const totalGuestsReq = reqAdults + reqChildren;

        // Capacity check
        if (reqAdults > roomType.capacity.maxAdults) throw new Error(`Too many adults for room: ${roomType.name}`);
        if (reqChildren > roomType.capacity.maxChildren) throw new Error(`Too many children for room: ${roomType.name}`);
        if (totalGuestsReq > roomType.capacity.maxTotalGuests) throw new Error(`Total guests exceed capacity for room: ${roomType.name}`);

        // Decrease availability securely
        roomType.inventory.availableRooms -= 1;
        await roomType.save({ session });

        // Adjacency metadata
        if (totalRequestedRoomsForAdjacency > 1) {
          if (!roomType.adjacency.allowAdjacent) {
            allowAdjacencyCheckPassed = false;
          }
          if (roomType.adjacency.allowAdjacent && roomType.adjacency.maxAdjacentRooms < totalRequestedRoomsForAdjacency) {
            allowAdjacencyCheckPassed = false;
          }
        }
      }

      finalAmount = (hotel as any).calculatedTotalPrice;
      priceBreakdown = (hotel as any).calculatedTotalBreakdown;
      totalGuests = priceBreakdown ? priceBreakdown.totalGuests : 1;

      if (totalRequestedRoomsForAdjacency > 1 && !allowAdjacencyCheckPassed) {
        adjacencyWarning = "Adjacent rooms not guaranteed";
      }

      // Backend mismatch validation
      if (Math.abs(finalAmount - req.body.totalAmount) > 2) {
         throw new Error("Price mismatch detected. Please refresh and try again.");
      }
    } else {
      // Logic for flight/car
      finalAmount = req.body.totalAmount; 
    }

    const booking = new Booking({
      bookingReference: 'BKG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      userId: req.user._id,
      type,
      flightId: type === 'flight' ? flightId : undefined,
      hotelId: type === 'hotel' ? hotelId : undefined,
      carId: type === 'car' ? carId : undefined,
      passengers,
      rooms: type === 'hotel' ? rooms : [],
      nights: type === 'hotel' ? nights : undefined,
      price: finalAmount,
      totalAmount: finalAmount,
      priceBreakdown: type === 'hotel' ? priceBreakdown : undefined,
      totalGuests: type === 'hotel' ? totalGuests : undefined,
      status: 'confirmed',
      paymentIntentId
    });

    const createdBooking = await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      booking: createdBooking,
      warning: adjacencyWarning
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getMyBookings = async (req: any, res: Response) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('flightId')
    .populate('hotelId')
    .populate('carId')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

export const getBookingById = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('flightId')
      .populate('hotelId')
      .populate('carId');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'Booking is already cancelled' });
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    res.json({ clientSecret: 'pi_mock_secret_' + Math.floor(Math.random()*10000) });
  } catch (err: any) {
    res.status(500).json({ message: 'Payment gateway error' });
  }
};
