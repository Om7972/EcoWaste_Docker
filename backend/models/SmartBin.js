const mongoose = require('mongoose');

const smartBinSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    address: { type: String, required: true },
    zone: { type: String, default: 'General' },
  },
  binType: {
    type: String,
    enum: ['general', 'recyclable', 'organic', 'hazardous', 'ewaste'],
    default: 'general',
  },
  capacity: { type: Number, default: 100, min: 0 }, // in liters
  currentFillLevel: { type: Number, default: 0, min: 0, max: 100 }, // percentage
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'full', 'offline'],
    default: 'active',
  },
  sensorStatus: {
    type: String,
    enum: ['online', 'offline', 'low_battery', 'error'],
    default: 'online',
  },
  batteryLevel: { type: Number, default: 100, min: 0, max: 100 },
  lastEmptied: { type: Date, default: Date.now },
  lastSensorPing: { type: Date, default: Date.now },
  avgFillRate: { type: Number, default: 0 }, // % per hour
  predictedFullTime: { type: Date },
  assignedCollector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  installDate: { type: Date, default: Date.now },
  manufacturer: { type: String, default: 'EcoWaste IoT' },
  model: { type: String, default: 'SB-2000' },
  metadata: {
    temperature: { type: Number, default: 25 },
    humidity: { type: Number, default: 50 },
    odorLevel: { type: Number, default: 0, min: 0, max: 10 },
    weight: { type: Number, default: 0 }, // kg
  },
}, { timestamps: true });

smartBinSchema.index({ 'location': '2dsphere' });
smartBinSchema.index({ currentFillLevel: -1 });
smartBinSchema.index({ status: 1 });

// Virtual for fill status color
smartBinSchema.virtual('fillStatus').get(function() {
  if (this.currentFillLevel < 40) return 'green';
  if (this.currentFillLevel < 80) return 'yellow';
  return 'red';
});

smartBinSchema.set('toJSON', { virtuals: true });
smartBinSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SmartBin', smartBinSchema);
