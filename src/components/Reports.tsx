import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { Transaction, Product } from '../types';
import { generateMonthlyReportPDF, formatRupiah } from '../utils/pdfGenerator';
import { exportTransactionsToExcel, exportInventoryToExcel } from '../utils/excelGenerator';
import { Language, translations } from '../i18n/translations';

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
  lang: Language;
}

export const Reports: React.FC<ReportsProps> = ({ transactions, products, lang }) => {
  const t = translations[lang];
  const [selectedMonth, setSelectedMonth] = useState('Juli 2026');

  const totalSales = transactions.reduce((sum, tr) => sum + tr.grandTotal, 0);
  const totalCost = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const totalRevenueVal = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.reports} & Audit Perusahaan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekspor rekapitulasi penjualan dan stok barang bulanan ke format PDF dan Excel (.xlsx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="Juli 2026">Juli 2026</option>
            <option value="Juni 2026">Juni 2026</option>
            <option value="Mei 2026">Mei 2026</option>
          </select>

          <button
            onClick={() => generateMonthlyReportPDF(transactions, products, selectedMonth)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            <span>{t.exportPdf}</span>
          </button>

          <button
            onClick={() => exportTransactionsToExcel(transactions, selectedMonth)}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{t.exportExcel}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Penjualan Lunas ({selectedMonth})
          </div>
          <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(totalSales)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            &bull; {transactions.length} Faktur Diterbitkan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estimasi Nilai Total Aset Stok
          </div>
          <p className="mt-2 text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatRupiah(totalCost)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            &bull; Potensi Penjualan: {formatRupiah(totalRevenueVal)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.netProfit} (Estimasi 20%)
          </div>
          <p className="mt-2 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(totalSales * 0.2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            &bull; Siap diekspor untuk audit akuntansi
          </p>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Rincian Transaksi Untuk Laporan Audit - {selectedMonth}
          </h3>
          <button
            onClick={() => exportInventoryToExcel(products)}
            className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Ekspor Stok Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="p-3 font-semibold">Invoice No</th>
                <th className="p-3 font-semibold">Pelanggan</th>
                <th className="p-3 font-semibold">Subtotal</th>
                <th className="p-3 font-semibold">PPN (11%)</th>
                <th className="p-3 font-semibold">Grand Total</th>
                <th className="p-3 font-semibold">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tr) => (
                <tr key={tr.id}>
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {tr.invoiceNumber}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {tr.customerName}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {formatRupiah(tr.subtotal)}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {formatRupiah(tr.tax)}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {formatRupiah(tr.grandTotal)}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Tervalidasi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
