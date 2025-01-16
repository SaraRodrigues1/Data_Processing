const db = require('../db');

const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getAllGenres = async (req, res) => {
    try {
        const [genres] = await db.execute('SELECT * FROM Genre');
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, genres);
        }
        sendJSONResponse(res, 200, genres);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching genres.', details: error.message });
    }
};

exports.getGenreById = async (req, res) => {
    try {
        const [genre] = await db.execute('SELECT * FROM Genre WHERE GenreID = ?', [req.params.id]);
        if (genre.length === 0) return sendJSONResponse(res, 404, { error: 'Genre not found.' });
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, genre[0]);
        }
        sendJSONResponse(res, 200, genre[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching genre by ID.', details: error.message });
    }
};

exports.createGenre = async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO Genre (Name) VALUES (?)', [name]);
        const response = { message: 'Genre created successfully.', GenreID: result.insertId };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating genre.', details: error.message });
    }
};

exports.updateGenre = async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.execute('UPDATE Genre SET Name = ? WHERE GenreID = ?', [name, req.params.id]);
        if (result.affectedRows === 0) return sendJSONResponse(res, 404, { error: 'Genre not found.' });
        const response = { message: 'Genre updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating genre.', details: error.message });
    }
};

exports.deleteGenre = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Genre WHERE GenreID = ?', [req.params.id]);
        if (result.affectedRows === 0) return sendJSONResponse(res, 404, { error: 'Genre not found.' });
        const response = { message: 'Genre deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting genre.', details: error.message });
    }
};
