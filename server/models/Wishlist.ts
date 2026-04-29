import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, enum: ['flight', 'hotel'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
