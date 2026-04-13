import React, { useState, useEffect } from 'react';
import { Users, Clock, Milk, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../api';

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
    <div className="flex justify-between items-start mb-4">
      <p className="text-gray-500 font-medium text-sm">{title}</p>
      <div className={`p-1.5 rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={18} />
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ activeClients: 0, todayEntries: 0, todayMilk: 0, totalRevenue: 0 });
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data)).catch(console.error);
    api.get('/entries').then(res => setEntries(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toDateString()}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard 
          title="Total Clients" value={stats.activeClients} subtitle="Active dairy clients" 
          icon={Users} iconBg="bg-[#e8f5e9]" iconColor="text-brand-green" 
        />
        <StatCard 
          title="Today's Entries" value={stats.todayEntries} subtitle="AM + PM sessions" 
          icon={Clock} iconBg="bg-[#f0ece5]" iconColor="text-[#7d7065]" 
        />
        <StatCard 
          title="Today's Milk" value={`${stats.todayMilk || 0} kg`} subtitle="Total collected today" 
          icon={Milk} iconBg="bg-[#faeddb]" iconColor="text-[#a67c46]" 
        />
        <StatCard 
          title="Total Revenue" value={`₹${stats.totalRevenue || 0}`} subtitle="All time" 
          icon={TrendingUp} iconBg="bg-[#e8f5e9]" iconColor="text-brand-green" 
        />
        <StatCard 
          title="Pending Balance" value="₹0" subtitle="Outstanding dues" 
          icon={AlertCircle} iconBg="bg-[#e8f5e9]" iconColor="text-brand-green" 
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Milk Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase font-semibold bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Session</th>
                <th className="px-6 py-4 text-right">Weight (KG)</th>
                <th className="px-6 py-4 text-right">SNF%</th>
                <th className="px-6 py-4 text-right">FAT%</th>
                <th className="px-6 py-4 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.client_name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${row.session === 'AM' ? 'bg-[#fff4e5] text-[#e68a00]' : 'bg-[#e8f5e9] text-brand-green'}`}>
                      {row.session}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{row.weight.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{row.snf.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{row.fat.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-brand-green">₹{row.total.toFixed(2)}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No recent entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
