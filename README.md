# Nusantara API - CDN Data

Data wilayah Indonesia yang dioptimalkan untuk CDN (Content Delivery Network).

## CDN URL Base

```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/
```

## Struktur Data

```
data/
├── provinces/
│   └── index.json              # Daftar provinsi
├── cities/
│   └── {provinsi_code}.json    # Daftar kabupaten/kota per provinsi
├── districts/
│   └── {kota_code}.json        # Daftar kecamatan per kabupaten/kota
└── villages/
    └── {kecamatan_code}.json   # Daftar kelurahan per kecamatan
```

## Format Data

Data menggunakan format array untuk efisiensi ukuran:

```json
[
  ["11", "Aceh"],
  ["12", "Sumatera Utara"],
  ...
]
```

Format: `[kode, nama]`

## Penggunaan

### 1. Ambil Daftar Provinsi

```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/provinces/index.json
```

### 2. Ambil Daftar Kabupaten/Kota

```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/cities/{provinsi_code}.json
```

Contoh:
```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/cities/11.json
```

### 3. Ambil Daftar Kecamatan

```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/districts/{kota_code}.json
```

Contoh:
```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/districts/11.01.json
```

### 4. Ambil Daftar Kelurahan

```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/villages/{kecamatan_code}.json
```

Contoh:
```
https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/villages/11.01.01.json
```

## Contoh Implementasi

```javascript
// Ambil daftar provinsi
fetch('https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/provinces/index.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(([code, name]) => {
      console.log(`${code} - ${name}`);
    });
  });

// Ambil kabupaten/kota dari provinsi Aceh (11)
fetch('https://cdn.jsdelivr.net/gh/ibnushahraa/nusantara-api@cdn/data/cities/11.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(([code, name]) => {
      console.log(`${code} - ${name}`);
    });
  });
```

## Statistik

- **Total Provinsi**: 38
- **Total Kabupaten/Kota**: 514
- **Total Kecamatan**: 7,265
- **Total Kelurahan**: 83,345
- **Total Files**: 7,837
- **Total Size**: ~2.62 MB (76% lebih kecil dari versi sebelumnya)

## Optimasi

- Nama wilayah sudah dibersihkan dari prefix "Kabupaten", "Kota", "Provinsi"
- Format JSON menggunakan array alih-alih object untuk menghemat ukuran
- Data dipecah per wilayah untuk lazy loading
- Cocok untuk dropdown cascading pada form registrasi
- Disajikan melalui CDN untuk akses cepat global
