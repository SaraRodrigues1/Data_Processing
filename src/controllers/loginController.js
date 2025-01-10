const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db'); 

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM Account WHERE Email = ?', [email]);
        if (user.length === 0) return res.status(404).json({ error: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user[0].Password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password.' });

        const token = jwt.sign({ userId: user[0].UserID }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful.' });
    } catch (error) {
        res.status(500).json({ error: 'Error during login.', details: error.message });
    }
};

// Registration
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO Account (Email, Password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully.', UserID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error during registration.', details: error.message });
    }
};

// Verify 
exports.verifyAccount = async (req, res) => {
    const { userId } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE Account SET AccountVerified = 1 WHERE UserID = ?',
            [userId]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'Account verified successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error during verification.', details: error.message });
    }
};
