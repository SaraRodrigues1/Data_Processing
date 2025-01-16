const express = require('express');
const router = express.Router();
const watchingSeriesController = require('../controllers/watchingSeriesController');

router.post('/', watchingSeriesController.createWatchingSeries);
router.get('/:ProfileID/:SeriesID', watchingSeriesController.getWatchingSeries);
router.delete('/:ProfileID/:SeriesID', watchingSeriesController.deleteWatchingSeries);
router.put('/:ProfileID/:SeriesID', watchingSeriesController.updateWatchingSeries);


console.log('ser routes loaded successfully.');

module.exports = router;
