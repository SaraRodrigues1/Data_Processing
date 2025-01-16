const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getAllFilms = async (req, res) => {
    try {
        const [films] = await db.execute('SELECT * FROM Film');
        if (films.length === 0) {
            return sendJSONResponse(res, 404, { error: 'No films found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, films);
        }
        sendJSONResponse(res, 200, films);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching films.', details: error.message });
    }
};

exports.getFilmById = async (req, res) => {
    try {
        const [film] = await db.execute('SELECT * FROM Film WHERE FilmID = ?', [req.params.id]);
        if (film.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Film not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, film[0]);
        }
        sendJSONResponse(res, 200, film[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching film.', details: error.message });
    }
};

exports.createFilm = async (req, res) => {
    const { title, description, subtitles, minimumAge } = req.body;
    if (!title || !description) {
        return sendJSONResponse(res, 400, { error: 'Title and description are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO Film (Title, Description, Subtitles, MinimumAge) VALUES (?, ?, ?, ?)', [title, description, subtitles, minimumAge]);
        const response = { message: 'Film created successfully.', filmId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating film.', details: error.message });
    }
};

exports.updateFilm = async (req, res) => {
    const { title, description, subtitles, minimumAge } = req.body;
    try {
        const [result] = await db.execute('UPDATE Film SET Title = ?, Description = ?, Subtitles = ?, MinimumAge = ? WHERE FilmID = ?', [title, description, subtitles, minimumAge, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Film not found.' });
        }

        const response = { message: 'Film updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating film.', details: error.message });
    }
};

exports.deleteFilm = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Film WHERE FilmID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Film not found.' });
        }

        const response = { message: 'Film deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting film.', details: error.message });
    }
};

exports.getAllSeries = async (req, res) => {
    try {
        const [series] = await db.execute('SELECT * FROM Series');
        if (series.length === 0) {
            return sendJSONResponse(res, 404, { error: 'No series found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, series);
        }
        sendJSONResponse(res, 200, series);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching series.', details: error.message });
    }
};

exports.getSeriesById = async (req, res) => {
    try {
        const [series] = await db.execute('SELECT * FROM Series WHERE SeriesID = ?', [req.params.id]);
        if (series.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Series not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, series[0]);
        }
        sendJSONResponse(res, 200, series[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching series.', details: error.message });
    }
};

exports.createSeries = async (req, res) => {
    const { title, description, subtitles, minimumAge } = req.body;
    if (!title || !description) {
        return sendJSONResponse(res, 400, { error: 'Title and description are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO Series (Title, Description, Subtitles, MinimumAge) VALUES (?, ?, ?, ?)', [title, description, subtitles, minimumAge]);
        const response = { message: 'Series created successfully.', seriesId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating series.', details: error.message });
    }
};

exports.updateSeries = async (req, res) => {
    const { title, description, subtitles, minimumAge } = req.body;
    try {
        const [result] = await db.execute('UPDATE Series SET Title = ?, Description = ?, Subtitles = ?, MinimumAge = ? WHERE SeriesID = ?', [title, description, subtitles, minimumAge, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Series not found.' });
        }

        const response = { message: 'Series updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating series.', details: error.message });
    }
};

exports.deleteSeries = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Series WHERE SeriesID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Series not found.' });
        }

        const response = { message: 'Series deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting series.', details: error.message });
    }
};
