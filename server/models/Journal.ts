import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true }, // Main intro content
  image: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true }, // History, Adventure, Culture, etc.
  author: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  featured: { type: Boolean, default: false },
  
  // Specific structured content for tourists
  history: { type: String },
  whyFamous: { type: String },
  bestTime: { type: String },
  ticketPrices: { type: String },
  travelTips: [{ type: String }],
  nearbyAttractions: [{ name: String, description: String }],
  safetyTips: [{ type: String }],
  localCulture: { type: String }
}, { timestamps: true });

export const Journal = mongoose.model('Journal', journalSchema);
