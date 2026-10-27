import React, { useState, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';

export default function POSPage() {
  const { products, customers, settings } = useInventory();
  const {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    selectedCustomerId,
    setSelectedCustomerId,
    discountPercent,
    setDiscountPercent,
    taxPercent,
    setTaxPercent,
    paymentMethod,
    setPaymentMethod,
    cashTendered,
    setCashTendered,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    changeDue,
    totalItemCount,
    processCheckout
  } = useCart();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const barcodeInputRef = useRef(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const query = barcodeInput.trim().toLowerCase();
    if (!query) return;

    const found = products.find(p => 
      p.barcode.toLowerCase() === query || 
      p.sku.toLowerCase() === query ||
      p.name.toLowerCase().includes(query)
    );

    if (found) {
      const res = addToCart(found.id);
      showToast(res.message);
      setBarcodeInput('');
    } else {
      showToast(`SKU/Barcode "${query}" not found!`);
    }
  };

  const handleSimulateScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (randomProduct) {
      const res = addToCart(randomProduct.id);
      showToast(`Simulated Scan: ${randomProduct.name}`);
    }
  };

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleCompleteSale = () => {
    const custObj = customers.find(c => c.id === selectedCustomerId);
    const custName = custObj ? custObj.name : 'Walk-in Customer';
    processCheckout(custName);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* LEFT: Product Catalog & Scanner (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Scanner Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
          <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="Scan Barcode or SKU (e.g. 8901001) + Press Enter"
                className="w-full pl-4 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all">
                Add
              </button>
            </div>
            <button
              type="button"
              onClick={handleSimulateScan}
              className="px-3 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
              ⚡ Sim Scan
            </button>
          </form>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(p => {
              const isOutOfStock = p.stock <= 0;
              const isLow = p.stock <= p.minStock;

              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && addToCart(p.id)}
                  className={`bg-slate-50/70 hover:bg-white border rounded-xl p-3 flex flex-col justify-between transition-all select-none group relative ${
                    isOutOfStock
                      ? 'border-rose-200 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                  }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="text-slate-400 truncate max-w-[90px] font-medium">{p.category}</span>
                    {isOutOfStock ? (
                      <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">OUT</span>
                    ) : isLow ? (
                      <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">{p.stock} left</span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{p.stock} left</span>
                    )}
                  </div>

                  <div className="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
                    {p.name}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="font-bold text-indigo-600 text-sm font-mono">
                      {settings.currency}{p.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.barcode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Catalog items: <b>{filteredProducts.length}</b></span>
          <span className="font-mono">Ready to scan</span>
        </div>
      </div>

      {/* RIGHT: Register Cart Drawer (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Customer Select */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🛒</span>
              <span className="font-bold text-slate-800 text-sm">Active Order Register</span>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-rose-600 hover:text-rose-800 font-semibold">
                Clear Cart
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium">
              <option value="walkin">Walk-in Customer (General)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
              <span className="text-4xl mb-2">🛍️</span>
              <p className="font-semibold text-sm text-slate-600">Cart is empty</p>
              <p className="text-xs mt-1">Scan a barcode or click a product to begin checkout</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-800 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {settings.currency}{item.price.toFixed(2)} &times; {item.qty}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-white font-bold text-xs">-</button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-800">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-white font-bold text-xs">+</button>
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="font-mono font-bold text-xs text-slate-900">
                    {settings.currency}{(item.price * item.qty).toFixed(2)}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-rose-500 hover:text-rose-700">
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({totalItemCount} items)</span>
              <span className="font-semibold text-slate-800 font-mono">{settings.currency}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>Discount</span>
                <select
                  value={discountPercent}
                  onChange={e => setDiscountPercent(parseFloat(e.target.value))}
                  className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5">
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={15}>15%</option>
                  <option value={20}>20%</option>
                </select>
              </div>
              <span className="font-semibold text-emerald-600 font-mono">-{settings.currency}{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>Tax / GST</span>
                <select
                  value={taxPercent}
                  onChange={e => setTaxPercent(parseFloat(e.target.value))}
                  className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5">
                  <option value={0}>0% (None)</option>
                  <option value={5}>5% GST</option>
                  <option value={12}>12% GST</option>
                  <option value={18}>18% GST</option>
                </select>
              </div>
              <span className="font-semibold text-slate-800 font-mono">{settings.currency}{taxAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">{settings.currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payment Method:</div>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {['cash', 'card', 'upi', 'credit'].map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-1 rounded-xl text-center capitalize transition-all ${
                    paymentMethod === m
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold'
                  }`}>
                  {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : m === 'upi' ? '📱 UPI' : '📝 Credit'}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'cash' && (
            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900">Cash Received:</span>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={e => setCashTendered(e.target.value)}
                  placeholder="0.00"
                  className="w-24 text-right px-2 py-1 text-xs font-mono bg-white border border-amber-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between border-t border-amber-200/60 pt-1 font-semibold">
                <span className="text-amber-800">Change Due:</span>
                <span className="font-mono text-amber-950 font-bold">{settings.currency}{changeDue.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all">
            <span>✓ Complete Sale & Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
