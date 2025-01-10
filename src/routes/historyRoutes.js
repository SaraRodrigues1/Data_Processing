const express = require('express');
const router = express.Router();

// Mock Database
const history = [
    { id: 1, userId: 1, mediaId: 2, watchedOn: '2023-12-01', duration: '1h30m' },
];

//Add a viewing record for a specific profile
router.post('/create', (req, res) => {
    const { userId, mediaId, watchedOn, duration } = req.body;

    if (!userId || !mediaId || !watchedOn) {
        return res.status(400).json({ error: 'User ID, media ID, and watched date are required.' });
    }

    const newHistory = {
        id: history.length + 1,
        userId,
        mediaId,
        watchedOn,
        duration: duration || 'Unknown',
    };
    history.push(newHistory);
    res.status(201).json({ message: 'History added successfully.', history: newHistory });
});


//Get viewing history for a specific profile
router.get('/user/:userId', (req, res) => {
    const userHistory = history.filter((h) => h.userId === parseInt(req.params.userId));
    res.json(userHistory);
});

//Delete a specific viewing history record
DELETE	/api/history/:id

module.exports = router;
