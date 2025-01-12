const express= require('express');
const app = express; 

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = 'secret-key';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// test
app.get('/', (req, res) => {
   res.send('Hello, Express!');
});

require('./app/routes')(app, {});
