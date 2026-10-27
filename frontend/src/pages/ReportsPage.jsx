import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function ReportsPage() {
  const { products, sales, settings } = useInventory();

  // Valuation
  let totalCostVal = 0;
  let totalRetailVal = 0;
  products.forEach(p => {
    totalCostVal += p.cost * p.stock;
    totalRetailVal += p.price * p.stock;
  });
  const unrealizedProfit = Math.max(0, totalRetailVal - totalCostVal);

  // Velocity
  const productStats = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          name: item.name,
          unitsSold: 0,
          revenue: 0,
          profit: 0
        };
      }
      productStats[item.productId].unitsSold += item.qty;
      productStats[item.productId].revenue += item.total;
      const cost = item.cost || (item.price * 0.6);
      productStats[item.productId].profit += (item.price - cost) * item.qty;
    });
  });

  const sorted = Object.keys(productStats).map(id => ({
    id,
    ...productStats[id]
  })).sort((a, b) => b.revenue - a.revenue);

  const exportReportCSV = () => {
    let csv = 'Product,UnitsSold,TotalRevenue,EstimatedProfit\n';
    sorted.forEach(item => {
      csv += `"${item.name}",${item.unitsSold},${item.revenue},${item.profit}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `ApexStock_VelocityReport_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Valuation (Cost Basis)</div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {settings.currency}{totalCostVal.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Capital invested in available stock</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Valuation (Retail Expectation)</div>
          <div className="text-2xl font-black text-indigo-600 mt-2 font-mono">
            {settings.currency}{totalRetailVal.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Projected revenue upon full sell-through</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Unrealized Potential Profit</div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            {settings.currency}{unrealizedProfit.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-700 mt-1">Expected margin return</div>
        </div>
      </div>

      {/* Top Velocity Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Top Performing Products by Velocity</h3>
            <p className="text-xs text-slate-500">Ranked by revenue generation and units sold</p>
          </div>
          <button
            onClick={exportReportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100">
            Export Velocity Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Profit Generated</th>
                <th className="py-3 px-4">Stock Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No sales recorded to generate velocity report.
                  </td>
                </tr>
              ) : (
                sorted.map((item, idx) => {
                  const prod = products.find(p => p.id === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-400 font-mono">#{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-slate-500">{prod ? prod.category : 'General'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">{item.unitsSold} units</td>
                      <td className="py-3 px-4 font-mono font-bold">{settings.currency}{item.revenue.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">{settings.currency}{item.profit.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono">
                        {prod ? (
                          prod.stock <= prod.minStock ? (
                            <span className="text-amber-600 font-bold">{prod.stock} left (Low)</span>
                          ) : (
                            <span className="text-slate-600">{prod.stock} in stock</span>
                          )
                        ) : (
                          'Discontinued'
                        )}
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
