const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== DATABASE =====
const db = new Database(path.join(__dirname, 'toka.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    cycle TEXT NOT NULL,
    next_due TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    link TEXT DEFAULT '',
    upi_id TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    expense_id TEXT,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT,
    method TEXT DEFAULT 'manual',
    paid_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== API: EXPENSES =====
app.get('/api/expenses', (req, res) => {
  const rows = db.prepare('SELECT * FROM expenses ORDER BY next_due ASC').all();
  res.json(rows.map(r => ({
    id: r.id, name: r.name, amount: r.amount, category: r.category,
    type: r.type, cycle: r.cycle, nextDue: r.next_due, status: r.status,
    link: r.link || '', upiId: r.upi_id || '', createdAt: r.created_at
  })));
});

app.post('/api/expenses', (req, res) => {
  const { name, amount, category, type, cycle, nextDue, link, upiId } = req.body;
  if (!name || !amount || !category || !type || !cycle || !nextDue) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  db.prepare(`INSERT INTO expenses (id, name, amount, category, type, cycle, next_due, status, link, upi_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`)
    .run(id, name, amount, category, type, cycle, nextDue, link || '', upiId || '');
  res.json({ id, name, amount, category, type, cycle, nextDue, status: 'active', link: link || '', upiId: upiId || '' });
});

app.patch('/api/expenses/:id', (req, res) => {
  const { status, nextDue } = req.body;
  const sets = [];
  const vals = [];
  if (status !== undefined) { sets.push('status = ?'); vals.push(status); }
  if (nextDue !== undefined) { sets.push('next_due = ?'); vals.push(nextDue); }
  if (sets.length === 0) return res.status(400).json({ error: 'Nothing to update' });
  vals.push(req.params.id);
  db.prepare(`UPDATE expenses SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({
    id: row.id, name: row.name, amount: row.amount, category: row.category,
    type: row.type, cycle: row.cycle, nextDue: row.next_due, status: row.status,
    link: row.link || '', upiId: row.upi_id || ''
  });
});

app.delete('/api/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ===== API: PAYMENTS =====
app.get('/api/payments', (req, res) => {
  const rows = db.prepare('SELECT * FROM payments ORDER BY paid_at DESC').all();
  res.json(rows.map(r => ({
    id: r.id, expenseId: r.expense_id, name: r.name, amount: r.amount,
    category: r.category, method: r.method, date: r.paid_at
  })));
});

app.post('/api/payments', (req, res) => {
  const { expenseId, name, amount, category, method } = req.body;
  if (!name || !amount) return res.status(400).json({ error: 'Missing name or amount' });
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  db.prepare(`INSERT INTO payments (id, expense_id, name, amount, category, method) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, expenseId || null, name, amount, category || '', method || 'manual');
  res.json({ id, expenseId, name, amount, category, method: method || 'manual', date: new Date().toISOString() });
});

// ===== API: SETTINGS =====
app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const obj = {};
  rows.forEach(r => { obj[r.key] = r.value; });
  res.json(obj);
});

app.put('/api/settings', (req, res) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const txn = db.transaction((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      stmt.run(key, String(value));
    }
  });
  txn(req.body);
  res.json({ ok: true });
});

// ===== API: STATS =====
app.get('/api/stats', (req, res) => {
  const expenses = db.prepare("SELECT * FROM expenses WHERE status != 'cancelled'").all();
  let totalMonthly = 0, subMonthly = 0, billMonthly = 0, persMonthly = 0;
  let subCount = 0, billCount = 0, persCount = 0;
  const today = new Date(); today.setHours(0,0,0,0);

  expenses.forEach(e => {
    let monthly = e.amount;
    if (e.cycle === 'quarterly') monthly = e.amount / 3;
    else if (e.cycle === 'yearly') monthly = e.amount / 12;
    else if (e.cycle === 'onetime') monthly = 0;

    totalMonthly += monthly;
    if (e.type === 'sub') { subMonthly += monthly; subCount++; }
    else if (e.type === 'bill') { billMonthly += monthly; billCount++; }
    else if (e.type === 'pers') { persMonthly += monthly; persCount++; }
  });

  const upcoming = expenses.filter(e => {
    const due = new Date(e.next_due); due.setHours(0,0,0,0);
    const days = Math.round((due - today) / 86400000);
    return days >= 0 && days <= 7;
  }).length;

  const snoozed = db.prepare("SELECT COUNT(*) as c FROM expenses WHERE status = 'snoozed'").get().c;

  res.json({
    totalMonthly: Math.round(totalMonthly),
    subMonthly: Math.round(subMonthly), billMonthly: Math.round(billMonthly), persMonthly: Math.round(persMonthly),
    subCount, billCount, persCount,
    yearlyProjected: Math.round(totalMonthly * 12),
    upcomingThisWeek: upcoming,
    snoozedCount: snoozed,
    totalExpenses: db.prepare('SELECT COUNT(*) as c FROM expenses').get().c
  });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n  Toka running at http://localhost:${PORT}\n`);
});