const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'subtrack.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    raw_description TEXT,
    merchant_clean TEXT,
    amount REAL,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    merchant TEXT,
    amount REAL,
    frequency TEXT,
    last_paid TEXT,
    next_due TEXT
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    subscription_id INTEGER,
    message TEXT,
    due_date TEXT
  );
`);

console.log('Database ready');

module.exports = db;