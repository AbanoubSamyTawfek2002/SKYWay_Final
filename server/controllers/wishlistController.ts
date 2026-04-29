import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Flight } from '../models/Flight.js';
import { Hotel } from '../models/Hotel.js';

export const getMyWishlist = async (req: any, res: Response) => {
  const items = await Wishlist.find({ userId: req.user._id });
  
  const enriched = await Promise.all(items.map(async (item) => {
    let details;
    if (item.itemType === 'flight') details = await Flight.findById(item.itemId);
    else details = await Hotel.findById(item.itemId);
    
    return {
      _id: item._id,
      itemType: item.itemType,
      itemId: item.itemId,
      details: details || { name: 'Item not found' }
    };
  }));

  res.json(enriched);
};

export const addToWishlist = async (req: any, res: Response) => {
  const { itemType, itemId } = req.body;
  
  const existing = await Wishlist.findOne({ userId: req.user._id, itemType, itemId });
  if (existing) return res.status(400).json({ message: 'Already in wishlist' });

  const item = await Wishlist.create({ userId: req.user._id, itemType, itemId });
  res.status(201).json(item);
};

export const removeFromWishlist = async (req: any, res: Response) => {
  await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Removed from wishlist' });
};

export const getWishlistIds = async (req: any, res: Response) => {
  const items = await Wishlist.find({ userId: req.user._id }, '_id itemId');
  res.json(items);
};
