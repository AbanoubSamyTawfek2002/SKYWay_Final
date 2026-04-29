import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  airlineLogo: { type: String },
  flightNumber: { type: String, required: true },
  departureCity: { type: String, required: true },
  arrivalCity: { type: String, required: true },
  countryFrom: { type: String },
  countryTo: { type: String },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, default: 100 },
  class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  ticketType: { type: String, enum: ['One-way', 'Round-trip'], default: 'One-way' },
  stops: { type: Number, default: 0 },
  duration: { type: String },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String },
  imageType: { type: String, default: 'flight' },
  coordinates: {
    from: { lat: { type: Number }, lng: { type: Number } },
    to: { lat: { type: Number }, lng: { type: Number } }
  },
  reviews: [{
    username: String,
    avatar: String,
    rating: Number,
    date: String,
    comment: String,
    verified: Boolean
  }]
}, { timestamps: true });

export const Flight = mongoose.model('Flight', flightSchema);
