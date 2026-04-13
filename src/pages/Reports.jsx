import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import api from '../api';

export default function Reports() {
  const currentMonthDate = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonthDate);
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/reports?month=${month}`).then(res => setData(res.data)).catch(console.error);
  }, [month]);

  const totals = {
    weight: data.reduce((a, b) => a + (b.total_weight || 0), 0),
    amount: data.reduce((a, b) => a + (b.total_amount || 0), 0),
    paid: data.reduce((a, b) => a + (b.paid || 0), 0),
    balance: data.reduce((a, b) => a + (b.balance || 0), 0)
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Report</h1>
          <p className="text-gray-500 text-sm mt-1">Summary of all client transactions for the selected month.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-700">Month:</label>
          <div className="relative">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-brand-green font-medium" />
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <p className="text-gray-500 font-semibold text-xs mb-1">Total Milk (kg)</p>
          <h3 className="text-2xl font-black text-gray-900">{totals.weight.toFixed(2)}</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <p className="text-gray-500 font-semibold text-xs mb-1">Total Revenue</p>
          <h3 className="text-2xl font-black text-gray-900">₹{totals.amount.toFixed(2)}</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <p className="text-gray-500 font-semibold text-xs mb-1">Total Collected</p>
          <h3 className="text-2xl font-black text-gray-900">₹{totals.paid.toFixed(2)}</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <p className="text-gray-500 font-semibold text-xs mb-1">Total Balance</p>
          <h3 className="text-2xl font-black text-gray-900">₹{totals.balance.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#fcfcfa]">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 size={18} className="text-brand-green" /> Client-wise Summary — {month}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-[11px] text-gray-500 uppercase font-bold bg-[#fcfcfa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">CLIENT ID</th>
                <th className="px-6 py-4 text-left">NAME</th>
                <th className="px-6 py-4">TOTAL MILK (KG)</th>
                <th className="px-6 py-4">TOTAL AMOUNT</th>
                <th className="px-6 py-4">PAID</th>
                <th className="px-6 py-4 text-right">BALANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(row => (
                <tr key={row.client_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#e8f5e9] text-brand-green text-xs font-bold">
                      {row.client_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-left">{row.name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.total_weight?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{row.total_amount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 font-bold text-brand-green">₹{row.paid?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-brand-green">
                      {row.balance > 0 ? <TrendingUp size={14} className="text-red-500" /> : null} 
                      <span className={row.balance > 0 ? "text-red-600" : ""}>
                        ₹{row.balance?.toFixed(2) || '0.00'}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="6" className="p-6 text-gray-500 text-center">No data for this month.</td></tr>}
              {data.length > 0 && (
                <tr className="bg-[#fcfcfa] border-t border-gray-200">
                  <td colSpan={2} className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">TOTALS</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{totals.weight.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{totals.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-brand-green">₹{totals.paid.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-green">₹{totals.balance.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
