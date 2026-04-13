import React, { useState, useEffect, useRef } from 'react';
import { Milk, Printer, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../api';

const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

export default function Billing() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ client_id: '', from_date: '', to_date: '' });
  const [bill, setBill] = useState(null);
  
  const billRef = useRef();

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data)).catch(console.error);
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    setFormData({ client_id: '', from_date: firstDay, to_date: today });
  }, []);

  const handleGenerate = async () => {
    if(!formData.client_id || !formData.from_date || !formData.to_date) return alert('Fill all fields');
    try {
      const res = await api.get(`/billing?client_id=${formData.client_id}&from_date=${formData.from_date}&to_date=${formData.to_date}`);
      setBill(res.data);
    } catch(err) {
      console.error(err);
      alert('Error fetching bill');
    }
  };

  const handlePDF = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!bill) return;
    const { client, summary } = bill;
    const message = `*Tejas Dairy - Bill Statement*

Client: ${client.name} (${client.id})
Period: ${formData.from_date} to ${formData.to_date}

Total Milk: ${summary.totalWeight.toFixed(2)} kg
Total Amount: ₹${summary.totalAmount.toFixed(2)}
Paid: ₹${summary.paid.toFixed(2)}
Balance Due: ₹${summary.balance.toFixed(2)}

Please contact Tejas Dairy for payment.`;
    
    // Attempt to use whatsapp API directly if mobile number available
    const phone = client.whatsapp || client.phone || '';
    const base = phone ? `https://wa.me/91${phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/';
    const whatsappUrl = `${base}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <div className="mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Select a client and date range to generate a bill.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-wrap items-end gap-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] mb-6 print:hidden">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Client</label>
          <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 text-gray-700 bg-white">
            <option value="">Select client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.id} — {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">From Date</label>
          <input type="date" value={formData.from_date} onChange={e => setFormData({...formData, from_date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">To Date</label>
          <input type="date" value={formData.to_date} onChange={e => setFormData({...formData, to_date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none" />
        </div>
        <button onClick={handleGenerate} className="bg-brand-green hover:bg-brand-green-hover text-white flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors">
          <FileTextIcon /> Generate Bill
        </button>
      </div>

      {bill && (
        <div className="bg-[#fcfcfa] rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div ref={billRef} className="bg-[#fcfcfa] pb-4">
            <div className="p-6 md:px-8 border-b border-gray-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green rounded flex items-center justify-center">
                  <Milk className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-none">Tejas Dairy</h2>
                  <p className="text-gray-500 text-sm mt-1">Milk Bill / Invoice</p>
                </div>
              </div>
              <div className="text-left md:text-right text-gray-600 text-sm">
                <p>Period: <span className="font-bold text-gray-900">{formData.from_date} to {formData.to_date}</span></p>
                <p className="mt-1">Generated: {new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:px-8 pb-4 border-b border-gray-200 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Client ID</p>
                <p className="font-bold text-gray-900">{bill.client.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Name</p>
                <p className="font-bold text-gray-900">{bill.client.name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-bold text-gray-900">{bill.client.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Address</p>
                <p className="font-bold text-gray-900">{bill.client.address || '-'}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 font-bold bg-[#fcfcfa] border-b border-gray-200">
                  <tr>
                    <th className="px-6 md:px-8 py-3">DATE</th>
                    <th className="px-6 py-3">SESSION</th>
                    <th className="px-6 py-3 text-right">WEIGHT (KG)</th>
                    <th className="px-6 py-3 text-right">SNF%</th>
                    <th className="px-6 py-3 text-right">FAT%</th>
                    <th className="px-6 py-3 text-right">RATE (₹)</th>
                    <th className="px-6 md:px-8 py-3 text-right">TOTAL (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bill.entries.map((e, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-6 md:px-8 py-3 text-gray-900">{e.date}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${e.session === 'AM' ? 'bg-[#fff4e5] text-[#e68a00]' : 'bg-[#e8f5e9] text-brand-green'}`}>{e.session}</span>
                      </td>
                      <td className="px-6 py-3 text-right text-gray-600">{e.weight.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{e.snf.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{e.fat.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{e.rate.toFixed(2)}</td>
                      <td className="px-6 md:px-8 py-3 text-right font-bold text-brand-green">₹{e.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  {bill.entries.length === 0 && <tr><td colSpan="7" className="text-center py-6 text-gray-500">No entries in this period.</td></tr>}
                  
                  <tr className="bg-[#fcfcfa] border-t-2 border-gray-200">
                    <td colSpan={2} className="px-6 md:px-8 py-4 font-bold text-gray-500 uppercase text-xs">TOTAL</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{bill.summary.totalWeight.toFixed(2)}</td>
                    <td colSpan={3}></td>
                    <td className="px-6 md:px-8 py-4 text-right font-bold text-brand-green">₹{bill.summary.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="px-6 md:px-8 pt-4 flex gap-8">
               <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{bill.summary.totalAmount.toFixed(2)}</p>
               </div>
               <div>
                  <p className="text-sm text-gray-500 mb-1">Paid</p>
                  <p className="text-xl font-bold text-brand-green">₹{bill.summary.paid.toFixed(2)}</p>
               </div>
               <div>
                  <p className="text-sm text-gray-500 mb-1">Balance Due</p>
                  <p className="text-xl font-bold text-brand-green">₹{bill.summary.balance.toFixed(2)}</p>
               </div>
            </div>
          </div>

          <div className="p-6 md:px-8 border-t border-gray-200 flex justify-end gap-3 bg-white print:hidden">
            <button onClick={handlePDF} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">
              <Printer size={18} /> Print / PDF
            </button>
            <button onClick={handleWhatsAppShare} className="flex items-center gap-2 px-5 py-2.5 bg-brand-green hover:bg-brand-green-hover text-white rounded-lg font-bold shadow-sm">
              <Send size={18} /> Send via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
