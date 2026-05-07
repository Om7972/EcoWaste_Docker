const mongoose = require('mongoose');

const recyclingCenterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  acceptedMaterials: [{ type: String }],
  operatingHours: { type: String, default: '9:00 AM - 5:00 PM' },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  isOpen: { type: Boolean, default: true },
}, { timestamps: true });

recyclingCenterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RecyclingCenter', recyclingCenterSchema);
