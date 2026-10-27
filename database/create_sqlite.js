const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'smart_inventory.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new DatabaseSync(dbPath);

db.exec(`
PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'cashier', 'manager')) DEFAULT 'cashier',
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    barcode TEXT NOT NULL UNIQUE,
    description TEXT,
    cost_price REAL NOT NULL,
    selling_price REAL NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock_alert INTEGER NOT NULL DEFAULT 10,
    unit TEXT DEFAULT 'pcs',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    address TEXT,
    total_spent REAL DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    categories_supplied TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Purchases Table (Stock Inward)
CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_invoice_no TEXT NOT NULL UNIQUE,
    supplier_id INTEGER,
    user_id INTEGER,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Purchase Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost REAL NOT NULL,
    total_cost REAL NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 8. Sales Table (POS Bills)
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL UNIQUE,
    customer_id INTEGER,
    cashier_id INTEGER,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal REAL NOT NULL,
    discount_percent REAL DEFAULT 0.00,
    discount_amount REAL DEFAULT 0.00,
    tax_percent REAL DEFAULT 18.00,
    tax_amount REAL DEFAULT 0.00,
    grand_total REAL NOT NULL,
    payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'upi', 'credit')) DEFAULT 'cash',
    payment_status TEXT CHECK(payment_status IN ('paid', 'pending', 'refunded')) DEFAULT 'paid',
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Sale Items Table
CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    unit_cost REAL NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 10. Stock History / Audit Log
CREATE TABLE IF NOT EXISTS stock_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER,
    movement_type TEXT CHECK(movement_type IN ('IN', 'OUT', 'ADJUSTMENT', 'RETURN')) NOT NULL,
    quantity_changed INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. Returns & Refunds Table
CREATE TABLE IF NOT EXISTS returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    refund_amount REAL NOT NULL,
    reason TEXT,
    return_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
`);

// Insert Seed Data
db.exec(`
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Doe (Admin)', 'admin@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'admin'),
(2, 'Maria Gomez (Cashier)', 'cashier@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'cashier'),
(3, 'Alex Rivera (Manager)', 'manager@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'manager');

INSERT INTO categories (id, name, description) VALUES
(1, 'Dairy & Bakery', 'Fresh farm milk, bread, butter, eggs and morning essentials'),
(2, 'Beverages', 'Cold coffees, energy drinks, mineral water, and premium teas'),
(3, 'Snacks & Food', 'Chips, chocolates, roasted nuts, and gourmet confectionery'),
(4, 'Electronics', 'Charging cables, wireless earbuds, adapters and tech gear'),
(5, 'Personal Care', 'Hand washes, natural toothpastes, skincare essentials'),
(6, 'Household', 'Eco-friendly cleaning supplies, microfiber cloths, detergents');

INSERT INTO products (id, category_id, name, sku, barcode, cost_price, selling_price, current_stock, min_stock_alert, unit) VALUES
(1, 1, 'Fresh Farm Whole Milk 1L', 'MLK-001', '8901001', 1.80, 2.99, 45, 15, 'bottle'),
(2, 1, 'Artisan Sourdough Bread 500g', 'BRD-002', '8901002', 2.10, 4.49, 22, 10, 'loaf'),
(3, 1, 'Salted Golden Butter 200g', 'BTR-003', '8901003', 1.90, 3.50, 8, 12, 'pack'),
(4, 2, 'Organic Cold Brew Coffee 330ml', 'BEV-004', '8901004', 1.20, 3.25, 60, 20, 'can'),
(5, 2, 'Sparkling Lemon Water 500ml', 'BEV-005', '8901005', 0.65, 1.75, 75, 25, 'bottle'),
(6, 2, 'Premium Earl Grey Tea Box (50s)', 'BEV-006', '8901006', 3.20, 6.99, 5, 10, 'box'),
(7, 3, 'Truffle Potato Chips 150g', 'SNK-007', '8901007', 1.40, 3.99, 35, 15, 'bag'),
(8, 3, 'Dark Chocolate Almonds 200g', 'SNK-008', '8901008', 2.80, 5.50, 18, 12, 'pack'),
(9, 3, 'Roasted Cashew Nuts 250g', 'SNK-009', '8901009', 4.00, 7.99, 4, 10, 'jar'),
(10, 4, 'Type-C Braided Fast Cable 2m', 'ELC-010', '8901010', 3.50, 12.99, 30, 8, 'pcs'),
(11, 4, 'Wireless Bluetooth Earbuds Pro', 'ELC-011', '8901011', 14.00, 39.99, 14, 5, 'unit'),
(12, 4, 'Fast 65W GaN Wall Charger', 'ELC-012', '8901012', 11.50, 29.99, 2, 6, 'unit'),
(13, 5, 'Organic Herbal Hand Wash 300ml', 'CAR-013', '8901013', 2.10, 4.80, 40, 15, 'bottle'),
(14, 5, 'Natural Mint Toothpaste 120g', 'CAR-014', '8901014', 1.30, 3.20, 55, 20, 'tube'),
(15, 6, 'Microfiber Cleaning Towels (4pk)', 'HSD-015', '8901015', 2.50, 6.50, 28, 10, 'pack'),
(16, 6, 'Eco Dishwashing Liquid 750ml', 'HSD-016', '8901016', 1.70, 3.90, 3, 8, 'bottle');

INSERT INTO customers (id, name, phone, email, address, total_spent, total_orders) VALUES
(1, 'Sarah Jenkins', '+1 555-0144', 'sarah.j@gmail.com', 'San Jose, CA', 482.50, 12),
(2, 'Marcus Vance', '+1 555-0182', 'marcus.v@outlook.com', 'Santa Clara, CA', 310.20, 8),
(3, 'Priya Sharma', '+1 555-0199', 'priya.s@techcorp.io', 'Sunnyvale, CA', 920.80, 21),
(4, 'Robert Chen', '+1 555-0131', 'rchen@stanford.edu', 'Palo Alto, CA', 165.40, 4),
(5, 'Elena Rostova', '+1 555-0167', 'elena.rostova@icloud.com', 'Mountain View, CA', 640.00, 15);

INSERT INTO suppliers (id, name, contact_person, phone, email, address, categories_supplied) VALUES
(1, 'Fresh Valley Farms Dairy', 'David Miller', '+1 555-8811', 'orders@freshvalley.com', 'Modesto, CA', 'Dairy & Bakery'),
(2, 'Summit Beverage Distributors', 'Karen Hughes', '+1 555-8822', 'sales@summitbev.com', 'Oakland, CA', 'Beverages'),
(3, 'Golden Harvest Foods', 'Alan Walker', '+1 555-8833', 'alan@goldenharvest.com', 'Fresno, CA', 'Snacks & Food'),
(4, 'AnkerTech Hardware Supply', 'Kenji Sato', '+1 555-8844', 'b2b@ankertech.io', 'Fremont, CA', 'Electronics'),
(5, 'PureLife Care & Hygiene', 'Jessica Alba', '+1 555-8855', 'contact@purelifecare.com', 'San Francisco, CA', 'Personal Care, Household');
`);

console.log('SQLite database successfully created at:', dbPath);
