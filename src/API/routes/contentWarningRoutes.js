const express = require('express');
const router = express.Router();
const contentWarningController = require('../controllers/contentWarningController');

router.get('/:id', (req, res, next) => {
    try {
        contentWarningController.getContentWarningById(req, res);
    } catch (err) {
        console.error('Error in route:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', contentWarningController.createContentWarning);
router.put('/:id', contentWarningController.updateContentWarning);
router.delete('/:id', contentWarningController.deleteContentWarning);


console.log(' cw routes loaded successfully.');

module.exports = router;