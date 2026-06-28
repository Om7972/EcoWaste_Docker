const mongoose = require('mongoose');

const collectionHistorySchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartBin', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'CollectionRoute' },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectedAt: { type: Date, default: Date.now },
  fillLevelBefore: { type: Number, required: true },
  fillLevelAfter: { type: Number, default: 0 },
  wasteWeight: { type: Number, default: 0 }, // kg
  wasteType: { type: String, enum: ['general', 'recyclable', 'organic', 'hazardous', 'ewaste'], default: 'general' },
  notes: { type: String, default: '' },
  wasOverflowing: { type: Boolean, default: false },
  collectionDuration: { type: Number, default: 0 }, // minutes
}, { timestamps: true });

collectionHistorySchema.index({ bin: 1, collectedAt: -1 });
collectionHistorySchema.index({ collectedAt: -1 });

module.exports = mongoose.model('CollectionHistory', collectionHistorySchema);
