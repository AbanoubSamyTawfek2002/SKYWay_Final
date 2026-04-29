import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['SUV', 'Sedan', 'Economy', 'Luxury', 'Convertible'], required: true },
  pricePerDay: { type: Number, required: true },
  images: [{ type: String }],
  seats: { type: Number, required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
  location: { 
    name: { type: String, default: 'Airport Terminal 1' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  city: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Car = mongoose.model('Car', carSchema);
