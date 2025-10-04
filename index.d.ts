/**
 * Nusantara API TypeScript Definitions
 * Type definitions for nusantara-api
 */

declare module 'nusantara-api' {
    /**
     * Wilayah object structure
     */
    export interface Wilayah {
        kode: string;
        nama: string;
    }

    /**
     * Statistics object structure
     */
    export interface Statistics {
        total: number;
        provinsi: number;
        kabupaten: number;
        kecamatan: number;
        kelurahan: number;
    }

    /**
     * Constructor options
     */
    export interface WilayahOptions {
        format?: 'array' | 'map';
    }

    /**
     * Main WilayahIndonesia class
     */
    export default class WilayahIndonesia {
        /**
         * Create a new WilayahIndonesia instance
         * @param options - Configuration options
         */
        constructor(options?: WilayahOptions);

        /**
         * Find wilayah by kode/ID
         * @param kode - Wilayah code (e.g., "11", "31.71", "11.01.01.2001")
         * @returns Wilayah object or null if not found
         * @example
         * const aceh = wilayah.findById('11');
         * // Returns: { kode: '11', nama: 'Aceh' }
         */
        findById(kode: string): Wilayah | null;

        /**
         * Get nama by kode
         * @param kode - Wilayah code
         * @returns Nama or null if not found
         * @example
         * const nama = wilayah.getName('11');
         * // Returns: "Aceh"
         */
        getName(kode: string): string | null;

        /**
         * Autocomplete search by nama
         * @param query - Search query
         * @param limit - Maximum results (default: 10)
         * @returns Array of matching wilayah
         * @example
         * const results = wilayah.autocomplete('jakarta', 5);
         */
        autocomplete(query: string, limit?: number): Wilayah[];

        /**
         * Search with caching (faster for repeated queries)
         * @param query - Search query
         * @param limit - Maximum results (default: 10)
         * @returns Array of matching wilayah
         * @example
         * const results = wilayah.search('bandung', 10);
         */
        search(query: string, limit?: number): Wilayah[];

        /**
         * Get wilayah by level
         * @param level - Level (1=provinsi, 2=kabupaten, 3=kecamatan, 4=kelurahan)
         * @returns Array of wilayah at specified level
         * @example
         * const provinces = wilayah.getByLevel(1);
         */
        getByLevel(level: 1 | 2 | 3 | 4): Wilayah[];

        /**
         * Get direct children of a wilayah
         * @param parentKode - Parent wilayah code
         * @returns Array of child wilayah
         * @example
         * const kabupaten = wilayah.getChildren('11');
         */
        getChildren(parentKode: string): Wilayah[];

        /**
         * Get all provinces
         * @returns Array of all provinces
         * @example
         * const provinces = wilayah.getProvinces();
         */
        getProvinces(): Wilayah[];

        /**
         * Get all kabupaten/kota in a province
         * @param provinceKode - Province code
         * @returns Array of kabupaten/kota
         * @example
         * const kabupaten = wilayah.getKabupaten('11');
         */
        getKabupaten(provinceKode: string): Wilayah[];

        /**
         * Get all kecamatan in a kabupaten
         * @param kabupatenKode - Kabupaten code
         * @returns Array of kecamatan
         * @example
         * const kecamatan = wilayah.getKecamatan('11.01');
         */
        getKecamatan(kabupatenKode: string): Wilayah[];

        /**
         * Get all kelurahan/desa in a kecamatan
         * @param kecamatanKode - Kecamatan code
         * @returns Array of kelurahan/desa
         * @example
         * const kelurahan = wilayah.getKelurahan('11.01.01');
         */
        getKelurahan(kecamatanKode: string): Wilayah[];

        /**
         * Get statistics
         * @returns Statistics object
         * @example
         * const stats = wilayah.getStats();
         * // Returns: { total: 91162, provinsi: 38, kabupaten: 514, ... }
         */
        getStats(): Statistics;

        /**
         * Clear search cache
         * @example
         * wilayah.clearCache();
         */
        clearCache(): void;
    }

    // Named export for TypeScript/ES6
    export { WilayahIndonesia };
}
