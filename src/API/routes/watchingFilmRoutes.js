const express = require('express');
const router = express.Router();
const watchingFilmController = require('../controllers/watchingFilmController');

router.post('/watchFilm', watchingFilmController.createWatchingFilm);
router.get('/watchFilm/:ProfileID/:FilmID', watchingFilmController.getWatchingFilm);
router.put('/watchFilm/:ProfileID/:FilmID', watchingFilmController.updateWatchingFilm);
router.delete('/watchFilm/:ProfileID/:FilmID', watchingFilmController.deleteWatchingFilm);


console.log(' film routes loaded successfully.');

module.exports = router;
