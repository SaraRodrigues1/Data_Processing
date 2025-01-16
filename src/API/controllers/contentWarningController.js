const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getContentWarningById = async (req, res) => {
    try {
        const [contentWarning] = await db.execute('SELECT * FROM ContentWarnings WHERE ContentWarningID = ?', [req.params.id]);
        if (contentWarning.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Content warning not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, contentWarning[0]);
        }
        sendJSONResponse(res, 200, contentWarning[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching content warning.', details: error.message });
    }
};

exports.createContentWarning = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return sendJSONResponse(res, 400, { error: 'Name is required.' });

    try {
        const [result] = await db.execute('INSERT INTO ContentWarnings (Name, Description) VALUES (?, ?)', [name, description]);
        const response = { message: 'Content warning created successfully.', contentWarningId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating content warning.', details: error.message });
    }
};

exports.updateContentWarning = async (req, res) => {
    const { name, description } = req.body;
    try {
        const [result] = await db.execute('UPDATE ContentWarnings SET Name = ?, Description = ? WHERE ContentWarningID = ?', [name, description, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Content warning not found.' });
        }

        const response = { message: 'Content warning updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating content warning.', details: error.message });
    }
};

exports.deleteContentWarning = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM ContentWarnings WHERE ContentWarningID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Content warning not found.' });
        }

        const response = { message: 'Content warning deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting content warning.', details: error.message });
    }
};

