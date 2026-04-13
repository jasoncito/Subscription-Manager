const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'subscriptions.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    category TEXT NOT NULL DEFAULT 'entertainment',
    next_payment_date TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#0056D2',
    icon TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM subscriptions').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO subscriptions (name, price, billing_cycle, category, next_payment_date, color, icon, status)
    VALUES (@name, @price, @billingCycle, @category, @nextPaymentDate, @color, @icon, @status)
  `);

  const seedData = [
    { name: 'Netflix', price: 15.99, billingCycle: 'monthly', category: 'entertainment', nextPaymentDate: '2026-04-24', color: '#E50914', icon: 'tv', status: 'active' },
    { name: 'NordVPN', price: 12.99, billingCycle: 'monthly', category: 'software', nextPaymentDate: '2026-04-24', color: '#4687FF', icon: 'shield', status: 'active' },
    { name: 'Claude AI', price: 20.00, billingCycle: 'monthly', category: 'software', nextPaymentDate: '2026-05-02', color: '#D97757', icon: 'psychology', status: 'active' },
    { name: 'Disney+', price: 7.99, billingCycle: 'monthly', category: 'entertainment', nextPaymentDate: '2026-05-06', color: '#113CCF', icon: 'star', status: 'active' },
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });

  insertMany(seedData);
  console.log('Base de datos inicializada con datos de ejemplo');
}

module.exports = db;
