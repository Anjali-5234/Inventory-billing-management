# ⚡ ApexStock Frontend — React + Vite + Tailwind CSS

The frontend client for the **Smart Inventory & POS Billing Management System**.

---

## 📁 Architecture & File Layout

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top header bar with live status and role switcher
│   │   ├── Sidebar.jsx          # Role-aware responsive navigation sidebar
│   │   ├── InvoiceModal.jsx     # Printable tax receipt modal with barcode
│   │   ├── ProductModal.jsx     # Add/Edit product catalog modal
│   │   └── StockModal.jsx       # Inward/Outward stock movement modal
│   ├── context/
│   │   ├── AuthContext.jsx      # Role and authentication state provider
│   │   ├── InventoryContext.jsx # Products, customers, suppliers & stock state
│   │   └── CartContext.jsx      # POS register cart & checkout engine
│   ├── hooks/
│   │   └── useSound.js          # Web Audio API barcode acoustic feedback
│   ├── layouts/
│   │   └── MainLayout.jsx       # Shell coordinating pages, header & sidebar
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Executive metrics, SVG charts, recent invoices
│   │   ├── POSPage.jsx          # Fast barcode scanner, catalog & register
│   │   ├── ProductsPage.jsx     # Inventory master table, low stock alerts, CSV
│   │   ├── StockMovementPage.jsx# Timestamped movement audit history
│   │   ├── SalesPage.jsx        # Invoice history and re-print actions
│   │   ├── CustomersPage.jsx    # CRM client profiles and lifetime spend
│   │   ├── SuppliersPage.jsx    # Vendor directory and inward PO trigger
│   │   ├── ReportsPage.jsx      # Valuation at cost vs retail, velocity ranking
│   │   └── SettingsPage.jsx     # Store name, GSTIN, receipt footer, factory reset
│   ├── services/
│   │   ├── api.js               # Central Fetch API client
│   │   ├── authService.js       # Auth endpoints
│   │   ├── productService.js    # Products endpoints
│   │   └── saleService.js       # POS and report endpoints
│   ├── App.jsx                  # Main application bootstrap
│   ├── main.jsx                 # React root renderer
│   └── index.css                # Tailwind styling
├── index.html                   # HTML entrypoint
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Tailwind theme configuration
└── vite.config.js               # Vite build configuration
```

---

## 🚀 Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application runs on `http://localhost:5173`.
