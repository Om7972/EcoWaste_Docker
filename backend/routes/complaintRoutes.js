const router = require('express').Router();
const { getAll, getById, create, update, delete: deleteComplaint, getMyComplaints } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getById);
router.post('/', protect, upload.array('images', 5), create);
router.put('/:id', protect, update);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;
