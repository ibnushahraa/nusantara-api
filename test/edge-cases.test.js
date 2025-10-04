const WilayahIndonesia = require('../src/index');

describe('Edge Cases and Error Handling', () => {
    let wilayah;

    beforeAll(() => {
        wilayah = new WilayahIndonesia();
    });

    describe('Invalid Input Handling', () => {
        test('should handle null input gracefully', () => {
            expect(() => wilayah.findById(null)).not.toThrow();
            expect(wilayah.findById(null)).toBeNull();
        });

        test('should handle undefined input gracefully', () => {
            expect(() => wilayah.findById(undefined)).not.toThrow();
            expect(wilayah.findById(undefined)).toBeNull();
        });

        test('should handle numeric input', () => {
            const result = wilayah.findById(11);
            // Should convert to string or handle appropriately
            expect(result).toBeDefined();
        });

        test('should handle special characters in search', () => {
            const results = wilayah.autocomplete('test@#$%', 5);
            expect(Array.isArray(results)).toBe(true);
        });

        test('should handle very long search query', () => {
            const longQuery = 'a'.repeat(1000);
            const results = wilayah.autocomplete(longQuery, 5);
            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('Boundary Cases', () => {
        test('should handle limit of 0', () => {
            const results = wilayah.autocomplete('jakarta', 0);
            expect(results).toEqual([]);
        });

        test('should handle negative limit', () => {
            const results = wilayah.autocomplete('jakarta', -1);
            expect(Array.isArray(results)).toBe(true);
        });

        test('should handle very large limit', () => {
            const results = wilayah.autocomplete('jakarta', 999999);
            expect(results.length).toBeGreaterThan(0);
            expect(results.length).toBeLessThan(1000); // Should not exceed actual matches
        });

        test('should handle level 0', () => {
            const results = wilayah.getByLevel(0);
            expect(results).toEqual([]);
        });

        test('should handle level greater than 4', () => {
            const results = wilayah.getByLevel(5);
            expect(results).toEqual([]);
        });
    });

    describe('Special Characters in Data', () => {
        test('should handle regions with apostrophes', () => {
            // Some regions might have names like "D'Anjou"
            const results = wilayah.autocomplete("'", 5);
            expect(Array.isArray(results)).toBe(true);
        });

        test('should handle regions with spaces', () => {
            const results = wilayah.autocomplete('jakarta pusat');
            expect(results.length).toBeGreaterThan(0);
        });

        test('should handle case sensitivity correctly', () => {
            const lower = wilayah.autocomplete('jakarta');
            const upper = wilayah.autocomplete('JAKARTA');
            const mixed = wilayah.autocomplete('JaKaRtA');

            expect(lower.length).toBe(upper.length);
            expect(lower.length).toBe(mixed.length);
        });
    });

    describe('Concurrent Access', () => {
        test('should handle multiple simultaneous queries', async () => {
            const promises = [];

            for (let i = 0; i < 10; i++) {
                promises.push(
                    Promise.resolve(wilayah.findById('11')),
                    Promise.resolve(wilayah.autocomplete('jakarta', 5)),
                    Promise.resolve(wilayah.getProvinces())
                );
            }

            const results = await Promise.all(promises);
            expect(results.length).toBe(30);
            expect(results.every(r => r !== undefined)).toBe(true);
        });
    });

    describe('Cache Edge Cases', () => {
        test('should handle cache with different query cases', () => {
            wilayah.clearCache();

            wilayah.search('Jakarta', 5);
            wilayah.search('jakarta', 5);
            wilayah.search('JAKARTA', 5);

            // All should be cached as different keys (case sensitive cache key)
            expect(wilayah.searchCache.size).toBeGreaterThan(0);
        });

        test('should handle cache with same query different limits', () => {
            wilayah.clearCache();

            wilayah.search('bandung', 5);
            wilayah.search('bandung', 10);
            wilayah.search('bandung', 15);

            // Should create different cache entries
            expect(wilayah.searchCache.size).toBe(3);
        });

        test('should clear cache completely', () => {
            wilayah.search('test1', 5);
            wilayah.search('test2', 5);
            wilayah.search('test3', 5);

            expect(wilayah.searchCache.size).toBeGreaterThan(0);

            wilayah.clearCache();
            expect(wilayah.searchCache.size).toBe(0);
        });
    });

    describe('Data Integrity', () => {
        test('should not have duplicate kodes', () => {
            const kodes = new Set();
            wilayah.regions.forEach(([kode]) => {
                expect(kodes.has(kode)).toBe(false);
                kodes.add(kode);
            });
            expect(kodes.size).toBe(wilayah.regions.length);
        });

        test('should have consistent map and regions data', () => {
            expect(Object.keys(wilayah.map).length).toBe(wilayah.regions.length);
        });

        test('all regions should have non-empty kode and nama', () => {
            wilayah.regions.forEach(([kode, nama]) => {
                expect(kode).toBeTruthy();
                expect(nama).toBeTruthy();
                expect(typeof kode).toBe('string');
                expect(typeof nama).toBe('string');
                expect(kode.length).toBeGreaterThan(0);
                expect(nama.length).toBeGreaterThan(0);
            });
        });

        test('should have valid hierarchical structure', () => {
            const provinces = wilayah.getProvinces();

            provinces.forEach(prov => {
                const kabupaten = wilayah.getKabupaten(prov.kode);

                kabupaten.forEach(kab => {
                    expect(kab.kode).toMatch(new RegExp(`^${prov.kode}\\.\\d+$`));
                });
            });
        });
    });

    describe('Return Value Consistency', () => {
        test('findById should always return same structure', () => {
            const result1 = wilayah.findById('11');
            const result2 = wilayah.findById('31.71');

            expect(Object.keys(result1).sort()).toEqual(['kode', 'nama']);
            expect(Object.keys(result2).sort()).toEqual(['kode', 'nama']);
        });

        test('autocomplete should always return array', () => {
            expect(Array.isArray(wilayah.autocomplete('test'))).toBe(true);
            expect(Array.isArray(wilayah.autocomplete(''))).toBe(true);
            expect(Array.isArray(wilayah.autocomplete('xyz123'))).toBe(true);
        });

        test('getByLevel should always return array', () => {
            expect(Array.isArray(wilayah.getByLevel(1))).toBe(true);
            expect(Array.isArray(wilayah.getByLevel(99))).toBe(true);
        });

        test('getChildren should always return array', () => {
            expect(Array.isArray(wilayah.getChildren('11'))).toBe(true);
            expect(Array.isArray(wilayah.getChildren('invalid'))).toBe(true);
        });
    });
});
