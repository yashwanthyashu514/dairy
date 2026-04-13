import React from 'react';
import { Link } from 'react-router-dom';
import { Milk, ArrowRight, Users, Droplets, FileText, CreditCard } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
            <Milk className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Tejas Dairy</h1>
            <p className="text-xs text-gray-500 font-medium">Management System</p>
          </div>
        </div>
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center shadow-lg shadow-brand-green/20 mb-8">
          <Milk className="text-white" size={48} />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Tejas Dairy</h2>
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-6">Milk Collection & Billing System</h3>
        
        <p className="text-gray-500 max-w-xl mx-auto text-lg mb-10 leading-relaxed">
          Manage your dairy clients, record daily milk entries, generate professional bills, and track payments — all in one place.
        </p>
        
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-6 py-3 rounded-xl font-medium text-lg shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all hover:-translate-y-0.5"
        >
          Start Managing <ArrowRight size={20} />
        </Link>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 text-left w-full">
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col items-start hover:border-brand-green/30 transition-colors">
            <div className="p-2.5 bg-[#e8f5e9] text-brand-green rounded-xl mb-4">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Client Management</h4>
            <p className="text-sm text-gray-500">Add and manage dairy clients with auto IDs.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col items-start hover:border-brand-green/30 transition-colors">
            <div className="p-2.5 bg-[#e8f5e9] text-brand-green rounded-xl mb-4">
              <Droplets size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Milk Entries</h4>
            <p className="text-sm text-gray-500">Record AM/PM entries with weight, SNF & fat.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col items-start hover:border-brand-green/30 transition-colors">
            <div className="p-2.5 bg-[#e8f5e9] text-brand-green rounded-xl mb-4">
              <FileText size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Auto Billing</h4>
            <p className="text-sm text-gray-500">Generate bills with date-range filter & PDF.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col items-start hover:border-brand-green/30 transition-colors">
            <div className="p-2.5 bg-[#e8f5e9] text-brand-green rounded-xl mb-4">
              <CreditCard size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Payment Tracking</h4>
            <p className="text-sm text-gray-500">Record payments and track balances.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
