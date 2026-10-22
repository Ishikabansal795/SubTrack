
const { detectRecurring } = require('../utils/detectRecurring');

// Normalize transactions before detecting recurring subscriptions.
function detectSubscriptions(transactions) {
  const normalizedTransactions = transactions.map((t) => ({
    date: t.date,
    description:
      t.raw_description || t.description || t.merchant_clean || '',
    merchant_clean: t.merchant_clean,
    amount: t.amount,
    type: t.type,
  }));

  return detectRecurring(normalizedTransactions);
}

module.exports = { detectSubscriptions };
