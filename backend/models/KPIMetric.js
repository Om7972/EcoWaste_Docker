const mongoose = require('mongoose');

const kpiMetricSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  ward: { type: String, default: 'General' },
  date: { type: Date, default: Date.now },
  wasteCollectedKg: { type: Number, default: 0 },
  fuelConsumedLiters: { type: Number, default: 0 },
  costPerTon: { type: Number, default: 0 },
  resolvedComplaintsCount: { type: Number, default: 0 },
  totalComplaintsCount: { type: Number, default: 0 },
  averageResolutionTimeHours: { type: Number, default: 0 },
  collectionEfficiencyPercentage: { type: Number, default: 0 },
  predictedWasteKg: { type: Number, default: 0 }
}, { timestamps: true });

kpiMetricSchema.index({ organization: 1, date: 1, ward: 1 }, { unique: true });

module.exports = mongoose.model('KPIMetric', kpiMetricSchema);
