import mongoose from 'mongoose';
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    basePricePerNight: { type: Number },
    category: { type: String, enum: ['budget', 'standard', 'luxury'] },
    pricingVersion: { type: String, default: 'v1' },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    description: { type: String },
    images: [{ type: String }],
    amenities: [{ type: String }],
    location: {
        city: { type: String },
        country: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    },
    stars: { type: Number, default: 5 },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
}, { timestamps: true });
export const Hotel = mongoose.model('Hotel', hotelSchema);
