const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartBin', required: true },
  type: {
    type: String,
    enum: ['overflow', 'predicted_overflow', 'sensor_offline', 'low_battery', 'maintenance_due', 'temperature_high', 'collection_missed'],
    required: true,
  },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'warning' },
  message: { type: String, required: true },
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt: { type: Date },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },
  notificationsSent: [{
    channel: { type: String, enum: ['in_app', 'email', 'sms'] },
    sentAt: { type: Date, default: Date.now },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

alertSchema.index({ bin: 1 });
alertSchema.index({ resolved: 1, type: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
