const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  plateNumber: { type: String, required: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true }, // in kg
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
  fuelType: { type: String, enum: ['diesel', 'cng', 'electric', 'petrol'], default: 'diesel' },
  currentFuelLevel: { type: Number, default: 100 }, // percentage
  fuelEfficiency: { type: Number, default: 8.5 }, // km per liter
  odometer: { type: Number, default: 0 }, // in km
  nextMaintenanceDate: { type: Date }
}, { timestamps: true });

vehicleSchema.index({ organization: 1, plateNumber: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
