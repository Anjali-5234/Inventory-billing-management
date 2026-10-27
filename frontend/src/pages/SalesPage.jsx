import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function SalesPage({ onViewInvoice, onLaunchPos }) {
  const { sales, settings } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filtered = sales.filter(s => {
    const matchesSearch = s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || s.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by invoice #, customer name..."
            className="flex-1 max-w-sm px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl">
            <option value="all">All Payment Modes</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI/QR</option>
            <option value="credit">Store Credit</option>
          </select>
        </div>
        <button
          onClick={onLaunchPos}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md">
          + New POS Sale
        </button>
      </div>

      {/* Sales List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Count</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Subtotal</th>
                <th className="py-3.5 px-4">Tax (GST)</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const itemCount = s.items.reduce((acc, i) => acc + i.qty, 0);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">{s.invoiceNo}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{s.date}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{s.customerName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{itemCount} items</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                          {s.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {settings.currency}{s.subtotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {settings.currency}{s.taxAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-slate-900">
                        {settings.currency}{s.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewInvoice(s)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                          View & Print
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
