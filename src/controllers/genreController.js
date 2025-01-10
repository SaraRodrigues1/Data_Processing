const db = require('./db');

// Get genres
exports.getAllGenres = async (req, res) => {
    try {
        const [genres] = await db.execute('SELECT * FROM Genre');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching genres.', details: error.message });
    }
};
