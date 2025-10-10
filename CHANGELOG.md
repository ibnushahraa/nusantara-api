# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3-beta] - 2025-10-10

### Improved
- Cleanup examples, fokus untuk Node.js backend

## [0.1.2-beta] - 2025-10-05

### Added
- Initial release
- Complete wilayah Indonesia data (Provinsi, Kabupaten, Kecamatan, Kelurahan)
- `findById()` - Find wilayah by kode
- `getName()` - Get nama by kode
- `autocomplete()` - Search wilayah by nama
- `search()` - Search with caching
- `getProvinces()` - Get all provinces
- `getKabupaten()` - Get kabupaten in a province
- `getKecamatan()` - Get kecamatan in a kabupaten
- `getKelurahan()` - Get kelurahan in a kecamatan
- `getByLevel()` - Get wilayah by level
- `getChildren()` - Get direct children
- `getStats()` - Get statistics
- Brotli compression support (524 KB compressed data)
- Gzip fallback support
- Auto-decompress on load
- Search result caching
- 80,000+ wilayah data
- Data sesuai Kepmendagri No 300.2.2-2138 Tahun 2025

### Performance
- O(1) lookup by ID
- ~100-200ms initial load time
- Memory efficient streaming decompression
