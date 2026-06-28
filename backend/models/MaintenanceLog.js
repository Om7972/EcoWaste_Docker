const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartBin', required: true },
  type: {
    type: String,
    enum: ['sensor_repair', 'battery_replace', 'physical_damage', 'cleaning', 'calibration', 'replacement', 'inspection'],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  cost: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  partsReplaced: [{ type: String }],
}, { timestamps: true });

maintenanceLogSchema.index({ bin: 1 });
maintenanceLogSchema.index({ status: 1 });
maintenanceLogSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
