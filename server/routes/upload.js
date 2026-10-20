const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');
const db = require('../db');
const auth = require('../middleware/auth');
const cleanMerchant = require('../utils/cleanMerchant');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload  (CSV columns: date, description, amount, type)
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const rows = [];

  Readable.from([req.file.buffer])
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('error', () => res.status(400).json({ message: 'Could not read CSV' }))
    .on('end', () => {
      const clear = db.prepare('DELETE FROM transactions WHERE user_id = ?');
      const insert = db.prepare(
        `INSERT INTO transactions
         (user_id, date, raw_description, merchant_clean, amount, type)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      const saveAll = db.transaction((list) => {
        clear.run(req.userId);
        let saved = 0;
        for (const r of list) {
          const amount = parseFloat(r.amount);
          if (!r.date || isNaN(amount)) continue;
          insert.run(
            req.userId,
            r.date,
            r.description,
            cleanMerchant(r.description),
            Math.abs(amount),
            (r.type || 'debit').toLowerCase()
          );
          saved++;
        }
        return saved;
      });

      res.json({ rowsSaved: saveAll(rows) });
    });
});

module.exports = router;