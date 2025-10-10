# Nusantara API

[![npm version](https://img.shields.io/npm/v/nusantara-api.svg?style=flat-square)](https://www.npmjs.com/package/nusantara-api)
[![npm downloads](https://img.shields.io/npm/dm/nusantara-api.svg?style=flat-square)](https://www.npmjs.com/package/nusantara-api)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI](https://github.com/ibnushahraa/nusantara-api/actions/workflows/test.yml/badge.svg)](https://github.com/ibnushahraa/nusantara-api/actions)
[![coverage](https://img.shields.io/badge/coverage-80%25-green.svg?style=flat-square)](https://github.com/ibnushahraa/nusantara-api)
[![file size](https://img.shields.io/badge/size-420KB-brightgreen.svg?style=flat-square)](https://github.com/ibnushahraa/nusantara-api)
[![data](https://img.shields.io/badge/data-91K%2B%20regions-orange.svg?style=flat-square)](https://github.com/ibnushahraa/nusantara-api)

🗺️ **Library ringan untuk data wilayah Indonesia** - Provinsi, Kabupaten, Kecamatan, Kelurahan/Desa

Data sesuai **Kepmendagri No 300.2.2-2138 Tahun 2025** dengan **91,162 wilayah** terupdate.

---

## 📦 Instalasi

### Via NPM (Untuk Node.js)

```bash
npm install nusantara-api
```

### Via CDN (Untuk Browser/Frontend)

Tidak perlu instalasi! Langsung fetch data dari CDN.

👉 **[Lihat dokumentasi CDN lengkap](https://github.com/ibnushahraa/nusantara-api/tree/cdn#readme)**

```javascript
const CDN = 'https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data'

// Fetch provinsi (~885 bytes)
const provinces = await fetch(`${CDN}/provinces/index.json`).then(r => r.json())
// Returns: [["11","Aceh"], ["12","Sumatera Utara"], ...]
```

**Keunggulan CDN:**
- ✅ Tidak perlu install npm package
- ✅ Ukuran file sangat kecil (76% lebih kecil)
- ✅ Lazy loading - hanya load yang dibutuhkan
- ✅ Global CDN - cepat di seluruh dunia

## 🚀 Cara Pakai

### Penggunaan Dasar (CommonJS)

```javascript
const WilayahIndonesia = require('nusantara-api');

// Inisialisasi
const wilayah = new WilayahIndonesia();

// Cari berdasarkan kode
const aceh = wilayah.findById('11');
console.log(aceh);
// Output: { kode: '11', nama: 'Aceh' }

// Ambil nama saja
const nama = wilayah.getName('31.71');
console.log(nama);
// Output: "Kota Jakarta Pusat"

// Autocomplete / Pencarian
const hasil = wilayah.autocomplete('jakarta', 5);
console.log(hasil);
// Output: [
//   { kode: '31.71', nama: 'Kota Jakarta Pusat' },
//   { kode: '31.72', nama: 'Kota Jakarta Utara' },
//   ...
// ]
```

### Penggunaan dengan ES Module

```javascript
import WilayahIndonesia from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const jakarta = wilayah.findById('31');
```

### Penggunaan dengan TypeScript

```typescript
import WilayahIndonesia, { Wilayah } from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const result: Wilayah | null = wilayah.findById('11');
```

---

## 🎯 Fitur Lengkap

### 1️⃣ Cari Wilayah

```javascript
// Cari berdasarkan kode
wilayah.findById('11');           // { kode: '11', nama: 'Aceh' }
wilayah.findById('31.71');        // { kode: '31.71', nama: 'Kota Jakarta Pusat' }

// Ambil nama saja
wilayah.getName('11');            // "Aceh"
```

### 2️⃣ Autocomplete & Pencarian

```javascript
// Cari wilayah dengan nama
wilayah.autocomplete('jakarta', 5);
wilayah.autocomplete('bandung', 10);

// Pencarian dengan cache (lebih cepat)
wilayah.search('surabaya', 5);
```

### 3️⃣ Ambil Data Berdasarkan Level

```javascript
// Semua provinsi
const provinsi = wilayah.getProvinces();
console.log(provinsi.length); // 38 provinsi

// Semua kabupaten di Aceh
const kabupaten = wilayah.getKabupaten('11');

// Semua kecamatan di Kabupaten Aceh Selatan
const kecamatan = wilayah.getKecamatan('11.01');

// Semua kelurahan di Kecamatan Bakongan
const kelurahan = wilayah.getKelurahan('11.01.01');
```

### 4️⃣ Navigasi Hierarki

```javascript
// Ambil anak langsung dari suatu wilayah
const children = wilayah.getChildren('11');
// Returns: Semua kabupaten di Aceh

// Ambil berdasarkan level
// Level 1 = Provinsi
// Level 2 = Kabupaten/Kota
// Level 3 = Kecamatan
// Level 4 = Kelurahan/Desa
const allKabupaten = wilayah.getByLevel(2);
```

### 5️⃣ Statistik

```javascript
const stats = wilayah.getStats();
console.log(stats);
// Output:
// {
//   total: 91162,
//   provinsi: 38,
//   kabupaten: 514,
//   kecamatan: 7255,
//   kelurahan: 83355
// }
```

---

## 📋 Daftar Method

| Method | Kegunaan | Contoh |
|--------|----------|--------|
| `findById(kode)` | Cari wilayah berdasarkan kode | `findById('11')` |
| `getName(kode)` | Ambil nama wilayah | `getName('31.71')` |
| `autocomplete(query, limit)` | Pencarian otomatis | `autocomplete('jakarta', 5)` |
| `search(query, limit)` | Pencarian dengan cache | `search('bandung', 10)` |
| `getProvinces()` | Ambil semua provinsi | `getProvinces()` |
| `getKabupaten(kodeProvinsi)` | Ambil kabupaten di provinsi | `getKabupaten('11')` |
| `getKecamatan(kodeKabupaten)` | Ambil kecamatan di kabupaten | `getKecamatan('11.01')` |
| `getKelurahan(kodeKecamatan)` | Ambil kelurahan di kecamatan | `getKelurahan('11.01.01')` |
| `getChildren(kode)` | Ambil wilayah anak langsung | `getChildren('11')` |
| `getByLevel(level)` | Ambil berdasarkan level (1-4) | `getByLevel(2)` |
| `getStats()` | Ambil statistik | `getStats()` |
| `clearCache()` | Bersihkan cache pencarian | `clearCache()` |

---

## 💡 Contoh Penggunaan

### Dropdown Bertingkat (Cascading)

```javascript
// User pilih provinsi
const provinsiKode = '11'; // Aceh
const daftarKabupaten = wilayah.getKabupaten(provinsiKode);

// User pilih kabupaten
const kabupatenKode = '11.01';
const daftarKecamatan = wilayah.getKecamatan(kabupatenKode);

// User pilih kecamatan
const kecamatanKode = '11.01.01';
const daftarKelurahan = wilayah.getKelurahan(kecamatanKode);
```

### Validasi Kode Wilayah

```javascript
function validasiKode(kode) {
    const wilayahData = wilayah.findById(kode);
    return wilayahData !== null;
}

console.log(validasiKode('11'));      // true
console.log(validasiKode('99.99'));   // false
```

### Tampilkan Alamat Lengkap

```javascript
function alamatLengkap(kode) {
    const bagian = kode.split('.');
    const alamat = [];

    for (let i = 1; i <= bagian.length; i++) {
        const kodeSebagian = bagian.slice(0, i).join('.');
        const nama = wilayah.getName(kodeSebagian);
        if (nama) alamat.push(nama);
    }

    return alamat.join(', ');
}

console.log(alamatLengkap('11.01.01.2001'));
// Output: "Keude Bakongan, Bakongan, Kabupaten Aceh Selatan, Aceh"
```

---

## 🛠️ Contoh Integrasi

### Express.js API

Lihat file lengkap di [`examples/express-api.js`](examples/express-api.js)

```javascript
const express = require('express');
const WilayahIndonesia = require('nusantara-api');

const app = express();
const wilayah = new WilayahIndonesia();

app.get('/provinces', (req, res) => {
    const provinces = wilayah.getProvinces();
    res.json({ data: provinces });
});

app.get('/search', (req, res) => {
    const { q, limit = 10 } = req.query;
    const results = wilayah.search(q, parseInt(limit));
    res.json({ data: results });
});

app.listen(3000);
```

---

## ⚡ Performa

- **Ukuran**: Hanya **420 KB** (terkompresi brotli)
- **Data**: 91,162 wilayah lengkap
- **Kecepatan**:
  - Cari by ID: O(1) - instan
  - Autocomplete: O(n) dengan early termination
  - Search (cached): O(1) setelah pencarian pertama
- **Memory**: ~420 KB compressed → ~2.5 MB saat di-load
- **Load time**: ~100-200ms (otomatis decompress)

---

## ✨ Keunggulan

✅ **Lengkap** - Data terbaru sesuai Kepmendagri 2025 dengan 91K+ wilayah

✅ **Ringan** - Hanya 420 KB (brotli compressed)

✅ **Cepat** - Pencarian O(1) untuk find by ID

✅ **Modern** - Support CommonJS, ES Module, TypeScript

✅ **Mudah** - API sederhana dan jelas

✅ **Fleksibel** - Bisa untuk Node.js, Express, NestJS, Fastify, dll

✅ **No Dependencies** - Pure Node.js built-in modules

✅ **Teruji** - 68 unit tests dengan coverage 80%

---

## 📚 Dokumentasi Lengkap

- [Contoh Penggunaan](examples/README.md)
- [CHANGELOG](CHANGELOG.md)
- [TypeScript Definitions](index.d.ts)

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

---

## 📝 Lisensi

MIT License - Bebas digunakan untuk proyek pribadi maupun komersial.

---

## 🙏 Credits

Data wilayah dari [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah)

---

## 💬 Support

Jika ada pertanyaan atau masalah, silakan buat [issue di GitHub](https://github.com/ibnushahraa/nusantara-api/issues).

---

**Dibuat dengan ❤️ untuk developer Indonesia**
