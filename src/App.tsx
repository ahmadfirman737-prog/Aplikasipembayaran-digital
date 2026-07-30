import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Transactions } from './components/Transactions';
import { InvoiceModal } from './components/InvoiceModal';
import { Reports } from './components/Reports';
import { UserManagement } from './components/UserManagement';
import { CompanySettings } from './components/CompanySettings';
import { TwoFactorModal } from './components/TwoFactorModal';
import { LaravelSourceCodeHub } from './components/LaravelSourceCodeHub';

import {
  initialUsers,
  initialProducts,
  initialTransactions,
  initialCompanyProfile,
} from './data/mockData';
import { Product, Transaction, UserRole, User, CompanyProfile } from './types';
import { Language } from './i18n/translations';

export default function App() {
  // Global State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [lang, setLang] = useState<Language>('id');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);

  // Users & Multi-Role
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);

  // Business Data
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Active Selected Modal
  const [selectedTransactionForModal, setSelectedTransactionForModal] =
    useState<Transaction | null>(null);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  // Apply dark mode class to root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // User Management Handlers
  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...newUserData,
      id: `usr-${Date.now()}`,
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (updatedUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  // Switch Role handler
  const handleSwitchRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      ...currentUser,
      role,
    };
    setCurrentUser(matched);
  };

  // Add Product
  const handleAddProduct = (newProdData: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setProducts([newProduct, ...products]);
  };

  // Edit Product
  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  // Adjust Stock
  const handleAdjustStock = (
    productId: string,
    qty: number,
    type: 'in' | 'out' | 'adjust',
    reason: string
  ) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          let updatedStock = p.stock;
          if (type === 'in') updatedStock += qty;
          else if (type === 'out') updatedStock = Math.max(0, p.stock - qty);
          else updatedStock = qty;

          return {
            ...p,
            stock: updatedStock,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return p;
      })
    );
  };

  // Add Transaction
  const handleAddTransaction = (trxData: Omit<Transaction, 'id'>) => {
    const newTrx: Transaction = {
      ...trxData,
      id: `trx-${Date.now()}`,
    };

    setTransactions([newTrx, ...transactions]);

    // Automatically update stock levels
    trxData.items.forEach((item) => {
      handleAdjustStock(item.productId, item.quantity, 'out', `Penjualan ${newTrx.invoiceNumber}`);
    });

    // Open document modal
    setSelectedTransactionForModal(newTrx);
  };

  // Critical low stock count
  const criticalStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        currentUser={currentUser}
        companyProfile={companyProfile}
        onSwitchRole={handleSwitchRole}
        lang={lang}
        onLanguageChange={setLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpen2FA={() => setIs2FAModalOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser.role}
          lang={lang}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          criticalStockCount={criticalStockCount}
        />

        {/* View Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <Dashboard
                products={products}
                transactions={transactions}
                lang={lang}
                onSelectTransaction={(trx) => setSelectedTransactionForModal(trx)}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'inventory' && (
              <Inventory
                products={products}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onAdjustStock={handleAdjustStock}
                userRole={currentUser.role}
                lang={lang}
              />
            )}

            {activeTab === 'transactions' && (
              <Transactions
                transactions={transactions}
                products={products}
                onAddTransaction={handleAddTransaction}
                onOpenDocuments={(trx) => setSelectedTransactionForModal(trx)}
                userRole={currentUser.role}
                lang={lang}
              />
            )}

            {activeTab === 'reports' && (
              <Reports transactions={transactions} products={products} lang={lang} />
            )}

            {activeTab === 'users' && (
              <UserManagement
                users={users}
                currentUser={currentUser}
                onAddUser={handleAddUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                lang={lang}
              />
            )}

            {activeTab === 'settings' && (
              <CompanySettings
                companyProfile={companyProfile}
                onSaveProfile={setCompanyProfile}
                lang={lang}
              />
            )}

            {activeTab === 'laravel' && <LaravelSourceCodeHub lang={lang} />}
          </div>
        </main>
      </div>

      {/* Invoice & Delivery Order Modal */}
      {selectedTransactionForModal && (
        <InvoiceModal
          transaction={selectedTransactionForModal}
          companyProfile={companyProfile}
          onClose={() => setSelectedTransactionForModal(null)}
          lang={lang}
        />
      )}

      {/* 2FA Security Modal */}
      {is2FAModalOpen && (
        <TwoFactorModal
          user={currentUser}
          onToggle2FA={(enable) => {
            setCurrentUser({ ...currentUser, is2FAEnabled: enable });
            setUsers(
              users.map((u) => (u.id === currentUser.id ? { ...u, is2FAEnabled: enable } : u))
            );
          }}
          onClose={() => setIs2FAModalOpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
