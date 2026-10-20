const KNOWN = [
  ['netflix', 'Netflix'],
  ['spotify', 'Spotify'],
  ['golds gym', "Gold's Gym"],
  ['jio', 'Jio Recharge'],
  ['bses', 'BSES Electricity'],
  ['swiggy', 'Swiggy'],
  ['zomato', 'Zomato'],
  ['amazon', 'Amazon'],
  ['uber', 'Uber'],
  ['big bazaar', 'Big Bazaar'],
  ['salary', 'Salary'],
];

function cleanMerchant(description) {
  const lower = String(description || '').toLowerCase();

  for (const [key, name] of KNOWN) {
    if (lower.includes(key)) return name;
  }

  // Fallback: strip prefixes, digits and symbols, then capitalize
  const cleaned = lower
    .replace(/^upi-?/, '')
    .replace(/[0-9]/g, '')
    .replace(/[^a-z ]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return cleaned || 'Unknown';
}

module.exports = cleanMerchant;