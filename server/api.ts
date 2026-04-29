import express from 'express';
import { Flight, Hotel, Booking, Blog, Review, Wishlist } from './models.js';
import { verifyToken, checkRole } from './auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// Blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

// Destinations
router.get('/destinations/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const hotels = await Hotel.find({ city: new RegExp(city, 'i') });
    const flights = await Flight.find({ arrivalCity: new RegExp(city, 'i') });
    
    // City descriptions could be in a separate model, for now we can use a lookup or just return data
    const cityDescriptions: Record<string, string> = {
      'Paris': 'The City of Light, synonymous with romance, art, and world-class cuisine.',
      'Tokyo': 'A vibrant metropolis blending futuristic technology with deep-rooted traditions.',
      'Dubai': 'A shimmering desert oasis known for ultra-modern architecture and luxury shopping.',
      'London': 'A global city steeped in history, offering a mix of royal heritage and contemporary culture.',
      'New York': 'The Big Apple, a bustling hub of entertainment, finance, and iconic landmarks.',
      'Santorini': 'A breathtaking Greek island famous for its white-washed buildings and stunning caldera views.',
      'Bangkok': 'A sensory feast of golden temples, street food markets, and high-energy urban life.',
      'Kyoto': 'The heart of traditional Japan, filled with serene temples, gardens, and teahouses.'
    };

    const images: Record<string, string> = {
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'Tokyo': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      'Santorini': 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'Bangkok': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    };

    res.json({
      city,
      description: cityDescriptions[city] || 'Discover the beauty and culture of this amazing destination.',
      image: images[city] || 'https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=1200&q=80',
      hotels,
      flights
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching destination data' });
  }
});

// Flights
router.get('/flights', async (req, res) => {
  try {
    const { from, to, date, page = 1, limit = 10 } = req.query;
    let query: any = {};
    if (from) query.departureCity = new RegExp(from as string, 'i');
    if (to) query.arrivalCity = new RegExp(to as string, 'i');
    
    // For specific country/city categories from user request
    if (req.query.category) {
      query.arrivalCity = new RegExp(req.query.category as string, 'i');
    }

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
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flights' });
  }
});

router.get('/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flight' });
  }
});

// Hotels
router.get('/hotels', async (req, res) => {
  try {
    const { location, page = 1, limit = 12, city, country } = req.query;
    let query: any = {};
    
    if (location) {
      query.$or = [
        { city: new RegExp(location as string, 'i') },
        { country: new RegExp(location as string, 'i') },
        { location: new RegExp(location as string, 'i') }
      ];
    }

    if (city) query.city = city as string;
    if (country) query.country = country as string;

    const skip = (Number(page) - 1) * Number(limit);
    const hotels = await Hotel.find(query).skip(skip).limit(Number(limit));
    const total = await Hotel.countDocuments(query);

    res.json({
      data: hotels,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});

router.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hotel' });
  }
});

// Create Payment Intent
router.post('/create-payment-intent', verifyToken, async (req: any, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: 'Stripe error' });
  }
});

// Create Booking
router.post('/bookings', verifyToken, async (req: any, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
      status: 'confirmed' // Usually pending until payment success webhook
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// User Bookings
router.get('/my-bookings', verifyToken, async (req: any, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('flightId')
      .populate('hotelId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Admin routes
router.get('/admin/stats', verifyToken, checkRole(['admin', 'support']), async (req, res) => {
    const totalUsers = await Flight.countDocuments(); // mock stats
    const totalBookings = await Booking.countDocuments();
    res.json({ totalUsers, totalBookings });
});

// Reviews System
router.get('/reviews/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const reviews = await Review.find({ targetType, targetId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
      
    // Format response to use userName directly if userId is missing
    const formattedReviews = reviews.map(r => {
      const obj = r.toObject() as any;
      if (!obj.userId && obj.userName) {
        obj.userId = { _id: 'guest', name: obj.userName, avatar: obj.userAvatar };
      }
      return obj;
    });
    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reviews', verifyToken, async (req: any, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!['flight', 'hotel'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Check if user has a completed booking for this target
    const bookingQuery: any = {
      userId,
      type: targetType,
      status: 'completed'
    };
    if (targetType === 'flight') bookingQuery.flightId = targetId;
    else bookingQuery.hotelId = targetId;

    const booking = await Booking.findOne(bookingQuery);

    if (!booking) {
      return res.status(403).json({ message: `Only users with a completed ${targetType} booking can leave a review.` });
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({ userId, targetType, targetId });
    if (existingReview) {
      return res.status(400).json({ message: `You have already reviewed this ${targetType}.` });
    }

    const review = new Review({
      userId,
      targetType,
      targetId,
      rating: Number(rating),
      comment
    });

    await review.save();
    await review.populate('userId', 'name');

    // Update target average rating
    const reviews = await Review.find({ targetType, targetId });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    if (targetType === 'hotel') {
      await Hotel.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    } else {
      await Flight.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/reviews/:id', verifyToken, async (req: any, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Allow user to delete their own review OR admin can delete any
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Re-calculate target average rating
    const { targetType, targetId } = review;
    const reviews = await Review.find({ targetType, targetId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
      : 0;
    
    if (targetType === 'hotel') {
      await Hotel.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    } else {
      await Flight.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    }

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Wishlist System
router.get('/wishlist', verifyToken, async (req: any, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id });
    
    // Enrich with item details
    const enrichedItems = await Promise.all(items.map(async (item) => {
      try {
        let details;
        if (item.itemType === 'flight') {
          details = await Flight.findById(item.itemId);
        } else {
          details = await Hotel.findById(item.itemId);
        }
        return {
          _id: item._id,
          itemType: item.itemType,
          itemId: item.itemId,
          createdAt: item.createdAt,
          details: details || { name: 'Item no longer available' }
        };
      } catch (err) {
        return {
          _id: item._id,
          itemType: item.itemType,
          itemId: item.itemId,
          createdAt: item.createdAt,
          details: { name: 'Error loading details' }
        };
      }
    }));

    res.json(enrichedItems);
  } catch (err) {
    console.error('Wishlist fetch error:', err);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

router.post('/wishlist', verifyToken, async (req: any, res) => {
  try {
    const { itemType, itemId } = req.body;
    
    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: req.user.id, itemType, itemId });
    if (existing) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    const newItem = new Wishlist({
      userId: req.user.id,
      itemType,
      itemId
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

router.delete('/wishlist/:id', verifyToken, async (req: any, res) => {
  try {
    const item = await Wishlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

// Helper route to check wishlist status for multiple items at once
router.get('/wishlist/ids', verifyToken, async (req: any, res) => {
  try {
    // Return objects with itemId and its corresponding wishlist _id
    const items = await Wishlist.find({ userId: req.user.id }, 'itemId _id');
    res.json(items.map(i => ({ itemId: i.itemId, _id: i._id })));
  } catch (err) {
    console.error('Wishlist IDs error:', err);
    res.status(500).json({ message: 'Error fetching wishlist ids' });
  }
});

export default router;
