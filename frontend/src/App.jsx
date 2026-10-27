import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
