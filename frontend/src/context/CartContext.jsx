import React, { createContext, useContext, useState } from 'react';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { products, completeSale, settings } = useInventory();
  const { role, user } = useAuth();

  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('walkin');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashTendered, setCashTendered] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const playBeep = (freq = 880, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const addToCart = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return { success: false, message: 'Product not found' };

    if (prod.stock <= 0) {
      playBeep(300, 0.2);
      return { success: false, message: `${prod.name} is out of stock!` };
    }

    const existing = cart.find(i => i.id === productId);
    if (existing) {
      if (existing.qty >= prod.stock) {
        return { success: false, message: `Cannot exceed available stock (${prod.stock})` };
      }
      setCart(prev => prev.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart(prev => [...prev, {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        cost: prod.cost,
        qty: 1,
        sku: prod.sku,
        maxStock: prod.stock
      }]);
    }

    playBeep(980, 0.06);
    return { success: true, message: `Added ${prod.name}` };
  };

  const updateQty = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find(p => p.id === productId);
    if (prod && newQty > prod.stock) {
      return;
    }

    setCart(prev => prev.map(i => i.id === productId ? { ...i, qty: newQty } : i));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCashTendered('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);
  const totalItemCount = cart.reduce((acc, i) => acc + i.qty, 0);

  const processCheckout = (customerName = 'Walk-in Customer') => {
    if (cart.length === 0) return null;

    const nextInvoiceNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const saleRecord = {
      id: 'sale_' + Date.now(),
      invoiceNo: nextInvoiceNo,
      date: dateStr,
      customerName,
      customerId: selectedCustomerId,
      paymentMethod,
      items: cart.map(i => ({
        productId: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        cost: i.cost,
        total: i.price * i.qty
      })),
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      cashier: user?.name || 'Cashier'
    };

    completeSale(saleRecord, role);
    setLastCompletedSale(saleRecord);
    setIsInvoiceModalOpen(true);
    clearCart();
    playBeep(1200, 0.15);

    return saleRecord;
  };

  return (
    <CartContext.Provider value={{
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
      processCheckout,
      lastCompletedSale,
      setLastCompletedSale,
      isInvoiceModalOpen,
      setIsInvoiceModalOpen,
      playBeep
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
