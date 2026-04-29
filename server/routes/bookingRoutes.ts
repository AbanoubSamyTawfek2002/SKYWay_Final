import express from 'express';
import { createBooking, getMyBookings, createPaymentIntent, cancelBooking, getBookingById } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/payment-intent', protect, createPaymentIntent);

export default router;
