import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  userAvatar: { type: String },
  targetType: { type: String, enum: ['flight', 'hotel', 'car'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
