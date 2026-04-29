import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { Hotel } from '../models/Hotel.js';
import { Flight } from '../models/Flight.js';

export const getReviews = async (req: Request, res: Response) => {
  const { targetType, targetId } = req.params;
  const reviews = await Review.find({ targetType, targetId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const addReview = async (req: any, res: Response) => {
  const { targetType, targetId, rating, comment } = req.body;

  const review = new Review({
    userId: req.user._id,
    targetType,
    targetId,
    rating,
    comment
  });

  await review.save();

  // Update target statistics
  const reviews = await Review.find({ targetType, targetId });
  const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

  if (targetType === 'hotel') {
    await Hotel.findByIdAndUpdate(targetId, { rating: avgRating, reviewCount: reviews.length });
  } else {
    await Flight.findByIdAndUpdate(targetId, { rating: avgRating, reviewCount: reviews.length });
  }

  res.status(201).json(review);
};
