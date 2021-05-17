const express = require('express');
const bodyParser = require('body-parser');
//To create a random id for posts we use crypto
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
//Save data on memory by creating an empty object for posts
const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});
app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('listening on port 4000');
});
