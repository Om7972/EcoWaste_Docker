const router = require('express').Router();
const { getAll, getById, getNearby } = require('../controllers/recyclingController');

router.get('/', getAll);
router.get('/nearby', getNearby);
router.get('/:id', getById);

module.exports = router;
