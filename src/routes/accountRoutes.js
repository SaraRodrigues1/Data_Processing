const express = require('express');
const router = express.Router();

//To be connected
const accounts = [
    { id: 1, email: 'test@example.com', accountBlocked: false },
];

//Create a new user account
router.post('/create', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const accountExists = accounts.find((a) => a.email === email);
    if (accountExists) {
        return res.status(409).json({ error: 'Account already exists.' });
    }

    const newAccount = { id: accounts.length + 1, email, accountBlocked: false };
    accounts.push(newAccount);
    res.status(201).json({ message: 'Account created successfully.', account: newAccount });
});

//Retrieve an account by its ID
router.get('/:id', (req, res) => {
    const account = accounts.find((a) => a.id === parseInt(req.params.id));
    if (!account) {
        return res.status(404).json({ error: 'Account not found.' });
    }
    res.json(account);
});

//Update account information (e.g., password)
router.put('/:id', (req, res) => {
    const account = accounts.find((a) => a.id === parseInt(req.params.id));
    if (!account) {
        return res.status(404).json({ error: 'Account not found.' });
    }

    const { email } = req.body;
    if (email) account.email = email;

    res.json({ message: 'Account updated successfully.', account });
});

//Delete an account
router.delete('/:id', (req, res) => {
    const accountIndex = accounts.findIndex((a) => a.id === parseInt(req.params.id));
    if (accountIndex === -1) {
        return res.status(404).json({ error: 'Account not found.' });
    }

    accounts.splice(accountIndex, 1);
    res.json({ message: 'Account deleted successfully.' });
});

//Block or unblock an account
router.put('/:id/block', (req, res) => {
    const account = accounts.find((a) => a.id === parseInt(req.params.id));
    if (!account) {
        return res.status(404).json({ error: 'Account not found.' });
    }

    account.accountBlocked = !account.accountBlocked;
    res.json({ message: `Account ${account.accountBlocked ? 'blocked' : 'unblocked'} successfully.`, account });
});

module.exports = router