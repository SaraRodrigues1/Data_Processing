const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getHistoryByProfile = async (req, res) => {
    try {
        const [history] = await db.execute(
            'SELECT * FROM History WHERE ProfileID = ?',
            [req.params.profileId]
        );
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, history);
        }
        sendJSONResponse(res, 200, history);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching history.', details: error.message });
    }
};
