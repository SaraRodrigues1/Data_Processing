const db = require('./db');

exports.getAllProfiles = async (req, res) => {
    try {
        const [profiles] = await db.execute('SELECT * FROM Profile');
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profiles.', details: error.message });
    }
};

exports.createProfile = async (req, res) => {
    const { userId, name, age, preferences } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO Profile (UserID, Name, Age, Preferences) VALUES (?, ?, ?, ?)',
            [userId, name, age, preferences]
        );
        res.status(201).json({ message: 'Profile created successfully.', ProfileID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating profile.', details: error.message });
    }
};
