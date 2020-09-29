const express = require('express');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ msg: 'API running!' });
});

server.listen(5000, () => console.log('Server listening...'));
