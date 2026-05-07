const router = require('express').Router();
const { getStats, getAdminStats, getAnalytics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
