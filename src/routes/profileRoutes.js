const express = require('express');
const router = express.Router();
const db = require('../db');

// Get All Profiles
router.get('/', (req, res) => {
    res.json(profiles);
});

/*Create a profile
router.post('/create', async (req, res) => {
    const { UserID, Name, Age, Preferences } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Profile (UserID, Name, Age, Preferences) VALUES (?, ?, ?, ?)',
            [UserID, Name, Age, Preferences]
        );
        res.status(201).json({ message: 'Profile created successfully.', ProfileID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating profile.', details: error.message });
    }
});*/

//Get profile
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Profile WHERE ProfileID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Profile not found.' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile.', details: error.message });
    }
});

//Update profile
router.put('/:id', async (req, res) => {
    const { Name, Age, Preferences } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE Profile SET Name = ?, Age = ?, Preferences = ? WHERE ProfileID = ?',
            [Name, Age, Preferences, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Profile not found.' });
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile.', details: error.message });
    }
});

//Delete profile
router.delete('/:id', (req, res) => {
    const profileIndex = profiles.findIndex((p) => p.id === parseInt(req.params.id));
    if (profileIndex === -1) {
        return res.status(404).json({ error: 'Profile not found.' });
    }

    profiles.splice(profileIndex, 1);
    res.json({ message: 'Profile deleted successfully.' });
});

module.exports = router;