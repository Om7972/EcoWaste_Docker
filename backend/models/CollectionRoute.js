const mongoose = require('mongoose');

const collectionRouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicle: { type: String, default: 'Truck-001' },
  stops: [{
    bin: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartBin' },
    order: { type: Number, required: true },
    estimatedArrival: { type: Date },
    actualArrival: { type: Date },
    completed: { type: Boolean, default: false },
    fillLevelAtCollection: { type: Number },
  }],
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned',
  },
  scheduledDate: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  totalDistance: { type: Number, default: 0 }, // km
  estimatedDuration: { type: Number, default: 0 }, // minutes
  actualDuration: { type: Number, default: 0 },
  fuelEstimate: { type: Number, default: 0 }, // liters
  efficiency: { type: Number, default: 0 }, // percentage
  optimized: { type: Boolean, default: false },
  zone: { type: String, default: 'General' },
}, { timestamps: true });

collectionRouteSchema.index({ scheduledDate: 1 });
collectionRouteSchema.index({ status: 1 });
collectionRouteSchema.index({ driver: 1 });

module.exports = mongoose.model('CollectionRoute', collectionRouteSchema);
