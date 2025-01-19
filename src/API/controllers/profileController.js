const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getAllProfiles = async (req, res) => {
    try {
        const [profiles] = await db.execute('SELECT * FROM Profile');
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, profiles);
        }
        sendJSONResponse(res, 200, profiles);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching profiles.', details: error.message });
    }
};

exports.createProfile = async (req, res) => {
    const { userId, name, age, preferences } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO Profile (UserID, Name, Age, Preferences) VALUES (?, ?, ?, ?)',
            [userId, name, age, preferences]
        );
        const response = { message: 'Profile created successfully.', ProfileID: result.insertId };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating profile.', details: error.message });
    }
};

exports.getProfileById = async (req, res) => {
    try {
        const [profile] = await db.execute('SELECT * FROM Profile WHERE ProfileID = ?', [req.params.id]);
        if (profile.length === 0) return sendJSONResponse(res, 404, { error: 'Profile not found.' });
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, profile[0]);
        }
        sendJSONResponse(res, 200, profile[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching profile by ID.', details: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, age, preferences } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE Profile SET Name = ?, Age = ?, Preferences = ? WHERE ProfileID = ?',
            [name, age, preferences, req.params.id]
        );
        if (result.affectedRows === 0) return sendJSONResponse(res, 404, { error: 'Profile not found.' });
        const response = { message: 'Profile updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating profile.', details: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Profile WHERE ProfileID = ?', [req.params.id]);
        if (result.affectedRows === 0) return sendJSONResponse(res, 404, { error: 'Profile not found.' });
        const response = { message: 'Profile deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting profile.', details: error.message });
    }
};
