/**
 * Basic Usage Example
 * Contoh penggunaan dasar Nusantara API
 */

const WilayahIndonesia = require('../src/index');

// Initialize
const wilayah = new WilayahIndonesia();

console.log('=== Basic Usage ===\n');

// Find by ID
console.log('1. Find Aceh by ID:');
const aceh = wilayah.findById('11');
console.log(aceh);
console.log();

// Find Jakarta Pusat
console.log('2. Find Jakarta Pusat:');
const jakpus = wilayah.findById('31.71');
console.log(jakpus);
console.log();

// Get nama only
console.log('3. Get nama only:');
const nama = wilayah.getName('32');
console.log('Kode 32:', nama);
console.log();

// Invalid ID
console.log('4. Invalid ID:');
const invalid = wilayah.findById('99.99');
console.log('Kode 99.99:', invalid);
console.log();

// Get provinces
console.log('5. Get all provinces:');
const provinces = wilayah.getProvinces();
console.log(`Total provinces: ${provinces.length}`);
console.log('First 5 provinces:');
provinces.slice(0, 5).forEach(p => {
    console.log(`  - ${p.kode}: ${p.nama}`);
});
