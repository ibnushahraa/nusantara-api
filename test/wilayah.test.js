const WilayahIndonesia = require('../src/index');

describe('WilayahIndonesia', () => {
    let wilayah;

    beforeAll(() => {
        wilayah = new WilayahIndonesia();
    });

    describe('Data Loading', () => {
        test('should load data successfully', () => {
            expect(wilayah.regions).toBeDefined();
            expect(wilayah.map).toBeDefined();
            expect(wilayah.regions.length).toBeGreaterThan(0);
        });

        test('should have valid data structure', () => {
            const firstRegion = wilayah.regions[0];
            expect(Array.isArray(firstRegion)).toBe(true);
            expect(firstRegion).toHaveLength(2);
            expect(typeof firstRegion[0]).toBe('string'); // kode
            expect(typeof firstRegion[1]).toBe('string'); // nama
        });
    });

    describe('findById()', () => {
        test('should find Aceh province by id', () => {
            const result = wilayah.findById('11');
            expect(result).toEqual({
                kode: '11',
                nama: 'Aceh'
            });
        });

        test('should find Jakarta Pusat by id', () => {
            const result = wilayah.findById('31.71');
            expect(result).toBeDefined();
            expect(result.kode).toBe('31.71');
            expect(result.nama).toContain('Jakarta');
        });

        test('should return null for invalid id', () => {
            const result = wilayah.findById('99.99.99');
            expect(result).toBeNull();
        });

        test('should handle empty string', () => {
            const result = wilayah.findById('');
            expect(result).toBeNull();
        });
    });

    describe('getName()', () => {
        test('should get name by kode', () => {
            const nama = wilayah.getName('11');
            expect(nama).toBe('Aceh');
        });

        test('should return null for invalid kode', () => {
            const nama = wilayah.getName('invalid');
            expect(nama).toBeNull();
        });
    });

    describe('autocomplete()', () => {
        test('should find regions containing "jakarta"', () => {
            const results = wilayah.autocomplete('jakarta');
            expect(results.length).toBeGreaterThan(0);
            results.forEach(r => {
                expect(r.nama.toLowerCase()).toContain('jakarta');
            });
        });

        test('should limit results', () => {
            const results = wilayah.autocomplete('jakarta', 3);
            expect(results.length).toBeLessThanOrEqual(3);
        });

        test('should be case insensitive', () => {
            const lower = wilayah.autocomplete('aceh');
            const upper = wilayah.autocomplete('ACEH');
            expect(lower.length).toBe(upper.length);
        });

        test('should return empty array for short query', () => {
            const results = wilayah.autocomplete('a');
            expect(results).toEqual([]);
        });

        test('should return empty array for empty query', () => {
            const results = wilayah.autocomplete('');
            expect(results).toEqual([]);
        });
    });

    describe('search()', () => {
        test('should search and cache results', () => {
            const results1 = wilayah.search('bandung', 5);
            const results2 = wilayah.search('bandung', 5);

            expect(results1).toEqual(results2);
            expect(results1.length).toBeGreaterThan(0);
        });

        test('should return different results for different limits', () => {
            const results1 = wilayah.search('surabaya', 2);
            const results2 = wilayah.search('surabaya', 5);

            expect(results1.length).toBe(2);
            expect(results2.length).toBeGreaterThanOrEqual(2);
        });

        test('should return empty array for empty query', () => {
            const results = wilayah.search('');
            expect(results).toEqual([]);
        });
    });

    describe('getProvinces()', () => {
        test('should get all provinces', () => {
            const provinces = wilayah.getProvinces();
            expect(provinces.length).toBeGreaterThan(30);
            expect(provinces.length).toBeLessThan(40);
        });

        test('should have valid province structure', () => {
            const provinces = wilayah.getProvinces();
            provinces.forEach(p => {
                expect(p).toHaveProperty('kode');
                expect(p).toHaveProperty('nama');
                expect(p.kode.split('.')).toHaveLength(1);
            });
        });

        test('should include major provinces', () => {
            const provinces = wilayah.getProvinces();
            const names = provinces.map(p => p.nama);

            expect(names).toContain('Aceh');
            expect(names.some(n => n.includes('Jakarta'))).toBe(true);
            expect(names.some(n => n.includes('Jawa Barat'))).toBe(true);
        });
    });

    describe('getKabupaten()', () => {
        test('should get kabupaten in Aceh', () => {
            const kabupaten = wilayah.getKabupaten('11');
            expect(kabupaten.length).toBeGreaterThan(0);
            kabupaten.forEach(k => {
                expect(k.kode).toMatch(/^11\.\d+$/);
            });
        });

        test('should get kabupaten in DKI Jakarta', () => {
            const kabupaten = wilayah.getKabupaten('31');
            expect(kabupaten.length).toBeGreaterThan(0);
            kabupaten.forEach(k => {
                expect(k.kode).toMatch(/^31\.\d+$/);
            });
        });

        test('should return empty array for invalid province', () => {
            const kabupaten = wilayah.getKabupaten('99');
            expect(kabupaten).toEqual([]);
        });
    });

    describe('getKecamatan()', () => {
        test('should get kecamatan in a kabupaten', () => {
            const kecamatan = wilayah.getKecamatan('11.01');
            expect(kecamatan.length).toBeGreaterThan(0);
            kecamatan.forEach(k => {
                expect(k.kode).toMatch(/^11\.01\.\d+$/);
            });
        });

        test('should return empty array for invalid kabupaten', () => {
            const kecamatan = wilayah.getKecamatan('99.99');
            expect(kecamatan).toEqual([]);
        });
    });

    describe('getKelurahan()', () => {
        test('should get kelurahan in a kecamatan', () => {
            const kelurahan = wilayah.getKelurahan('11.01.01');
            expect(kelurahan.length).toBeGreaterThan(0);
            kelurahan.forEach(k => {
                expect(k.kode).toMatch(/^11\.01\.01\.\d+$/);
            });
        });

        test('should return empty array for invalid kecamatan', () => {
            const kelurahan = wilayah.getKelurahan('99.99.99');
            expect(kelurahan).toEqual([]);
        });
    });

    describe('getByLevel()', () => {
        test('should get all provinces (level 1)', () => {
            const level1 = wilayah.getByLevel(1);
            expect(level1.length).toBeGreaterThan(30);
            level1.forEach(r => {
                expect(r.kode.split('.')).toHaveLength(1);
            });
        });

        test('should get all kabupaten (level 2)', () => {
            const level2 = wilayah.getByLevel(2);
            expect(level2.length).toBeGreaterThan(500);
            level2.forEach(r => {
                expect(r.kode.split('.')).toHaveLength(2);
            });
        });

        test('should get all kecamatan (level 3)', () => {
            const level3 = wilayah.getByLevel(3);
            expect(level3.length).toBeGreaterThan(1000);
            level3.forEach(r => {
                expect(r.kode.split('.')).toHaveLength(3);
            });
        });

        test('should get all kelurahan (level 4)', () => {
            const level4 = wilayah.getByLevel(4);
            expect(level4.length).toBeGreaterThan(10000);
            level4.forEach(r => {
                expect(r.kode.split('.')).toHaveLength(4);
            });
        });
    });

    describe('getChildren()', () => {
        test('should get direct children only', () => {
            const children = wilayah.getChildren('11');
            expect(children.length).toBeGreaterThan(0);
            children.forEach(c => {
                expect(c.kode).toMatch(/^11\.\d+$/);
                expect(c.kode.split('.')).toHaveLength(2);
            });
        });

        test('should not include grandchildren', () => {
            const children = wilayah.getChildren('11');
            const hasGrandchildren = children.some(c => c.kode.split('.').length > 2);
            expect(hasGrandchildren).toBe(false);
        });
    });

    describe('getStats()', () => {
        test('should return valid statistics', () => {
            const stats = wilayah.getStats();

            expect(stats).toHaveProperty('total');
            expect(stats).toHaveProperty('provinsi');
            expect(stats).toHaveProperty('kabupaten');
            expect(stats).toHaveProperty('kecamatan');
            expect(stats).toHaveProperty('kelurahan');

            expect(stats.total).toBeGreaterThan(0);
            expect(stats.provinsi).toBeGreaterThan(30);
            expect(stats.kabupaten).toBeGreaterThan(500);
            expect(stats.kecamatan).toBeGreaterThan(1000);
            expect(stats.kelurahan).toBeGreaterThan(10000);
        });

        test('should have total equal sum of all levels', () => {
            const stats = wilayah.getStats();
            const sum = stats.provinsi + stats.kabupaten + stats.kecamatan + stats.kelurahan;
            expect(stats.total).toBe(sum);
        });
    });

    describe('clearCache()', () => {
        test('should clear search cache', () => {
            wilayah.search('test', 5);
            expect(wilayah.searchCache.size).toBeGreaterThan(0);

            wilayah.clearCache();
            expect(wilayah.searchCache.size).toBe(0);
        });
    });
});
