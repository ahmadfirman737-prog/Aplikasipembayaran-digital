export type UserRole = 'admin' | 'gudang' | 'kasir' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  is2FAEnabled: boolean;
  twoFASecret?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface CompanyProfile {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  npwp?: string;
  tagline?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string; // e.g. 'Pcs', 'Box', 'Kg'
  supplier: string;
  image?: string;
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjust';
  quantity: number;
  reason: string;
  operator: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface TransactionItem {
  productId: string;
  sku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  suratJalanNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Transfer' | 'QRIS' | 'Credit Card';
  paymentStatus: 'Lunas' | 'Belum Lunas' | 'Jatuh Tempo';
  shippingStatus: 'Siap Kirim' | 'Dalam Perjalanan' | 'Terkirim' | 'Dibatalkan';
  driverName?: string;
  vehiclePlate?: string;
  date: string;
  cashierName: string;
  notes?: string;
}


export interface LaravelFile {
  id: string;
  filename: string;
  path: string;
  category: 'Controller' | 'Model' | 'Migration' | 'Route' | 'Mail' | 'PDF View';
  description: string;
  content: string;
}

export interface AIStockInsights {
  summary: string;
  criticalAlerts: string[];
  restockRecommendations: {
    productName: string;
    recommendedQty: number;
    reason: string;
  }[];
  salesGrowthTips: string;
}
