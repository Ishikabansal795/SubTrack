// Merchant cleaning + masking of sensitive data in bank descriptions.

const KNOWN = [
  ['NETFLIX', 'Netflix'], ['SPOTIFY', 'Spotify'], ['GOLDS GYM', "Gold's Gym"],
  ['JIO', 'Jio'], ['BSES', 'BSES Electricity'], ['SWIGGY', 'Swiggy'],
  ['ZOMATO', 'Zomato'], ['UBER', 'Uber'], ['AMAZON', 'Amazon'],
  ['HOTSTAR', 'Disney+ Hotstar'], ['YOUTUBE', 'YouTube'], ['AIRTEL', 'Airtel'],
  ['PRIME VIDEO', 'Amazon Prime'], ['APPLE', 'Apple'], ['GOOGLE', 'Google'],
];
const NOISE = new Set(['ORDER', 'TRIP', 'PMT', 'PAYMENT', 'BILL', 'UPI', 'POS', 'NEFT', 'IMPS', 'ACH', 'TRF', 'TRANSFER', 'DEBIT', 'CREDIT']);

function cleanMerchant(raw) {
  let s = String(raw || '').toUpperCase();
  for (const [key, name] of KNOWN) if (s.includes(key)) return name;
  s = s.split('*')[0].replace(/[^A-Z\s]/g, ' ');
  const words = s.split(/\s+/).filter((w) => w && !NOISE.has(w));
  if (!words.length) return 'Unknown';
  return words.slice(0, 3).map((w) => w[0] + w.slice(1).toLowerCase()).join(' ');
}

// Mask emails/UPI handles and any digit run of 6+ (account/card/ref numbers).
function maskDescription(raw) {
  return String(raw || '')
    .replace(/[\w.\-]+@[\w.\-]+/g, '****@****')
    .replace(/\d{6,}/g, (m) => '*'.repeat(m.length - 2) + m.slice(-2));
}

module.exports = { cleanMerchant, maskDescription };
