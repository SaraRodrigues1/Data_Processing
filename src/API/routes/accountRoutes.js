const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/create', accountController.createAccount);
router.get('/:id', accountController.getAccountById);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);
router.put('/:id/block', accountController.blockAccount);


console.log('acc routes loaded successfully.');

module.exports = router;
