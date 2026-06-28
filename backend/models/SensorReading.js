const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartBin', required: true, index: true },
  binId: { type: String, required: true, index: true },
  fillLevel: { type: Number, required: true, min: 0, max: 100 },
  temperature: { type: Number, default: 25 },
  humidity: { type: Number, default: 50 },
  weight: { type: Number, default: 0 },
  batteryLevel: { type: Number, default: 100 },
  odorLevel: { type: Number, default: 0 },
  sensorStatus: { type: String, enum: ['online', 'offline', 'low_battery', 'error'], default: 'online' },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

// TTL index: auto-delete readings older than 90 days
sensorReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Compound index for efficient queries
sensorReadingSchema.index({ bin: 1, timestamp: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
