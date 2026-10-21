require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
require('./db');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set it.');
  process.exit(1);
}
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.send('SubTrack server is running'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/transactions'));
app.use('/api', require('./routes/subscriptions'));

app.listen(PORT, () => console.log(`SubTrack running at http://localhost:${PORT}`));
