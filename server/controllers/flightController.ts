import { Request, Response } from 'express';
import { Flight } from '../models/Flight.js';

export const getFlights = async (req: Request, res: Response) => {
  const { from, to, page = 1, limit = 10, category, ticketType, flightClass } = req.query;
  let query: any = {};
  
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  if (from) query.departureCity = new RegExp(escapeRegExp(from as string), 'i');
  if (to) query.arrivalCity = new RegExp(escapeRegExp(to as string), 'i');
  if (category) query.arrivalCity = new RegExp(escapeRegExp(category as string), 'i');
  if (ticketType) query.ticketType = ticketType;
  if (flightClass) query.class = flightClass;

  const skip = (Number(page) - 1) * Number(limit);
  const flights = await Flight.find(query).skip(skip).limit(Number(limit));
  const total = await Flight.countDocuments(query);

  res.json({
    data: flights,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  });
};

export const getFlightById = async (req: Request, res: Response) => {
  const flight = await Flight.findById(req.params.id);
  if (flight) {
    res.json(flight);
  } else {
    res.status(404).json({ message: 'Flight not found' });
  }
};
