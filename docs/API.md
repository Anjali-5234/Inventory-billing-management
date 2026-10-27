# Smart Inventory & Billing Management System — API Specification (MongoDB)

Base URL: `http://localhost:5000/api`

---

### 1. Authentication (`/api/auth`)

#### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@apexstock.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6627a810f3c0b1a0e8d12345",
      "name": "John Doe",
      "email": "admin@apexstock.com",
      "role": "admin"
    }
  }
  ```

#### `POST /api/auth/register`
- Register a new user account with role.

#### `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- Returns current logged-in user profile.

---

### 2. Products & Inventory (`/api/products`)

#### `GET /api/products`
- **Query Params:** `search`, `category`, `stock` (`low`, `out`, `available`)
- **Response:**
  ```json
  {
    "success": true,
    "count": 16,
    "data": [
      {
        "_id": "6627a810f3c0b1a0e8d10001",
        "name": "Fresh Farm Whole Milk 1L",
        "category": "Dairy & Bakery",
        "sku": "MLK-001",
        "barcode": "8901001",
        "cost": 38.00,
        "price": 65.00,
        "stock": 45,
        "minStock": 15,
        "unit": "bottle"
      }
    ]
  }
  ```

#### `GET /api/products/:idOrBarcode`
- Find product by Mongo `_id`, Barcode, or SKU.

#### `POST /api/products` (Admin / Manager)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Organic Cold Brew Coffee 330ml",
    "category": "Beverages",
    "sku": "BEV-004",
    "barcode": "8901004",
    "cost": 60.00,
    "price": 120.00,
    "stock": 60,
    "minStock": 20,
    "unit": "can"
  }
  ```

#### `PUT /api/products/:id` (Admin / Manager)
- Update product fields.

#### `DELETE /api/products/:id` (Admin only)
- Remove product from database.

---

### 3. POS Billing & Checkout (`/api/pos`)

#### `POST /api/pos/checkout`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "customerId": "cust_1",
    "customerName": "Priya Sharma",
    "paymentMethod": "upi",
    "discountPercent": 10,
    "taxPercent": 18,
    "items": [
      { "productId": "6627a810f3c0b1a0e8d10001", "name": "Fresh Farm Whole Milk 1L", "qty": 2, "price": 65.00, "cost": 38.00 }
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Sale completed and inventory deducted successfully",
    "data": {
      "invoiceNo": "INV-2026-0003",
      "date": "2026-10-25 15:30",
      "grandTotal": 138.06,
      "paymentMethod": "upi"
    }
  }
  ```

#### `GET /api/pos/sales`
- List completed sales invoices with optional `?search=` and `?paymentMethod=`.

---

### 4. Stock Inward / Outward (`/api/stock`)

#### `GET /api/stock`
- Audit log of all stock movements.

#### `POST /api/stock/in`
- Record inward stock replenishment with supplier and invoice reference.

#### `POST /api/stock/out`
- Record outward inventory adjustments (damaged goods, expired, audit discrepancy).

---

### 5. Customers & Suppliers (`/api/customers`, `/api/suppliers`)

- Full CRUD operations to manage customer CRM profiles and supplier vendor contacts.

---

### 6. Reports & Analytics (`/api/reports`)

#### `GET /api/reports/dashboard`
- Aggregated financial summary: `grossRevenue`, `todaySales`, `grossProfit`, `lowStockCount`.

#### `GET /api/reports/valuation`
- Asset valuation at cost basis vs. expected retail realization.

#### `GET /api/reports/velocity`
- Products ranked by volume sold and revenue generated.

---

### 7. Store Profile Settings (`/api/settings`)

#### `GET /api/settings`
- Fetch active business name, GSTIN number, address, and currency symbol (`₹`).

#### `PUT /api/settings` (Admin only)
- Update store profile and invoice print headers.
