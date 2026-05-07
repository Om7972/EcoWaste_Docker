const router = require('express').Router();
const { getPoints, getLeaderboard, redeem } = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');

router.get('/points', protect, getPoints);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/redeem', protect, redeem);

module.exports = router;
