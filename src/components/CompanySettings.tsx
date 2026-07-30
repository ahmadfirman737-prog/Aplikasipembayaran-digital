import React, { useState, useRef } from 'react';
import {
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Save,
  CheckCircle2,
  Printer,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { CompanyProfile } from '../types';
import { Language, translations } from '../i18n/translations';

interface CompanySettingsProps {
  companyProfile: CompanyProfile;
  onSaveProfile: (updatedProfile: CompanyProfile) => void;
  lang: Language;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  companyProfile,
  onSaveProfile,
  lang,
}) => {
  const t = translations[lang];

  const [form, setForm] = useState<CompanyProfile>({ ...companyProfile });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiPresets = ['🏢', '🏭', '🏬', '📦', '🛒', '⚡', '🌟', '💎'];

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar, maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({ ...prev, logo: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400 backdrop-blur-sm border border-indigo-500/30">
              <Building2 className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Pengaturan Profil Perusahaan
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-300 max-w-xl">
            Ubah nama perusahaan, logo, alamat, dan nomor telepon. Informasi ini secara otomatis digunakan pada Kop Faktur Invoice, Surat Jalan, dan Dokumen Laporan.
          </p>
        </div>

        {showSaveSuccess && (
          <div className="flex items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 animate-pulse">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profil Perusahaan Berhasil Diperbarui!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Settings Form Column */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5"
          >
            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Informasi Utama Identitas Perusahaan</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Data akan langsung memperbarui header aplikasi dan cetakan PDF.
              </p>
            </div>

            {/* Nama Perusahaan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Perusahaan / Bisnis <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: PT Solusi Niaga Nusantara"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Logo Selector / File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Logo Perusahaan (Unggah File / Preset Emoji / URL)
              </label>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                onChange={handleLogoFileChange}
                className="hidden"
              />

              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-12 items-center">
                {/* Logo Preview Badge */}
                <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80 text-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-indigo-50 text-2xl font-black text-indigo-600 dark:border-slate-700 dark:bg-indigo-950 shadow-sm">
                    {form.logo.startsWith('http') || form.logo.startsWith('data:') ? (
                      <img src={form.logo} alt="Logo Perusahaan" className="h-full w-full object-cover" />
                    ) : (
                      <span>{form.logo || '🏢'}</span>
                    )}
                  </div>
                  <span className="mt-1.5 text-[10px] font-semibold text-slate-500">
                    {form.logo.startsWith('data:')
                      ? 'Gambar Terunggah'
                      : form.logo.startsWith('http')
                      ? 'Logo dari URL'
                      : 'Emoji Preset'}
                  </span>
                </div>

                {/* Upload Action Box */}
                <div className="sm:col-span-9 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Choose File / Pilih Logo dari HP & Komputer</span>
                    </button>

                    {(form.logo.startsWith('http') || form.logo.startsWith('data:')) && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logo: '🏢' })}
                        className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Hapus Gambar</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Format yang didukung: PNG, JPG, SVG, WebP (Maksimal 5MB).
                  </p>

                  {/* Preset Emojis & URL */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Atau Pilih Preset Icon / Masukkan URL Gambar:
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {emojiPresets.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setForm({ ...form, logo: emoji })}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-all ${
                            form.logo === emoji
                              ? 'border-indigo-600 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={form.logo}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })}
                      placeholder="Atau tempelkan URL logo (https://...)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alamat Perusahaan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Alamat Kantor Utama / Gudang <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Jl. Rasuna Said Blok X-5 No. 18, Jakarta..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* No Telepon & Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  No. Telepon / HP <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(021) 555-8900 atau 0812-XXXX-XXXX"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Operasional
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="info@perusahaan.co.id"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Website & NPWP */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Website Resmi
                </label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="www.perusahaan.co.id"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nomor NPWP Perusahaan
                </label>
                <div className="relative mt-1">
                  <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.npwp || ''}
                    onChange={(e) => setForm({ ...form, npwp: e.target.value })}
                    placeholder="01.234.567.8-012.000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Slogan / Tagline Bisnis
              </label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Contoh: Solusi Terbaik Distribusi & Logistik"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Pratinjau Live Dokumen Invoice</span>
              </h3>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Otomatis Sync
              </span>
            </div>

            {/* Simulated Invoice Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs space-y-4">
              {/* Header Box */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 text-white font-black text-base shadow-md">
                      {form.logo.startsWith('http') || form.logo.startsWith('data:') ? (
                        <img src={form.logo} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <span>{form.logo || '🏢'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">
                        {form.name || 'NAMA PERUSAHAAN'}
                      </h4>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {form.tagline || 'Tagline Perusahaan'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                    {form.address || 'Alamat Perusahaan'}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Telp: {form.phone || '-'} &bull; Email: {form.email || '-'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    FAKTUR LUNAS
                  </span>
                  <p className="mt-2 font-mono font-bold text-slate-900 dark:text-white">
                    INV/2026/001
                  </p>
                </div>
              </div>

              {/* Sample Table */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex justify-between font-bold text-[11px] text-slate-700 dark:text-slate-300 border-b pb-1.5 dark:border-slate-700">
                  <span>Nama Barang</span>
                  <span>Subtotal</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Monitor Gaming LED 27 Inci (x2)</span>
                  <span>Rp 7.000.000</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Keyboard Mekanik RGB (x5)</span>
                  <span>Rp 4.250.000</span>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>NPWP: {form.npwp || '-'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {form.website || ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
