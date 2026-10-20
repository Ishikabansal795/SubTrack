function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function addPeriod(dateStr, frequency) {
  const d = new Date(dateStr);
  if (frequency === 'monthly') d.setUTCMonth(d.getUTCMonth() + 1);
  else d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

function detectSubscriptions(transactions) {
  const groups = {};

  for (const t of transactions) {
    if (t.type !== 'debit') continue;
    (groups[t.merchant_clean] = groups[t.merchant_clean] || []).push(t);
  }

  const result = [];

  for (const [merchant, list] of Object.entries(groups)) {
    if (list.length < 3) continue;

    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    const gaps = [];
    for (let i = 1; i < list.length; i++) {
      gaps.push(daysBetween(list[i - 1].date, list[i].date));
    }
    const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;

    const amounts = list.map((t) => t.amount);
    const avgAmt = amounts.reduce((s, a) => s + a, 0) / amounts.length;
    const similar = amounts.every((a) => Math.abs(a - avgAmt) / avgAmt <= 0.3);

    let frequency = null;
    if (avgGap >= 25 && avgGap <= 35) frequency = 'monthly';
    else if (avgGap >= 6 && avgGap <= 8) frequency = 'weekly';

    if (!frequency || !similar) continue;

    const last = list[list.length - 1];
    result.push({
      merchant,
      amount: last.amount,
      frequency,
      last_paid: last.date,
      next_due: addPeriod(last.date, frequency),
    });
  }

  return result;
}

module.exports = detectSubscriptions;