import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Trash2 } from 'lucide-react';
import api from '../api';

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} registered clients</p>
        </div>
        <Link 
          to="/clients/add"
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus size={18} /> Add Client
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase font-semibold bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Client ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#e8f5e9] text-brand-green text-xs font-semibold">
                      {c.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-gray-500">📞 {c.phone}</td>
                  <td className="px-6 py-4 text-gray-500">{c.address || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{c.joined_date}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No clients yet. Add one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
