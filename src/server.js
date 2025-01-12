const express= require('express');
const app = express; 

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

 // test
 app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });
