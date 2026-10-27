import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function Header({ pageTitle, onLaunchPos }) {
  const { role, switchRole } = useAuth();
  const { settings } = useInventory();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
        <span className="text-slate-300">|</span>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Store: <b className="text-slate-700">{settings.name}</b></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <span className="px-2 text-slate-500">Role:</span>
          {['admin', 'cashier', 'manager'].map(r => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                role === r
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}>
              {r}
            </button>
          ))}
        </div>

        {/* Quick Launch POS Button */}
        {role !== 'manager' && (
          <button
            onClick={onLaunchPos}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all">
            <span>⚡ Launch POS (F2)</span>
          </button>
        )}
      </div>
    </header>
  );
}
