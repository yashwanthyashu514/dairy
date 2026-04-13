import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error connecting to database', err);
  else console.log('Connected to SQLite database.');
});

// Setup tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    whatsapp TEXT,
    address TEXT,
    account_number TEXT,
    ifsc TEXT,
    joined_date TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS milk_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,
    date TEXT,
    session TEXT,
    weight REAL,
    snf REAL,
    fat REAL,
    rate REAL,
    total REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,
    amount REAL,
    date TEXT,
    note TEXT
  )`);
});

const dbAll = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
const dbGet = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) { err ? reject(err) : resolve(this); });
});

// API Routes
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await dbAll('SELECT * FROM clients');
    res.json(clients);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, phone, whatsapp, address, account_number, ifsc } = req.body;
    const row = await dbGet('SELECT COUNT(*) as count FROM clients');
    const newIdNum = row.count + 1;
    const clientId = `TD${String(newIdNum).padStart(3, '0')}`;
    const joined_date = new Date().toISOString().split('T')[0];

    await dbRun(
      'INSERT INTO clients (id, name, phone, whatsapp, address, account_number, ifsc, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [clientId, name, phone, whatsapp, address, account_number, ifsc, joined_date]
    );
    res.json({ id: clientId, message: 'Client created successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await dbAll(`
      SELECT e.*, c.name as client_name 
      FROM milk_entries e 
      JOIN clients c ON e.client_id = c.id 
      ORDER BY e.id DESC LIMIT 10
    `);
    res.json(entries);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/entries', async (req, res) => {
  try {
    const { client_id, date, session, weight, snf, fat, rate } = req.body;
    const total = parseFloat(weight) * parseFloat(rate);
    await dbRun(
      'INSERT INTO milk_entries (client_id, date, session, weight, snf, fat, rate, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [client_id, date, session, weight, snf, fat, rate, total]
    );
    res.json({ message: 'Entry recorded successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await dbAll(`
      SELECT p.*, c.name as client_name 
      FROM payments p 
      JOIN clients c ON p.client_id = c.id 
      ORDER BY p.id DESC LIMIT 20
    `);
    res.json(payments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { client_id, amount, date, note } = req.body;
    await dbRun(
      'INSERT INTO payments (client_id, amount, date, note) VALUES (?, ?, ?, ?)',
      [client_id, amount, date, note]
    );
    res.json({ message: 'Payment recorded successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const clientsCount = await dbGet('SELECT COUNT(*) as count FROM clients');
    const todayEntries = await dbGet('SELECT COUNT(*) as count, SUM(weight) as total_weight FROM milk_entries WHERE date = ?', [today]);
    const totalRevenue = await dbGet('SELECT SUM(total) as revenue FROM milk_entries');
    res.json({
      activeClients: clientsCount.count || 0,
      todayEntries: todayEntries.count || 0,
      todayMilk: todayEntries.total_weight || 0,
      totalRevenue: totalRevenue.revenue || 0,
      pendingBalance: 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/billing', async (req, res) => {
  try {
    const { client_id, from_date, to_date } = req.query;
    if (!client_id) return res.status(400).json({error: 'Client ID required'});
    const client = await dbGet('SELECT * FROM clients WHERE id = ?', [client_id]);
    const entries = await dbAll(
      'SELECT * FROM milk_entries WHERE client_id = ? AND date >= ? AND date <= ? ORDER BY date ASC',
      [client_id, from_date, to_date]
    );
    const payments = await dbAll(
      'SELECT SUM(amount) as paid FROM payments WHERE client_id = ? AND date >= ? AND date <= ?',
      [client_id, from_date, to_date]
    );
    
    let totalWeight = 0;
    let totalAmount = 0;
    entries.forEach(e => {
      totalWeight += parseFloat(e.weight || 0);
      totalAmount += parseFloat(e.total || 0);
    });
    
    const paid = parseFloat(payments[0]?.paid || 0);

    res.json({
      client,
      entries,
      summary: {
        totalWeight,
        totalAmount,
        paid: paid,
        balance: totalAmount - paid
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reports', async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    const from_date = `${month}-01`;
    const to_date = `${month}-31`; // Simplified for demo
    
    const entries = await dbAll(`
      SELECT e.client_id, c.name, SUM(e.weight) as total_weight, SUM(e.total) as total_amount
      FROM milk_entries e
      JOIN clients c ON e.client_id = c.id
      WHERE e.date >= ? AND e.date <= ?
      GROUP BY e.client_id
    `, [from_date, to_date]);
    
    const payments = await dbAll(`
      SELECT client_id, SUM(amount) as total_paid
      FROM payments WHERE date >= ? AND date <= ? GROUP BY client_id
    `, [from_date, to_date]);
    
    const data = entries.map(e => {
      const p = payments.find(p => p.client_id === e.client_id);
      const paid = p ? p.total_paid : 0;
      return {
        ...e,
        paid,
        balance: e.total_amount - paid
      };
    });
    
    res.json(data);
  } catch(err) { res.status(500).json({ error: err.message }) }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
