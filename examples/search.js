/**
 * Search and Autocomplete Example
 * Contoh pencarian dan autocomplete
 */

const WilayahIndonesia = require('../src/index');

const wilayah = new WilayahIndonesia();

console.log('=== Search & Autocomplete ===\n');

// Autocomplete search
console.log('1. Search "jakarta":');
const jakartaResults = wilayah.autocomplete('jakarta', 5);
jakartaResults.forEach(r => {
    console.log(`  - ${r.kode}: ${r.nama}`);
});
console.log();

// Search with different query
console.log('2. Search "bandung":');
const bandungResults = wilayah.autocomplete('bandung', 5);
bandungResults.forEach(r => {
    console.log(`  - ${r.kode}: ${r.nama}`);
});
console.log();

// Case insensitive
console.log('3. Case insensitive search (SURABAYA):');
const surabayaResults = wilayah.autocomplete('SURABAYA', 3);
surabayaResults.forEach(r => {
    console.log(`  - ${r.kode}: ${r.nama}`);
});
console.log();

// Cached search (faster on repeated queries)
console.log('4. Cached search:');
console.time('First search');
wilayah.search('medan', 5);
console.timeEnd('First search');

console.time('Cached search');
const cachedResults = wilayah.search('medan', 5);
console.timeEnd('Cached search');
console.log('Results:');
cachedResults.forEach(r => {
    console.log(`  - ${r.kode}: ${r.nama}`);
});
console.log();

// Empty query
console.log('5. Empty query:');
const emptyResults = wilayah.autocomplete('', 5);
console.log('Results:', emptyResults);
console.log();

// No results
console.log('6. No results (searching for "xyz123"):');
const noResults = wilayah.autocomplete('xyz123', 5);
console.log('Results:', noResults);
