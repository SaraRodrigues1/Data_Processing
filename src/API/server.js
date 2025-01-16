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

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


app.locals.db = pool;

app.use(express.json()); 

const accountsRouter = require('./routes/accountRoutes');
const genreRouter = require('./routes/genreRoutes');
const historyRouter = require('./routes/historyRoutes');
const loginRouter = require('./routes/loginRoutes');
const profileRouter = require('./routes/profileRoutes');
const contentRouter = require('./routes/contentRoutes');
const contentWarningRouter = require('./routes/contentWarningRoutes');
const recommendationRouter = require('./routes/recommendationRoutes');
const subscriptionsRouter = require('./routes/subscriptionsRoutes');
const watchingFilmRouter = require('./routes/watchingFilmRoutes');
const watchingSeriesRouter = require('./routes/watchingSeriesRoutes');
const authenticateToken = require('./middleware/authenticateToken');

app.use(authenticateToken);


app.use('/api/accounts', accountsRouter);  
app.use('/api/genres', genreRouter);     
app.use('/api/history', historyRouter);  
app.use('/api/login', loginRouter);        
app.use('/api/profiles', profileRouter);  
app.use('/api/content', contentRouter);  
app.use('/api/recommendation', recommendationRouter);  
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/contentWarning', contentWarningRouter);
app.use('/api/watchingFilm', watchingFilmRouter);
app.use('/api/watchingSeries', watchingSeriesRouter);


const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
