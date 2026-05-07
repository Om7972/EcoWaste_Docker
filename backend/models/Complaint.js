const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  description: { type: String, required: [true, 'Description is required'], maxlength: 2000 },
  category: { type: String, enum: ['overflow', 'illegal_dump', 'missed_pickup', 'broken_bin', 'other'], required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved', 'rejected'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String, default: '' },
  },
  images: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
}, { timestamps: true });

complaintSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Complaint', complaintSchema);
