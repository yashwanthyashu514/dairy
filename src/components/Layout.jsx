import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Droplets, FileText, CreditCard, BarChart2, Milk } from 'lucide-react';

export default function Layout() {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Milk Entry', path: '/entries/add', icon: Droplets },
    { name: 'Billing', path: '/billing', icon: FileText },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3d3731] flex flex-col pt-6 pb-4 shadow-xl z-10 flex-shrink-0 print:hidden">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-green rounded flex items-center justify-center flex-shrink-0">
            <Milk className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Tejas Dairy</h2>
            <p className="text-gray-400 text-[10px] uppercase font-medium tracking-wider">Management System</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-green text-white'
                    : 'text-gray-300 hover:bg-[#4d463f] hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="px-6 mt-auto">
          <p className="text-[#655e56] text-xs font-semibold">Tejas Dairy v1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#faf9f6] print:bg-white print:overflow-visible text-gray-900">
        <div className="max-w-[1200px] mx-auto p-8 print:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
