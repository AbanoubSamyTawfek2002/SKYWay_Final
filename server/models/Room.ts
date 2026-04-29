import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['single', 'double', 'suite'], required: true },
  capacity: {
    maxAdults: { type: Number, required: true },
    maxChildren: { type: Number, required: true },
    maxTotalGuests: { type: Number, required: true }
  },
  pricing: {
    pricePerNight: { type: Number, required: true },
    extraAdultPrice: { type: Number, required: true },
    childPrice: { type: Number, required: true },
    includedGuests: { type: Number, default: 1 },
    freeGuests: { type: Number, default: 1 }
  },
  inventory: {
    totalRooms: { type: Number, required: true },
    availableRooms: { type: Number, required: true }
  },
  features: [{ type: String }],
  adjacency: {
    allowAdjacent: { type: Boolean, default: false },
    maxAdjacentRooms: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Room = mongoose.model('Room', roomSchema);
