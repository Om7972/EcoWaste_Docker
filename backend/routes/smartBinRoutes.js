const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllBins,
  getBinById,
  registerBin,
  updateFillLevel,
  getNearbyBins,
  predictBinOverflow,
  predictAllBinOverflows,
  generateRoute,
  getCollectionRoutes,
  createMaintenanceLog,
  getMaintenanceLogs,
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  getSmartBinAnalytics,
  getSchedule,
} = require('../controllers/smartBinController');

// Public / auth-required routes
router.get('/', protect, getAllBins);
router.get('/nearby', protect, getNearbyBins);
router.get('/analytics', protect, getSmartBinAnalytics);
router.get('/schedule', protect, getSchedule);
router.get('/predictions/all', protect, authorize('admin', 'collector'), predictAllBinOverflows);
router.get('/alerts', protect, getAlerts);
router.get('/maintenance', protect, authorize('admin'), getMaintenanceLogs);
router.get('/routes', protect, getCollectionRoutes);

// Bin CRUD
router.post('/', protect, authorize('admin'), registerBin);
router.get('/:id', protect, getBinById);
router.put('/:id/fill-level', protect, updateFillLevel);
router.get('/:id/predict', protect, predictBinOverflow);
router.post('/:id/maintenance', protect, authorize('admin'), createMaintenanceLog);

// Routes
router.post('/routes/optimize', protect, authorize('admin', 'collector'), generateRoute);

// Alerts
router.put('/alerts/:id/acknowledge', protect, acknowledgeAlert);
router.put('/alerts/:id/resolve', protect, resolveAlert);

module.exports = router;
