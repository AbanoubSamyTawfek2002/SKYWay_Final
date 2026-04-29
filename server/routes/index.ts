import express from 'express';
import authRoutes from './authRoutes.js';
import flightRoutes from './flightRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import contactRoutes from './contactRoutes.js';
import adminRoutes from './adminRoutes.js';
import carRoutes from './carRoutes.js';
import journalRoutes from './journalRoutes.js';
import { Flight } from '../models/Flight.js';
import { Hotel } from '../models/Hotel.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/hotels', hotelRoutes);
router.use('/cars', carRoutes);
router.use('/journals', journalRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

// Compatibility route for Destinations page
router.get('/destinations/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeCity = escapeRegExp(city);
    const hotels = await Hotel.find({ city: new RegExp(safeCity, 'i') });
    const flights = await Flight.find({ arrivalCity: new RegExp(safeCity, 'i') });
    
    res.json({
      city,
      description: `Discover the beauty and culture of ${city}.`,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=1200&q=80',
      hotels,
      flights
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching destination data' });
  }
});

export default router;
