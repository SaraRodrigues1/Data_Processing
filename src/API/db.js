const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',       
    user: process.env.DB_USER || 'root',          
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'DB', 
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
});

module.exports = pool.promise();
