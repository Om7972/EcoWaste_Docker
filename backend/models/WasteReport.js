const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  prediction: {
    category: { type: String, enum: ['plastic', 'paper', 'glass', 'organic', 'metal', 'ewaste', 'textile'], required: true },
    confidence: { type: Number, required: true },
    recyclable: { type: Boolean, required: true },
    tips: [{ type: String }],
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  pointsEarned: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('WasteReport', wasteReportSchema);
