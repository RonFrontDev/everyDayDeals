import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dealsRouter from './routes/deals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

dotenv.config({ path: envPath });

const PORT = process.env.SERVER_PORT || 5000;

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/deals', dealsRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
