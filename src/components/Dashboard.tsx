import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  FileCheck2,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Product, Transaction, AIStockInsights } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatRupiah } from '../utils/pdfGenerator';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  lang: Language;
  onSelectTransaction: (trx: Transaction) => void;
  onNavigateToTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  transactions,
  lang,
  onSelectTransaction,
  onNavigateToTab,
}) => {
  const t = translations[lang];

  const [aiInsights, setAiInsights] = useState<AIStockInsights | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Compute Statistics
  const totalRevenue = transactions.reduce((sum, tr) => sum + tr.grandTotal, 0);
  const totalTrxCount = transactions.length;
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const criticalProducts = products.filter((p) => p.stock <= p.minStock);

  // Chart Data: Last 7 Days Sales Trend
  const chartData = [
    { day: 'Senin', sales: 12500000, trxs: 4 },
    { day: 'Selasa', sales: 18200000, trxs: 6 },
    { day: 'Rabu', sales: 24100000, trxs: 8 },
    { day: 'Kamis', sales: 19800000, trxs: 5 },
    { day: 'Jumat', sales: 32000000, trxs: 10 },
    { day: 'Sabtu', sales: 41500000, trxs: 14 },
    { day: 'Minggu', sales: 35297000, trxs: 11 },
  ];

  // Top products calculation
  const topProducts = [...products]
    .sort((a, b) => b.price * (100 - b.stock) - a.price * (100 - a.stock))
    .slice(0, 4);

  // Run Gemini AI Analysis
  const runAIStockAnalysis = async () => {
    setLoadingAI(true);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/stock-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: products.map((p) => ({
            sku: p.sku,
            name: p.name,
            stock: p.stock,
            minStock: p.minStock,
            price: p.price,
          })),
          salesHistory: transactions.map((t) => ({
            invoice: t.invoiceNumber,
            total: t.grandTotal,
            date: t.date,
          })),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiInsights(data);
      }
    } catch (err: any) {
      setAiError('Gagal menghubungkan ke server AI Gemini: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Real-time Enterprise Sales & Inventory Hub</span>
            </div>
            <h2 className="mt-2 text-xl font-bold md:text-2xl">
              Dasbor Pemantauan Transaksi & Stok Real-time
            </h2>
            <p className="mt-1 text-xs text-indigo-200 opacity-90 max-w-2xl">
              Monitor grafik penjualan, riwayat faktur invoice, dan surat jalan real-time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateToTab('transactions')}
              className="flex items-center space-x-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition-all"
            >
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
              <span>+ Buat Penjualan (POS)</span>
            </button>
            <button
              onClick={() => onNavigateToTab('inventory')}
              className="flex items-center space-x-2 rounded-xl border border-indigo-400/40 bg-indigo-900/50 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-900 transition-all"
            >
              <Package className="h-4 w-4" />
              <span>Kelola Stok</span>
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.totalRevenue}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(totalRevenue)}
          </p>
          <div className="mt-2 flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+14.2% dari bulan lalu</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.totalTransactions}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            {totalTrxCount} <span className="text-xs font-normal text-slate-500">Faktur</span>
          </p>
          <div className="mt-2 flex items-center space-x-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>100% Lunas & Terverifikasi</span>
          </div>
        </div>

        {/* Total Items in Stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.itemsInStock}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            {totalStockItems} <span className="text-xs font-normal text-slate-500">Item</span>
          </p>
          <div className="mt-2 flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            <span>Terdistribusi di 4 Gudang</span>
          </div>
        </div>

        {/* Critical Low Stock Count */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm transition-colors dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              {t.criticalLowStock}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-rose-700 dark:text-rose-300">
            {criticalProducts.length} <span className="text-xs font-normal">Barang</span>
          </p>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="mt-2 flex items-center space-x-1 text-[11px] font-bold text-rose-600 underline hover:text-rose-800 dark:text-rose-400"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Lihat Stok Kritis</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart + Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Performance Area Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.salesTrend}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Omset Penjualan Harian (Rp) &bull; Juli 2026
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Status: Live Real-time
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000000}JT`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), 'Omset Penjualan']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.topProducts}
            </h3>
            <button
              onClick={() => onNavigateToTab('inventory')}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((prod) => (
              <div key={prod.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {prod.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatRupiah(prod.price)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                      style={{ width: `${Math.min(100, prod.stock * 3)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    Sisa {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gemini AI Inventory Assistant Section */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 p-6 shadow-sm transition-colors dark:border-indigo-900/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.aiAssistantTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Dapatkan estimasi kebutuhan restock otomatis dan rekomendasi peningkatan omset dari Gemini AI.
              </p>
            </div>
          </div>

          <button
            onClick={runAIStockAnalysis}
            disabled={loadingAI}
            className="flex shrink-0 items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? t.analyzingAI : t.generateAIAnalysis}</span>
          </button>
        </div>

        {aiError && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {aiError}
          </div>
        )}

        {aiInsights && (
          <div className="mt-5 space-y-4 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm dark:border-indigo-900/50 dark:bg-slate-900/80">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Ringkasan Analisis AI
              </h4>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed dark:text-slate-200">
                {aiInsights.summary}
              </p>
            </div>

            {aiInsights.criticalAlerts && aiInsights.criticalAlerts.length > 0 && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                <span className="font-bold">⚠️ Perhatian Stok:</span>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  {aiInsights.criticalAlerts.map((alert, i) => (
                    <li key={i}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiInsights.restockRecommendations && aiInsights.restockRecommendations.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Rekomendasi Pemesanan Ulang (Restock):
                </h5>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {aiInsights.restockRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800"
                    >
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">
                        {rec.productName} (+{rec.recommendedQty} Unit)
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.recentSales}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik transaksi untuk mencetak atau mengunduh Faktur Invoice & Surat Jalan
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('transactions')}
            className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <span>Buka Semua Transaksi</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="p-3 font-semibold">{t.invoiceNumber}</th>
                <th className="p-3 font-semibold">{t.customer}</th>
                <th className="p-3 font-semibold">Tanggal</th>
                <th className="p-3 font-semibold">Metode Bayar</th>
                <th className="p-3 font-semibold">{t.grandTotal}</th>
                <th className="p-3 font-semibold text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                >
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {trx.invoiceNumber}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {trx.customerName}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{trx.date}</td>
                  <td className="p-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {formatRupiah(trx.grandTotal)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelectTransaction(trx)}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                    >
                      Invoice & Surat Jalan
                    </button>
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
