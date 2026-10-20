require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('SubTrack server is running'));

app.listen(process.env.PORT, () =>
  console.log(`SubTrack server running on port ${process.env.PORT}`)
);