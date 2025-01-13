const db = require('./db');

// Get history
exports.getHistoryByProfile = async (req, res) => {
    try {
        const [history] = await db.execute(
            'SELECT * FROM History WHERE ProfileID = ?',
            [req.params.profileId]
        );
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching history.', details: error.message });
    }
};
