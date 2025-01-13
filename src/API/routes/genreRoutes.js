const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Genre
router.post('/create', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Genre name is required.' });
    }

    const newGenre = { id: genres.length + 1, name };
    genres.push(newGenre);
    res.status(201).json({ message: 'Genre created successfully.', genre: newGenre });
});

//List all genres
router.get('/', (req, res) => {
    res.json(genres);
});

// Delete Genre
router.delete('/:id', (req, res) => {
    const genreIndex = genres.findIndex((g) => g.id === parseInt(req.params.id));
    if (genreIndex === -1) {
        return res.status(404).json({ error: 'Genre not found.' });
    }

    genres.splice(genreIndex, 1);
    res.json({ message: 'Genre deleted successfully.' });
});

module.exports = router;