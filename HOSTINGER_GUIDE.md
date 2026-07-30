# Panduan Lengkap Deploy Aplikasi Ke Hostinger

Panduan ini berisi langkah-langkah praktis untuk mengonlinekan sistem ERP & Penjualan ini di **Hostinger** (Web Hosting / Cloud Hosting / VPS).

---

## OPSI A: Deploy ke Hostinger Web Hosting / Shared Hosting (Paling Mudah)

Metode ini cocok untuk paket Hostinger Single, Premium, Business, atau Cloud Hosting (menggunakan **hPanel File Manager** atau **FTP**).

### Langkah 1: Buat Build Aplikasi Production
Jalankan perintah berikut di terminal komputer Anda:
```bash
npm run build
```
Perintah ini akan menghasilkan folder **`dist/`** yang berisi seluruh file HTML, JS, CSS, dan file `.htaccess` dari folder `public/`.

### Langkah 2: Upload File ke Hostinger hPanel
1. Login ke **Hostinger hPanel** (https://hpanel.hostinger.com).
2. Pilih domain Anda dan klik **File Manager** (`public_html`).
3. Masuk ke folder `public_html`.
4. Unggah (Upload) seluruh isi di dalam folder **`dist/`** (bukan folder `dist`-nya, tapi isi file di dalamnya) ke `public_html`.
5. Pastikan file **`.htaccess`** sudah terunggah di `public_html`. (Di File Manager Hostinger, pastikan opsi "Show Hidden Files" dicentang).

### Isi File `.htaccess` (Sudah Tersedia di public/.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect HTTP to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # React SPA Fallback Routing (Mencegah Error 404 saat Refresh)
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Langkah 3: Uji Coba Website
Buka domain Anda (misal `https://namadomainanda.com`).
Coba berpindah menu dan lakukan refresh halaman untuk memastikan tidak ada error 404.

---

## OPSI B: Deploy ke Hostinger Node.js Application / VPS

Jika Anda ingin menggunakan Node.js Express Server backend (`server.ts` / `dist/server.cjs`):

### Langkah 1: Persiapan di Hostinger VPS / Node Application
1. Buka Hostinger hPanel -> **Node.js** atau SSH ke VPS Anda.
2. Pastikan versi **Node.js 18+** atau **20+** terinstall.

### Langkah 2: Upload Source Code & Build
1. Upload seluruh folder project ke server Hostinger (via Git Deployment atau File Manager).
2. Masuk ke terminal VPS / SSH:
```bash
cd /home/user/public_html/
npm install
npm run build
```

### Langkah 3: Jalankan dengan PM2 Process Manager
File `ecosystem.config.js` sudah kami sediakan di root folder project.
Jalankan perintah:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Troubleshooting FAQ Hostinger

* **Q: Mengapa saat di-refresh halaman muncul Error 404 Not Found?**
  * **A:** Pastikan file `.htaccess` sudah diupload ke folder `public_html` dan modul Apache `mod_rewrite` aktif di Hostinger.

* **Q: Bagaimana jika SSL HTTPS belum aktif?**
  * **A:** Aktifkan Gratis SSL di Hostinger hPanel -> **Security** -> **SSL** -> **Install SSL**.

* **Q: Di mana memasukkan API Key Gemini jika menggunakan AI?**
  * **A:** Buat file `.env` di folder root di Hostinger dan masukkan `GEMINI_API_KEY=AIzaSy...`.

---
*Dibuat khusus untuk Sistem Penjualan & Gudang Solusi Niaga Nusantara - Hostinger Deployment Ready.*
