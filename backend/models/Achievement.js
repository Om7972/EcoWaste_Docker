const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // e.g. percentage of progress
  unlocked: { type: Boolean, default: false }
}, { timestamps: true });

achievementSchema.index({ user: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
