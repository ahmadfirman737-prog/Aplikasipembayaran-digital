import React, { useState } from 'react';
import {
  Globe,
  Server,
  Upload,
  Copy,
  CheckCircle2,
  FileCode,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  FolderArchive,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface HostingerDeploymentHubProps {
  lang: Language;
}

export const HostingerDeploymentHub: React.FC<HostingerDeploymentHubProps> = ({ lang }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shared' | 'vps' | 'htaccess' | 'blank_fix'>('blank_fix');

  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Force HTTPS Redirection (Keamanan SSL Hostinger)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. Prevent Direct Access to Internal Config Files
  RewriteRule ^(\\.env|\\.git|composer\\.json|package\\.json) - [F,L,NC]

  # 3. React SPA Fallback Routing (Mencegah Error 404 saat Refresh)
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# GZIP COMPRESSION (Mempercepat Loading Website)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json
</IfModule>

# EXPIRES CACHING (Optimasi Browser Cache)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresDefault "access plus 2 days"
</IfModule>`;

  const ecosystemContent = `module.exports = {
  apps: [
    {
      name: 'solusiniaga-erp',
      script: 'dist/server.cjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between border border-purple-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-xl bg-purple-500/20 p-2.5 text-purple-400 backdrop-blur-sm border border-purple-500/30">
              <Globe className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                  Hostinger Deployment Assistant
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                  Ready Online
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 max-w-xl">
                Panduan lengkap dan berkas konfigurasi siap pakai untuk mengonlinekan aplikasi ini ke **Hostinger Shared Hosting / Cloud / VPS**.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(htaccessContent, 'header-htaccess')}
            className="flex items-center space-x-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500"
          >
            {copiedIndex === 'header-htaccess' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>.htaccess Terpasang & Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Salin .htaccess Hostinger</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EMERGENCY ALERT: BLANK WHITE SCREEN FIX */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-500/40 dark:from-amber-950/40 dark:to-orange-950/40 shadow-sm">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-xl shadow-md shadow-amber-500/20">
            !
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-200 flex items-center space-x-2">
              <span>Mengalami Layar Blank Putih (White Screen) Setelah Deploy di Hostinger?</span>
            </h3>
            <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed max-w-2xl">
              Jangan panik! Ini adalah masalah umum path statis di Vite & React SPA. Kami <strong>sudah menerapkan perbaikannya di kode aplikasi ini (`base: './'`)</strong>. Ikuti 4 langkah verifikasi di bawah agar web Anda langsung tampil sempurna!
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('blank_fix')}
          className="shrink-0 flex items-center space-x-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Lihat 4 Solusi Blank Putih</span>
        </button>
      </div>

      {/* Deploy Steps Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-sm">
            01
          </div>
          <h3 className="mt-3 font-extrabold text-slate-900 dark:text-white text-sm">
            Build Bundle Production
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Jalankan <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono dark:bg-slate-800">npm run build</code> untuk memproses seluruh asset React & Vite menjadi folder <strong className="text-slate-800 dark:text-slate-200">dist/</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 font-bold text-sm">
            02
          </div>
          <h3 className="mt-3 font-extrabold text-slate-900 dark:text-white text-sm">
            Upload ke Hostinger public_html
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Buka Hostinger hPanel &rarr; <strong>File Manager</strong> &rarr; <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-600 font-mono dark:bg-slate-800">public_html</code>. Unggah seluruh isi folder dist di sana.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-sm">
            03
          </div>
          <h3 className="mt-3 font-extrabold text-slate-900 dark:text-white text-sm">
            Pastikan .htaccess Aktif
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            File <strong className="text-slate-800 dark:text-slate-200">.htaccess</strong> mencegah error 404 saat halaman di-refresh dan mengaktifkan SSL HTTPS otomatis.
          </p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'shared'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Server className="h-4 w-4" />
          <span>Hostinger Shared / Cloud Hosting (hPanel)</span>
        </button>

        <button
          onClick={() => setActiveTab('htaccess')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'htaccess'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Konfigurasi .htaccess SPA</span>
        </button>

        <button
          onClick={() => setActiveTab('vps')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'vps'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Hostinger VPS / Node.js Runner</span>
        </button>
      </div>

      {/* Tab Content 1: Shared Hosting */}
      {activeTab === 'shared' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Upload className="h-5 w-5 text-purple-600" />
                <span>Panduan Hostinger Shared / Web Hosting (Paling Direkomendasikan)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Langkah demi langkah mengupload hasil build ke hPanel Hostinger tanpa perlu server kustom.
              </p>
            </div>
            <a
              href="https://hpanel.hostinger.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <span>Buka hPanel Hostinger</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Jalankan Perintah Build di Komputer / Terminal
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Buka terminal di folder project aplikasi dan ketik:
                </p>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-mono text-emerald-400">
                  <span>npm run build</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'cmd-build')}
                    className="text-slate-400 hover:text-white text-[10px]"
                  >
                    {copiedIndex === 'cmd-build' ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Upload File ke Hostinger hPanel File Manager
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  1. Masuk ke <strong>hPanel Hostinger</strong> &rarr; pilih nama domain Anda &rarr; klik <strong>File Manager</strong>.<br />
                  2. Buka folder <strong>`public_html`</strong>.<br />
                  3. Upload seluruh isi yang ada di dalam folder <strong>`dist`</strong> (seperti <code className="font-mono text-purple-600">index.html</code>, folder <code className="font-mono text-purple-600">assets/</code>, dan <code className="font-mono text-purple-600">.htaccess</code>).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Verifikasi File `.htaccess` Terpasang
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Aplikasi ini sudah menyertakan file <code className="font-mono text-indigo-600">public/.htaccess</code> yang akan otomatis ikut ter-copy ke folder dist. File ini wajib ada di Hostinger agar saat user me-refresh halaman tidak kena Error 404.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: .htaccess Config */}
      {activeTab === 'htaccess' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileCode className="h-5 w-5 text-indigo-600" />
                <span>Konfigurasi File `.htaccess` Hostinger (Sudah Dibuat Otomatis)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                File ini disimpan di <code className="font-mono text-indigo-600">public/.htaccess</code> dan otomatis masuk ke folder <code className="font-mono text-indigo-600">dist/</code> saat di-build.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(htaccessContent, 'tab-htaccess')}
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
            >
              {copiedIndex === 'tab-htaccess' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Isi File</span>
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs font-mono text-slate-200 leading-relaxed border border-slate-800 max-h-96">
            <code>{htaccessContent}</code>
          </pre>
        </div>
      )}

      {/* Tab Content 3: VPS / Node Runner */}
      {activeTab === 'vps' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-purple-600" />
                <span>Konfigurasi PM2 (`ecosystem.config.js`) untuk Hostinger VPS / Node Application</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Digunakan untuk menjalankan server Node.js Express secara berkelanjutan di Hostinger VPS.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(ecosystemContent, 'tab-ecosystem')}
              className="flex items-center space-x-2 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-purple-500"
            >
              {copiedIndex === 'tab-ecosystem' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin PM2 Config</span>
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs font-mono text-purple-300 leading-relaxed border border-slate-800">
            <code>{ecosystemContent}</code>
          </pre>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30 text-xs space-y-2">
            <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-600" />
              <span>Perintah Terminal VPS Hostinger:</span>
            </p>
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono space-y-1">
              <p>npm install</p>
              <p>npm run build</p>
              <p>npm install -g pm2</p>
              <p>pm2 start ecosystem.config.js</p>
              <p>pm2 save</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
