import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

const INITIAL_PRODUCTS = [
  { id: 'prod_1', name: 'Fresh Farm Whole Milk 1L', category: 'Dairy & Bakery', sku: 'MLK-001', barcode: '8901001', cost: 38.00, price: 65.00, stock: 45, minStock: 15, unit: 'bottle' },
  { id: 'prod_2', name: 'Artisan Sourdough Bread 500g', category: 'Dairy & Bakery', sku: 'BRD-002', barcode: '8901002', cost: 30.00, price: 55.00, stock: 22, minStock: 10, unit: 'loaf' },
  { id: 'prod_3', name: 'Salted Golden Butter 200g', category: 'Dairy & Bakery', sku: 'BTR-003', barcode: '8901003', cost: 45.00, price: 60.00, stock: 8, minStock: 12, unit: 'pack' },
  { id: 'prod_4', name: 'Organic Cold Brew Coffee 330ml', category: 'Beverages', sku: 'BEV-004', barcode: '8901004', cost: 60.00, price: 120.00, stock: 60, minStock: 20, unit: 'can' },
  { id: 'prod_5', name: 'Sparkling Lemon Water 500ml', category: 'Beverages', sku: 'BEV-005', barcode: '8901005', cost: 25.00, price: 45.00, stock: 75, minStock: 25, unit: 'bottle' },
  { id: 'prod_6', name: 'Premium Earl Grey Tea Box (50s)', category: 'Beverages', sku: 'BEV-006', barcode: '8901006', cost: 180.00, price: 290.00, stock: 5, minStock: 10, unit: 'box' },
  { id: 'prod_7', name: 'Truffle Potato Chips 150g', category: 'Snacks & Food', sku: 'SNK-007', barcode: '8901007', cost: 40.00, price: 75.00, stock: 35, minStock: 15, unit: 'bag' },
  { id: 'prod_8', name: 'Dark Chocolate Almonds 200g', category: 'Snacks & Food', sku: 'SNK-008', barcode: '8901008', cost: 150.00, price: 260.00, stock: 18, minStock: 12, unit: 'pack' },
  { id: 'prod_9', name: 'Roasted Cashew Nuts 250g', category: 'Snacks & Food', sku: 'SNK-009', barcode: '8901009', cost: 220.00, price: 360.00, stock: 4, minStock: 10, unit: 'jar' },
  { id: 'prod_10', name: 'Type-C Braided Fast Cable 2m', category: 'Electronics', sku: 'ELC-010', barcode: '8901010', cost: 120.00, price: 299.00, stock: 30, minStock: 8, unit: 'pcs' },
  { id: 'prod_11', name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', sku: 'ELC-011', barcode: '8901011', cost: 750.00, price: 1499.00, stock: 14, minStock: 5, unit: 'unit' },
  { id: 'prod_12', name: 'Fast 65W GaN Wall Charger', category: 'Electronics', sku: 'ELC-012', barcode: '8901012', cost: 650.00, price: 1299.00, stock: 2, minStock: 6, unit: 'unit' },
  { id: 'prod_13', name: 'Organic Herbal Hand Wash 300ml', category: 'Personal Care', sku: 'CAR-013', barcode: '8901013', cost: 70.00, price: 140.00, stock: 40, minStock: 15, unit: 'bottle' },
  { id: 'prod_14', name: 'Natural Mint Toothpaste 120g', category: 'Personal Care', sku: 'CAR-014', barcode: '8901014', cost: 55.00, price: 110.00, stock: 55, minStock: 20, unit: 'tube' },
  { id: 'prod_15', name: 'Microfiber Cleaning Towels (4pk)', category: 'Household', sku: 'HSD-015', barcode: '8901015', cost: 90.00, price: 199.00, stock: 28, minStock: 10, unit: 'pack' },
  { id: 'prod_16', name: 'Eco Dishwashing Liquid 750ml', category: 'Household', sku: 'HSD-016', barcode: '8901016', cost: 65.00, price: 125.00, stock: 3, minStock: 8, unit: 'bottle' }
];

const INITIAL_CUSTOMERS = [
  { id: 'cust_1', name: 'Sarah Jenkins', phone: '+91 98765 01441', email: 'sarah.j@gmail.com', city: 'Mumbai', totalSpent: 4820.00, orders: 12 },
  { id: 'cust_2', name: 'Marcus Vance', phone: '+91 98765 01822', email: 'marcus.v@outlook.com', city: 'Bengaluru', totalSpent: 3100.00, orders: 8 },
  { id: 'cust_3', name: 'Priya Sharma', phone: '+91 98765 01993', email: 'priya.s@techcorp.io', city: 'Delhi NCR', totalSpent: 9200.00, orders: 21 },
  { id: 'cust_4', name: 'Robert Chen', phone: '+91 98765 01314', email: 'rchen@stanford.edu', city: 'Pune', totalSpent: 1650.00, orders: 4 },
  { id: 'cust_5', name: 'Elena Rostova', phone: '+91 98765 01675', email: 'elena.rostova@icloud.com', city: 'Hyderabad', totalSpent: 6400.00, orders: 15 }
];

const INITIAL_SUPPLIERS = [
  { id: 'supp_1', name: 'Fresh Valley Farms Dairy', contact: 'David Miller', phone: '+91 98765 88110', email: 'orders@freshvalley.com', categories: 'Dairy & Bakery' },
  { id: 'supp_2', name: 'Summit Beverage Distributors', contact: 'Karen Hughes', phone: '+91 98765 88220', email: 'sales@summitbev.com', categories: 'Beverages' },
  { id: 'supp_3', name: 'Golden Harvest Foods', contact: 'Alan Walker', phone: '+91 98765 88330', email: 'alan@goldenharvest.com', categories: 'Snacks & Food' },
  { id: 'supp_4', name: 'AnkerTech Hardware Supply', contact: 'Kenji Sato', phone: '+91 98765 88440', email: 'b2b@ankertech.io', categories: 'Electronics' },
  { id: 'supp_5', name: 'PureLife Care & Hygiene', contact: 'Jessica Alba', phone: '+91 98765 88550', email: 'contact@purelifecare.com', categories: 'Personal Care, Household' }
];

const INITIAL_SALES = [
  {
    id: 'sale_1',
    invoiceNo: 'INV-2026-0001',
    date: '2026-10-08 09:15',
    customerName: 'Priya Sharma',
    customerId: 'cust_3',
    paymentMethod: 'card',
    items: [
      { productId: 'prod_11', name: 'Wireless Bluetooth Earbuds Pro', qty: 1, price: 1499.00, cost: 750.00, total: 1499.00 },
      { productId: 'prod_10', name: 'Type-C Braided Fast Cable 2m', qty: 1, price: 299.00, cost: 120.00, total: 299.00 }
    ],
    subtotal: 1798.00,
    discountPercent: 10,
    discountAmount: 179.80,
    taxPercent: 18,
    taxAmount: 291.28,
    grandTotal: 1909.48,
    cashier: 'John Doe'
  },
  {
    id: 'sale_2',
    invoiceNo: 'INV-2026-0002',
    date: '2026-10-08 10:42',
    customerName: 'Sarah Jenkins',
    customerId: 'cust_1',
    paymentMethod: 'cash',
    items: [
      { productId: 'prod_1', name: 'Fresh Farm Whole Milk 1L', qty: 2, price: 65.00, cost: 38.00, total: 130.00 },
      { productId: 'prod_2', name: 'Artisan Sourdough Bread 500g', qty: 1, price: 55.00, cost: 30.00, total: 55.00 },
      { productId: 'prod_4', name: 'Organic Cold Brew Coffee 330ml', qty: 2, price: 120.00, cost: 60.00, total: 240.00 }
    ],
    subtotal: 425.00,
    discountPercent: 0,
    discountAmount: 0.00,
    taxPercent: 18,
    taxAmount: 76.50,
    grandTotal: 501.50,
    cashier: 'John Doe'
  }
];

const INITIAL_STOCK_MOVEMENTS = [
  { id: 'mov_1', timestamp: '2026-10-08 08:30', productName: 'Fresh Farm Whole Milk 1L', type: 'IN', qty: 50, prevQty: 0, newQty: 50, reason: 'Purchase from Fresh Valley Farms', user: 'Admin' },
  { id: 'mov_2', timestamp: '2026-10-08 09:15', productName: 'Wireless Bluetooth Earbuds Pro', type: 'OUT', qty: 1, prevQty: 15, newQty: 14, reason: 'Sale: INV-2026-0001', user: 'Cashier' }
];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('apex_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].price < 10) {
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
    return INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('apex_customers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].totalSpent < 1000) {
        return INITIAL_CUSTOMERS;
      }
      return parsed;
    }
    return INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('apex_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('apex_sales');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].grandTotal < 100) {
        return INITIAL_SALES;
      }
      return parsed;
    }
    return INITIAL_SALES;
  });

  const [stockMovements, setStockMovements] = useState(() => {
    const saved = localStorage.getItem('apex_stockMovements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('apex_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currency === '$') {
        parsed.currency = '₹';
      }
      return parsed;
    }
    return {
      name: 'Apex Retail Hypermarket',
      gst: 'GSTIN27AABCU9603R1ZM',
      address: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001',
      phone: '+91 98765 43210 | billing@apexstock.com',
      currency: '₹',
      footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    };
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('apex_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('apex_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('apex_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('apex_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('apex_stockMovements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('apex_settings', JSON.stringify(settings));
  }, [settings]);

  // Operations
  const addProduct = (newProd) => {
    setProducts(prev => [...prev, { ...newProd, id: 'prod_' + Date.now() }]);
  };

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const recordStockIn = (productId, qty, supplierName, invoiceRef, notes, userRole) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const prevQty = prod.stock;
    const newQty = prevQty + qty;

    updateProduct(productId, { stock: newQty });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    setStockMovements(prev => [
      {
        id: 'mov_' + Date.now(),
        timestamp: dateStr,
        productName: prod.name,
        type: 'IN',
        qty,
        prevQty,
        newQty,
        reason: `Purchase Inward ${invoiceRef ? '(' + invoiceRef + ')' : ''} from ${supplierName || 'Vendor'} ${notes ? '- ' + notes : ''}`,
        user: userRole
      },
      ...prev
    ]);
  };

  const recordStockOut = (productId, qty, reason, notes, userRole) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const prevQty = prod.stock;
    const newQty = Math.max(0, prevQty - qty);

    updateProduct(productId, { stock: newQty });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    setStockMovements(prev => [
      {
        id: 'mov_' + Date.now(),
        timestamp: dateStr,
        productName: prod.name,
        type: 'OUT',
        qty,
        prevQty,
        newQty,
        reason: `${reason} ${notes ? '- ' + notes : ''}`,
        user: userRole
      },
      ...prev
    ]);
  };

  const addCustomer = (customerData) => {
    setCustomers(prev => [{ ...customerData, id: 'cust_' + Date.now(), totalSpent: 0, orders: 0 }, ...prev]);
  };

  const addSupplier = (supplierData) => {
    setSuppliers(prev => [{ ...supplierData, id: 'supp_' + Date.now() }, ...prev]);
  };

  const completeSale = (saleData, userRole) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    // Deduct stock and record movements
    saleData.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const prevQty = prod.stock;
        const newQty = Math.max(0, prod.stock - item.qty);
        prod.stock = newQty;

        setStockMovements(prev => [
          {
            id: 'mov_' + Date.now() + Math.random().toString(36).substr(2, 4),
            timestamp: dateStr,
            productName: prod.name,
            type: 'OUT',
            qty: item.qty,
            prevQty,
            newQty,
            reason: `POS Sale: ${saleData.invoiceNo}`,
            user: userRole
          },
          ...prev
        ]);
      }
    });

    // Update customer spend
    if (saleData.customerId && saleData.customerId !== 'walkin') {
      setCustomers(prev => prev.map(c => {
        if (c.id === saleData.customerId) {
          return {
            ...c,
            totalSpent: (c.totalSpent || 0) + saleData.grandTotal,
            orders: (c.orders || 0) + 1
          };
        }
        return c;
      }));
    }

    setSales(prev => [saleData, ...prev]);
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setSettings({
      name: 'Apex Retail Hypermarket',
      gst: 'GSTIN27AABCU9603R1ZM',
      address: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001',
      phone: '+91 98765 43210 | billing@apexstock.com',
      currency: '₹',
      footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    });
  };

  return (
    <InventoryContext.Provider value={{
      products,
      customers,
      suppliers,
      sales,
      stockMovements,
      settings,
      setSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      recordStockIn,
      recordStockOut,
      addCustomer,
      addSupplier,
      completeSale,
      resetDemoData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
