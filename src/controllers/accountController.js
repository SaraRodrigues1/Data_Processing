const db = require('./db');

// Get Account by ID
exports.getAccountById = async (req, res) => {
    try {
        const [account] = await db.execute('SELECT * FROM Account WHERE UserID = ?', [req.params.id]);
        if (account.length === 0) return res.status(404).json({ error: 'Account not found.' });
        res.json(account[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching account.', details: error.message });
    }
};

// Update Account
exports.updateAccount = async (req, res) => {
    const { email, subscriptionId } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE Account SET Email = ?, SubscriptionID = ? WHERE UserID = ?',
            [email, subscriptionId, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found.' });
        res.json({ message: 'Account updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating account.', details: error.message });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Account WHERE UserID = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found.' });
        res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account.', details: error.message });
    }
};
