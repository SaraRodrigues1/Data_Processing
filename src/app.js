const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(bodyParser.json());

//incomplete
const accountRoutes = require('./routes/accountRoutes');
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/accounts', accountRoutes);
app.use('/api/profiles', profileRoutes);

module.exports = app;
