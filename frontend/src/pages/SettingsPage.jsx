import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function SettingsPage() {
  const { settings, setSettings, resetDemoData } = useInventory();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Restore factory demo products, customers, suppliers, and sales? All custom records will reset.')) {
      resetDemoData();
      setFormData({
        name: 'Apex Retail Hypermarket',
        gst: 'GSTIN27AABCU9603R1ZM',
        address: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001',
        phone: '+91 98765 43210 | billing@apexstock.com',
        currency: '₹',
        footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
      });
    }
  };

  return (
    <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Store Profile & Configuration</h2>
        <p className="text-xs text-slate-500">Configure business information that appears on printed invoices.</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          ✓ Store profile settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business / Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tax / GSTIN Number</label>
            <input
              type="text"
              value={formData.gst}
              onChange={e => setFormData({ ...formData, gst: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Phone & Email</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
            <select
              value={formData.currency}
              onChange={e => setFormData({ ...formData, currency: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold">
              <option value="₹">₹ (INR - Rupee)</option>
              <option value="$">$ (USD - Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - Pound)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt Footer Note</label>
            <input
              type="text"
              value={formData.footer}
              onChange={e => setFormData({ ...formData, footer: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md">
            Save Store Settings
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100">
            ⚠️ Restore Factory Demo Data
          </button>
        </div>
      </form>
    </div>
  );
}
