import express from 'express';
import { getReviews, addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:targetType/:targetId', getReviews);
router.post('/', protect, addReview);

export default router;
