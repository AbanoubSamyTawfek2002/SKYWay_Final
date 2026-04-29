import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel.js';
import { Room } from '../models/Room.js';
import mongoose from 'mongoose';

// Ensure Room is registered 
if (Room) {}

export const applyHotelPricing = (hotel: any, requestedRooms: any[] = [], nights: number = 1) => {
  const EXTRA_ADULT_RATE = 0.25;   // each extra adult = +25% of base
  const CHILD_RATE = 0.70;         // each child = 70% of base
  const TAX_RATE = 0.15;           // 15% tax

  let totalPerNight = 0;
  let breakdown = {
    basePrice: 0,
    extraGuestsPrice: 0,
    taxes: 0,
    roomsCount: 0,
    totalGuests: 0,
    subtotal: 0
  };

  const activeRooms = requestedRooms.length > 0 ? requestedRooms : [{ adults: 1, children: 0 }];

  activeRooms.forEach((room) => {
    const adults = room.adults || 1;
    const children = room.children || 0;
    
    breakdown.roomsCount += 1;
    breakdown.totalGuests += (adults + children);

    let roomCost = hotel.pricePerNight; // 1st adult included in basePrice
    
    // Calculate extra adults cost
    if (adults > 1) {
      const extraAdultsCost = (adults - 1) * (hotel.pricePerNight * EXTRA_ADULT_RATE);
      roomCost += extraAdultsCost;
      breakdown.extraGuestsPrice += extraAdultsCost * nights;
    }

    // Calculate children cost
    if (children > 0) {
      const childrenCost = children * (hotel.pricePerNight * CHILD_RATE);
      roomCost += childrenCost;
      breakdown.extraGuestsPrice += childrenCost * nights;
    }

    totalPerNight += roomCost;
    breakdown.basePrice += hotel.pricePerNight * nights;
  });

  const subtotal = totalPerNight * nights;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  breakdown.subtotal = subtotal;
  breakdown.taxes = tax;

  hotel.calculatedTotalBreakdown = breakdown;
  hotel.calculatedTotalPrice = grandTotal;

  return hotel;
};

export const getHotels = async (req: Request, res: Response) => {
  try {
    const { location, page = 1, limit = 12, city, country, rooms: roomsQuery, checkIn, checkOut } = req.query;
    let query: any = {};
    
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    if (location) {
      const safeLocation = escapeRegExp(location as string);
      query.$or = [
        { name: new RegExp(safeLocation, 'i') },
        { city: new RegExp(safeLocation, 'i') },
        { country: new RegExp(safeLocation, 'i') },
        { address: new RegExp(safeLocation, 'i') }
      ];
    }

    if (city) query["city"] = new RegExp(escapeRegExp(city as string), 'i');
    if (country) query["country"] = new RegExp(escapeRegExp(country as string), 'i');

    const skip = (Number(page) - 1) * Number(limit);
    
    // Base hotel search
    let hotels = await Hotel.find(query).populate('rooms').skip(skip).limit(Number(limit)).lean();
    let total = await Hotel.countDocuments(query);

    // Fallback: If no results found with query, return all hotels
    if (hotels.length === 0) {
      hotels = await Hotel.find({}).populate('rooms').limit(Number(limit)).lean();
      total = await Hotel.countDocuments({});
    }

    let requestedRooms: any[] = [];
    if (roomsQuery) {
      try {
        requestedRooms = JSON.parse(roomsQuery as string);
      } catch(e) {
        console.error("Failed to parse rooms query");
      }
    }


    // Filter hotels by room availability if requestedRooms are passing
    if (requestedRooms.length > 0) {
      hotels = hotels.filter((hotel: any) => {
        if (!hotel.rooms || hotel.rooms.length === 0) return false;
        
        const availableRooms = hotel.rooms.filter((room: any) => room.inventory && room.inventory.availableRooms > 0);
        const bookedRoomIds = new Map();
        
        // Basic match for each requested room
        let canFulfill = true;
        for (const reqRoom of requestedRooms) {
          const _adults = reqRoom.adults || 1;
          const _children = reqRoom.children || 0;
          const _total = _adults + _children;
          
          // Find if any roomtype can support this reqRoom
          const matchingType = availableRooms.find((rt: any) => {
              const used = bookedRoomIds.get(rt._id.toString()) || 0;
              return rt.capacity && rt.capacity.maxAdults >= _adults && 
                     rt.capacity.maxChildren >= _children &&
                     rt.capacity.maxTotalGuests >= _total &&
                     rt.inventory.availableRooms > used;
          });
          
          if (!matchingType) {
            canFulfill = false;
            break;
          } else {
             const used = bookedRoomIds.get(matchingType._id.toString()) || 0;
             bookedRoomIds.set(matchingType._id.toString(), used + 1);
          }
        }
        return canFulfill;
      });
      
      // update total since we filtered in memory
      total = hotels.length;
    }

    hotels = hotels.map(h => applyHotelPricing(h, requestedRooms));

    res.json({
      data: hotels,
      pricingParams: requestedRooms.length ? { requestedRooms } : {},
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error("Error in getHotels:", error);
    res.status(500).json({ message: "Failed to fetch hotels", error: error.message });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  const hotel = await Hotel.findById(req.params.id).populate('rooms').lean();
  let requestedRooms: any[] = [];
  if (req.query.rooms) {
    try {
      requestedRooms = JSON.parse(req.query.rooms as string);
    } catch(e) {}
  }
  if (hotel) {
    const pricedHotel = applyHotelPricing(hotel, requestedRooms);
    res.json(pricedHotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};
