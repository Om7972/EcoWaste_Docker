const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  status: { type: String, enum: ['available', 'on_duty', 'off_duty'], default: 'available' },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  rating: { type: Number, default: 5.0 },
  completedCollections: { type: Number, default: 0 }
}, { timestamps: true });

driverSchema.index({ organization: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Driver', driverSchema);
