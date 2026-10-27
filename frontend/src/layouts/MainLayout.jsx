import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InvoiceModal from '../components/InvoiceModal';
import ProductModal from '../components/ProductModal';
import StockModal from '../components/StockModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import DashboardPage from '../pages/DashboardPage';
import POSPage from '../pages/POSPage';
import ProductsPage from '../pages/ProductsPage';
import StockMovementPage from '../pages/StockMovementPage';
import SalesPage from '../pages/SalesPage';
import CustomersPage from '../pages/CustomersPage';
import SuppliersPage from '../pages/SuppliersPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

export default function MainLayout() {
  const { role } = useAuth();
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, lastCompletedSale } = useCart();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockModalMode, setStockModalMode] = useState('IN');
  const [stockModalDefaultProd, setStockModalDefaultProd] = useState('');
  const [viewInvoiceRecord, setViewInvoiceRecord] = useState(null);

  // Safety check for role permissions
  const safeActiveTab = (() => {
    if (role === 'cashier' && ['products', 'stock_movement', 'suppliers', 'reports', 'settings'].includes(activeTab)) {
      return 'pos';
    }
    if (role === 'manager' && ['pos', 'settings'].includes(activeTab)) {
      return 'products';
    }
    return activeTab;
  })();

  const pageTitles = {
    dashboard: 'Executive Dashboard & Live Metrics',
    pos: 'Point of Sale (POS) Billing Terminal',
    products: 'Product Catalog & Inventory Master',
    stock_movement: 'Stock Inward & Outward Movements',
    sales: 'Invoices & Customer Sales Register',
    customers: 'Customer Relationship Management (CRM)',
    suppliers: 'Supplier Directory & Vendor Accounts',
    reports: 'Financial Performance & Stock Analytics',
    settings: 'Store Configuration & System Admin'
  };

  const handleOpenProductModal = (prod = null) => {
    setEditingProduct(prod);
    setProductModalOpen(true);
  };

  const handleOpenStockModal = (mode = 'IN', prodId = '') => {
    setStockModalMode(mode);
    setStockModalDefaultProd(prodId);
    setStockModalOpen(true);
  };

  const handleViewInvoice = (saleRecord) => {
    setViewInvoiceRecord(saleRecord);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <Sidebar activeTab={safeActiveTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100">
        <Header
          pageTitle={pageTitles[safeActiveTab] || 'ApexStock'}
          onLaunchPos={() => setActiveTab('pos')}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {safeActiveTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {safeActiveTab === 'pos' && <POSPage />}
          {safeActiveTab === 'products' && (
            <ProductsPage
              onOpenProductModal={handleOpenProductModal}
              onOpenStockModal={handleOpenStockModal}
            />
          )}
          {safeActiveTab === 'stock_movement' && (
            <StockMovementPage onOpenStockModal={handleOpenStockModal} />
          )}
          {safeActiveTab === 'sales' && (
            <SalesPage
              onViewInvoice={handleViewInvoice}
              onLaunchPos={() => setActiveTab('pos')}
            />
          )}
          {safeActiveTab === 'customers' && <CustomersPage />}
          {safeActiveTab === 'suppliers' && (
            <SuppliersPage onOpenStockModal={handleOpenStockModal} />
          )}
          {safeActiveTab === 'reports' && <ReportsPage />}
          {safeActiveTab === 'settings' && <SettingsPage />}
        </div>
      </main>

      {/* Shared Modals */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        editingProduct={editingProduct}
      />

      <StockModal
        mode={stockModalMode}
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        defaultProductId={stockModalDefaultProd}
      />

      {/* Sale completion invoice modal */}
      <InvoiceModal
        sale={lastCompletedSale}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* Historical view invoice modal */}
      <InvoiceModal
        sale={viewInvoiceRecord}
        isOpen={!!viewInvoiceRecord}
        onClose={() => setViewInvoiceRecord(null)}
      />
    </div>
  );
}
