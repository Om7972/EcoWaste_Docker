const router = require('express').Router();
const { getAll, getById, create, update, optimize } = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/:id', protect, getById);
router.post('/', protect, authorize('admin'), create);
router.put('/:id', protect, authorize('admin', 'collector'), update);
router.post('/:id/optimize', protect, authorize('admin'), optimize);

module.exports = router;
