import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['flight', 'hotel', 'car'], required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  rooms: [{
    roomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    adults: { type: Number },
    children: { type: Number },
    guests: [{ type: String }]
  }],
  nights: { type: Number, default: 1 },
  passengers: [{
    name: String,
    type: { type: String },
    seat: String,
    ticketNumber: String
  }],
  date: { type: Date, default: Date.now },
  priceBreakdown: {
    basePrice: Number,
    extraGuestsPrice: Number,
    taxes: Number
  },
  totalGuests: { type: Number },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentIntentId: { type: String }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
