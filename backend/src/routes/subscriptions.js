const express = require('express');
const router = express.Router();
const db = require('../database');

const SELECT_ALL = `
  SELECT id, name, price,
    billing_cycle AS billingCycle,
    category,
    next_payment_date AS nextPaymentDate,
    color, icon, status,
    created_at AS createdAt
  FROM subscriptions
`;

// IMPORTANT: stats route BEFORE /:id
router.get('/stats/summary', (req, res) => {
  const subscriptions = db.prepare(`${SELECT_ALL} WHERE status = 'active'`).all();
  const totalMonthly = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === 'annual' ? sub.price / 12 : sub.price);
  }, 0);
  res.json({
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    count: subscriptions.length,
    annualProjection: Math.round(totalMonthly * 12 * 100) / 100,
  });
});

router.get('/', (req, res) => {
  const subscriptions = db.prepare(SELECT_ALL).all();
  res.json(subscriptions);
});

router.get('/:id', (req, res) => {
  const subscription = db.prepare(`${SELECT_ALL} WHERE id = ?`).get(req.params.id);
  if (!subscription) return res.status(404).json({ error: 'Suscripcion no encontrada' });
  res.json(subscription);
});

router.post('/', (req, res) => {
  const { name, price, billingCycle, category, nextPaymentDate, color, icon, status } = req.body;
  if (!name || price == null || !nextPaymentDate) {
    return res.status(400).json({ error: 'Campos requeridos: name, price, nextPaymentDate' });
  }
  const result = db.prepare(`
    INSERT INTO subscriptions (name, price, billing_cycle, category, next_payment_date, color, icon, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, price, billingCycle || 'monthly', category || 'entertainment', nextPaymentDate, color || '#0056D2', icon || null, status || 'active');
  const created = db.prepare(`${SELECT_ALL} WHERE id = ?`).get(result.lastInsertRowid);
  res.status(201).json(created);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM subscriptions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Suscripcion no encontrada' });
  const fields = {
    name: req.body.name, price: req.body.price, billing_cycle: req.body.billingCycle,
    category: req.body.category, next_payment_date: req.body.nextPaymentDate,
    color: req.body.color, icon: req.body.icon, status: req.body.status,
  };
  const updates = [];
  const values = [];
  for (const [col, val] of Object.entries(fields)) {
    if (val !== undefined) { updates.push(`${col} = ?`); values.push(val); }
  }
  if (updates.length > 0) {
    values.push(req.params.id);
    db.prepare(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  const updated = db.prepare(`${SELECT_ALL} WHERE id = ?`).get(req.params.id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM subscriptions WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Suscripcion no encontrada' });
  res.json({ message: 'Suscripcion eliminada correctamente' });
});

module.exports = router;
