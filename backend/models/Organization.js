const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  country: { type: String, default: 'India' },
  domain: { type: String, unique: true }, // For tenant workspace isolation
  status: { type: String, enum: ['active', 'suspended', 'trial'], default: 'active' },
  subscription: {
    plan: { type: String, enum: ['basic', 'growth', 'enterprise'], default: 'basic' },
    status: { type: String, enum: ['active', 'past_due', 'cancelled'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    usageLimits: {
      maxBins: { type: Number, default: 50 },
      maxVehicles: { type: Number, default: 10 },
      maxUsers: { type: Number, default: 20 }
    }
  },
  settings: {
    slaTargetResolutionHours: { type: Number, default: 24 },
    autoAssignDrivers: { type: Boolean, default: true },
    alertThresholdFillPercentage: { type: Number, default: 80 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
