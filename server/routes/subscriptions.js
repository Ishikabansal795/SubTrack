const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const detectSubscriptions = require('../utils/detectSubscriptions');

const router = express.Router();

// GET /api/subscriptions
router.get('/subscriptions', auth, (req, res) => {
  const transactions = db
    .prepare('SELECT date, merchant_clean, amount, type FROM transactions WHERE user_id = ?')
    .all(req.userId);

  const found = detectSubscriptions(transactions);

  const clear = db.prepare('DELETE FROM subscriptions WHERE user_id = ?');
  const insert = db.prepare(
    `INSERT INTO subscriptions (user_id, merchant, amount, frequency, last_paid, next_due)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  db.transaction(() => {
    clear.run(req.userId);
    for (const s of found) {
      insert.run(req.userId, s.merchant, s.amount, s.frequency, s.last_paid, s.next_due);
    }
  })();

  res.json(found);
});

module.exports = router;