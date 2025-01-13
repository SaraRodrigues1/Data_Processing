const express = require('express'); 
const http = require('http'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); 

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

app.use(express.json()); 

const accountsRouter = require('./routes/accountRoutes');
const genreRouter = require('./routes/genreRoutes');
const historyRouter = require('./routes/historyRoutes');
const loginRouter = require('./routes/loginRoutes');
const mediaRouter = require('./routes/mediaRoutes');
const profileRouter = require('./routes/profileRoutes');


app.use('/api/accounts', accountsRouter);  
app.use('/api/genres', genreRouter);     
app.use('/api/history', historyRouter);  
app.use('/api/login', loginRouter);     
app.use('/api/media', mediaRouter);    
app.use('/api/profiles', profileRouter);  

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
