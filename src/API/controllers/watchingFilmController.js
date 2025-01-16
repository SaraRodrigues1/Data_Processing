const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getWatchingFilm = async (req, res) => {
    try {
        const [watchingFilm] = await db.execute('SELECT * FROM WatchingFilm WHERE ProfileID = ? AND FilmID = ?', [req.params.profileId, req.params.filmId]);
        if (watchingFilm.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching film record not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, watchingFilm[0]);
        }
        sendJSONResponse(res, 200, watchingFilm[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching watching film record.', details: error.message });
    }
};

exports.createWatchingFilm = async (req, res) => {
    const { profileId, filmId } = req.body;
    if (!profileId || !filmId) {
        return sendJSONResponse(res, 400, { error: 'ProfileId and FilmId are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO WatchingFilm (ProfileID, FilmID) VALUES (?, ?)', [profileId, filmId]);
        const response = { message: 'Watching film record created successfully.', watchingFilmId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating watching film record.', details: error.message });
    }
};

exports.updateWatchingFilm = async (req, res) => {
    const { profileId, filmId } = req.body;
    try {
        const [result] = await db.execute('UPDATE WatchingFilm SET FilmID = ? WHERE ProfileID = ?', [filmId, profileId]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching film record not found.' });
        }

        const response = { message: 'Watching film record updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating watching film record.', details: error.message });
    }
};

exports.deleteWatchingFilm = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM WatchingFilm WHERE ProfileID = ? AND FilmID = ?', [req.params.profileId, req.params.filmId]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching film record not found.' });
        }

        const response = { message: 'Watching film record deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting watching film record.', details: error.message });
    }
};
