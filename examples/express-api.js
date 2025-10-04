/**
 * Express API Example
 * REST API menggunakan Express.js dan Nusantara API
 *
 * Install dependencies:
 * npm install express cors
 *
 * Run:
 * node express-api.js
 */

const express = require('express');
const WilayahIndonesia = require('../src/index');

const app = express();
const PORT = 3000;

// Initialize Nusantara API
const wilayah = new WilayahIndonesia();

// Middleware
app.use(express.json());

// CORS (optional)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ===== API Routes =====

/**
 * GET / - API Info
 */
app.get('/', (req, res) => {
    res.json({
        name: 'Nusantara API',
        version: '1.0.0',
        description: 'REST API untuk data wilayah Indonesia',
        endpoints: {
            '/': 'API info',
            '/stats': 'Get statistics',
            '/provinces': 'Get all provinces',
            '/search?q={query}&limit={limit}': 'Search wilayah',
            '/wilayah/:kode': 'Get wilayah by kode',
            '/kabupaten/:provinceKode': 'Get kabupaten in province',
            '/kecamatan/:kabupatenKode': 'Get kecamatan in kabupaten',
            '/kelurahan/:kecamatanKode': 'Get kelurahan in kecamatan'
        }
    });
});

/**
 * GET /stats - Get statistics
 */
app.get('/stats', (req, res) => {
    try {
        const stats = wilayah.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /provinces - Get all provinces
 */
app.get('/provinces', (req, res) => {
    try {
        const provinces = wilayah.getProvinces();
        res.json({
            success: true,
            total: provinces.length,
            data: provinces
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /search?q=query&limit=10 - Search wilayah
 */
app.get('/search', (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }

        const results = wilayah.search(q, parseInt(limit));
        res.json({
            success: true,
            query: q,
            total: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /autocomplete?q=query&limit=10 - Autocomplete search
 */
app.get('/autocomplete', (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }

        const results = wilayah.autocomplete(q, parseInt(limit));
        res.json({
            success: true,
            query: q,
            total: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /wilayah/:kode - Get wilayah by kode
 */
app.get('/wilayah/:kode', (req, res) => {
    try {
        const { kode } = req.params;
        const result = wilayah.findById(kode);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Wilayah not found'
            });
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /kabupaten/:provinceKode - Get kabupaten in province
 */
app.get('/kabupaten/:provinceKode', (req, res) => {
    try {
        const { provinceKode } = req.params;
        const kabupaten = wilayah.getKabupaten(provinceKode);

        res.json({
            success: true,
            provinceKode,
            total: kabupaten.length,
            data: kabupaten
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /kecamatan/:kabupatenKode - Get kecamatan in kabupaten
 */
app.get('/kecamatan/:kabupatenKode', (req, res) => {
    try {
        const { kabupatenKode } = req.params;
        const kecamatan = wilayah.getKecamatan(kabupatenKode);

        res.json({
            success: true,
            kabupatenKode,
            total: kecamatan.length,
            data: kecamatan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /kelurahan/:kecamatanKode - Get kelurahan in kecamatan
 */
app.get('/kelurahan/:kecamatanKode', (req, res) => {
    try {
        const { kecamatanKode } = req.params;
        const kelurahan = wilayah.getKelurahan(kecamatanKode);

        res.json({
            success: true,
            kecamatanKode,
            total: kelurahan.length,
            data: kelurahan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`\n🚀 Nusantara API Server running on http://localhost:${PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  - GET  http://localhost:${PORT}/`);
    console.log(`  - GET  http://localhost:${PORT}/stats`);
    console.log(`  - GET  http://localhost:${PORT}/provinces`);
    console.log(`  - GET  http://localhost:${PORT}/search?q=jakarta&limit=5`);
    console.log(`  - GET  http://localhost:${PORT}/wilayah/11`);
    console.log(`  - GET  http://localhost:${PORT}/kabupaten/11`);
    console.log(`  - GET  http://localhost:${PORT}/kecamatan/11.01`);
    console.log(`  - GET  http://localhost:${PORT}/kelurahan/11.01.01\n`);
});
