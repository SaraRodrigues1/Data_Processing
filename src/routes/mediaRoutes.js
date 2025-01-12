const express = require('express');
const router = express.Router();
const db = require('../db');

//Add new media 
router.post('/create', (req, res) => {
    const { title, genreId, description, releaseYear } = req.body;

    if (!title || !genreId || !releaseYear) {
        return res.status(400).json({ error: 'Title, genre, and release year are required.' });
    }

    const newMedia = {
        id: mediaItems.length + 1,
        title,
        genreId,
        description: description || '',
        releaseYear,
    };
    mediaItems.push(newMedia);
    res.status(201).json({ message: 'Media created successfully.', media: newMedia });
});

//Get media
router.get('/:id', (req, res) => {
    const media = mediaItems.find((m) => m.id === parseInt(req.params.id));
    if (!media) {
        return res.status(404).json({ error: 'Media not found.' });
    }
    res.json(media);
});

//Update media
router.put('/:id', (req, res) => {
    const media = mediaItems.find((m) => m.id === parseInt(req.params.id));
    if (!media) {
        return res.status(404).json({ error: 'Media not found.' });
    }

    const { title, genreId, description, releaseYear } = req.body;
    if (title) media.title = title;
    if (genreId) media.genreId = genreId;
    if (description) media.description = description;
    if (releaseYear) media.releaseYear = releaseYear;

    res.json({ message: 'Media updated successfully.', media });
});

//Delete media
router.delete('/:id', (req, res) => {
    const mediaIndex = mediaItems.findIndex((m) => m.id === parseInt(req.params.id));
    if (mediaIndex === -1) {
        return res.status(404).json({ error: 'Media not found.' });
    }

    mediaItems.splice(mediaIndex, 1);
    res.json({ message: 'Media deleted successfully.' });
});

//List all media
router.get('/', (req, res) => {
    res.json(mediaItems);
});

//Search media items by title, genre, etc

module.exports = router;
