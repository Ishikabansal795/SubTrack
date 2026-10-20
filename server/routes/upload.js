const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');
const db = require('../db');
const auth = require('../middleware/auth');
const { cleanMerchant, maskDescription } = require('../lib/clean');
const { detectSubscriptions } = require('../lib/detect');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const norm = (h) => h.toLowerCase().replace(/[^a-z]/g, '');
const FIELD = {
  date: ['date', 'txndate', 'transactiondate', 'valuedate'],
  description: ['description', 'narration', 'particulars', 'details', 'remarks'],
  amount: ['amount', 'txnamount'],
  debit: ['debit', 'withdrawal', 'withdrawals', 'withdrawalamt'],
  credit: ['credit', 'deposit', 'deposits', 'depositamt'],
  type: ['type', 'drcr', 'crdr'],
};
function findCol(headers, key) {
  return headers.find((h) => FIELD[key].includes(norm(h)));
}

function parseDate(s) {
  s = String(s || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return null;
}
const num = (v) => parseFloat(String(v || '').replace(/[, ]/g, ''));

// POST /api/upload  (multipart field: file)
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Attach a CSV file in field "file"' });

  const rows = [];
  let headers = [];
  Readable.from(req.file.buffer)
    .pipe(csv())
    .on('headers', (h) => (headers = h))
    .on('data', (r) => rows.push(r))
    .on('error', () => res.status(400).json({ message: 'Could not read CSV' }))
    .on('end', () => {
      const cols = Object.fromEntries(Object.keys(FIELD).map((k) => [k, findCol(headers, k)]));
      const hasAmount = cols.amount || cols.debit || cols.credit;
      if (!cols.date || !cols.description || !hasAmount) {
        return res.status(400).json({
          message: 'CSV needs date, description and amount (or debit/credit) columns',
          found: headers,
        });
      }

      const exists = db.prepare(
        'SELECT 1 FROM transactions WHERE user_id=? AND date=? AND raw_description=? AND amount=?');
      const insert = db.prepare(
        `INSERT INTO transactions (user_id,date,raw_description,merchant_clean,amount,type)
         VALUES (?,?,?,?,?,?)`);

      let added = 0, skipped = 0, invalid = 0;
      db.transaction(() => {
        for (const r of rows) {
          const date = parseDate(r[cols.date]);
          let amount, type;
          if (cols.debit || cols.credit) {
            const d = num(r[cols.debit]), c = num(r[cols.credit]);
            if (d > 0) { amount = d; type = 'debit'; }
            else if (c > 0) { amount = c; type = 'credit'; }
          } else {
            amount = Math.abs(num(r[cols.amount]));
            const t = String(r[cols.type] || '').toLowerCase();
            type = t.startsWith('c') ? 'credit' : t.startsWith('d') ? 'debit'
              : num(r[cols.amount]) < 0 ? 'debit' : 'credit';
          }
          if (!date || !(amount > 0) || !r[cols.description]) { invalid++; continue; }

          const raw = maskDescription(r[cols.description]);
          const merchant = cleanMerchant(r[cols.description]);
          if (exists.get(req.userId, date, raw, amount)) { skipped++; continue; }
          insert.run(req.userId, date, raw, merchant, amount, type);
          added++;
        }
      })();

      // Re-run detection over everything this user has uploaded.
      const all = db.prepare('SELECT * FROM transactions WHERE user_id=?').all(req.userId);
      const subs = detectSubscriptions(all);
      db.transaction(() => {
        db.prepare('DELETE FROM subscriptions WHERE user_id=?').run(req.userId);
        const ins = db.prepare(
          `INSERT INTO subscriptions (user_id,merchant,amount,frequency,last_paid,next_due)
           VALUES (?,?,?,?,?,?)`);
        for (const s of subs) ins.run(req.userId, s.merchant, s.amount, s.frequency, s.last_paid, s.next_due);
      })();

      res.json({ added, skipped, invalid, subscriptionsDetected: subs.length });
    });
});

module.exports = router;
