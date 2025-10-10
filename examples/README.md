# Contoh Penggunaan

Kumpulan contoh script untuk menggunakan Nusantara API.

## Cara Menjalankan

### Contoh Node.js (CommonJS)

```bash
cd examples
node basic.js
node search.js
node hierarchical.js
node express-api.js
```

### Contoh ES Modules

```javascript
// example.mjs
import WilayahIndonesia from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const aceh = wilayah.findById('11');
console.log(aceh);
```

```bash
node example.mjs
```

### Contoh TypeScript

```typescript
// example.ts
import WilayahIndonesia, { Wilayah } from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const result: Wilayah | null = wilayah.findById('11');
console.log(result);
```

---

## Daftar Contoh

### 1. basic.js
Contoh penggunaan dasar:
- Cari wilayah berdasarkan kode
- Ambil nama wilayah
- Ambil semua provinsi
- Menangani kode yang tidak valid

```bash
node basic.js
```

### 2. search.js
Contoh pencarian dan autocomplete:
- Pencarian berdasarkan nama
- Pencarian case-insensitive
- Pencarian dengan cache (lebih cepat)
- Menangani query kosong dan hasil tidak ditemukan

```bash
node search.js
```

### 3. hierarchical.js
Contoh navigasi hierarki wilayah:
- Navigasi provinsi → kabupaten → kecamatan → kelurahan
- Ambil wilayah anak berdasarkan kode parent
- Ambil statistik berdasarkan level
- Navigasi pohon hierarki lengkap

```bash
node hierarchical.js
```

### 4. express-api.js
REST API lengkap dengan Express.js:
- `GET /provinces` - Ambil semua provinsi
- `GET /search?q=query` - Cari wilayah
- `GET /wilayah/:kode` - Ambil berdasarkan kode
- `GET /kabupaten/:provinceKode` - Ambil kabupaten
- Dan lainnya...

**Install dependensi:**
```bash
npm install express
```

**Jalankan:**
```bash
node express-api.js
```

**Test API:**
```bash
curl http://localhost:3000/provinces
curl http://localhost:3000/search?q=jakarta&limit=5
curl http://localhost:3000/wilayah/11
```

---

## Contoh Kasus Penggunaan

### 1. Autocomplete di Form

```javascript
const wilayah = new WilayahIndonesia();

// User mengetik "jak..."
const saran = wilayah.autocomplete('jak', 5);
// Hasil: Wilayah yang mengandung kata "jak" (Jakarta, dll)
```

### 2. Dropdown Bertingkat (Cascading)

```javascript
// User memilih provinsi
const kodeProvinsi = '11'; // Aceh
const daftarKabupaten = wilayah.getKabupaten(kodeProvinsi);

// User memilih kabupaten
const kodeKabupaten = '11.01';
const daftarKecamatan = wilayah.getKecamatan(kodeKabupaten);

// User memilih kecamatan
const kodeKecamatan = '11.01.01';
const daftarKelurahan = wilayah.getKelurahan(kodeKecamatan);
```

### 3. Validasi Kode Wilayah

```javascript
function validasiKode(kode) {
    const wilayahData = wilayah.findById(kode);
    return wilayahData !== null;
}

console.log(validasiKode('11'));      // true - Aceh ada
console.log(validasiKode('99.99'));   // false - Kode tidak valid
```

### 4. Tampilkan Alamat Lengkap

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

### 5. Filter Wilayah Berdasarkan Level

```javascript
// Ambil semua provinsi
const provinsi = wilayah.getByLevel(1);
console.log(`Total provinsi: ${provinsi.length}`); // 38

// Ambil semua kabupaten/kota
const kabupaten = wilayah.getByLevel(2);
console.log(`Total kabupaten/kota: ${kabupaten.length}`); // 514

// Ambil semua kecamatan
const kecamatan = wilayah.getByLevel(3);
console.log(`Total kecamatan: ${kecamatan.length}`); // 7255

// Ambil semua kelurahan/desa
const kelurahan = wilayah.getByLevel(4);
console.log(`Total kelurahan/desa: ${kelurahan.length}`); // 83355
```

### 6. Pencarian dengan Cache

```javascript
// Pencarian pertama (membangun cache)
console.time('First search');
const hasil1 = wilayah.search('jakarta', 10);
console.timeEnd('First search'); // ~50ms

// Pencarian kedua (dari cache)
console.time('Cached search');
const hasil2 = wilayah.search('jakarta', 10);
console.timeEnd('Cached search'); // ~1ms (lebih cepat!)

// Bersihkan cache jika perlu
wilayah.clearCache();
```

---

## Tips Penggunaan

1. **Inisialisasi Sekali**: Buat instance `WilayahIndonesia` sekali saja, lalu gunakan berkali-kali.

```javascript
// ✅ Baik
const wilayah = new WilayahIndonesia();
wilayah.findById('11');
wilayah.findById('31');

// ❌ Tidak efisien
new WilayahIndonesia().findById('11');
new WilayahIndonesia().findById('31');
```

2. **Gunakan Cache untuk Pencarian**: Method `search()` lebih cepat dari `autocomplete()` untuk query yang sama.

3. **Batasi Hasil Autocomplete**: Gunakan parameter `limit` untuk performa lebih baik.

```javascript
// Hanya ambil 5 hasil pertama
wilayah.autocomplete('jakarta', 5);
```

4. **Validasi Input User**: Selalu validasi kode wilayah dari user.

```javascript
const userInput = '11.01';
if (wilayah.findById(userInput)) {
    // Kode valid, lanjutkan
} else {
    // Kode tidak valid, tampilkan error
}
```

---

## Pertanyaan & Bantuan

Jika ada pertanyaan atau menemukan bug, silakan buat [issue di GitHub](https://github.com/ibnushahraa/nusantara-api/issues).
