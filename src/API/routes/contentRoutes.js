const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/film', contentController.getAllFilms);         
router.get('/film/:id', contentController.getFilmById);    
router.post('/film', contentController.createFilm);      
router.put('/film/:id', contentController.updateFilm);      
router.delete('/film/:id', contentController.deleteFilm);  

router.get('/series', contentController.getAllSeries);      
router.get('/series/:id', contentController.getSeriesById); 
router.post('/series', contentController.createSeries);    
router.put('/series/:id', contentController.updateSeries);  
router.delete('/series/:id', contentController.deleteSeries); 


console.log('cont routes loaded successfully.');

module.exports = router;
