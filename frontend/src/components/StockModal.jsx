import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';

export default function StockModal({ mode, isOpen, onClose, defaultProductId }) {
  const { products, suppliers, recordStockIn, recordStockOut } = useInventory();
  const { role } = useAuth();

  const [productId, setProductId] = useState(defaultProductId || (products[0]?.id || ''));
  const [qty, setQty] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [reason, setReason] = useState('Damaged Goods');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const isInward = mode === 'IN';

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantityNum = parseInt(qty) || 0;
    if (quantityNum <= 0) return;

    if (isInward) {
      recordStockIn(productId, quantityNum, supplierName, invoiceRef, notes, role);
    } else {
      recordStockOut(productId, quantityNum, reason, notes, role);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className={`px-6 py-4 text-white flex items-center justify-between ${isInward ? 'bg-emerald-700' : 'bg-rose-700'}`}>
          <h3 className="font-bold text-sm">
            {isInward ? '📥 Record Stock-In (Purchase / Receipt)' : '📤 Record Stock-Out (Damage / Adjustment)'}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Product *</label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {isInward ? (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supplier / Vendor</label>
              <select
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                <option value="">General Purchase</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Deduction *</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                <option value="Damaged Goods">Damaged Goods</option>
                <option value="Expired Product">Expired Product</option>
                <option value="Inventory Discrepancy">Inventory Discrepancy</option>
                <option value="Sample / Internal Use">Sample / Internal Use</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isInward ? 'Quantity Received *' : 'Quantity to Deduct *'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={e => setQty(e.target.value)}
                placeholder="10"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>
            {isInward ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice / PO Ref</label>
                <input
                  type="text"
                  value={invoiceRef}
                  onChange={e => setInvoiceRef(e.target.value)}
                  placeholder="PO-2026-01"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            ) : null}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Audit Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Verified by team"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white font-bold rounded-xl shadow-md ${
                isInward ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}>
              {isInward ? 'Add to Stock' : 'Deduct from Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
