import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { role, user, switchRole } = useAuth();
  const { products } = useInventory();

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager'] },
    { id: 'pos', label: 'POS Billing', icon: '🛒', roles: ['admin', 'cashier'], badge: 'FAST' },
    { id: 'products', label: 'Products & Stock', icon: '📦', roles: ['admin', 'manager'], alertCount: lowStockCount },
    { id: 'stock_movement', label: 'Stock In & Out', icon: '🔄', roles: ['admin', 'manager'] },
    { id: 'sales', label: 'Invoices & Sales', icon: '🧾', roles: ['admin', 'cashier'] },
    { id: 'customers', label: 'Customers (CRM)', icon: '👥', roles: ['admin', 'cashier'] },
    { id: 'suppliers', label: 'Suppliers', icon: '🏢', roles: ['admin', 'manager'] },
    { id: 'reports', label: 'Analytics & Reports', icon: '📈', roles: ['admin', 'manager'] },
    { id: 'settings', label: 'Store Settings', icon: '⚙️', roles: ['admin'] }
  ];

  const allowedNavs = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 select-none z-30">
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              ApexStock
              <span className="text-[10px] uppercase font-mono-code font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">PRO</span>
            </div>
            <div className="text-[11px] text-slate-400 -mt-0.5">Inventory & POS Billing</div>
          </div>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Active Role:
        </span>
        <span className="font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full capitalize">
          {role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm font-medium">
        {allowedNavs.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}>
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  {item.badge}
                </span>
              )}
              {item.alertCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                  {item.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
            {user?.name?.slice(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
