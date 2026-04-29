import { Response } from 'express';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import { Hotel } from '../models/Hotel.js';

export const getAdminStats = async (req: any, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalFlights = await Flight.countDocuments();
  const totalHotels = await Hotel.countDocuments();
  const bookings = await Booking.find();
  const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

  res.json({
    totalUsers,
    totalFlights,
    totalHotels,
    totalRevenue
  });
};
