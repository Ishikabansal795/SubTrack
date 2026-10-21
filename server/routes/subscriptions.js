
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

const PER_MONTH = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12
};

// GET /api/subscriptions -> list + monthly/yearly totals
router.get('/subscriptions', auth, (req, res) => {
  const subs = db
    .prepare('SELECT * FROM subscriptions WHERE user_id=? ORDER BY next_due')
    .all(req.userId);

  const monthly = subs.reduce(
    (total, subscription) =>
      total + subscription.amount * (PER_MONTH[subscription.frequency] || 0),
    0
  );

  res.json({
    subscriptions: subs,
    monthlyTotal: Math.round(monthly * 100) / 100,
    yearlyTotal: Math.round(monthly * 12 * 100) / 100,
  });
});

// GET /api/alerts?days=7 -> subscriptions due soon (or overdue)
router.get('/alerts', auth, (req, res) => {
  const n = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
  const limit = new Date(Date.now() + n * 86400000)
    .toISOString()
    .slice(0, 10);

  const due = db
    .prepare(
      'SELECT * FROM subscriptions WHERE user_id=? AND next_due<=? ORDER BY next_due'
    )
    .all(req.userId, limit);

  res.json(
    due.map((subscription) => ({
      subscription_id: subscription.id,
      message: `${subscription.merchant} (₹${subscription.amount}) is due`,
      due_date: subscription.next_due,
    }))
  );
});

module.exports = router;
