# Project Documentation & Architecture Guide

## 1. System Architecture

The **Smart Inventory & Billing Management System** adopts a modern 3-tier full-stack architecture:
- **Presentation Layer**: Responsive React (Vite + Tailwind CSS) or zero-setup standalone web application with Web Audio API.
- **Application & API Layer**: Node.js & Express RESTful microservices with JWT-based Role-Based Access Control (RBAC).
- **Data Layer**: **MongoDB Document Database** with Mongoose ODM schemas, transactional consistency, indexing, and audit logs.

```text
+-------------------------------------------------------+
|              CLIENT / PRESENTATION LAYER             |
|   POS Terminal  |  Inventory Master  |  Analytics     |
+-------------------------------------------------------+
                           │ REST / JSON (fetch / Axios)
                           ▼
+-------------------------------------------------------+
|               NODE.JS / EXPRESS BACKEND              |
|   JWT Auth   |  RBAC Middleware  |  Business Logic    |
+-------------------------------------------------------+
                           │ Mongoose ODM
                           ▼
+-------------------------------------------------------+
|                 MONGODB DATABASE                      |
|  Users | Products | Sales | StockMovements | Customers |
+-------------------------------------------------------+
```

## 2. Role-Based Access Matrix

| Feature / Module | Admin | Cashier | Inventory Manager |
|---|:---:|:---:|:---:|
| Executive Analytics Dashboard | ✅ Full | ❌ | ✅ Read-Only |
| POS Terminal & Checkout | ✅ Full | ✅ Full | ❌ |
| Invoices & Transaction History | ✅ Full | ✅ Full | ❌ |
| Product Catalog Management | ✅ Full | ❌ | ✅ Full |
| Stock Inward / Outward Entry | ✅ Full | ❌ | ✅ Full |
| Customer Profile Management | ✅ Full | ✅ Full | ❌ |
| Supplier Directory | ✅ Full | ❌ | ✅ Full |
| Financial Valuation Reports | ✅ Full | ❌ | ✅ Full |
| Store Profile & Tax Settings | ✅ Full | ❌ | ❌ |

## 3. Stock Movement Integrity

Every transaction automatically creates a log in `stockmovements` in MongoDB:
- **Sales**: Stock is deducted and an `OUT` record is logged referencing the invoice.
- **Supplier Receipts**: Stock is incremented and an `IN` record is logged with invoice reference.
- **Damage/Audit Adjustments**: Stock is deducted/adjusted with a reason tag.

## 4. MongoDB Models Overview

- `User`: Handles RBAC users (`admin`, `cashier`, `manager`) with bcrypt passwords.
- `Product`: Stores product catalog, SKU, barcode, unit, cost price, and selling price in Indian Rupees (₹).
- `Category`: Categories categorization.
- `Customer`: Customer CRM, contact, lifetime spent, and total orders.
- `Supplier`: Vendor directory and supplied departments.
- `Sale`: Itemized POS transaction invoices with tax/GST calculation.
- `StockMovement`: Audit trail for stock changes.
- `Setting`: Business name, GSTIN, and currency configuration.
