-- ========================================================
-- Seed Data for Smart Inventory & Billing Management System
-- ========================================================

USE smart_inventory;

-- 1. Users (password is 'password123' bcrypt hashed: $2a$12$e8iVw6wHkZqIqZf0...)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Doe (Admin)', 'admin@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'admin'),
(2, 'Maria Gomez (Cashier)', 'cashier@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'cashier'),
(3, 'Alex Rivera (Manager)', 'manager@apexstock.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'manager');

-- 2. Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Dairy & Bakery', 'Fresh farm milk, bread, butter, eggs and morning essentials'),
(2, 'Beverages', 'Cold coffees, energy drinks, mineral water, and premium teas'),
(3, 'Snacks & Food', 'Chips, chocolates, roasted nuts, and gourmet confectionery'),
(4, 'Electronics', 'Charging cables, wireless earbuds, adapters and tech gear'),
(5, 'Personal Care', 'Hand washes, natural toothpastes, skincare essentials'),
(6, 'Household', 'Eco-friendly cleaning supplies, microfiber cloths, detergents');

-- 3. Products (Prices in INR ₹)
INSERT INTO products (id, category_id, name, sku, barcode, cost_price, selling_price, current_stock, min_stock_alert, unit) VALUES
(1, 1, 'Fresh Farm Whole Milk 1L', 'MLK-001', '8901001', 38.00, 65.00, 45, 15, 'bottle'),
(2, 1, 'Artisan Sourdough Bread 500g', 'BRD-002', '8901002', 30.00, 55.00, 22, 10, 'loaf'),
(3, 1, 'Salted Golden Butter 200g', 'BTR-003', '8901003', 45.00, 60.00, 8, 12, 'pack'),
(4, 2, 'Organic Cold Brew Coffee 330ml', 'BEV-004', '8901004', 60.00, 120.00, 60, 20, 'can'),
(5, 2, 'Sparkling Lemon Water 500ml', 'BEV-005', '8901005', 25.00, 45.00, 75, 25, 'bottle'),
(6, 2, 'Premium Earl Grey Tea Box (50s)', 'BEV-006', '8901006', 180.00, 290.00, 5, 10, 'box'),
(7, 3, 'Truffle Potato Chips 150g', 'SNK-007', '8901007', 40.00, 75.00, 35, 15, 'bag'),
(8, 3, 'Dark Chocolate Almonds 200g', 'SNK-008', '8901008', 150.00, 260.00, 18, 12, 'pack'),
(9, 3, 'Roasted Cashew Nuts 250g', 'SNK-009', '8901009', 220.00, 360.00, 4, 10, 'jar'),
(10, 4, 'Type-C Braided Fast Cable 2m', 'ELC-010', '8901010', 120.00, 299.00, 30, 8, 'pcs'),
(11, 4, 'Wireless Bluetooth Earbuds Pro', 'ELC-011', '8901011', 750.00, 1499.00, 14, 5, 'unit'),
(12, 4, 'Fast 65W GaN Wall Charger', 'ELC-012', '8901012', 650.00, 1299.00, 2, 6, 'unit'),
(13, 5, 'Organic Herbal Hand Wash 300ml', 'CAR-013', '8901013', 70.00, 140.00, 40, 15, 'bottle'),
(14, 5, 'Natural Mint Toothpaste 120g', 'CAR-014', '8901014', 55.00, 110.00, 55, 20, 'tube'),
(15, 6, 'Microfiber Cleaning Towels (4pk)', 'HSD-015', '8901015', 90.00, 199.00, 28, 10, 'pack'),
(16, 6, 'Eco Dishwashing Liquid 750ml', 'HSD-016', '8901016', 65.00, 125.00, 3, 8, 'bottle');

-- 4. Customers
INSERT INTO customers (id, name, phone, email, address, total_spent, total_orders) VALUES
(1, 'Sarah Jenkins', '+91 98765 01441', 'sarah.j@gmail.com', 'Mumbai', 4820.00, 12),
(2, 'Marcus Vance', '+91 98765 01822', 'marcus.v@outlook.com', 'Bengaluru', 3100.00, 8),
(3, 'Priya Sharma', '+91 98765 01993', 'priya.s@techcorp.io', 'Delhi NCR', 9200.00, 21),
(4, 'Robert Chen', '+91 98765 01314', 'rchen@stanford.edu', 'Pune', 1650.00, 4),
(5, 'Elena Rostova', '+91 98765 01675', 'elena.rostova@icloud.com', 'Hyderabad', 6400.00, 15);

-- 5. Suppliers
INSERT INTO suppliers (id, name, contact_person, phone, email, address, categories_supplied) VALUES
(1, 'Fresh Valley Farms Dairy', 'David Miller', '+91 98765 88110', 'orders@freshvalley.com', 'Pune', 'Dairy & Bakery'),
(2, 'Summit Beverage Distributors', 'Karen Hughes', '+91 98765 88220', 'sales@summitbev.com', 'Mumbai', 'Beverages'),
(3, 'Golden Harvest Foods', 'Alan Walker', '+91 98765 88330', 'alan@goldenharvest.com', 'Nashik', 'Snacks & Food'),
(4, 'AnkerTech Hardware Supply', 'Kenji Sato', '+91 98765 88440', 'b2b@ankertech.io', 'Bengaluru', 'Electronics'),
(5, 'PureLife Care & Hygiene', 'Jessica Alba', '+91 98765 88550', 'contact@purelifecare.com', 'Delhi', 'Personal Care, Household');
