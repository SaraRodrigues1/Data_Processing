const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/recommendations/:ProfileID', recommendationController.getRecommendations);
router.post('/recommendations', recommendationController.createRecommendations);
router.put('/recommendations/:ProfileID', recommendationController.updateRecommendations);
router.delete('/recommendations/:ProfileID', recommendationController.deleteRecommendations);

console.log(' rec routes loaded successfully.'); 

module.exports = router;
