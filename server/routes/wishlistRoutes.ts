import express from 'express';
import { getMyWishlist, addToWishlist, removeFromWishlist, getWishlistIds } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMyWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:id', protect, removeFromWishlist);
router.get('/ids', protect, getWishlistIds);

export default router;
