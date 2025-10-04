# Nusantara API

🇮🇩 Lightweight library untuk data wilayah Indonesia (Provinsi, Kabupaten, Kecamatan, Kelurahan/Desa).

Data sesuai **Kepmendagri No 300.2.2-2138 Tahun 2025**.

## 📦 Installation

```bash
npm install nusantara-api
```

## 📊 File Size

Hanya **524 KB** (brotli compressed) untuk 80,000+ data wilayah!

## 🚀 Usage

```javascript
const WilayahIndonesia = require('nusantara-api');

// Initialize (auto-detect & decompress)
const wilayah = new WilayahIndonesia();

// Find by ID
const aceh = wilayah.findById('11');
console.log(aceh); // { kode: '11', nama: 'Aceh' }

// Get nama only
const nama = wilayah.getName('31.71');
console.log(nama); // "Kota Jakarta Pusat"

// Autocomplete search
const results = wilayah.autocomplete('jakarta', 5);
console.log(results);
// [
//   { kode: '31.71', nama: 'Kota Jakarta Pusat' },
//   { kode: '31.72', nama: 'Kota Jakarta Utara' },
//   ...
// ]

// Get all provinces
const provinces = wilayah.getProvinces();
console.log(provinces.length); // 38

// Get kabupaten in a province
const kabupaten = wilayah.getKabupaten('11'); // Aceh
console.log(kabupaten.length); // 23

// Get kecamatan in kabupaten
const kecamatan = wilayah.getKecamatan('11.01');

// Get kelurahan/desa in kecamatan
const kelurahan = wilayah.getKelurahan('11.01.01');

// Statistics
const stats = wilayah.getStats();
console.log(stats);
// {
//   total: 87000+,
//   provinsi: 38,
//   kabupaten: 514,
//   kecamatan: 7200+,
//   kelurahan: 80000+
// }
```

## 📖 API Reference

### `findById(kode)`
Find wilayah by kode. Returns `{kode, nama}` or `null`.

**Example:**
```javascript
wilayah.findById('11'); // { kode: '11', nama: 'Aceh' }
```

### `getName(kode)`
Get nama wilayah by kode. Returns string or `null`.

**Example:**
```javascript
wilayah.getName('31.71'); // "Kota Jakarta Pusat"
```

### `autocomplete(query, limit = 10)`
Search wilayah by nama. Returns array of `{kode, nama}`.

**Example:**
```javascript
wilayah.autocomplete('bandung', 5);
```

### `search(query, limit = 10)`
Search with caching. Same as autocomplete but faster for repeated queries.

### `getProvinces()`
Get all provinces (level 1).

**Example:**
```javascript
const provinces = wilayah.getProvinces();
```

### `getKabupaten(provinceKode)`
Get all kabupaten/kota in a province.

**Example:**
```javascript
const kabupaten = wilayah.getKabupaten('11'); // Kabupaten di Aceh
```

### `getKecamatan(kabupatenKode)`
Get all kecamatan in a kabupaten.

**Example:**
```javascript
const kecamatan = wilayah.getKecamatan('11.01');
```

### `getKelurahan(kecamatanKode)`
Get all kelurahan/desa in a kecamatan.

**Example:**
```javascript
const kelurahan = wilayah.getKelurahan('11.01.01');
```

### `getByLevel(level)`
Get wilayah by level (1=provinsi, 2=kab/kota, 3=kecamatan, 4=kelurahan).

**Example:**
```javascript
const allKabupaten = wilayah.getByLevel(2);
```

### `getChildren(parentKode)`
Get direct children of a wilayah.

**Example:**
```javascript
const children = wilayah.getChildren('11');
```

### `getStats()`
Get statistics.

**Example:**
```javascript
const stats = wilayah.getStats();
```

### `clearCache()`
Clear search cache.

## ⚡ Performance

- **Find by ID**: O(1) - instant lookup
- **Autocomplete**: O(n) - with early termination
- **Search (cached)**: O(1) - after first search
- **Memory**: ~524 KB compressed → ~2-3 MB in memory
- **Load time**: ~100-200ms (auto-decompress brotli)

## 🎯 Features

✅ **Lightweight** - Only 524 KB (brotli compressed)
✅ **Fast** - Find by ID in O(1)
✅ **Complete** - 80,000+ wilayah data
✅ **Auto-decompress** - Support brotli & gzip
✅ **Search & Autocomplete** - Built-in search with cache
✅ **Hierarchical** - Navigate provinsi → kabupaten → kecamatan → kelurahan
✅ **No dependencies** - Pure Node.js (fs, zlib)
✅ **Up-to-date** - Data sesuai Kepmendagri 2025

## 📝 License

MIT

## 🙏 Credits

Data dari [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah)
