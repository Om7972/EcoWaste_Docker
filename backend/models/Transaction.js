const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceListing', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'refunded', 'failed'], default: 'pending' },
  transactionType: { type: String, enum: ['marketplace_sale', 'reward_redemption'], default: 'marketplace_sale' },
  paymentMethod: { type: String, default: 'wallet' },
  pickupTime: { type: Date },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: { type: String }
  },
  auditLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
