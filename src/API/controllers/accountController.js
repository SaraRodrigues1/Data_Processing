const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getAccountById = async (req, res) => {
    try {
        const [account] = await db.execute('SELECT * FROM Account WHERE UserID = ?', [req.params.id]);
        if (account.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Account not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, account[0]);
        }
        sendJSONResponse(res, 200, account[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching account.', details: error.message });
    }
};

exports.createAccount = async (req, res) => {
    const { email, subscriptionId } = req.body;
    if (!email) return sendJSONResponse(res, 400, { error: 'Email is required.' });

    try {
        const [existing] = await db.execute('SELECT * FROM Account WHERE Email = ?', [email]);
        if (existing.length > 0) {
            return sendJSONResponse(res, 409, { error: 'Account already exists.' });
        }

        const [result] = await db.execute('INSERT INTO Account (Email, SubscriptionID) VALUES (?, ?)', [email, subscriptionId]);
        const response = { message: 'Account created successfully.', accountId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating account.', details: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    const { email, subscriptionId } = req.body;
    try {
        const [result] = await db.execute('UPDATE Account SET Email = ?, SubscriptionID = ? WHERE UserID = ?', [email, subscriptionId, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Account not found.' });
        }

        const response = { message: 'Account updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating account.', details: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Account WHERE UserID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Account not found.' });
        }

        const response = { message: 'Account deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting account.', details: error.message });
    }
};

exports.blockAccount = async (req, res) => {
    try {
        const [account] = await db.execute('SELECT * FROM Account WHERE UserID = ?', [req.params.id]);
        if (account.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Account not found.' });
        }

        const newStatus = account[0].AccountBlocked === 0 ? 1 : 0;
        await db.execute('UPDATE Account SET AccountBlocked = ? WHERE UserID = ?', [newStatus, req.params.id]);

        const response = { message: `Account ${newStatus ? 'blocked' : 'unblocked'} successfully.` };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating account status.', details: error.message });
    }
};
