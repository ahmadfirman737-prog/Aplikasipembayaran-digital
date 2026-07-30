import * as XLSX from 'xlsx';
import { Transaction, Product } from '../types';
import { formatRupiah } from './pdfGenerator';

export function exportTransactionsToExcel(transactions: Transaction[], monthLabel: string) {
  // Worksheet 1: Transaksi Penjualan
  const salesData = transactions.map((t, idx) => ({
    No: idx + 1,
    'No. Invoice': t.invoiceNumber,
    'No. Surat Jalan': t.suratJalanNumber,
    Tanggal: t.date,
    'Nama Pelanggan': t.customerName,
    Telepon: t.customerPhone,
    Alamat: t.address,
    'Metode Bayar': t.paymentMethod,
    'Status Bayar': t.paymentStatus,
    Subtotal: t.subtotal,
    Diskon: t.discount,
    Pajak: t.tax,
    'Grand Total': t.grandTotal,
    Kasir: t.cashierName,
  }));

  const worksheetSales = XLSX.utils.json_to_sheet(salesData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheetSales, 'Laporan Penjualan');

  // Worksheet 2: Rincian Item Transaksi
  const itemDetails: any[] = [];
  transactions.forEach((t) => {
    t.items.forEach((item) => {
      itemDetails.push({
        'No. Invoice': t.invoiceNumber,
        Tanggal: t.date,
        Pelanggan: t.customerName,
        SKU: item.sku,
        'Nama Produk': item.productName,
        Qty: item.quantity,
        'Harga Satuan': item.unitPrice,
        Subtotal: item.subtotal,
      });
    });
  });

  const worksheetItems = XLSX.utils.json_to_sheet(itemDetails);
  XLSX.utils.book_append_sheet(workbook, worksheetItems, 'Rincian Item Transaksi');

  XLSX.writeFile(workbook, `Laporan_Penjualan_${monthLabel.replace(/\s+/g, '_')}.xlsx`);
}

export function exportInventoryToExcel(products: Product[]) {
  const inventoryData = products.map((p, idx) => ({
    No: idx + 1,
    SKU: p.sku,
    Barcode: p.barcode,
    'Nama Barang': p.name,
    Kategori: p.category,
    'Jumlah Stok': p.stock,
    'Stok Minimum': p.minStock,
    Satuan: p.unit,
    'Harga Jual': p.price,
    'Harga Modal': p.costPrice,
    'Estimasi Nilai Stok': p.stock * p.costPrice,
    'Status Stok': p.stock <= p.minStock ? 'KRITIS / REORDER' : 'AMAN',
    Supplier: p.supplier,
  }));

  const worksheet = XLSX.utils.json_to_sheet(inventoryData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Stok Barang');

  XLSX.writeFile(workbook, `Laporan_Stok_Barang_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
