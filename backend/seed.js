const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Supplier = require('./models/Supplier');
const Sale = require('./models/Sale');
const StockMovement = require('./models/StockMovement');
const Setting = require('./models/Setting');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔄 Cleaning existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Supplier.deleteMany({}),
      Sale.deleteMany({}),
      StockMovement.deleteMany({}),
      Setting.deleteMany({})
    ]);

    console.log('🌱 Seeding database...');

    // 1. Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { name: 'John Doe', email: 'admin@apexstock.com', password: hashedPassword, role: 'admin' },
      { name: 'Maria Gomez', email: 'cashier@apexstock.com', password: hashedPassword, role: 'cashier' },
      { name: 'Alex Rivera', email: 'manager@apexstock.com', password: hashedPassword, role: 'manager' }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // 2. Categories
    const categories = await Category.insertMany([
      { name: 'Dairy & Bakery', description: 'Fresh farm milk, bread, butter, eggs and morning essentials' },
      { name: 'Beverages', description: 'Cold coffees, energy drinks, mineral water, and premium teas' },
      { name: 'Snacks & Food', description: 'Chips, chocolates, roasted nuts, and gourmet confectionery' },
      { name: 'Electronics', description: 'Charging cables, wireless earbuds, adapters and tech gear' },
      { name: 'Personal Care', description: 'Hand washes, natural toothpastes, skincare essentials' },
      { name: 'Household', description: 'Eco-friendly cleaning supplies, microfiber cloths, detergents' }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // 3. Products (Prices in INR ₹)
    const products = await Product.insertMany([
      { name: 'Fresh Farm Whole Milk 1L', category: 'Dairy & Bakery', sku: 'MLK-001', barcode: '8901001', cost: 38.00, price: 65.00, stock: 45, minStock: 15, unit: 'bottle' },
      { name: 'Artisan Sourdough Bread 500g', category: 'Dairy & Bakery', sku: 'BRD-002', barcode: '8901002', cost: 30.00, price: 55.00, stock: 22, minStock: 10, unit: 'loaf' },
      { name: 'Salted Golden Butter 200g', category: 'Dairy & Bakery', sku: 'BTR-003', barcode: '8901003', cost: 45.00, price: 60.00, stock: 8, minStock: 12, unit: 'pack' },
      { name: 'Organic Cold Brew Coffee 330ml', category: 'Beverages', sku: 'BEV-004', barcode: '8901004', cost: 60.00, price: 120.00, stock: 60, minStock: 20, unit: 'can' },
      { name: 'Sparkling Lemon Water 500ml', category: 'Beverages', sku: 'BEV-005', barcode: '8901005', cost: 25.00, price: 45.00, stock: 75, minStock: 25, unit: 'bottle' },
      { name: 'Premium Earl Grey Tea Box (50s)', category: 'Beverages', sku: 'BEV-006', barcode: '8901006', cost: 180.00, price: 290.00, stock: 5, minStock: 10, unit: 'box' },
      { name: 'Truffle Potato Chips 150g', category: 'Snacks & Food', sku: 'SNK-007', barcode: '8901007', cost: 40.00, price: 75.00, stock: 35, minStock: 15, unit: 'bag' },
      { name: 'Dark Chocolate Almonds 200g', category: 'Snacks & Food', sku: 'SNK-008', barcode: '8901008', cost: 150.00, price: 260.00, stock: 18, minStock: 12, unit: 'pack' },
      { name: 'Roasted Cashew Nuts 250g', category: 'Snacks & Food', sku: 'SNK-009', barcode: '8901009', cost: 220.00, price: 360.00, stock: 4, minStock: 10, unit: 'jar' },
      { name: 'Type-C Braided Fast Cable 2m', category: 'Electronics', sku: 'ELC-010', barcode: '8901010', cost: 120.00, price: 299.00, stock: 30, minStock: 8, unit: 'pcs' },
      { name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', sku: 'ELC-011', barcode: '8901011', cost: 750.00, price: 1499.00, stock: 14, minStock: 5, unit: 'unit' },
      { name: 'Fast 65W GaN Wall Charger', category: 'Electronics', sku: 'ELC-012', barcode: '8901012', cost: 650.00, price: 1299.00, stock: 2, minStock: 6, unit: 'unit' },
      { name: 'Organic Herbal Hand Wash 300ml', category: 'Personal Care', sku: 'CAR-013', barcode: '8901013', cost: 70.00, price: 140.00, stock: 40, minStock: 15, unit: 'bottle' },
      { name: 'Natural Mint Toothpaste 120g', category: 'Personal Care', sku: 'CAR-014', barcode: '8901014', cost: 55.00, price: 110.00, stock: 55, minStock: 20, unit: 'tube' },
      { name: 'Microfiber Cleaning Towels (4pk)', category: 'Household', sku: 'HSD-015', barcode: '8901015', cost: 90.00, price: 199.00, stock: 28, minStock: 10, unit: 'pack' },
      { name: 'Eco Dishwashing Liquid 750ml', category: 'Household', sku: 'HSD-016', barcode: '8901016', cost: 65.00, price: 125.00, stock: 3, minStock: 8, unit: 'bottle' }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // 4. Customers
    const customers = await Customer.insertMany([
      { name: 'Sarah Jenkins', phone: '+91 98765 01441', email: 'sarah.j@gmail.com', city: 'Mumbai', totalSpent: 4820.00, orders: 12 },
      { name: 'Marcus Vance', phone: '+91 98765 01822', email: 'marcus.v@outlook.com', city: 'Bengaluru', totalSpent: 3100.00, orders: 8 },
      { name: 'Priya Sharma', phone: '+91 98765 01993', email: 'priya.s@techcorp.io', city: 'Delhi NCR', totalSpent: 9200.00, orders: 21 },
      { name: 'Robert Chen', phone: '+91 98765 01314', email: 'rchen@stanford.edu', city: 'Pune', totalSpent: 1650.00, orders: 4 },
      { name: 'Elena Rostova', phone: '+91 98765 01675', email: 'elena.rostova@icloud.com', city: 'Hyderabad', totalSpent: 6400.00, orders: 15 }
    ]);
    console.log(`✅ Created ${customers.length} customers`);

    // 5. Suppliers
    const suppliers = await Supplier.insertMany([
      { name: 'Fresh Valley Farms Dairy', contact: 'David Miller', phone: '+91 98765 88110', email: 'orders@freshvalley.com', categories: 'Dairy & Bakery' },
      { name: 'Summit Beverage Distributors', contact: 'Karen Hughes', phone: '+91 98765 88220', email: 'sales@summitbev.com', categories: 'Beverages' },
      { name: 'Golden Harvest Foods', contact: 'Alan Walker', phone: '+91 98765 88330', email: 'alan@goldenharvest.com', categories: 'Snacks & Food' },
      { name: 'AnkerTech Hardware Supply', contact: 'Kenji Sato', phone: '+91 98765 88440', email: 'b2b@ankertech.io', categories: 'Electronics' },
      { name: 'PureLife Care & Hygiene', contact: 'Jessica Alba', phone: '+91 98765 88550', email: 'contact@purelifecare.com', categories: 'Personal Care, Household' }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers`);

    // 6. Sales
    const sales = await Sale.insertMany([
      {
        invoiceNo: 'INV-2026-0001',
        date: '2026-10-08 09:15',
        customerName: 'Priya Sharma',
        customerId: customers[2]._id.toString(),
        paymentMethod: 'card',
        items: [
          { productId: products[10]._id.toString(), name: 'Wireless Bluetooth Earbuds Pro', sku: 'ELC-011', qty: 1, price: 1499.00, cost: 750.00, total: 1499.00 },
          { productId: products[9]._id.toString(), name: 'Type-C Braided Fast Cable 2m', sku: 'ELC-010', qty: 1, price: 299.00, cost: 120.00, total: 299.00 }
        ],
        subtotal: 1798.00,
        discountPercent: 10,
        discountAmount: 179.80,
        taxPercent: 18,
        taxAmount: 291.28,
        grandTotal: 1909.48,
        cashier: 'John Doe',
        cashTendered: 2000,
        changeDue: 90.52
      },
      {
        invoiceNo: 'INV-2026-0002',
        date: '2026-10-08 10:42',
        customerName: 'Sarah Jenkins',
        customerId: customers[0]._id.toString(),
        paymentMethod: 'cash',
        items: [
          { productId: products[0]._id.toString(), name: 'Fresh Farm Whole Milk 1L', sku: 'MLK-001', qty: 2, price: 65.00, cost: 38.00, total: 130.00 },
          { productId: products[1]._id.toString(), name: 'Artisan Sourdough Bread 500g', sku: 'BRD-002', qty: 1, price: 55.00, cost: 30.00, total: 55.00 },
          { productId: products[3]._id.toString(), name: 'Organic Cold Brew Coffee 330ml', sku: 'BEV-004', qty: 2, price: 120.00, cost: 60.00, total: 240.00 }
        ],
        subtotal: 425.00,
        discountPercent: 0,
        discountAmount: 0.00,
        taxPercent: 18,
        taxAmount: 76.50,
        grandTotal: 501.50,
        cashier: 'John Doe',
        cashTendered: 550,
        changeDue: 48.50
      }
    ]);
    console.log(`✅ Created ${sales.length} initial sales`);

    // 7. Stock Movements
    const movements = await StockMovement.insertMany([
      { timestamp: '2026-10-08 08:30', productName: 'Fresh Farm Whole Milk 1L', productId: products[0]._id.toString(), type: 'IN', qty: 50, prevQty: 0, newQty: 50, reason: 'Purchase from Fresh Valley Farms', user: 'Admin' },
      { timestamp: '2026-10-08 09:15', productName: 'Wireless Bluetooth Earbuds Pro', productId: products[10]._id.toString(), type: 'OUT', qty: 1, prevQty: 15, newQty: 14, reason: 'POS Sale: INV-2026-0001', user: 'Cashier' }
    ]);
    console.log(`✅ Created ${movements.length} stock movements`);

    // 8. Settings
    await Setting.create({
      name: 'Apex Retail Hypermarket',
      gst: 'GSTIN27AABCU9603R1ZM',
      address: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001',
      phone: '+91 98765 43210 | billing@apexstock.com',
      currency: '₹',
      footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    });
    console.log('✅ Created default store configuration (Indian Rupees ₹)');

    console.log('🎉 MongoDB Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
    process.exit(1);
  }
};

seedData();
