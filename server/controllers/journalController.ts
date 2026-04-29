import { Request, Response } from 'express';
import { Journal } from '../models/Journal.js';

export const getJournals = async (req: Request, res: Response) => {
  const { category, search, page = 1, limit = 9, featured } = req.query;
  const query: any = {};
  
  if (category && category !== 'All') {
    query.category = new RegExp(category as string, 'i');
  }

  if (search) {
    query.$or = [
      { title: new RegExp(search as string, 'i') },
      { city: new RegExp(search as string, 'i') },
      { country: new RegExp(search as string, 'i') }
    ];
  }

  if (featured === 'true') {
    query.featured = true;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const journals = await Journal.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Journal.countDocuments(query);

  res.json({
    data: journals,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  });
};

export const getJournalById = async (req: Request, res: Response) => {
  const journal = await Journal.findById(req.params.id);
  if (journal) {
    res.json(journal);
  } else {
    res.status(404).json({ message: 'Journal article not found' });
  }
};

export const createJournal = async (req: Request, res: Response) => {
  try {
    const journal = new Journal(req.body);
    const createdJournal = await journal.save();
    res.status(201).json(createdJournal);
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid journal data', error: error.message });
  }
};
