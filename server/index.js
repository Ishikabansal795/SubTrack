require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('SubTrack server is running'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/transactions'));
app.use('/api', require('./routes/subscriptions'));
app.listen(process.env.PORT, () =>
  console.log(`SubTrack server running on port ${process.env.PORT}`)
);