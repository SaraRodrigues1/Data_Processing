const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getWatchingSeries = async (req, res) => {
    try {
        const [watchingSeries] = await db.execute('SELECT * FROM WatchingSeries WHERE ProfileID = ? AND SeriesID = ?', [req.params.profileId, req.params.seriesId]);
        if (watchingSeries.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching series record not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, watchingSeries[0]);
        }
        sendJSONResponse(res, 200, watchingSeries[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching watching series record.', details: error.message });
    }
};

exports.createWatchingSeries = async (req, res) => {
    const { profileId, seriesId } = req.body;
    if (!profileId || !seriesId) {
        return sendJSONResponse(res, 400, { error: 'ProfileId and SeriesId are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO WatchingSeries (ProfileID, SeriesID) VALUES (?, ?)', [profileId, seriesId]);
        const response = { message: 'Watching series record created successfully.', watchingSeriesId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating watching series record.', details: error.message });
    }
};

exports.updateWatchingSeries = async (req, res) => {
    const { profileId, seriesId } = req.body;
    try {
        const [result] = await db.execute('UPDATE WatchingSeries SET SeriesID = ? WHERE ProfileID = ?', [seriesId, profileId]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching series record not found.' });
        }

        const response = { message: 'Watching series record updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating watching series record.', details: error.message });
    }
};

exports.deleteWatchingSeries = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM WatchingSeries WHERE ProfileID = ? AND SeriesID = ?', [req.params.profileId, req.params.seriesId]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Watching series record not found.' });
        }

        const response = { message: 'Watching series record deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting watching series record.', details: error.message });
    }
};
