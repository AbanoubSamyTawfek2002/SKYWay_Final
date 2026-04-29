import { Request, Response } from 'express';
import { Car } from '../models/Car.js';

export const getCars = async (req: Request, res: Response) => {
  const { location, type, page = 1, limit = 12 } = req.query;
  let query: any = {};
  
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  if (location) {
    const safeLocation = escapeRegExp(location as string);
    query.$or = [
      { city: new RegExp(safeLocation, 'i') },
      { country: new RegExp(safeLocation, 'i') }
    ];
  }

  if (type) query.type = new RegExp(escapeRegExp(type as string), 'i');

  const skip = (Number(page) - 1) * Number(limit);
  const cars = await Car.find(query).skip(skip).limit(Number(limit));
  const total = await Car.countDocuments(query);

  res.json({
    data: cars,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  });
};

export const getCarById = async (req: Request, res: Response) => {
  const car = await Car.findById(req.params.id);
  if (car) {
    res.json(car);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
};
