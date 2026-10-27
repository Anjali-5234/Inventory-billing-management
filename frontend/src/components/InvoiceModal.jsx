import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function InvoiceModal({ sale, isOpen, onClose }) {
  const { settings } = useInventory();

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓ Transaction Settled</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors">
              <span>🖨️ Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printableInvoiceArea" className="p-6 overflow-y-auto text-slate-800 text-xs space-y-4">
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-lg font-black tracking-tight text-slate-900">{settings.name}</h2>
            <div className="text-[11px] text-slate-500">{settings.address}</div>
            <div className="text-[11px] text-slate-500">{settings.phone} | GSTIN: {settings.gst}</div>
            <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-100 font-bold text-slate-700 uppercase tracking-widest text-[10px]">
              Tax Invoice / Cash Receipt
            </div>
          </div>

          <div className="flex justify-between text-[11px] border-b border-slate-100 pb-2">
            <div>
              <div><b>Invoice:</b> <span className="font-mono font-bold text-indigo-700">{sale.invoiceNo}</span></div>
              <div><b>Customer:</b> <span>{sale.customerName}</span></div>
            </div>
            <div className="text-right">
              <div><b>Date:</b> <span>{sale.date}</span></div>
              <div><b>Cashier:</b> <span>{sale.cashier}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-300 text-slate-600 font-semibold text-[11px]">
              <tr>
                <th className="py-1">Item Description</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items.map((item, idx) => (
                <tr key={idx} className="py-1">
                  <td className="py-1 font-medium">{item.name}</td>
                  <td className="py-1 text-center font-mono">{item.qty}</td>
                  <td className="py-1 text-right font-mono">{settings.currency}{item.price.toFixed(2)}</td>
                  <td className="py-1 text-right font-mono font-bold">{settings.currency}{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Breakdown */}
          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-mono font-semibold">{settings.currency}{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Discount ({sale.discountPercent}%):</span>
                <span className="font-mono font-semibold text-emerald-600">-{settings.currency}{sale.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Tax / GST ({sale.taxPercent}%):</span>
              <span className="font-mono font-semibold">{settings.currency}{sale.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black border-t border-slate-300 pt-1.5 text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-indigo-700">{settings.currency}{sale.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase text-slate-700">{sale.paymentMethod}</span>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <div className="font-mono tracking-widest text-slate-800 font-bold">||| | || ||||| || ||| || |||</div>
            <div>{settings.footer}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors">
            Close & Start Next Sale
          </button>
        </div>
      </div>
    </div>
  );
}
