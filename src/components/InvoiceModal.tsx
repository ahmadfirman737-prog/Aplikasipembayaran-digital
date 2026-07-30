import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  FileCheck,
  Truck,
} from 'lucide-react';
import { Transaction, CompanyProfile } from '../types';
import { generateInvoicePDF, generateSuratJalanPDF, formatRupiah } from '../utils/pdfGenerator';
import { Language, translations } from '../i18n/translations';

interface InvoiceModalProps {
  transaction: Transaction | null;
  companyProfile: CompanyProfile;
  onClose: () => void;
  lang: Language;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  transaction,
  companyProfile,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'invoice' | 'suratJalan'>('invoice');

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8">
        {/* Header toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab buttons */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('invoice')}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'invoice'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>{t.invoiceTitle}</span>
            </button>
            <button
              onClick={() => setActiveTab('suratJalan')}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'suratJalan'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>{t.suratJalanTitle}</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                activeTab === 'invoice'
                  ? generateInvoicePDF(transaction, companyProfile)
                  : generateSuratJalanPDF(transaction, companyProfile)
              }
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              <span>{t.downloadPdf}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              <span>{t.print}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-document" className="p-6 text-slate-800 dark:text-slate-200 text-xs">
          {activeTab === 'invoice' ? (
            /* INVOICE VIEW */
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col justify-between border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-indigo-600 text-white font-extrabold text-base">
                      {companyProfile.logo.startsWith('http') || companyProfile.logo.startsWith('data:') ? (
                        <img src={companyProfile.logo} alt={companyProfile.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>{companyProfile.logo || '🏢'}</span>
                      )}
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {companyProfile.name}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {companyProfile.address}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Telp: {companyProfile.phone} &bull; Email: {companyProfile.email}
                  </p>
                </div>

                <div className="mt-4 text-left sm:mt-0 sm:text-right">
                  <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    STATUS: LUNAS
                  </span>
                  <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                    {transaction.invoiceNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tanggal: {transaction.date}
                  </p>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Diterbitkan Kepada:
                  </h4>
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {transaction.customerName}
                  </p>
                  <p className="text-slate-500">Telp: {transaction.customerPhone}</p>
                  <p className="text-slate-500">{transaction.address}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Rincian Pembayaran:
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Metode: <strong className="font-bold">{transaction.paymentMethod}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Kasir: {transaction.cashierName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Surat Jalan: {transaction.suratJalanNumber}
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800">
                    <tr>
                      <th className="p-2.5 font-bold">No</th>
                      <th className="p-2.5 font-bold">SKU</th>
                      <th className="p-2.5 font-bold">Nama Barang</th>
                      <th className="p-2.5 font-bold text-center">Qty</th>
                      <th className="p-2.5 font-bold text-right">Harga Satuan</th>
                      <th className="p-2.5 font-bold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transaction.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-center">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-semibold">{item.sku}</td>
                        <td className="p-2.5 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="p-2.5 text-right">{formatRupiah(item.unitPrice)}</td>
                        <td className="p-2.5 text-right font-bold">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="flex flex-col justify-end text-right">
                <div className="ml-auto w-64 space-y-1.5 border-t border-slate-200 pt-3 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(transaction.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Diskon:</span>
                    <span>- {formatRupiah(transaction.discount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PPN (11%):</span>
                    <span>{formatRupiah(transaction.tax)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>GRAND TOTAL:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {formatRupiah(transaction.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="font-semibold text-slate-600">Hormat Kami,</p>
                  <p className="text-[10px] text-slate-400">{companyProfile.name}</p>
                  <div className="my-8 h-12 flex items-center justify-center font-serif italic text-slate-400">
                    ( Tanda Tangan Kasir / Stempel )
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {transaction.cashierName}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-600">Penerima / Pelanggan,</p>
                  <div className="my-8 h-12 flex items-center justify-center font-serif italic text-slate-400">
                    ( Cap & Tanda Tangan )
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {transaction.customerName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* SURAT JALAN VIEW */
            <div className="space-y-6">
              <div className="flex flex-col justify-between border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-white font-extrabold text-base">
                      {companyProfile.logo.startsWith('http') || companyProfile.logo.startsWith('data:') ? (
                        <img src={companyProfile.logo} alt={companyProfile.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>{companyProfile.logo || '🏢'}</span>
                      )}
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {companyProfile.name} - LOGISTIK
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Divisi Pengiriman & Gudang Logistik | Telp: {companyProfile.phone}
                  </p>
                </div>

                <div className="mt-4 text-left sm:mt-0 sm:text-right">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {transaction.suratJalanNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ref Invoice: {transaction.invoiceNumber}
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Tujuan Pengiriman:
                  </h4>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {transaction.customerName}
                  </p>
                  <p className="text-slate-500">{transaction.address}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Kendaraan & Driver:
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Driver: <strong className="font-bold">{transaction.driverName || 'Slamet Supriyadi'}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    No. Polisi: {transaction.vehiclePlate || 'B 9284 SJA'}
                  </p>
                </div>
              </div>

              {/* Warehouse Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-900 text-white">
                    <tr>
                      <th className="p-2.5 font-bold">No</th>
                      <th className="p-2.5 font-bold">SKU</th>
                      <th className="p-2.5 font-bold">Nama Barang</th>
                      <th className="p-2.5 font-bold text-center">Jumlah Kirim</th>
                      <th className="p-2.5 font-bold">Keterangan Fizik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transaction.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-center">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-semibold">{item.sku}</td>
                        <td className="p-2.5 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {item.quantity} Unit
                        </td>
                        <td className="p-2.5 text-slate-500">Kondisi Baik & Tersegel</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3 Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="font-semibold text-slate-600">Pengirim / Gudang</p>
                  <div className="my-6 h-10 border-b border-slate-300 dark:border-slate-700" />
                  <p className="font-bold">( Bagian Logistik )</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-600">Pengemudi / Courier</p>
                  <div className="my-6 h-10 border-b border-slate-300 dark:border-slate-700" />
                  <p className="font-bold">({transaction.driverName || 'Driver'})</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-600">Penerima Barang</p>
                  <div className="my-6 h-10 border-b border-slate-300 dark:border-slate-700" />
                  <p className="font-bold">( Stempel & TTD )</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
