const e = require('express');
const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json());

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
        errorMessage: 'The user with the specified ID does not exist'
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

server.listen(5000, () => console.log('Server listening...'));
