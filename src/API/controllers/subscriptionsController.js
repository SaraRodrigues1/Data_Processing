const db = require('../db');
const json2xml = require('json2xml');

const sendJSONResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};

const sendXMLResponse = (res, statusCode, data) => {
    const xmlData = json2xml(data);
    res.header('Content-Type', 'application/xml').status(statusCode).send(xmlData);
};

exports.getSubscriptionById = async (req, res) => {
    try {
        const [subscription] = await db.execute('SELECT * FROM Subscription WHERE SubscriptionID = ?', [req.params.id]);
        if (subscription.length === 0) {
            return sendJSONResponse(res, 404, { error: 'Subscription not found.' });
        }
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, subscription[0]);
        }
        sendJSONResponse(res, 200, subscription[0]);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error fetching subscription.', details: error.message });
    }
};

exports.createSubscription = async (req, res) => {
    const { subscriptionType, discount } = req.body;
    if (!subscriptionType) return sendJSONResponse(res, 400, { error: 'Subscription type is required.' });

    try {
        const [result] = await db.execute('INSERT INTO Subscription (SubscriptionType, Discount) VALUES (?, ?)', [subscriptionType, discount]);
        const response = { message: 'Subscription created successfully.', subscriptionId: result.insertId };

        if (req.accepts('xml')) {
            return sendXMLResponse(res, 201, response);
        }
        sendJSONResponse(res, 201, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error creating subscription.', details: error.message });
    }
};

exports.updateSubscription = async (req, res) => {
    const { subscriptionType, discount } = req.body;
    try {
        const [result] = await db.execute('UPDATE Subscription SET SubscriptionType = ?, Discount = ? WHERE SubscriptionID = ?', [subscriptionType, discount, req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Subscription not found.' });
        }

        const response = { message: 'Subscription updated successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error updating subscription.', details: error.message });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Subscription WHERE SubscriptionID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return sendJSONResponse(res, 404, { error: 'Subscription not found.' });
        }

        const response = { message: 'Subscription deleted successfully.' };
        if (req.accepts('xml')) {
            return sendXMLResponse(res, 200, response);
        }
        sendJSONResponse(res, 200, response);
    } catch (error) {
        sendJSONResponse(res, 500, { error: 'Error deleting subscription.', details: error.message });
    }
};
