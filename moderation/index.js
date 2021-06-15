const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.get('/events', (req, res) => {});
app.post('/events', async (req, res) => {
  const { tye, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .catch((error) => console.log(error.message));
  }
  res.send({});
});

app.listen(5006, () => {
  console.log('listening on port 5003');
});
