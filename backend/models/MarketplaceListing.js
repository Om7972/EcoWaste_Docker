const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  materialType: { type: String, enum: ['plastic', 'paper', 'glass', 'metal', 'ewaste', 'organic', 'textile', 'other'], required: true },
  weight: { type: Number, required: true }, // in kg
  price: { type: Number, required: true }, // Starting bid or fixed price
  images: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    address: { type: String, required: true }
  },
  status: { type: String, enum: ['active', 'sold', 'pending_pickup', 'cancelled'], default: 'active' },
  bids: [{
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupSchedule: { type: Date },
  moderated: { type: Boolean, default: false },
  moderationNotes: { type: String }
}, { timestamps: true });

marketplaceListingSchema.index({ location: '2dsphere' });
marketplaceListingSchema.index({ status: 1 });
marketplaceListingSchema.index({ materialType: 1 });

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);
