/**
 * Wilayah Indonesia Library
 * Lightweight library untuk data wilayah Indonesia
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class WilayahIndonesia {
    constructor(options = {}) {
        this.dataFormat = options.format || 'array';
        this.regions = null;
        this.map = null;
        this.searchCache = new Map();

        this._loadData();
    }

    _loadData() {
        const dataPath = path.join(__dirname, 'data', 'wilayah-' + this.dataFormat + '.json');
        const brPath = dataPath + '.br';
        const gzPath = dataPath + '.gz';

        let data;

        if (fs.existsSync(brPath)) {
            console.log('Loading from brotli...');
            const compressed = fs.readFileSync(brPath);
            data = JSON.parse(zlib.brotliDecompressSync(compressed).toString());
        } else if (fs.existsSync(gzPath)) {
            console.log('Loading from gzip...');
            const compressed = fs.readFileSync(gzPath);
            data = JSON.parse(zlib.gunzipSync(compressed).toString());
        } else {
            console.log('Loading from raw JSON...');
            data = require(dataPath);
        }

        // Handle both formats: split-array {k:[...], n:[...]} or array [[k,n],...]
        if (data.k && data.n && Array.isArray(data.k) && Array.isArray(data.n)) {
            // Split-array format (optimized)
            this.regions = data.k.map((k, i) => [k, data.n[i]]);
            this.map = {};
            data.k.forEach((k, i) => {
                this.map[k] = data.n[i];
            });
        } else if (Array.isArray(data)) {
            // Array format (legacy)
            this.regions = data;
            this.map = {};
            data.forEach(([k, n]) => {
                this.map[k] = n;
            });
        } else {
            // Object format {kode: nama, ...}
            this.map = data;
            this.regions = Object.entries(data).map(([k, n]) => [k, n]);
        }

        console.log('Loaded ' + this.regions.length + ' regions');
    }

    findById(kode) {
        const nama = this.map[kode];
        return nama ? { kode, nama } : null;
    }

    getName(kode) {
        return this.map[kode] || null;
    }

    autocomplete(query, limit = 10) {
        if (!query || query.length < 2) return [];

        const q = query.toLowerCase();
        const results = [];

        for (const [kode, nama] of this.regions) {
            if (results.length >= limit) break;
            if (nama.toLowerCase().includes(q)) {
                results.push({ kode, nama });
            }
        }

        return results;
    }

    search(query, limit = 10) {
        if (!query) return [];

        const cacheKey = query + ':' + limit;
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }

        const results = this.autocomplete(query, limit);
        this.searchCache.set(cacheKey, results);

        return results;
    }

    getByLevel(level) {
        return this.regions
            .filter(([kode]) => kode.split('.').length === level)
            .map(([kode, nama]) => ({ kode, nama }));
    }

    getChildren(parentKode) {
        const prefix = parentKode + '.';
        const targetLevel = parentKode.split('.').length + 1;

        return this.regions
            .filter(([kode]) =>
                kode.startsWith(prefix) &&
                kode.split('.').length === targetLevel
            )
            .map(([kode, nama]) => ({ kode, nama }));
    }

    getProvinces() {
        return this.getByLevel(1);
    }

    getKabupaten(provinceKode) {
        return this.getChildren(provinceKode);
    }

    getKecamatan(kabupatenKode) {
        return this.getChildren(kabupatenKode);
    }

    getKelurahan(kecamatanKode) {
        return this.getChildren(kecamatanKode);
    }

    getStats() {
        return {
            total: this.regions.length,
            provinsi: this.getByLevel(1).length,
            kabupaten: this.getByLevel(2).length,
            kecamatan: this.getByLevel(3).length,
            kelurahan: this.getByLevel(4).length
        };
    }

    clearCache() {
        this.searchCache.clear();
    }
}

module.exports = WilayahIndonesia;
