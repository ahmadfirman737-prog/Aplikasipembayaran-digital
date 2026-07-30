import React, { useState } from 'react';
import {
  Plus,
  Search,
  ShoppingCart,
  FileText,
  Printer,
  Trash2,
  CheckCircle,
  X,
  CreditCard,
  Building,
  QrCode,
  DollarSign,
  Truck,
  User,
  MapPin,
  Phone,
} from 'lucide-react';
import { Product, Transaction, CartItem, UserRole } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatRupiah } from '../utils/pdfGenerator';

interface TransactionsProps {
  transactions: Transaction[];
  products: Product[];
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
  onOpenDocuments: (trx: Transaction) => void;
  userRole: UserRole;
  lang: Language;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  products,
  onAddTransaction,
  onOpenDocuments,
  userRole,
  lang,
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerName, setCustomerName] = useState('PT Cahaya Gemilang');
  const [customerPhone, setCustomerPhone] = useState('081299887766');
  const [address, setAddress] = useState('Jl. Gatot Subroto No. 88, Jakarta Selatan');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'QRIS' | 'Credit Card'>('Transfer');
  const [driverName, setDriverName] = useState('Slamet Supriyadi');
  const [vehiclePlate, setVehiclePlate] = useState('B 9284 SJA');

  const filteredTransactions = transactions.filter(
    (tr) =>
      tr.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.suratJalanNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableProducts = products.filter(
    (p) =>
      p.stock > 0 &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * product.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const item = cart.find((i) => i.product.id === productId);
    if (item && newQty > item.product.stock) return;

    setCart(
      cart.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: newQty, subtotal: newQty * i.product.price }
          : i
      )
    );
  };

  const subtotalCart = cart.reduce((acc, i) => acc + i.subtotal, 0);
  const taxCart = Math.round((subtotalCart - discount) * 0.11);
  const grandTotalCart = Math.max(0, subtotalCart - discount + taxCart);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const trxCountToday = transactions.length + 1;
    const invNo = `INV/${todayStr}/${String(trxCountToday).padStart(3, '0')}`;
    const sjNo = `SJ/${todayStr}/${String(trxCountToday).padStart(3, '0')}`;

    onAddTransaction({
      invoiceNumber: invNo,
      suratJalanNumber: sjNo,
      customerName,
      customerPhone,
      address,
      items: cart.map((i) => ({
        productId: i.product.id,
        sku: i.product.sku,
        productName: i.product.name,
        unitPrice: i.product.price,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      subtotal: subtotalCart,
      tax: taxCart,
      discount,
      grandTotal: grandTotalCart,
      paymentMethod,
      paymentStatus: 'Lunas',
      shippingStatus: 'Siap Kirim',
      driverName,
      vehiclePlate,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cashierName: 'Siti Sales / Kasir',
    });

    setCart([]);
    setIsPosModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.transactions} & Kasir POS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar faktur invoice, transaksi penjualan, dan terbitkan Surat Jalan pengiriman.
          </p>
        </div>

        {['admin', 'kasir'].includes(userRole) && (
          <button
            onClick={() => setIsPosModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.newTransaction}</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor invoice, surat jalan, atau nama pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="p-3.5 font-semibold">No. Invoice & Surat Jalan</th>
                <th className="p-3.5 font-semibold">Pelanggan</th>
                <th className="p-3.5 font-semibold">Tanggal</th>
                <th className="p-3.5 font-semibold">Status Pengiriman</th>
                <th className="p-3.5 font-semibold">Total Bayar</th>
                <th className="p-3.5 font-semibold text-center">Cetak Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                >
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {trx.invoiceNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {trx.suratJalanNumber}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {trx.customerName}
                    </div>
                    <div className="text-[10px] text-slate-500">{trx.customerPhone}</div>
                  </td>

                  <td className="p-3.5 text-slate-500 dark:text-slate-400">{trx.date}</td>

                  <td className="p-3.5">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {trx.shippingStatus}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {formatRupiah(trx.grandTotal)}
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onOpenDocuments(trx)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{t.viewDocuments}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Kasir Penjualan & Penerbitan Invoice Baru
                </h3>
              </div>
              <button
                onClick={() => setIsPosModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2">
              {/* Left Column: Product Picker */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 md:border-b-0 md:border-r">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Pilih Produk
                </h4>

                <input
                  type="text"
                  placeholder="Cari barang atau SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />

                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {availableProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-2.5 hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-indigo-950/30 transition-all"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          SKU: {p.sku} &bull; Stok: {p.stock} {p.unit}
                        </div>
                      </div>
                      <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {formatRupiah(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Customer Info & Cart */}
              <form onSubmit={handleCheckoutSubmit} className="p-4 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. Informasi Pelanggan & Pengiriman
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Nama Pelanggan
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        No. Telepon
                      </label>
                      <input
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Alamat Pengiriman (Untuk Surat Jalan)
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Cart Items List */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-1">
                    3. Keranjang Belanja ({cart.length} Item)
                  </h4>

                  <div className="max-h-36 space-y-1.5 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-800"
                      >
                        <div className="truncate max-w-[150px]">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatRupiah(item.product.price)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQty(item.product.id, Number(e.target.value))
                            }
                            className="w-12 rounded border p-1 text-center font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals Calculation */}
                  <div className="space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal:</span>
                      <span>{formatRupiah(subtotalCart)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Pajak PPN (11%):</span>
                      <span>{formatRupiah(taxCart)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 text-sm dark:text-white pt-1">
                      <span>GRAND TOTAL:</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {formatRupiah(grandTotalCart)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Selesaikan & Terbitkan Faktur
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
