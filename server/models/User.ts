import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  phone: { type: String },
  dob: { type: Date },
  address: { type: String },
  location: { type: String },
  profileImage: { type: String },
  googleId: { type: String },
  languagePreference: { type: String, default: 'en' },
  otpCode: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
