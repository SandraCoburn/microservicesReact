const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.get('/events', (req, res) => {});
app.post('/events', (req, res) => {});

app.listen(5006, () => {
  console.log('listening on port 5003');
});
