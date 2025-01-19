const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getRecommendations = async (req, res) => {
    try {
        const [recommendations] = await db.execute('SELECT * FROM Recommendations WHERE ProfileID = ?', [req.params.id]);
        if (recommendations.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Recommendations not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, recommendations);
        }
        sendJSONResponse(res, 200, recommendations);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching recommendations.', details: error.message });
    }
};

exports.createRecommendations = async (req, res) => {
    const { profileId, mediaType, mediaId } = req.body;
    if (!profileId || !mediaType || !mediaId) {
        return sendJSONResponse(res, 400, { error: 'ProfileId, MediaType, and MediaId are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO Recommendations (ProfileID, MediaType, MediaID) VALUES (?, ?, ?)', [profileId, mediaType, mediaId]);
        const response = { message: 'Recommendation created successfully.', recommendationId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating recommendation.', details: error.message });
    }
};

exports.updateRecommendations = async (req, res) => {
    const { mediaType, mediaId } = req.body;
    try {
        const [result] = await db.execute('UPDATE Recommendations SET MediaType = ?, MediaID = ? WHERE RecommendationID = ?', [mediaType, mediaId, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Recommendation not found.' });
        }

        const response = { message: 'Recommendation updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating recommendation.', details: error.message });
    }
};

exports.deleteRecommendations = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Recommendations WHERE RecommendationID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Recommendation not found.' });
        }

        const response = { message: 'Recommendation deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting recommendation.', details: error.message });
    }
};
