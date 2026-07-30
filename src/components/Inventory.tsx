import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  SlidersHorizontal,
  AlertOctagon,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Product, UserRole } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatRupiah } from '../utils/pdfGenerator';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  onEditProduct: (product: Product) => void;
  onAdjustStock: (productId: string, qty: number, type: 'in' | 'out' | 'adjust', reason: string) => void;
  userRole: UserRole;
  lang: Language;
}

export const Inventory: React.FC<InventoryProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onAdjustStock,
  userRole,
  lang,
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'safe' | 'critical'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    category: 'Elektronik & Gadget',
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 5,
    unit: 'Unit',
    supplier: 'PT Solusi Supplier',
  });

  // Form states for Stock Adjustment
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustType, setAdjustType] = useState<'in' | 'out' | 'adjust'>('in');
  const [adjustReason, setAdjustReason] = useState('Penerimaan Barang Dari Supplier');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'critical'
        ? p.stock <= p.minStock
        : p.stock > p.minStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setFormData({
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `899${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: '',
      category: categories[0] || 'Elektronik & Gadget',
      price: 150000,
      costPrice: 100000,
      stock: 10,
      minStock: 5,
      unit: 'Pcs',
      supplier: 'PT Niaga Jaya',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sku: p.sku,
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit,
      supplier: p.supplier,
    });
  };

  const handleSubmitSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        ...formData,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });
      setEditingProduct(null);
    } else {
      onAddProduct(formData);
      setIsAddModalOpen(false);
    }
  };

  const handleSubmitAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustingProduct) {
      onAdjustStock(adjustingProduct.id, adjustQty, adjustType, adjustReason);
      setAdjustingProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.inventory} & Manajemen Stok
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data produk, batas minimum stok, dan koreksi stok inventaris.
          </p>
        </div>

        {['admin', 'gudang'].includes(userRole) && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addProduct}</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchProduct}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
          />
        </div>

        {/* Category & Stock Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setStockFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                stockFilter === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStockFilter('critical')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                stockFilter === 'critical'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🚨 Stok Kritis
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="p-3.5 font-semibold">SKU / Barcode</th>
                <th className="p-3.5 font-semibold">{t.productName}</th>
                <th className="p-3.5 font-semibold">{t.category}</th>
                <th className="p-3.5 font-semibold">{t.unitPrice}</th>
                <th className="p-3.5 font-semibold">{t.stock}</th>
                <th className="p-3.5 font-semibold">{t.status}</th>
                <th className="p-3.5 font-semibold text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isCritical = p.stock <= p.minStock;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50 ${
                      isCritical ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {p.sku}
                      </div>
                      <div className="text-[10px] text-slate-400">{p.barcode}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500">Supplier: {p.supplier}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatRupiah(p.price)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Modal: {formatRupiah(p.costPrice)}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {p.stock} <span className="text-[10px] text-slate-400">{p.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Min: {p.minStock} {p.unit}</div>
                    </td>

                    <td className="p-3.5">
                      {isCritical ? (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                          <AlertOctagon className="h-3.5 w-3.5" />
                          <span>STOK KRITIS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>AMAN</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Koreksi Jumlah Stok"
                        >
                          <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Edit Detail Produk"
                        >
                          <Edit2 className="h-4 w-4 text-amber-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Product */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSave} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nama Barang
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Harga Modal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Batas Minim
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData({ ...formData, minStock: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nama Supplier Utama
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-4 flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Stock Adjustment */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Koreksi Stok Barang
              </h3>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjust} className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  {adjustingProduct.name}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  SKU: {adjustingProduct.sku} &bull; Stok Saat Ini:{' '}
                  <strong className="font-bold text-slate-900 dark:text-white">
                    {adjustingProduct.stock} {adjustingProduct.unit}
                  </strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Jenis Koreksi
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="in">Restock Masuk (+)</option>
                  <option value="out">Pengeluaran / Rusak (-)</option>
                  <option value="adjust">Setel Jumlah Langsung (=)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Jumlah (Qty)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Alasan Koreksi
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-4 flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Terapkan Koreksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
