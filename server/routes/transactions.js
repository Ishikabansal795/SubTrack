const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/transactions
router.get('/transactions', auth, (req, res) => {
  res.json(db.prepare(
    'SELECT id,date,raw_description,merchant_clean,amount,type FROM transactions WHERE user_id=? ORDER BY date DESC, id DESC'
  ).all(req.userId));
});

// DELETE /api/transactions  (clear all of this user's data)
router.delete('/transactions', auth, (req, res) => {
  db.prepare('DELETE FROM transactions WHERE user_id=?').run(req.userId);
  db.prepare('DELETE FROM subscriptions WHERE user_id=?').run(req.userId);
  res.json({ message: 'Cleared' });
});

module.exports = router;
