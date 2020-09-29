const express = require('express');
const shortid = require('shortid');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.status(200).json({ msg: 'API running!' });
});

let users = [
  {
    id: 1,
    name: 'Jane Doe',
    bio: "Not Tarzan's wife"
  }
];

// GET /api/users
server.get('/api/users', (req, res) => {
  try {
    res.status(200).json({ data: users });
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The user's information could not be retrieved" });
  }
});

// GET /api/users/:id
server.get('/api/users/:id', (req, res) => {
  // pull the id from the url
  const { id } = req.params;

  // find the specific user from the data with that id
  const user = users.find((user) => user.id == id);

  try {
    // a user with specific id was found
    if (user) {
      res.status(200).json(user);
    } else {
      // return error to the client
      res.status(404).json({
        message: 'The user with the specified ID does not exist'
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be retireved' });
  }
});

// POST /api/users
server.post('/api/users', (req, res) => {
  const userInfo = req.body;
  const { name, bio } = userInfo;

  try {
    if (name && bio) {
      userInfo.id = shortid.generate();
      users.push(userInfo);
      res.status(201).json(users);
    } else {
      res
        .status(400)
        .json({ errorMessage: 'Please provide name and bio for the user' });
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: 'There was an error while saving the user to the database'
    });
  }
});

// PUT /api/users/:id
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const { name, bio } = changes;
  const found = users.find((user) => user.id == id);

  try {
    if (found) {
      if (name && bio) {
        Object.assign(found, changes);
        res.status(200).json({ data: users });
      } else {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user' });
      }
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be modified' });
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const found = users.find((user) => user.id == id);

  try {
    if (found) {
      users = users.filter((user) => user.id != id);
      res.status(200).json({ data: users });
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist' });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: 'The user could not be removed' });
  }
});

server.listen(5000, () => console.log('Server listening...'));
