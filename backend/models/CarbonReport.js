const mongoose = require('mongoose');

const carbonReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalCarbonSaved: { type: Number, default: 0 }, // in kg of CO2 equivalent
  recycledWeights: {
    plastic: { type: Number, default: 0 }, // kg
    paper: { type: Number, default: 0 },
    glass: { type: Number, default: 0 },
    metal: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    ewaste: { type: Number, default: 0 }
  },
  aiSuggestions: [{ type: String }],
  monthlyImpactScore: { type: Number, default: 0 },
  lastCalculated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CarbonReport', carbonReportSchema);
