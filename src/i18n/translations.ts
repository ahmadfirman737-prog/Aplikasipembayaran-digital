export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Navigation
    dashboard: 'Dashboard Real-time',
    inventory: 'Stok & Inventaris',
    transactions: 'Transaksi Penjualan',
    reports: 'Laporan Bulanan',
    userManagement: 'Manajemen User',
    companySettings: 'Profil Perusahaan',
    laravelCode: 'Source Code Laravel',
    hostingerDeploy: 'Onlinekan Hostinger',
    
    // Header & Meta
    appTitle: 'Sistem Penjualan & Stok Gudang',
    role: 'Peran',
    switchRole: 'Ganti Peran',
    twoFA: 'Otentikasi 2FA',
    enabled: 'Aktif',
    disabled: 'Nonaktif',
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    
    // Dashboard
    totalRevenue: 'Total Pendapatan',
    totalTransactions: 'Total Transaksi',
    itemsInStock: 'Total Stok Barang',
    criticalLowStock: 'Stok Kritis / Minim',
    salesTrend: 'Grafik Performa Penjualan Real-time',
    topProducts: 'Produk Terlaris Bulan Ini',
    recentSales: 'Transaksi Penjualan Terbaru',
    aiAssistantTitle: 'Analisis Inventaris Gemini AI',
    generateAIAnalysis: 'Jalankan Analisis AI',
    analyzingAI: 'Menganalisis data stok & transaksi...',
    
    // Inventory
    searchProduct: 'Cari nama produk, SKU, atau kategori...',
    addProduct: 'Tambah Produk Baru',
    editProduct: 'Edit Produk',
    sku: 'SKU',
    productName: 'Nama Barang',
    category: 'Kategori',
    unitPrice: 'Harga Jual',
    costPrice: 'Harga Modal',
    stock: 'Jumlah Stok',
    minStock: 'Batas Minim',
    status: 'Status Stok',
    actions: 'Aksi',
    adjustStock: 'Koreksi Stok',
    triggerLowStockMail: 'Tes Email Stok Kritis',
    safeStock: 'Aman',
    warningStock: 'Mendekati Minim',
    dangerStock: 'Kritis / Habis',
    
    // Transactions
    newTransaction: 'Transaksi Baru (POS)',
    invoiceNumber: 'No. Invoice',
    suratJalanNumber: 'No. Surat Jalan',
    customer: 'Pelanggan',
    grandTotal: 'Total Bayar',
    paymentStatus: 'Status Bayar',
    viewDocuments: 'Cetak Invoice & Surat Jalan',
    
    // POS Modal
    selectProducts: 'Pilih Produk',
    addToCart: 'Tambah',
    cartItems: 'Keranjang Belanja',
    discount: 'Diskon',
    tax: 'Pajak (11%)',
    paymentMethod: 'Metode Pembayaran',
    checkout: 'Selesaikan & Terbitkan Faktur',
    
    // Documents
    invoiceTitle: 'INVOICE / FAKTUR PENJUALAN',
    suratJalanTitle: 'SURAT JALAN / DELIVERY ORDER',
    downloadPdf: 'Unduh PDF',
    print: 'Cetak Dokumen',
    companyName: 'PT SOLUSI NIAGA NANTARA',
    driver: 'Pengemudi',
    vehiclePlate: 'No. Polisi Kendaraan',
    
    // Reports
    monthlyReport: 'Laporan Penjualan & Stok Bulanan',
    exportPdf: 'Ekspor PDF',
    exportExcel: 'Ekspor Excel (XLSX)',
    filterMonth: 'Pilih Bulan',
    netProfit: 'Laba Bersih Estimasi',
    
    // Ecommerce
    syncAll: 'Sinkronkan Semua Platform',
    channelStatus: 'Status Saluran E-Commerce',
    autoSync: 'Auto-Sync Stok',
    
    // Notifications & Email
    emailLogs: 'Log Email Otomatis Sent to Admin',
    pushAlerts: 'Riwayat Notifikasi Push App',
    
    // Laravel Hub
    laravelHubTitle: 'Source Code Framework Laravel 11',
    laravelHubDesc: 'Kode sumber lengkap siap pakai meliputi Controller, Model, Migration, Route, Mailable, dan PDF generator.',
    copyCode: 'Salin Kode',
    codeCopied: 'Kode Berhasil Disalin!',
    downloadZip: 'Unduh Arsip Kode',
  },
  en: {
    // Navigation
    dashboard: 'Real-time Dashboard',
    inventory: 'Stock & Inventory',
    transactions: 'Sales Transactions',
    reports: 'Monthly Reports',
    userManagement: 'User Management',
    companySettings: 'Company Settings',
    laravelCode: 'Laravel Source Code',
    hostingerDeploy: 'Hostinger Deploy',
    
    // Header & Meta
    appTitle: 'Sales & Inventory System',
    role: 'Role',
    switchRole: 'Switch Role',
    twoFA: '2FA Auth',
    enabled: 'Enabled',
    disabled: 'Disabled',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    
    // Dashboard
    totalRevenue: 'Total Revenue',
    totalTransactions: 'Total Transactions',
    itemsInStock: 'Items In Stock',
    criticalLowStock: 'Critical Low Stock',
    salesTrend: 'Real-time Sales Performance Chart',
    topProducts: 'Top Selling Products This Month',
    recentSales: 'Recent Sales Transactions',
    aiAssistantTitle: 'Gemini AI Inventory Analysis',
    generateAIAnalysis: 'Run AI Analysis',
    analyzingAI: 'Analyzing stock & sales data...',
    
    // Inventory
    searchProduct: 'Search product name, SKU, category...',
    addProduct: 'Add New Product',
    editProduct: 'Edit Product',
    sku: 'SKU',
    productName: 'Product Name',
    category: 'Category',
    unitPrice: 'Selling Price',
    costPrice: 'Cost Price',
    stock: 'Stock Quantity',
    minStock: 'Min Threshold',
    status: 'Stock Status',
    actions: 'Actions',
    adjustStock: 'Adjust Stock',
    triggerLowStockMail: 'Test Low Stock Email',
    safeStock: 'Safe',
    warningStock: 'Near Minimum',
    dangerStock: 'Critical / Out',
    
    // Transactions
    newTransaction: 'New Transaction (POS)',
    invoiceNumber: 'Invoice No.',
    suratJalanNumber: 'Delivery Order No.',
    customer: 'Customer',
    grandTotal: 'Grand Total',
    paymentStatus: 'Payment Status',
    viewDocuments: 'Print Invoice & Delivery Order',
    
    // POS Modal
    selectProducts: 'Select Products',
    addToCart: 'Add',
    cartItems: 'Shopping Cart',
    discount: 'Discount',
    tax: 'Tax (11%)',
    paymentMethod: 'Payment Method',
    checkout: 'Checkout & Issue Invoice',
    
    // Documents
    invoiceTitle: 'SALES INVOICE',
    suratJalanTitle: 'DELIVERY ORDER / SURAT JALAN',
    downloadPdf: 'Download PDF',
    print: 'Print Document',
    companyName: 'PT SOLUSI NIAGA NANTARA',
    driver: 'Driver Name',
    vehiclePlate: 'Vehicle Plate No.',
    
    // Reports
    monthlyReport: 'Monthly Sales & Stock Report',
    exportPdf: 'Export PDF',
    exportExcel: 'Export Excel (XLSX)',
    filterMonth: 'Select Month',
    netProfit: 'Estimated Net Profit',
    
    // Ecommerce
    syncAll: 'Sync All Platforms',
    channelStatus: 'E-Commerce Channel Status',
    autoSync: 'Stock Auto-Sync',
    
    // Notifications & Email
    emailLogs: 'Automated Email Logs to Admin',
    pushAlerts: 'Push Notification History',
    
    // Laravel Hub
    laravelHubTitle: 'Laravel 11 Source Code Hub',
    laravelHubDesc: 'Complete ready-to-use source code files including Controllers, Models, Migrations, Routes, Mailables, and PDF generators.',
    copyCode: 'Copy Code',
    codeCopied: 'Code Copied!',
    downloadZip: 'Download Code Package',
  },
};
