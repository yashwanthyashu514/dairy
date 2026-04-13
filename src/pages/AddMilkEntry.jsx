import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import api from '../api';

export default function AddMilkEntry() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    session: 'AM',
    weight: '',
    snf: '8.5',
    fat: '4.2',
    rate: '35'
  });

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data)).catch(console.error);
  }, []);

  const total = (parseFloat(formData.weight || 0) * parseFloat(formData.rate || 0)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id || !formData.weight) return alert('Select client and enter weight.');
    try {
      await api.post('/entries', formData);
      alert('Entry recorded successfully!');
      setFormData({ ...formData, weight: '' });
    } catch (err) {
      console.error(err);
      alert('Error saving entry');
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Milk Entry</h1>
        <p className="text-gray-500 text-sm mt-1">Record AM or PM milk collection for a client.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Client *</label>
                <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 font-medium">
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                <div className="relative">
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green font-medium" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Session *</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setFormData({...formData, session: 'AM'})} className={`font-bold py-2.5 rounded-lg border transition-colors ${formData.session === 'AM' ? 'bg-brand-green text-white border-brand-green' : 'bg-[#faf9f6] text-gray-400 border-gray-200 hover:bg-gray-50'}`}>
                  AM
                </button>
                <button type="button" onClick={() => setFormData({...formData, session: 'PM'})} className={`font-bold py-2.5 rounded-lg border transition-colors ${formData.session === 'PM' ? 'bg-brand-green text-white border-brand-green' : 'bg-[#faf9f6] text-gray-400 border-gray-200 hover:bg-gray-50'}`}>
                  PM
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg) *</label>
                <input required type="number" step="0.01" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-green font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SNF% *</label>
                <input required type="number" step="0.1" value={formData.snf} onChange={e => setFormData({...formData, snf: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-green font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fat% *</label>
                <input required type="number" step="0.1" value={formData.fat} onChange={e => setFormData({...formData, fat: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-green font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rate (₹/kg) *</label>
                <input required type="number" step="0.1" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-green font-medium" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-green-hover transition-colors shadow-sm">
              <span className="opacity-90">💧</span> Record Entry
            </button>
          </form>
        </div>

        <div className="bg-[#e8f3ec] rounded-xl border border-[#cbe5d4] p-6 h-fit">
          <div className="flex items-center gap-2 text-brand-green font-medium mb-2 text-sm">
            <Calculator size={16} /> Live Total
          </div>
          <div className="text-4xl font-black text-brand-green mb-1">
            ₹{total}
          </div>
          <div className="text-brand-green/70 text-xs font-semibold">
            Weight × Rate
          </div>
        </div>
      </div>
    </div>
  );
}
