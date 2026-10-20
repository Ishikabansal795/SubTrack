const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions
router.get('/transactions', auth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT date, merchant_clean, amount, type
       FROM transactions WHERE user_id = ? ORDER BY date DESC`
    )
    .all(req.userId);

  res.json(rows);
});

module.exports = router;