const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // e.g., '🌱', '🏆', '🔥'
  category: { type: String, enum: ['recycling', 'marketplace', 'community', 'carbon', 'achievement'], default: 'recycling' },
  pointsRequired: { type: Number, default: 0 },
  criteria: {
    type: { type: String }, // e.g. 'total_scans', 'total_weight', 'volunteer_count'
    value: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
