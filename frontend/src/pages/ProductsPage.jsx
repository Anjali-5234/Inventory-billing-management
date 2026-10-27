import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function ProductsPage({ onOpenProductModal, onOpenStockModal }) {
  const { products, deleteProduct, settings } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all');

  const categories = [...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    let matchesStock = true;
    if (selectedStockFilter === 'low') matchesStock = p.stock <= p.minStock && p.stock > 0;
    if (selectedStockFilter === 'out') matchesStock = p.stock <= 0;
    if (selectedStockFilter === 'available') matchesStock = p.stock > p.minStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const exportCSV = () => {
    let csv = 'ID,Name,Category,SKU,Barcode,CostPrice,SellingPrice,CurrentStock,MinThreshold,Unit\n';
    products.forEach(p => {
      csv += `"${p.id}","${p.name}","${p.category}","${p.sku}","${p.barcode}",${p.cost},${p.price},${p.stock},${p.minStock},"${p.unit}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `ApexStock_Products_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search products by title, SKU, or barcode..."
            className="flex-1 min-w-[200px] px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl">
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStockFilter}
            onChange={e => setSelectedStockFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl">
            <option value="all">All Stock Status</option>
            <option value="low">⚠️ Low Stock (≤ Threshold)</option>
            <option value="out">⛔ Out of Stock</option>
            <option value="available">✅ Optimal Stock</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl">
            Export CSV
          </button>
          <button
            onClick={() => onOpenProductModal(null)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md">
            + Add Product
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Product Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No products match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isLow = p.stock <= p.minStock && p.stock > 0;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400">ID: {p.id}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600">{p.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        <div>{p.sku}</div>
                        <div className="text-[10px] text-slate-400">{p.barcode}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {settings.currency}{p.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {settings.currency}{p.price.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 font-mono font-bold ${
                        isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {p.stock} <span className="text-[10px] font-normal text-slate-400">{p.unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Low Stock (≤{p.minStock})
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-medium">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenStockModal('IN', p.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-semibold mr-2 text-xs">
                          + Stock
                        </button>
                        <button
                          onClick={() => onOpenProductModal(p)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold mr-2 text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold text-xs">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing <b>{filtered.length}</b> products</span>
          <span>Synced locally</span>
        </div>
      </div>
    </div>
  );
}
