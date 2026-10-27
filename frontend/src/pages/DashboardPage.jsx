import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function DashboardPage({ onNavigate }) {
  const { products, sales, settings } = useInventory();

  // Metrics
  const totalRevenue = sales.reduce((acc, s) => acc + s.grandTotal, 0);
  let totalCost = 0;
  sales.forEach(s => {
    s.items.forEach(i => {
      totalCost += (i.cost || (i.price * 0.6)) * i.qty;
    });
  });
  const grossProfit = Math.max(0, totalRevenue - totalCost);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  // Category counts
  const catCount = {};
  products.forEach(p => {
    catCount[p.category] = (catCount[p.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">📈</div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {settings.currency}{totalRevenue.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 font-medium">
              <span>{sales.length} transactions processed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Profit</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">💎</div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {settings.currency}{grossProfit.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <span>~28.4% gross margin</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('products')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md cursor-pointer transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Warnings</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">⚠️</div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 tracking-tight font-mono">
              {lowStockItems.length} Products
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-700 font-medium">
              <span>Click to replenish stock</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog Inventory</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">📦</div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {products.length} Items
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-600 font-medium">
              <span>Active in 6 departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Weekly Revenue & Volume Trend</h2>
              <p className="text-xs text-slate-500">Live consolidated sale values across all registers</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              ● Sales Velocity
            </span>
          </div>
          <div className="w-full h-60 relative flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4"/>
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4"/>
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4"/>
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0 180 Q 100 120 200 130 T 400 70 T 600 50 L 600 200 L 0 200 Z" fill="url(#chartGrad)"/>
              <path d="M 0 180 Q 100 120 200 130 T 400 70 T 600 50" fill="none" stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 pt-2 border-t border-slate-100">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-1">Category Distribution</h2>
            <p className="text-xs text-slate-500 mb-4">Stock density across categories</p>
            <div className="space-y-3">
              {Object.keys(catCount).map(cat => {
                const pct = Math.round((catCount[cat] / products.length) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-700">{cat}</span>
                      <span className="text-slate-500 font-mono">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
            💡 <b>Insight:</b> Fast turning SKUs should maintain 3 days of buffer stock.
          </div>
        </div>
      </div>

      {/* Invoices and Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Recent Invoices</h2>
            <button onClick={() => onNavigate('sales')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All &rarr;
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-100 font-semibold">
                <tr>
                  <th className="pb-2">Invoice #</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {sales.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-mono font-bold text-indigo-600">{s.invoiceNo}</td>
                    <td className="py-2.5 font-medium text-slate-800">{s.customerName}</td>
                    <td className="py-2.5 font-mono font-semibold">{settings.currency}{s.grandTotal.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                        {s.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Critical Low Stock Items</h2>
            <button onClick={() => onNavigate('products')} className="text-xs font-semibold text-amber-600 hover:text-amber-800">
              Manage Stock &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">✅ All products have healthy stock levels.</div>
            ) : (
              lowStockItems.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">⚠️</span>
                    <div>
                      <div className="font-bold text-xs text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">SKU: {item.sku} &bull; Min: {item.minStock} {item.unit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-rose-600 font-mono">{item.stock} left</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
