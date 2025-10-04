const WilayahIndonesia = require('../src/index');

describe('Performance Tests', () => {
    let wilayah;

    beforeAll(() => {
        wilayah = new WilayahIndonesia();
    });

    describe('Load Time', () => {
        test('should load data in reasonable time', () => {
            const start = Date.now();
            const w = new WilayahIndonesia();
            const loadTime = Date.now() - start;

            expect(w.regions.length).toBeGreaterThan(0);
            expect(loadTime).toBeLessThan(1000); // Less than 1 second
        });
    });

    describe('findById Performance', () => {
        test('should find by id quickly (O(1))', () => {
            const iterations = 10000;
            const start = Date.now();

            for (let i = 0; i < iterations; i++) {
                wilayah.findById('11');
            }

            const elapsed = Date.now() - start;
            const avgTime = elapsed / iterations;

            expect(avgTime).toBeLessThan(1); // Less than 1ms average
        });

        test('should handle multiple lookups efficiently', () => {
            const kodes = ['11', '31.71', '32.01', '33.01', '34.01'];
            const start = Date.now();

            for (let i = 0; i < 1000; i++) {
                kodes.forEach(kode => wilayah.findById(kode));
            }

            const elapsed = Date.now() - start;
            expect(elapsed).toBeLessThan(100); // Less than 100ms for 5000 lookups
        });
    });

    describe('Search Performance', () => {
        test('autocomplete should complete in reasonable time', () => {
            const start = Date.now();
            const results = wilayah.autocomplete('jakarta', 10);
            const elapsed = Date.now() - start;

            expect(results.length).toBeGreaterThan(0);
            expect(elapsed).toBeLessThan(100); // Less than 100ms
        });

        test('cached search should be faster than first search', () => {
            wilayah.clearCache();

            const start1 = Date.now();
            wilayah.search('bandung', 10);
            const firstSearch = Date.now() - start1;

            const start2 = Date.now();
            wilayah.search('bandung', 10);
            const cachedSearch = Date.now() - start2;

            expect(cachedSearch).toBeLessThan(firstSearch);
        });
    });

    describe('Memory Usage', () => {
        test('should not create excessive objects', () => {
            const initialMem = process.memoryUsage().heapUsed;

            // Perform many operations
            for (let i = 0; i < 1000; i++) {
                wilayah.findById('11');
                wilayah.autocomplete('jakarta', 5);
                wilayah.getProvinces();
            }

            const finalMem = process.memoryUsage().heapUsed;
            const increase = (finalMem - initialMem) / 1024 / 1024; // MB

            expect(increase).toBeLessThan(10); // Less than 10MB increase
        });
    });

    describe('Hierarchical Queries', () => {
        test('getChildren should be efficient', () => {
            const start = Date.now();

            for (let i = 0; i < 100; i++) {
                wilayah.getChildren('11');
                wilayah.getChildren('31');
                wilayah.getChildren('32');
            }

            const elapsed = Date.now() - start;
            expect(elapsed).toBeLessThan(3000); // Less than 3 seconds for 300 queries
        });

        test('getByLevel should handle large results efficiently', () => {
            const start = Date.now();
            const kelurahan = wilayah.getByLevel(4); // Largest dataset
            const elapsed = Date.now() - start;

            expect(kelurahan.length).toBeGreaterThan(10000);
            expect(elapsed).toBeLessThan(1000); // Less than 1 second
        });
    });
});
