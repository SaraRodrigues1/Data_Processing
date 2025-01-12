const express = require('express'); 
const http = require('http'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const mysql = require('mysql');

const app = express(); 

const secretKey = 'secret-key';

const PORT = process.env.PORT || 3000;

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'data_processing',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.locals.db = db;

function loadRoutes(directory) {
    const routesPath = path.join(__dirname, directory);
    fs.readdirSync(routesPath).forEach((file) => {
        if (file.endsWith('Routes.js')) { 
            const route = require(path.join(routesPath, file));
            route(app); 
        }
    });
}

loadRoutes('routes');

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
