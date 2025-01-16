const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptionsController');

router.get('/:id', subscriptionsController.getSubscriptionById);
router.post('/', subscriptionsController.createSubscription);
router.put('/:id', subscriptionsController.updateSubscription);
router.delete('/:id', subscriptionsController.deleteSubscription);

console.log(' sub routes loaded successfully.');

module.exports = router;