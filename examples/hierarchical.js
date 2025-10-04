/**
 * Hierarchical Navigation Example
 * Contoh navigasi hierarki wilayah
 */

const WilayahIndonesia = require('../src/index');

const wilayah = new WilayahIndonesia();

console.log('=== Hierarchical Navigation ===\n');

// Get kabupaten in Aceh
console.log('1. Kabupaten/Kota in Aceh (11):');
const kabupatenAceh = wilayah.getKabupaten('11');
console.log(`Total: ${kabupatenAceh.length} kabupaten`);
console.log('First 5:');
kabupatenAceh.slice(0, 5).forEach(k => {
    console.log(`  - ${k.kode}: ${k.nama}`);
});
console.log();

// Get kecamatan in a kabupaten
console.log('2. Kecamatan in Kabupaten Aceh Selatan (11.01):');
const kecamatan = wilayah.getKecamatan('11.01');
console.log(`Total: ${kecamatan.length} kecamatan`);
console.log('First 5:');
kecamatan.slice(0, 5).forEach(k => {
    console.log(`  - ${k.kode}: ${k.nama}`);
});
console.log();

// Get kelurahan in a kecamatan
console.log('3. Kelurahan/Desa in Kecamatan Bakongan (11.01.01):');
const kelurahan = wilayah.getKelurahan('11.01.01');
console.log(`Total: ${kelurahan.length} kelurahan`);
kelurahan.forEach(k => {
    console.log(`  - ${k.kode}: ${k.nama}`);
});
console.log();

// Navigate full hierarchy
console.log('4. Full hierarchy navigation:');
const province = wilayah.findById('11');
console.log(`Provinsi: ${province.nama}`);

const firstKab = wilayah.getKabupaten('11')[0];
console.log(`  └─ Kabupaten: ${firstKab.nama} (${firstKab.kode})`);

const firstKec = wilayah.getKecamatan(firstKab.kode)[0];
console.log(`      └─ Kecamatan: ${firstKec.nama} (${firstKec.kode})`);

const firstKel = wilayah.getKelurahan(firstKec.kode)[0];
console.log(`          └─ Kelurahan: ${firstKel.nama} (${firstKel.kode})`);
console.log();

// Get by level
console.log('5. Statistics by level:');
const stats = wilayah.getStats();
console.log(`  - Provinsi (level 1): ${stats.provinsi}`);
console.log(`  - Kabupaten/Kota (level 2): ${stats.kabupaten}`);
console.log(`  - Kecamatan (level 3): ${stats.kecamatan}`);
console.log(`  - Kelurahan/Desa (level 4): ${stats.kelurahan}`);
console.log(`  - Total: ${stats.total}`);
