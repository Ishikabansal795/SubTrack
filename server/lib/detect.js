<<<<<<< HEAD

const {
  detectRecurring
} = require('../utils/detectRecurring');

// Keep the existing function name so upload.js still works.
function detectSubscriptions(transactions) {
  const normalizedTransactions = transactions.map((t) => ({
    date: t.date,
    description: t.raw_description || t.description || t.merchant_clean || '',
    merchant_clean: t.merchant_clean,
    amount: t.amount,
    type: t.type
  }));

  return detectRecurring(normalizedTransactions);
=======
// Recurring-payment detection: same merchant, regular gap, similar amount.

const PERIODS = [
  { name: 'weekly', min: 6, max: 8 },
  { name: 'monthly', min: 26, max: 35 },
  { name: 'quarterly', min: 85, max: 97 },
  { name: 'yearly', min: 355, max: 375 },
];
const AMOUNT_TOLERANCE = 0.25; // utility bills vary a little

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

function addPeriod(dateStr, freq) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDate();
  const months = { monthly: 1, quarterly: 3, yearly: 12 }[freq];
  if (months) {
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + months);
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, last));
  } else d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

function detectSubscriptions(transactions) {
  const groups = {};
  for (const t of transactions) {
    if (t.type !== 'debit') continue;
    (groups[t.merchant_clean] ||= []).push(t);
  }
  const found = [];
  for (const [merchant, list] of Object.entries(groups)) {
    if (list.length < 3) continue;
    list.sort((a, b) => a.date.localeCompare(b.date));
    const gaps = list.slice(1).map((t, i) => days(list[i].date, t.date));
    const gap = median(gaps);
    const period = PERIODS.find((p) => gap >= p.min && gap <= p.max);
    if (!period) continue;
    const amt = median(list.map((t) => t.amount));
    if (!list.every((t) => Math.abs(t.amount - amt) / amt <= AMOUNT_TOLERANCE)) continue;
    const last = list[list.length - 1];
    found.push({
      merchant, amount: last.amount, frequency: period.name,
      last_paid: last.date, next_due: addPeriod(last.date, period.name),
    });
  }
  return found;
>>>>>>> 1575f64ca0f5f749b7fd599f6c32600a708476d0
}

module.exports = { detectSubscriptions };
