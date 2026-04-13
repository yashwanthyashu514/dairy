// updated for render fix
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.log('⚠️ MONGO_URI not found');
}

const PORT = process.env.PORT || 3001;
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Mongo Error:", err));

const clientSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  phone: String,
  whatsapp: String,
  address: String,
  account_number: String,
  ifsc: String,
  joined_date: String
});
const Client = mongoose.model('Client', clientSchema);

const milkEntrySchema = new mongoose.Schema({
  client_id: String,
  date: String,
  session: String,
  weight: Number,
  snf: Number,
  fat: Number,
  rate: Number,
  total: Number
});
const MilkEntry = mongoose.model('MilkEntry', milkEntrySchema);

const paymentSchema = new mongoose.Schema({
  client_id: String,
  amount: Number,
  date: String,
  note: String
});
const Payment = mongoose.model('Payment', paymentSchema);

// API Routes
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find().sort({ id: 1 }).lean();
    res.json(clients);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, phone, whatsapp, address, account_number, ifsc } = req.body;
    const count = await Client.countDocuments();
    const newIdNum = count + 1;
    const clientId = `TD${String(newIdNum).padStart(3, '0')}`;
    const joined_date = new Date().toISOString().split('T')[0];

    const client = new Client({
      id: clientId, name, phone, whatsapp, address, account_number, ifsc, joined_date
    });
    await client.save();
    res.json({ id: clientId, message: 'Client created successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await MilkEntry.find().sort({ _id: -1 }).limit(10).lean();
    for (let entry of entries) {
      const client = await Client.findOne({ id: entry.client_id });
      entry.client_name = client ? client.name : 'Unknown';
    }
    res.json(entries);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/entries', async (req, res) => {
  try {
    const { client_id, date, session, weight, snf, fat, rate } = req.body;
    const total = parseFloat(weight) * parseFloat(rate);
    const entry = new MilkEntry({ client_id, date, session, weight, snf, fat, rate, total });
    await entry.save();
    res.json({ message: 'Entry recorded successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ _id: -1 }).limit(20).lean();
    for (let payment of payments) {
      const client = await Client.findOne({ id: payment.client_id });
      payment.client_name = client ? client.name : 'Unknown';
    }
    res.json(payments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { client_id, amount, date, note } = req.body;
    const payment = new Payment({ client_id, amount, date, note });
    await payment.save();
    res.json({ message: 'Payment recorded successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const clientsCount = await Client.countDocuments();

    const todayEntries = await MilkEntry.aggregate([
      { $match: { date: today } },
      { $group: { _id: null, count: { $sum: 1 }, total_weight: { $sum: "$weight" } } }
    ]);

    const totalRevenue = await MilkEntry.aggregate([
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);

    res.json({
      activeClients: clientsCount || 0,
      todayEntries: todayEntries.length > 0 ? todayEntries[0].count : 0,
      todayMilk: todayEntries.length > 0 ? todayEntries[0].total_weight : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,
      pendingBalance: 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/billing', async (req, res) => {
  try {
    const { client_id, from_date, to_date } = req.query;
    if (!client_id) return res.status(400).json({ error: 'Client ID required' });

    const client = await Client.findOne({ id: client_id });
    const entries = await MilkEntry.find({ client_id, date: { $gte: from_date, $lte: to_date } }).sort({ date: 1 }).lean();
    const paymentsAgg = await Payment.aggregate([
      { $match: { client_id, date: { $gte: from_date, $lte: to_date } } },
      { $group: { _id: null, paid: { $sum: "$amount" } } }
    ]);

    let totalWeight = 0;
    let totalAmount = 0;
    entries.forEach(e => {
      totalWeight += parseFloat(e.weight || 0);
      totalAmount += parseFloat(e.total || 0);
    });

    const paid = paymentsAgg.length > 0 ? parseFloat(paymentsAgg[0].paid || 0) : 0;

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

    const entriesAgg = await MilkEntry.aggregate([
      { $match: { date: { $gte: from_date, $lte: to_date } } },
      { $group: { _id: "$client_id", total_weight: { $sum: "$weight" }, total_amount: { $sum: "$total" } } }
    ]);

    const paymentsAgg = await Payment.aggregate([
      { $match: { date: { $gte: from_date, $lte: to_date } } },
      { $group: { _id: "$client_id", total_paid: { $sum: "$amount" } } }
    ]);

    const data = [];
    for (let e of entriesAgg) {
      const client = await Client.findOne({ id: e._id });
      const p = paymentsAgg.find(p => p._id === e._id);
      const paid = p ? p.total_paid : 0;
      data.push({
        client_id: e._id,
        name: client ? client.name : 'Unknown',
        total_weight: e.total_weight,
        total_amount: e.total_amount,
        paid,
        balance: e.total_amount - paid
      });
    }

    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }) }
});

