const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

// Register a new account
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
        return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
});

// Log in
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
    res.json({ message: 'Login successful.', token });
});

// Log out
router.post('/logout', authenticateToken, (req, res) => {
    // No actual token invalidation here since it's stateless JWT
    res.json({ message: 'Logout successful.' });
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
