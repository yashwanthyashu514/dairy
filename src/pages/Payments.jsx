import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api';

export default function Payments() {
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const loadData = () => {
    api.get('/clients').then(res => setClients(res.data)).catch(console.error);
    api.get('/payments').then(res => setPayments(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id || !formData.amount) return alert('Select client and enter amount');
    try {
      await api.post('/payments', formData);
      alert('Payment recorded successfully!');
      setFormData({ ...formData, amount: '', note: '' });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving payment');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Record client payments and view payment history.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 bg-[#fcfcfa]">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Plus size={18} className="text-brand-green" /> Record Payment
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-gray-700 mb-2">Client *</label>
            <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₹) *</label>
            <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full max-w-[150px] border border-brand-green rounded-lg px-4 py-2 outline-none ring-2 ring-brand-green/20 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none" />
          </div>
          <div className="flex-[1.5] min-w-[200px]">
            <label className="block text-sm font-bold text-gray-700 mb-2">Note (optional)</label>
            <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="e.g. Partial payment" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none" />
          </div>
          <button type="submit" className="bg-brand-green hover:bg-brand-green-hover text-white flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors h-[42px]">
             Record
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-500 uppercase font-bold bg-[#fcfcfa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">CLIENT</th>
                <th className="px-6 py-4 text-right">AMOUNT PAID</th>
                <th className="px-6 py-4">NOTE</th>
                <th className="px-6 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{p.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{p.client_name}</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-green">₹{p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-400">{p.note || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No payments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
