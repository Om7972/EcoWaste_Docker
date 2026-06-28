const SmartBin = require('../models/SmartBin');
const CollectionRoute = require('../models/CollectionRoute');

/**
 * Generate an optimized collection route using nearest-neighbor heuristic
 * Prioritizes bins by fill level (highest first) and minimizes travel distance
 */
const generateOptimizedRoute = async (options = {}) => {
  const {
    zone = null,
    minFillLevel = 60,
    maxStops = 10,
    driverName = 'Auto-Assigned',
  } = options;

  // Get bins that need collection
  const query = {
    status: { $in: ['active', 'full'] },
    currentFillLevel: { $gte: minFillLevel },
  };
  if (zone) query['location.zone'] = zone;

  let bins = await SmartBin.find(query)
    .sort({ currentFillLevel: -1 })
    .limit(maxStops * 2)
    .lean();

  if (bins.length === 0) {
    return { success: false, message: 'No bins need collection at this time' };
  }

  // Nearest neighbor route optimization
  const selectedBins = [];
  const remaining = [...bins];

  // Start with the fullest bin
  selectedBins.push(remaining.shift());

  while (remaining.length > 0 && selectedBins.length < maxStops) {
    const lastBin = selectedBins[selectedBins.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    remaining.forEach((bin, idx) => {
      const dist = haversineDistance(
        lastBin.location.coordinates[1], lastBin.location.coordinates[0],
        bin.location.coordinates[1], bin.location.coordinates[0]
      );
      // Weight by fill level - prioritize fuller bins that are nearby
      const weightedDist = dist / (bin.currentFillLevel / 100);
      if (weightedDist < nearestDist) {
        nearestDist = weightedDist;
        nearestIdx = idx;
      }
    });

    selectedBins.push(remaining.splice(nearestIdx, 1)[0]);
  }

  // Calculate route metrics
  let totalDistance = 0;
  for (let i = 1; i < selectedBins.length; i++) {
    totalDistance += haversineDistance(
      selectedBins[i - 1].location.coordinates[1], selectedBins[i - 1].location.coordinates[0],
      selectedBins[i].location.coordinates[1], selectedBins[i].location.coordinates[0]
    );
  }

  const estimatedDuration = Math.ceil(totalDistance * 3 + selectedBins.length * 5); // minutes
  const fuelEstimate = parseFloat((totalDistance * 0.12).toFixed(2)); // liters

  // Create the route
  const routeId = `CR-${Date.now().toString(36).toUpperCase()}`;
  const scheduledDate = new Date();
  scheduledDate.setHours(scheduledDate.getHours() + 1);

  const route = await CollectionRoute.create({
    routeId,
    name: `Optimized Route ${zone || 'All Zones'} - ${new Date().toLocaleDateString()}`,
    stops: selectedBins.map((bin, i) => ({
      bin: bin._id,
      order: i + 1,
      estimatedArrival: new Date(scheduledDate.getTime() + i * 10 * 60 * 1000),
      completed: false,
    })),
    status: 'planned',
    scheduledDate,
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    estimatedDuration,
    fuelEstimate,
    optimized: true,
    zone: zone || 'All',
  });

  // Populate stops with bin details for the response
  await route.populate('stops.bin');

  return {
    success: true,
    route,
    metrics: {
      totalStops: selectedBins.length,
      totalDistance: `${totalDistance.toFixed(2)} km`,
      estimatedDuration: `${estimatedDuration} minutes`,
      fuelEstimate: `${fuelEstimate} liters`,
      avgFillLevel: parseFloat((selectedBins.reduce((a, b) => a + b.currentFillLevel, 0) / selectedBins.length).toFixed(1)),
    },
  };
};

/**
 * Haversine formula to calculate distance between two points
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = {
  generateOptimizedRoute,
  haversineDistance,
};
