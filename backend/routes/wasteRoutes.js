const router = require('express').Router();
const { predict, getHistory, getStats } = require('../controllers/wasteController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/predict', protect, upload.single('image'), predict);
router.get('/history', protect, getHistory);
router.get('/stats', protect, getStats);

module.exports = router;
