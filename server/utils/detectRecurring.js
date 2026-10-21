
const DAY_MS = 24 * 60 * 60 * 1000;

// Convert supported date formats into valid Date objects.
function parseDate(value) {
  if (!value) return null;

  const s = String(value).trim();
  let match;

  if ((match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) {
    return makeDate(+match[1], +match[2], +match[3]);
  }

  if ((match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) {
    return makeDate(+match[3], +match[2], +match[1]);
  }

  if ((match = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/))) {
    return makeDate(+match[3], +match[2], +match[1]);
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime())
    ? null
    : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function makeDate(year, month, day) {
  const d = new Date(year, month - 1, day);

  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }

  return d;
}

// Convert messy bank descriptions into consistent merchant names.
function cleanMerchant(description = "") {
  const text = String(description)
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const knownMerchants = [
    [/\bnetflix\b/, "Netflix"],
    [/\bspotify\b/, "Spotify"],
    [/\bgolds gym\b|\bgym\b|\bfitness\b/, "Gold's Gym"],
    [/\bjio\b/, "Jio"],
    [/\bswiggy\b/, "Swiggy"],
    [/\bzomato\b/, "Zomato"],
    [/\bamazon\b/, "Amazon"],
    [/\buber\b/, "Uber"],
    [/\belectricity\b|\bjvvnl\b|\bdiscom\b/, "Electricity Bill"],
    [/\bmyntra\b/, "Myntra"]
  ];

  for (const [pattern, name] of knownMerchants) {
    if (pattern.test(text)) return name;
  }

  return text
    .replace(/\b(com|india|online|payment|limited|ltd|pvt)\b/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()) || "Unknown Merchant";
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function addMonths(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDay));
  return result;
}

function detectRecurring(transactions, options = {}) {
  const minOccurrences = options.minOccurrences ?? 3;
  const amountTolerance = options.amountTolerance ?? 0.15;
  const groups = new Map();

  // Group debit transactions by cleaned merchant.
  for (const tx of transactions) {
    if (String(tx.type || "debit").toLowerCase() !== "debit") {
      continue;
    }

    const date = parseDate(tx.date);
    const amount = Number(tx.amount);

    if (!date || !Number.isFinite(amount) || amount <= 0) {
      continue;
    }

    const merchant =
      tx.merchant_clean || cleanMerchant(
        tx.raw_description || tx.description || tx.merchant || ""
      );

    if (!groups.has(merchant)) groups.set(merchant, []);

    groups.get(merchant).push({
      date,
      amount,
      merchant
    });
  }

  const subscriptions = [];

  for (const [merchant, rows] of groups) {
    rows.sort((a, b) => a.date - b.date);

    if (rows.length < minOccurrences) continue;

    // Keep payments with amounts close to the typical amount.
    const typicalAmount = median(rows.map(row => row.amount));

    const stable = rows.filter(row =>
      Math.abs(row.amount - typicalAmount) /
        Math.max(typicalAmount, 1) <= amountTolerance
    );

    if (stable.length < minOccurrences) continue;

    // Check the time between consecutive payments.
    const gaps = [];

    for (let i = 1; i < stable.length; i++) {
      gaps.push(Math.round(
        (stable[i].date - stable[i - 1].date) / DAY_MS
      ));
    }

    const averageGap =
      gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    let frequency;
    let nextDue;

    if (averageGap >= 5 && averageGap <= 9) {
      frequency = "weekly";
      nextDue = new Date(stable[stable.length - 1].date);
      nextDue.setDate(nextDue.getDate() + 7);
    } else if (averageGap >= 28 && averageGap <= 32) {
      frequency = "monthly";
      nextDue = addMonths(stable[stable.length - 1].date, 1);
    } else if (averageGap >= 350 && averageGap <= 380) {
      frequency = "yearly";
      nextDue = new Date(stable[stable.length - 1].date);
      nextDue.setDate(nextDue.getDate() + 365);
    } else {
      continue;
    }

    subscriptions.push({
      merchant,
      amount: Math.round(typicalAmount * 100) / 100,
      frequency,
      last_paid: formatDate(stable[stable.length - 1].date),
      next_due: formatDate(nextDue)
    });
  }

  return subscriptions.sort((a, b) =>
    a.next_due.localeCompare(b.next_due)
  );
}

module.exports = {
  cleanMerchant,
  parseDate,
  detectRecurring
};
