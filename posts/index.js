const express = require('express');
const bodyParser = require('body-parser');
//To create a random id for posts we use crypto
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

//Save data on memory by creating an empty object for posts
const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('listening on port 4000');
});
