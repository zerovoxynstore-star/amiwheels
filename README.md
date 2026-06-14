# AmiWheels Starter

Starter web mobile-first untuk toko die-cast AmiWheels.

## Fitur
- Marketplace mobile-first
- Tambah koleksi baru untuk dijual
- Kategori: Standar, Premium, Track Set, Display & Blister, Rare
- Stok otomatis
- Jika stok 0, produk pindah ke bagian Sold Out paling bawah
- Tombol Terjual 1
- Tombol Restock
- Tombol Chat WhatsApp
- Data tersimpan di browser memakai localStorage

## Cara pakai lokal
Cukup buka `index.html` di browser.

## Cara upload ke GitHub
1. Buat repository baru: `amiwheels`
2. Upload semua file ini
3. Deploy ke Cloudflare Pages
4. Output folder: `/`
5. Framework preset: None / Static HTML

## Catatan
Ini versi tanpa database dulu. Cocok untuk validasi desain dan alur toko.
Nanti bisa disambungkan ke Cloudflare D1.


## Update Fitur History Penjualan
- Setiap klik `Terjual 1`, sistem otomatis membuat bukti transaksi.
- Ada menu `Bukti Pembelian / History` di halaman Akun.
- History berisi nomor invoice, tanggal, produk, qty, harga, total, dan status.
- Ada tombol `Copy Bukti` untuk menyalin bukti pembelian.
- Ada tombol `Export Bukti` untuk download CSV.
