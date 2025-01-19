const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/profile/:profileId', historyController.getHistoryByProfile);


console.log('his routes loaded successfully.');

module.exports = router;