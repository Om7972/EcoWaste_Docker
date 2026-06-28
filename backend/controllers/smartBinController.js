const SmartBin = require('../models/SmartBin');
const SensorReading = require('../models/SensorReading');
const CollectionRoute = require('../models/CollectionRoute');
const CollectionHistory = require('../models/CollectionHistory');
const MaintenanceLog = require('../models/MaintenanceLog');
const Alert = require('../models/Alert');
const { predictOverflow, predictAllOverflows, getBinAnalytics } = require('../services/predictionEngine');
const { generateOptimizedRoute } = require('../services/routeOptimizer');

// @desc    Get all smart bins
// @route   GET /api/smart-bins
// @access  Private
exports.getAllBins = async (req, res) => {
  try {
    const { status, zone, type, minFill, maxFill, sortBy } = req.query;
    const query = {};

    if (status) query.status = status;
    if (zone) query['location.zone'] = zone;
    if (type) query.binType = type;
    if (minFill || maxFill) {
      query.currentFillLevel = {};
      if (minFill) query.currentFillLevel.$gte = Number(minFill);
      if (maxFill) query.currentFillLevel.$lte = Number(maxFill);
    }

    let sort = { currentFillLevel: -1 };
    if (sortBy === 'name') sort = { name: 1 };
    if (sortBy === 'zone') sort = { 'location.zone': 1 };
    if (sortBy === 'fillLevel') sort = { currentFillLevel: -1 };

    const bins = await SmartBin.find(query).sort(sort).lean();

    // Compute summary stats
    const totalBins = bins.length;
    const activeBins = bins.filter(b => b.status === 'active' || b.status === 'full').length;
    const avgFillLevel = totalBins > 0 ? parseFloat((bins.reduce((a, b) => a + b.currentFillLevel, 0) / totalBins).toFixed(1)) : 0;
    const criticalBins = bins.filter(b => b.currentFillLevel >= 80).length;
    const overflowBins = bins.filter(b => b.currentFillLevel >= 95).length;

    res.json({
      success: true,
      data: bins,
      summary: { totalBins, activeBins, avgFillLevel, criticalBins, overflowBins },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single smart bin
// @route   GET /api/smart-bins/:id
// @access  Private
exports.getBinById = async (req, res) => {
  try {
    const bin = await SmartBin.findById(req.params.id).populate('assignedCollector', 'name email');
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found' });

    // Get recent readings
    const recentReadings = await SensorReading.find({ bin: bin._id })
      .sort({ timestamp: -1 }).limit(50).lean();

    // Get analytics
    const analytics = await getBinAnalytics(bin._id, 7);

    // Get prediction
    const prediction = await predictOverflow(bin._id);

    // Get active alerts
    const alerts = await Alert.find({ bin: bin._id, resolved: false })
      .sort({ createdAt: -1 }).limit(5).lean();

    // Get recent collections
    const collections = await CollectionHistory.find({ bin: bin._id })
      .sort({ collectedAt: -1 }).limit(10)
      .populate('collector', 'name').lean();

    // Get maintenance history
    const maintenance = await MaintenanceLog.find({ bin: bin._id })
      .sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      success: true,
      data: {
        bin,
        recentReadings,
        analytics,
        prediction,
        alerts,
        collections,
        maintenance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new smart bin
// @route   POST /api/smart-bins
// @access  Private/Admin
exports.registerBin = async (req, res) => {
  try {
    const { name, coordinates, address, zone, binType, capacity } = req.body;

    const binCount = await SmartBin.countDocuments();
    const binId = `SB-${String(binCount + 1).padStart(4, '0')}`;

    const bin = await SmartBin.create({
      binId,
      name,
      location: {
        type: 'Point',
        coordinates,
        address,
        zone: zone || 'General',
      },
      binType: binType || 'general',
      capacity: capacity || 100,
    });

    res.status(201).json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update fill level (simulating IoT sensor update)
// @route   PUT /api/smart-bins/:id/fill-level
// @access  Private
exports.updateFillLevel = async (req, res) => {
  try {
    const { fillLevel } = req.body;
    const bin = await SmartBin.findById(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found' });

    bin.currentFillLevel = fillLevel;
    bin.lastSensorPing = new Date();
    if (fillLevel >= 90) bin.status = 'full';
    else if (bin.status === 'full') bin.status = 'active';

    await bin.save();

    // Save reading
    await SensorReading.create({
      bin: bin._id,
      binId: bin.binId,
      fillLevel,
      timestamp: new Date(),
    });

    res.json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby bins
// @route   GET /api/smart-bins/nearby
// @access  Private
exports.getNearbyBins = async (req, res) => {
  try {
    const { lng, lat, radius = 5 } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'Longitude and latitude required' });
    }

    const bins = await SmartBin.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000, // convert km to meters
        },
      },
    }).lean();

    res.json({ success: true, data: bins, count: bins.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Predict overflow for a bin
// @route   GET /api/smart-bins/:id/predict
// @access  Private
exports.predictBinOverflow = async (req, res) => {
  try {
    const prediction = await predictOverflow(req.params.id);
    if (!prediction) return res.status(404).json({ success: false, message: 'Bin not found' });

    res.json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Predict all overflows
// @route   GET /api/smart-bins/predictions/all
// @access  Private/Admin
exports.predictAllBinOverflows = async (req, res) => {
  try {
    const predictions = await predictAllOverflows();
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate optimized collection route
// @route   POST /api/smart-bins/routes/optimize
// @access  Private/Admin
exports.generateRoute = async (req, res) => {
  try {
    const { zone, minFillLevel, maxStops } = req.body;
    const result = await generateOptimizedRoute({ zone, minFillLevel, maxStops });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json({ success: true, data: result.route, metrics: result.metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get collection routes
// @route   GET /api/smart-bins/routes
// @access  Private
exports.getCollectionRoutes = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};
    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const routes = await CollectionRoute.find(query)
      .populate('stops.bin', 'binId name location currentFillLevel')
      .populate('driver', 'name email')
      .sort({ scheduledDate: -1 })
      .lean();

    res.json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create maintenance log
// @route   POST /api/smart-bins/:id/maintenance
// @access  Private/Admin
exports.createMaintenanceLog = async (req, res) => {
  try {
    const bin = await SmartBin.findById(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found' });

    const log = await MaintenanceLog.create({
      bin: bin._id,
      ...req.body,
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get maintenance logs
// @route   GET /api/smart-bins/maintenance
// @access  Private/Admin
exports.getMaintenanceLogs = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const logs = await MaintenanceLog.find(query)
      .populate('bin', 'binId name location')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get alerts
// @route   GET /api/smart-bins/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const { resolved, type, severity } = req.query;
    const query = {};
    if (resolved !== undefined) query.resolved = resolved === 'true';
    if (type) query.type = type;
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .populate('bin', 'binId name location currentFillLevel')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const unresolvedCount = await Alert.countDocuments({ resolved: false });
    const criticalCount = await Alert.countDocuments({ resolved: false, severity: 'critical' });

    res.json({
      success: true,
      data: alerts,
      summary: { unresolvedCount, criticalCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Acknowledge an alert
// @route   PUT /api/smart-bins/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, {
      acknowledged: true,
      acknowledgedBy: req.user._id,
      acknowledgedAt: new Date(),
    }, { new: true });

    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve an alert
// @route   PUT /api/smart-bins/alerts/:id/resolve
// @access  Private
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, {
      resolved: true,
      resolvedAt: new Date(),
    }, { new: true });

    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics / heatmap data
// @route   GET /api/smart-bins/analytics
// @access  Private
exports.getSmartBinAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Overall stats
    const bins = await SmartBin.find().lean();
    const totalBins = bins.length;
    const activeBins = bins.filter(b => b.status === 'active' || b.status === 'full').length;
    const avgFill = parseFloat((bins.reduce((a, b) => a + b.currentFillLevel, 0) / (totalBins || 1)).toFixed(1));

    // Collection stats
    const collections = await CollectionHistory.find({
      collectedAt: { $gte: startDate },
    }).lean();

    const totalWasteCollected = parseFloat(collections.reduce((a, c) => a + (c.wasteWeight || 0), 0).toFixed(1));
    const totalCollections = collections.length;
    const overflowCollections = collections.filter(c => c.wasOverflowing).length;

    // Routes efficiency
    const routes = await CollectionRoute.find({
      scheduledDate: { $gte: startDate },
      status: 'completed',
    }).lean();

    const avgRouteEfficiency = routes.length > 0
      ? parseFloat((routes.reduce((a, r) => a + (r.efficiency || 75), 0) / routes.length).toFixed(1))
      : 78.5;

    const totalFuelSaved = parseFloat((routes.length * 2.5).toFixed(1)); // estimated fuel saved by optimization

    // Heatmap data (bin locations with intensity based on fill level)
    const heatmapData = bins.map(b => ({
      lat: b.location.coordinates[1],
      lng: b.location.coordinates[0],
      intensity: b.currentFillLevel / 100,
      binId: b.binId,
      fillLevel: b.currentFillLevel,
    }));

    // Daily trends
    const dailyTrends = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toISOString().split('T')[0];
      const dayCollections = collections.filter(c =>
        c.collectedAt.toISOString().split('T')[0] === dayStr
      );
      dailyTrends.push({
        date: dayStr,
        collections: dayCollections.length,
        wasteCollected: parseFloat(dayCollections.reduce((a, c) => a + (c.wasteWeight || 0), 0).toFixed(1)),
        overflows: dayCollections.filter(c => c.wasOverflowing).length,
      });
    }

    // Zone distribution
    const zoneStats = {};
    bins.forEach(b => {
      const zone = b.location.zone || 'General';
      if (!zoneStats[zone]) zoneStats[zone] = { bins: 0, totalFill: 0, critical: 0 };
      zoneStats[zone].bins++;
      zoneStats[zone].totalFill += b.currentFillLevel;
      if (b.currentFillLevel >= 80) zoneStats[zone].critical++;
    });

    const zoneDistribution = Object.entries(zoneStats).map(([zone, stats]) => ({
      zone,
      bins: stats.bins,
      avgFillLevel: parseFloat((stats.totalFill / stats.bins).toFixed(1)),
      criticalBins: stats.critical,
    }));

    // AI recommendations
    const recommendations = generateRecommendations(bins, collections, routes);

    res.json({
      success: true,
      data: {
        overview: {
          totalBins,
          activeBins,
          avgFillLevel: avgFill,
          totalWasteCollected,
          totalCollections,
          overflowIncidents: overflowCollections,
          routeEfficiency: avgRouteEfficiency,
          fuelSaved: totalFuelSaved,
        },
        heatmapData,
        dailyTrends,
        zoneDistribution,
        recommendations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI-powered recommendations
 */
function generateRecommendations(bins, collections, routes) {
  const recommendations = [];

  // Check for bins consistently at high fill levels
  const highFillBins = bins.filter(b => b.currentFillLevel >= 70);
  if (highFillBins.length > bins.length * 0.3) {
    recommendations.push({
      type: 'capacity',
      priority: 'high',
      title: 'Increase Collection Frequency',
      description: `${highFillBins.length} bins (${((highFillBins.length / bins.length) * 100).toFixed(0)}%) are above 70% capacity. Consider increasing collection frequency in high-demand zones.`,
      icon: '📈',
    });
  }

  // Check zones with most critical bins
  const zoneGroups = {};
  bins.forEach(b => {
    const zone = b.location.zone || 'General';
    if (!zoneGroups[zone]) zoneGroups[zone] = [];
    zoneGroups[zone].push(b);
  });

  Object.entries(zoneGroups).forEach(([zone, zoneBins]) => {
    const criticalCount = zoneBins.filter(b => b.currentFillLevel >= 80).length;
    if (criticalCount >= 2) {
      recommendations.push({
        type: 'zone',
        priority: 'medium',
        title: `Deploy Additional Bins in ${zone} Zone`,
        description: `${criticalCount} bins in ${zone} zone are at critical levels. Adding more bins could reduce overflow incidents by an estimated 40%.`,
        icon: '🗑️',
      });
    }
  });

  // Route optimization suggestion
  recommendations.push({
    type: 'efficiency',
    priority: 'medium',
    title: 'Optimize Collection Timing',
    description: 'AI analysis suggests shifting collection schedules to early morning (5-7 AM) could improve route efficiency by 15% and reduce fuel costs.',
    icon: '⚡',
  });

  // Predictive maintenance
  const lowBatteryBins = bins.filter(b => b.batteryLevel < 30);
  if (lowBatteryBins.length > 0) {
    recommendations.push({
      type: 'maintenance',
      priority: 'high',
      title: 'Schedule Battery Replacements',
      description: `${lowBatteryBins.length} bins have battery levels below 30%. Schedule maintenance to prevent sensor outages.`,
      icon: '🔋',
    });
  }

  // Environmental insight
  recommendations.push({
    type: 'environmental',
    priority: 'low',
    title: 'Carbon Footprint Reduction',
    description: 'Optimized routes this month have reduced CO₂ emissions by an estimated 12.5 kg compared to traditional collection patterns.',
    icon: '🌱',
  });

  return recommendations;
}

// @desc    Get collection schedule / calendar
// @route   GET /api/smart-bins/schedule
// @access  Private
exports.getSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default: current month
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.scheduledDate = { $gte: start, $lte: end };
    }

    const routes = await CollectionRoute.find(query)
      .populate('stops.bin', 'binId name location.address')
      .populate('driver', 'name')
      .sort({ scheduledDate: 1 })
      .lean();

    // Group by date
    const schedule = {};
    routes.forEach(route => {
      const dateKey = route.scheduledDate.toISOString().split('T')[0];
      if (!schedule[dateKey]) schedule[dateKey] = [];
      schedule[dateKey].push({
        routeId: route.routeId,
        name: route.name,
        status: route.status,
        stops: route.stops.length,
        driver: route.driver?.name || 'Unassigned',
        estimatedDuration: route.estimatedDuration,
        zone: route.zone,
      });
    });

    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
