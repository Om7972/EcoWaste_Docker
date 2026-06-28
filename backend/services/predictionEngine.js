const SensorReading = require('../models/SensorReading');
const SmartBin = require('../models/SmartBin');

/**
 * Predict overflow time for a single bin using linear regression on recent readings
 */
const predictOverflow = async (binId) => {
  const bin = await SmartBin.findById(binId);
  if (!bin) return null;

  // Get last 24 hours of readings
  const readings = await SensorReading.find({
    bin: binId,
    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).sort({ timestamp: 1 }).lean();

  if (readings.length < 3) {
    return {
      binId: bin.binId,
      currentFillLevel: bin.currentFillLevel,
      predictedOverflowTime: null,
      hoursToOverflow: null,
      confidence: 0,
      riskLevel: bin.currentFillLevel >= 80 ? 'high' : bin.currentFillLevel >= 50 ? 'medium' : 'low',
      recommendation: 'Insufficient data for prediction',
    };
  }

  // Simple linear regression for fill rate
  const n = readings.length;
  const startTime = readings[0].timestamp.getTime();
  const xs = readings.map(r => (r.timestamp.getTime() - startTime) / (1000 * 60 * 60)); // hours
  const ys = readings.map(r => r.fillLevel);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² for confidence
  const meanY = sumY / n;
  const ssTotal = ys.reduce((a, y) => a + (y - meanY) ** 2, 0);
  const ssRes = ys.reduce((a, y, i) => a + (y - (slope * xs[i] + intercept)) ** 2, 0);
  const rSquared = ssTotal > 0 ? 1 - ssRes / ssTotal : 0;

  let hoursToOverflow = null;
  let predictedOverflowTime = null;

  if (slope > 0) {
    const currentHours = (Date.now() - startTime) / (1000 * 60 * 60);
    const currentPredicted = slope * currentHours + intercept;
    hoursToOverflow = Math.max(0, (100 - currentPredicted) / slope);
    predictedOverflowTime = new Date(Date.now() + hoursToOverflow * 60 * 60 * 1000);
  }

  const riskLevel = !hoursToOverflow ? 'low' :
    hoursToOverflow < 2 ? 'critical' :
    hoursToOverflow < 6 ? 'high' :
    hoursToOverflow < 12 ? 'medium' : 'low';

  let recommendation = '';
  switch (riskLevel) {
    case 'critical': recommendation = 'Immediate collection required! Bin will overflow within 2 hours.'; break;
    case 'high': recommendation = 'Schedule collection within the next 4 hours.'; break;
    case 'medium': recommendation = 'Include in next routine collection route.'; break;
    case 'low': recommendation = 'No immediate action needed.'; break;
  }

  // Update bin's avgFillRate
  if (slope > 0) {
    await SmartBin.findByIdAndUpdate(binId, {
      avgFillRate: parseFloat(slope.toFixed(3)),
      predictedFullTime: predictedOverflowTime,
    });
  }

  return {
    binId: bin.binId,
    binName: bin.name,
    currentFillLevel: bin.currentFillLevel,
    fillRate: parseFloat((slope || 0).toFixed(3)),
    predictedOverflowTime,
    hoursToOverflow: hoursToOverflow ? parseFloat(hoursToOverflow.toFixed(1)) : null,
    confidence: parseFloat((Math.max(0, rSquared) * 100).toFixed(1)),
    riskLevel,
    recommendation,
    dataPoints: n,
  };
};

/**
 * Predict overflow for all active bins
 */
const predictAllOverflows = async () => {
  const bins = await SmartBin.find({ status: { $in: ['active', 'full'] } });
  const predictions = await Promise.all(bins.map(bin => predictOverflow(bin._id)));
  return predictions.filter(p => p !== null).sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (riskOrder[a.riskLevel] || 3) - (riskOrder[b.riskLevel] || 3);
  });
};

/**
 * Get analytics for a bin
 */
const getBinAnalytics = async (binId, days = 7) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const readings = await SensorReading.find({
    bin: binId,
    timestamp: { $gte: startDate },
  }).sort({ timestamp: 1 }).lean();

  if (readings.length === 0) return null;

  // Aggregate by day
  const dailyData = {};
  readings.forEach(r => {
    const day = r.timestamp.toISOString().split('T')[0];
    if (!dailyData[day]) {
      dailyData[day] = { fills: [], temps: [], weights: [] };
    }
    dailyData[day].fills.push(r.fillLevel);
    dailyData[day].temps.push(r.temperature);
    dailyData[day].weights.push(r.weight);
  });

  const dailyStats = Object.entries(dailyData).map(([date, data]) => ({
    date,
    avgFillLevel: parseFloat((data.fills.reduce((a, b) => a + b, 0) / data.fills.length).toFixed(1)),
    maxFillLevel: Math.max(...data.fills),
    avgTemperature: parseFloat((data.temps.reduce((a, b) => a + b, 0) / data.temps.length).toFixed(1)),
    avgWeight: parseFloat((data.weights.reduce((a, b) => a + b, 0) / data.weights.length).toFixed(2)),
    readingCount: data.fills.length,
  }));

  return {
    totalReadings: readings.length,
    avgFillLevel: parseFloat((readings.reduce((a, r) => a + r.fillLevel, 0) / readings.length).toFixed(1)),
    maxFillLevel: Math.max(...readings.map(r => r.fillLevel)),
    avgTemperature: parseFloat((readings.reduce((a, r) => a + r.temperature, 0) / readings.length).toFixed(1)),
    dailyStats,
  };
};

module.exports = {
  predictOverflow,
  predictAllOverflows,
  getBinAnalytics,
};
