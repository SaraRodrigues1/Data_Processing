const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM Account WHERE Email = ?', [email]);
        if (user.length === 0) return sendJSONResponse(res, 404, { error: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user[0].Password);
        if (!isPasswordValid) return sendJSONResponse(res, 401, { error: 'Invalid password.' });

        const token = jwt.sign({ userId: user[0].UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const response = { token, message: 'Login successful.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error during login.', details: error.message });
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO Account (Email, Password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        const response = { message: 'User registered successfully.', UserID: result.insertId };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error during registration.', details: error.message });
    }
};

exports.verifyAccount = async (req, res) => {
    const { userId } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE Account SET AccountVerified = 1 WHERE UserID = ?',
            [userId]
        );
        if (result.affectedRows === 0) return sendJSONResponse(res, 404, { error: 'User not found.' });
        const response = { message: 'Account verified successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error during verification.', details: error.message });
    }
};
