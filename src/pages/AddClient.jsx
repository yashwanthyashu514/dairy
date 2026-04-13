import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import api from '../api';

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', whatsapp: '', address: '', account_number: '', ifsc: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clients', formData);
      navigate('/clients');
    } catch (err) {
      console.error(err);
      alert('Error creating client');
    }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/clients" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-brand-green mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Clients
      </Link>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-500 text-sm mt-1">A unique client ID (e.g. TD001) will be assigned automatically.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Ramesh Kumar" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" placeholder="e.g. 9876543210" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} type="text" placeholder="e.g. 9876543210" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
              <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} type="text" placeholder="e.g. Village, City" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
          </div>

          <div className="pt-4 pb-2">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Bank Details (Optional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
              <input value={formData.account_number} onChange={e => setFormData({...formData, account_number: e.target.value})} type="text" placeholder="Bank account number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">IFSC Code</label>
              <input value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value})} type="text" placeholder="e.g. SBIN0001234" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 mt-8">
            <Link to="/clients" className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-6 py-2.5 bg-brand-green hover:bg-brand-green-hover text-white font-bold rounded-lg flex items-center gap-2">
              <UserPlus size={18} /> Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
