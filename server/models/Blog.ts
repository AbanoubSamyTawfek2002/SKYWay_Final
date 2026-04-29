import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'SkyWay Editor' },
  category: { type: String },
  date: { type: Date, default: Date.now },
  slug: { type: String, unique: true },
});

export const Blog = mongoose.model('Blog', BlogSchema);
