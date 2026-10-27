import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function StockMovementPage({ onOpenStockModal }) {
  const { stockMovements } = useInventory();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Stock Movement & Inward/Outward Log</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Record supplier deliveries, damages, and audit write-offs with an immutable timestamped log.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenStockModal('IN')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md">
            📥 Record Stock-In
          </button>
          <button
            onClick={() => onOpenStockModal('OUT')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md">
            📤 Record Stock-Out
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Movement Audit Logs</h3>
          <span className="text-xs text-slate-500">Live ledger</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Qty Changed</th>
                <th className="py-3 px-4">Previous &rarr; New</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stockMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No movements recorded yet.
                  </td>
                </tr>
              ) : (
                stockMovements.map(m => {
                  const isIn = m.type === 'IN';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{m.timestamp}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{m.productName}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isIn ? '📥 INWARD' : '📤 OUTWARD'}
                        </span>
                      </td>
                      <td className={`py-2.5 px-4 font-mono font-bold ${
                        isIn ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isIn ? '+' : '-'}{m.qty}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">
                        {m.prevQty} &rarr; <b>{m.newQty}</b>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{m.reason || '-'}</td>
                      <td className="py-2.5 px-4 text-slate-500 capitalize">{m.user}</td>
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
