const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stops: [{
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    address: String,
    completed: { type: Boolean, default: false },
  }],
  status: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'planned' },
  scheduledDate: { type: Date },
  estimatedDuration: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
