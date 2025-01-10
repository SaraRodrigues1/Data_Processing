const db = require('./db');

//Get subscriptions
exports.getAllSubscriptions = async (req, res) => {
    try {
        const [subscriptions] = await db.execute('SELECT * FROM Subscription');
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subscriptions.', details: error.message });
    }
};
