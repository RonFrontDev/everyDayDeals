const express = require('express');
const cors = require('cors');
const dummyData = require('./dummyData'); // Import dummyData

const app = express();
app.use(cors());

// Endpoint to serve deals
app.get('/api/deals', (req, res) => {
  res.json(dummyData);
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
