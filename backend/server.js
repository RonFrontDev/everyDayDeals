const express = require('express');
const cors = require('cors');
const deals = require('./dummyData');

const app = express();
app.use(cors());

app.get('/api/deals', (req, res) => {
  res.json(deals);
});

app.listen(5000, () => console.log('Server running on port 5000'));
