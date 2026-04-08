const express = require('express');
const { getTrains, getTrainById, seedTrains } = require('../controllers/trainController');
const router = express.Router();

router.get('/', getTrains);
router.get('/:id', getTrainById);
router.post('/seed', seedTrains);

module.exports = router;
