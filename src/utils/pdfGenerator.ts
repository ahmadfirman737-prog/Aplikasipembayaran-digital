import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, Product, CompanyProfile } from '../types';

const defaultCompany: CompanyProfile = {
  name: 'PT SOLUSI NIAGA NUSANTARA',
  logo: '🏢',
  address: 'Jl. Rasuna Said Blok X-5 No. 18, Kuningan, Jakarta Selatan',
  phone: '(021) 555-8900',
  email: 'info@solusiniaga.co.id',
  website: 'www.solusiniaga.co.id',
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate & Download Invoice PDF
 */
export function generateInvoicePDF(trx: Transaction, company: CompanyProfile = defaultCompany) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Company Info
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name.toUpperCase(), 14, 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.address} | Telp: ${company.phone}`, 14, 21);
  doc.text(`Email: ${company.email} | Web: ${company.website}`, 14, 26);

  // Invoice Title Tag
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTUR / INVOICE PENJUALAN', 14, 45);

  // Meta Grid (Customer & Invoice Info)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Diterbitkan Untuk:', 14, 55);
  doc.text('Rincian Invoice:', 120, 55);

  doc.setFont('helvetica', 'normal');
  doc.text(`Pelanggan: ${trx.customerName}`, 14, 61);
  doc.text(`Telepon: ${trx.customerPhone}`, 14, 66);
  doc.text(`Alamat: ${trx.address}`, 14, 71, { maxWidth: 90 });

  doc.text(`No. Invoice: ${trx.invoiceNumber}`, 120, 61);
  doc.text(`Tanggal: ${trx.date}`, 120, 66);
  doc.text(`Metode Bayar: ${trx.paymentMethod}`, 120, 71);
  doc.text(`Status: ${trx.paymentStatus}`, 120, 76);

  // Itemized Table
  const tableData = trx.items.map((item, index) => [
    index + 1,
    item.sku,
    item.productName,
    item.quantity,
    formatRupiah(item.unitPrice),
    formatRupiah(item.subtotal),
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['No', 'SKU', 'Nama Barang', 'Qty', 'Harga Satuan', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 32 },
      2: { cellWidth: 70 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 30, halign: 'right' },
    },
  });

  // Summary Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 120, finalY);
  doc.text(formatRupiah(trx.subtotal), 180, finalY, { align: 'right' });

  doc.text('Diskon:', 120, finalY + 6);
  doc.text(`- ${formatRupiah(trx.discount)}`, 180, finalY + 6, { align: 'right' });

  doc.text('Pajak PPN (11%):', 120, finalY + 12);
  doc.text(formatRupiah(trx.tax), 180, finalY + 12, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('GRAND TOTAL:', 120, finalY + 20);
  doc.text(formatRupiah(trx.grandTotal), 180, finalY + 20, { align: 'right' });

  // Signatures
  const sigY = finalY + 40;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Hormat Kami,', 30, sigY);
  doc.text(company.name, 30, sigY + 5);

  doc.text('Penerima / Pelanggan,', 140, sigY);

  // Signature lines
  doc.line(25, sigY + 30, 80, sigY + 30);
  doc.text(`(${trx.cashierName})`, 35, sigY + 35);

  doc.line(135, sigY + 30, 190, sigY + 30);
  doc.text(`(${trx.customerName})`, 140, sigY + 35);

  doc.save(`${trx.invoiceNumber.replace(/\//g, '_')}.pdf`);
}

/**
 * Generate & Download Surat Jalan PDF
 */
export function generateSuratJalanPDF(trx: Transaction, company: CompanyProfile = defaultCompany) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Company Info
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name.toUpperCase(), 14, 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Divisi Logistik & Pengiriman | Telp: ${company.phone}`, 14, 21);
  doc.text(`Alamat Gudang: ${company.address}`, 14, 26);

  // Surat Jalan Title Tag
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN / DELIVERY ORDER', 14, 45);

  // Info Grid
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Tujuan Pengiriman:', 14, 55);
  doc.text('Detail Expedisi / Kendaraan:', 120, 55);

  doc.setFont('helvetica', 'normal');
  doc.text(`Penerima: ${trx.customerName}`, 14, 61);
  doc.text(`Telepon: ${trx.customerPhone}`, 14, 66);
  doc.text(`Alamat Pengiriman: ${trx.address}`, 14, 71, { maxWidth: 90 });

  doc.text(`No. Surat Jalan: ${trx.suratJalanNumber}`, 120, 61);
  doc.text(`Ref Invoice: ${trx.invoiceNumber}`, 120, 66);
  doc.text(`Tanggal Kirim: ${trx.date}`, 120, 71);
  doc.text(`Pengemudi / Courier: ${trx.driverName || 'Slamet Supriyadi'}`, 120, 76);
  doc.text(`No. Polisi: ${trx.vehiclePlate || 'B 9284 SJA'}`, 120, 81);

  // Itemized Table (Without Price for Warehouse Security)
  const tableData = trx.items.map((item, index) => [
    index + 1,
    item.sku,
    item.productName,
    item.quantity,
    'Kondisi Baik & Tersegel',
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['No', 'SKU', 'Nama Barang', 'Qty Barang', 'Keterangan']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 80 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 35 },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('* Catatan: Mohon periksa kelengkapan dan kondisi fisik barang saat diterima.', 14, finalY);

  // Signatures (3 Stamps: Driver, Warehouse, Recipient)
  const sigY = finalY + 25;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  doc.text('Pengirim / Gudang,', 15, sigY);
  doc.text('Pengemudi / Courier,', 85, sigY);
  doc.text('Penerima Barang,', 155, sigY);

  doc.line(10, sigY + 25, 60, sigY + 25);
  doc.text('( Bag. Gudang )', 20, sigY + 30);

  doc.line(80, sigY + 25, 130, sigY + 25);
  doc.text(`( ${trx.driverName || 'Driver'} )`, 85, sigY + 30);

  doc.line(150, sigY + 25, 200, sigY + 25);
  doc.text('( Cap & Tanda Tangan )', 152, sigY + 30);

  doc.save(`${trx.suratJalanNumber.replace(/\//g, '_')}.pdf`);
}

/**
 * Generate Monthly Sales & Inventory Report PDF
 */
export function generateMonthlyReportPDF(
  transactions: Transaction[],
  products: Product[],
  monthLabel: string,
  company: CompanyProfile = defaultCompany
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN BULANAN PENJUALAN & MANAJEMEN STOK', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.name.toUpperCase()} | Telp: ${company.phone} | Periode: ${monthLabel} | Diunduh: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

  // Summary Cards
  const totalRev = transactions.reduce((acc, t) => acc + t.grandTotal, 0);
  const totalTrxCount = transactions.length;
  const criticalCount = products.filter((p) => p.stock <= p.minStock).length;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN KINERJA BULANAN:', 14, 38);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Omset Penjualan: ${formatRupiah(totalRev)}`, 14, 45);
  doc.text(`Total Transaksi Diterbitkan: ${totalTrxCount} Faktur`, 110, 45);
  doc.text(`Barang Status Stok Kritis: ${criticalCount} Item`, 210, 45);

  // Table 1: Sales Summary
  doc.setFont('helvetica', 'bold');
  doc.text('1. Daftar Transaksi Penjualan Bulanan', 14, 56);

  const salesRows = transactions.map((t, idx) => [
    idx + 1,
    t.invoiceNumber,
    t.date,
    t.customerName,
    t.paymentMethod,
    t.paymentStatus,
    formatRupiah(t.grandTotal),
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['No', 'No Invoice', 'Tanggal', 'Pelanggan', 'Metode Bayar', 'Status', 'Total Bayar']],
    body: salesRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
  });

  // Table 2: Critical Stock List
  const nextY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.text('2. Status Stok Barang Kritis / Perlu Pemesanan Ulang', 14, nextY);

  const criticalProducts = products.filter((p) => p.stock <= p.minStock);
  const stockRows = criticalProducts.map((p, idx) => [
    idx + 1,
    p.sku,
    p.name,
    p.category,
    p.stock,
    p.minStock,
    p.supplier,
    formatRupiah(p.price),
  ]);

  autoTable(doc, {
    startY: nextY + 4,
    head: [['No', 'SKU', 'Nama Barang', 'Kategori', 'Stok Saat Ini', 'Stok Minim', 'Supplier', 'Harga Jual']],
    body: stockRows.length > 0 ? stockRows : [['-', '-', 'Semua stok barang berada dalam kondisi aman', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] }, // Red header for low stock
  });

  doc.save(`Laporan_Bulanan_${monthLabel.replace(/\s+/g, '_')}.pdf`);
}
