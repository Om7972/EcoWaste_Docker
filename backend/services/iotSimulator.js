const SmartBin = require('../models/SmartBin');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');

let io = null;

const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Simulated bin locations in Mumbai
const CITY_LOCATIONS = [
  { address: 'Andheri West, Mumbai', coordinates: [72.8362, 19.1364], zone: 'West' },
  { address: 'Bandra Station, Mumbai', coordinates: [72.8401, 19.0544], zone: 'West' },
  { address: 'Dadar TT Circle, Mumbai', coordinates: [72.8443, 19.0178], zone: 'Central' },
  { address: 'Churchgate, Mumbai', coordinates: [72.8271, 18.9322], zone: 'South' },
  { address: 'Powai Lake, Mumbai', coordinates: [72.9052, 19.1267], zone: 'East' },
  { address: 'Juhu Beach Road, Mumbai', coordinates: [72.8296, 19.0883], zone: 'West' },
  { address: 'Worli Sea Face, Mumbai', coordinates: [72.8151, 19.0096], zone: 'South' },
  { address: 'Kurla Station, Mumbai', coordinates: [72.8791, 19.0651], zone: 'Central' },
  { address: 'Malad West, Mumbai', coordinates: [72.8464, 19.1869], zone: 'West' },
  { address: 'Goregaon East, Mumbai', coordinates: [72.8635, 19.1618], zone: 'East' },
  { address: 'Thane Station, Mumbai', coordinates: [72.9781, 19.1858], zone: 'North' },
  { address: 'Vashi, Navi Mumbai', coordinates: [72.9988, 19.0759], zone: 'East' },
  { address: 'Borivali National Park, Mumbai', coordinates: [72.8560, 19.2288], zone: 'North' },
  { address: 'Colaba Causeway, Mumbai', coordinates: [72.8318, 18.9067], zone: 'South' },
  { address: 'Lower Parel, Mumbai', coordinates: [72.8269, 18.9943], zone: 'Central' },
  { address: 'Santacruz East, Mumbai', coordinates: [72.8583, 19.0797], zone: 'East' },
  { address: 'Kandivali West, Mumbai', coordinates: [72.8480, 19.2040], zone: 'North' },
  { address: 'Chembur, Mumbai', coordinates: [72.8963, 19.0522], zone: 'East' },
  { address: 'Mulund West, Mumbai', coordinates: [72.9452, 19.1726], zone: 'North' },
  { address: 'Vikhroli, Mumbai', coordinates: [72.9270, 19.1101], zone: 'East' },
];

const BIN_TYPES = ['general', 'recyclable', 'organic', 'hazardous', 'ewaste'];

/**
 * Seed initial smart bins into the database if none exist
 */
const seedSmartBins = async () => {
  const count = await SmartBin.countDocuments();
  if (count >= 15) return;

  console.log('🌱 Seeding smart bins...');
  const bins = CITY_LOCATIONS.map((loc, i) => ({
    binId: `SB-${String(i + 1).padStart(4, '0')}`,
    name: `Smart Bin ${loc.zone}-${i + 1}`,
    location: {
      type: 'Point',
      coordinates: loc.coordinates,
      address: loc.address,
      zone: loc.zone,
    },
    binType: BIN_TYPES[i % BIN_TYPES.length],
    capacity: [100, 120, 80, 150, 200][i % 5],
    currentFillLevel: Math.floor(Math.random() * 60) + 10,
    status: 'active',
    sensorStatus: 'online',
    batteryLevel: Math.floor(Math.random() * 40) + 60,
    lastEmptied: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
    avgFillRate: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
  }));

  await SmartBin.insertMany(bins);
  console.log(`✅ Seeded ${bins.length} smart bins`);
};

/**
 * Simulate IoT sensor data for all active bins
 */
const simulateSensorData = async () => {
  try {
    const bins = await SmartBin.find({ status: { $in: ['active', 'full'] } });

    for (const bin of bins) {
      // Simulate fill level changes
      const fillIncrease = parseFloat((Math.random() * 2.5 + 0.1).toFixed(1));
      let newFillLevel = Math.min(100, bin.currentFillLevel + fillIncrease);

      // Occasionally simulate collection (reset fill level)
      if (newFillLevel >= 95 && Math.random() < 0.15) {
        newFillLevel = Math.floor(Math.random() * 10);
        bin.lastEmptied = new Date();
      }

      // Simulate sensor data
      const reading = {
        bin: bin._id,
        binId: bin.binId,
        fillLevel: parseFloat(newFillLevel.toFixed(1)),
        temperature: parseFloat((20 + Math.random() * 15).toFixed(1)),
        humidity: parseFloat((40 + Math.random() * 30).toFixed(1)),
        weight: parseFloat((newFillLevel * bin.capacity * 0.005).toFixed(2)),
        batteryLevel: Math.max(0, bin.batteryLevel - parseFloat((Math.random() * 0.05).toFixed(2))),
        odorLevel: parseFloat((newFillLevel * 0.08 + Math.random() * 2).toFixed(1)),
        sensorStatus: bin.batteryLevel > 10 ? 'online' : 'low_battery',
        timestamp: new Date(),
      };

      // Save reading
      await SensorReading.create(reading);

      // Update bin
      bin.currentFillLevel = reading.fillLevel;
      bin.batteryLevel = reading.batteryLevel;
      bin.sensorStatus = reading.sensorStatus;
      bin.lastSensorPing = new Date();
      bin.metadata = {
        temperature: reading.temperature,
        humidity: reading.humidity,
        odorLevel: reading.odorLevel,
        weight: reading.weight,
      };

      // Update status based on fill level
      if (reading.fillLevel >= 90) {
        bin.status = 'full';
      } else if (reading.fillLevel < 80 && bin.status === 'full') {
        bin.status = 'active';
      }

      // Calculate predicted full time
      if (bin.avgFillRate > 0) {
        const hoursToFull = (100 - reading.fillLevel) / bin.avgFillRate;
        bin.predictedFullTime = new Date(Date.now() + hoursToFull * 60 * 60 * 1000);
      }

      await bin.save();

      // Check for alerts
      if (reading.fillLevel >= 80 && reading.fillLevel < 95) {
        await createAlertIfNeeded(bin, 'predicted_overflow', 'warning',
          `Bin ${bin.binId} at ${reading.fillLevel.toFixed(0)}% capacity - collection needed soon`);
      }
      if (reading.fillLevel >= 95) {
        await createAlertIfNeeded(bin, 'overflow', 'critical',
          `Bin ${bin.binId} is overflowing at ${reading.fillLevel.toFixed(0)}% capacity!`);
      }
      if (reading.batteryLevel < 15) {
        await createAlertIfNeeded(bin, 'low_battery', 'warning',
          `Bin ${bin.binId} battery critically low at ${reading.batteryLevel.toFixed(0)}%`);
      }
    }

    // Emit real-time update via Socket.IO
    if (io) {
      const updatedBins = await SmartBin.find({ status: { $in: ['active', 'full'] } }).lean();
      io.emit('bins:update', updatedBins);
    }

  } catch (error) {
    console.error('IoT Simulation Error:', error.message);
  }
};

/**
 * Create an alert if one doesn't already exist (unresolved) for this bin+type
 */
const createAlertIfNeeded = async (bin, type, severity, message) => {
  const existing = await Alert.findOne({
    bin: bin._id,
    type,
    resolved: false,
    createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // within last 30min
  });

  if (!existing) {
    const alert = await Alert.create({
      bin: bin._id,
      type,
      severity,
      message,
      metadata: {
        fillLevel: bin.currentFillLevel,
        batteryLevel: bin.batteryLevel,
        location: bin.location.address,
      },
    });

    if (io) {
      io.emit('alert:new', alert);
    }
  }
};

module.exports = {
  seedSmartBins,
  simulateSensorData,
  setSocketIO,
};
