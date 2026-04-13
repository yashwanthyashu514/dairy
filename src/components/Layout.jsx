import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Droplets,
  FileText,
  CreditCard,
  BarChart2,
  Milk,
  Menu,
  X,
} from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Milk Entry', path: '/entries/add', icon: Droplets },
    { name: 'Billing', path: '/billing', icon: FileText },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  // Prevent background scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-[100dvh] bg-[#faf9f6] overflow-hidden">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#3d3731] z-40 flex items-center justify-between px-4 shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center">
            <Milk className="text-white" size={18} />
          </div>
          <h2 className="text-white font-bold text-lg">Tejas Dairy</h2>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 print:hidden ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-[#3d3731] flex flex-col pt-6 pb-4 shadow-xl z-50 flex-shrink-0 print:hidden
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative
      `}
      >
        {/* Header */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green rounded flex items-center justify-center">
              <Milk className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Tejas Dairy</h2>
              <p className="text-gray-400 text-[10px] uppercase">Management</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-300 p-1" onClick={closeMenu}>
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-brand-green text-white shadow'
                    : 'text-gray-300 hover:bg-[#4d463f] hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 mt-auto">
          <p className="text-[#655e56] text-xs">Tejas Dairy v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto pt-16 lg:pt-0 print:bg-white print:overflow-visible text-gray-900">
        <div className="max-w-[1200px] mx-auto p-3 sm:p-5 lg:p-8 print:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
