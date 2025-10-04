/**
 * React Example - Wilayah Selector Component
 *
 * Install dependencies:
 * npm install react nusantara-api
 *
 * Usage in React app:
 * import WilayahSelector from './WilayahSelector';
 *
 * function App() {
 *   return <WilayahSelector onSelect={(wilayah) => console.log(wilayah)} />
 * }
 */

import React, { useState, useEffect, useMemo } from 'react';
import WilayahIndonesia from 'nusantara-api';

// Initialize once (outside component to avoid re-initialization)
const wilayah = new WilayahIndonesia();

function WilayahSelector({ onSelect }) {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedKabupaten, setSelectedKabupaten] = useState('');
    const [selectedKecamatan, setSelectedKecamatan] = useState('');
    const [selectedKelurahan, setSelectedKelurahan] = useState('');

    // Get all provinces (memoized)
    const provinces = useMemo(() => wilayah.getProvinces(), []);

    // Get kabupaten based on selected province
    const kabupatenList = useMemo(() => {
        if (!selectedProvince) return [];
        return wilayah.getKabupaten(selectedProvince);
    }, [selectedProvince]);

    // Get kecamatan based on selected kabupaten
    const kecamatanList = useMemo(() => {
        if (!selectedKabupaten) return [];
        return wilayah.getKecamatan(selectedKabupaten);
    }, [selectedKabupaten]);

    // Get kelurahan based on selected kecamatan
    const kelurahanList = useMemo(() => {
        if (!selectedKecamatan) return [];
        return wilayah.getKelurahan(selectedKecamatan);
    }, [selectedKecamatan]);

    // Reset child selections when parent changes
    useEffect(() => {
        setSelectedKabupaten('');
        setSelectedKecamatan('');
        setSelectedKelurahan('');
    }, [selectedProvince]);

    useEffect(() => {
        setSelectedKecamatan('');
        setSelectedKelurahan('');
    }, [selectedKabupaten]);

    useEffect(() => {
        setSelectedKelurahan('');
    }, [selectedKecamatan]);

    // Notify parent when selection is complete
    useEffect(() => {
        if (selectedKelurahan && onSelect) {
            onSelect({
                province: wilayah.getName(selectedProvince),
                kabupaten: wilayah.getName(selectedKabupaten),
                kecamatan: wilayah.getName(selectedKecamatan),
                kelurahan: wilayah.getName(selectedKelurahan),
                kodes: {
                    province: selectedProvince,
                    kabupaten: selectedKabupaten,
                    kecamatan: selectedKecamatan,
                    kelurahan: selectedKelurahan
                }
            });
        }
    }, [selectedKelurahan, selectedProvince, selectedKabupaten, selectedKecamatan, onSelect]);

    return (
        <div className="wilayah-selector">
            <h3>Pilih Wilayah Indonesia</h3>

            {/* Province Selector */}
            <div className="form-group">
                <label>Provinsi:</label>
                <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="form-control"
                >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((prov) => (
                        <option key={prov.kode} value={prov.kode}>
                            {prov.nama}
                        </option>
                    ))}
                </select>
            </div>

            {/* Kabupaten Selector */}
            {selectedProvince && (
                <div className="form-group">
                    <label>Kabupaten/Kota:</label>
                    <select
                        value={selectedKabupaten}
                        onChange={(e) => setSelectedKabupaten(e.target.value)}
                        className="form-control"
                    >
                        <option value="">-- Pilih Kabupaten/Kota --</option>
                        {kabupatenList.map((kab) => (
                            <option key={kab.kode} value={kab.kode}>
                                {kab.nama}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Kecamatan Selector */}
            {selectedKabupaten && (
                <div className="form-group">
                    <label>Kecamatan:</label>
                    <select
                        value={selectedKecamatan}
                        onChange={(e) => setSelectedKecamatan(e.target.value)}
                        className="form-control"
                    >
                        <option value="">-- Pilih Kecamatan --</option>
                        {kecamatanList.map((kec) => (
                            <option key={kec.kode} value={kec.kode}>
                                {kec.nama}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Kelurahan Selector */}
            {selectedKecamatan && (
                <div className="form-group">
                    <label>Kelurahan/Desa:</label>
                    <select
                        value={selectedKelurahan}
                        onChange={(e) => setSelectedKelurahan(e.target.value)}
                        className="form-control"
                    >
                        <option value="">-- Pilih Kelurahan/Desa --</option>
                        {kelurahanList.map((kel) => (
                            <option key={kel.kode} value={kel.kode}>
                                {kel.nama}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

// ===== Autocomplete Component Example =====

function WilayahAutocomplete({ placeholder = 'Cari wilayah...', onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const searchResults = wilayah.autocomplete(query, 10);
        setResults(searchResults);
        setShowResults(true);
    }, [query]);

    const handleSelect = (item) => {
        setQuery(item.nama);
        setShowResults(false);
        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <div className="autocomplete">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                placeholder={placeholder}
                className="form-control"
            />
            {showResults && results.length > 0 && (
                <ul className="autocomplete-results">
                    {results.map((item) => (
                        <li
                            key={item.kode}
                            onClick={() => handleSelect(item)}
                            className="autocomplete-item"
                        >
                            <strong>{item.nama}</strong>
                            <span className="kode">({item.kode})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ===== Example Usage =====

function App() {
    const handleWilayahSelect = (wilayah) => {
        console.log('Selected wilayah:', wilayah);
    };

    const handleAutocompleteSelect = (wilayah) => {
        console.log('Autocomplete selected:', wilayah);
    };

    return (
        <div className="App">
            <h1>Nusantara API - React Example</h1>

            <section>
                <h2>Cascading Dropdown</h2>
                <WilayahSelector onSelect={handleWilayahSelect} />
            </section>

            <section>
                <h2>Autocomplete Search</h2>
                <WilayahAutocomplete onSelect={handleAutocompleteSelect} />
            </section>
        </div>
    );
}

export default App;
export { WilayahSelector, WilayahAutocomplete };
