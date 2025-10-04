<template>
  <div class="wilayah-selector">
    <!-- Province Selector -->
    <div class="form-group">
      <label>Provinsi:</label>
      <select v-model="selectedProvince" @change="onProvinceChange" class="form-control">
        <option value="">-- Pilih Provinsi --</option>
        <option v-for="prov in provinces" :key="prov.kode" :value="prov.kode">
          {{ prov.nama }}
        </option>
      </select>
    </div>

    <!-- Kabupaten Selector -->
    <div v-if="selectedProvince" class="form-group">
      <label>Kabupaten/Kota:</label>
      <select v-model="selectedKabupaten" @change="onKabupatenChange" class="form-control">
        <option value="">-- Pilih Kabupaten/Kota --</option>
        <option v-for="kab in kabupatenList" :key="kab.kode" :value="kab.kode">
          {{ kab.nama }}
        </option>
      </select>
    </div>

    <!-- Kecamatan Selector -->
    <div v-if="selectedKabupaten" class="form-group">
      <label>Kecamatan:</label>
      <select v-model="selectedKecamatan" @change="onKecamatanChange" class="form-control">
        <option value="">-- Pilih Kecamatan --</option>
        <option v-for="kec in kecamatanList" :key="kec.kode" :value="kec.kode">
          {{ kec.nama }}
        </option>
      </select>
    </div>

    <!-- Kelurahan Selector -->
    <div v-if="selectedKecamatan" class="form-group">
      <label>Kelurahan/Desa:</label>
      <select v-model="selectedKelurahan" @change="onKelurahanChange" class="form-control">
        <option value="">-- Pilih Kelurahan/Desa --</option>
        <option v-for="kel in kelurahanList" :key="kel.kode" :value="kel.kode">
          {{ kel.nama }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
/**
 * WilayahSelector Component - Vue 3
 *
 * Install:
 * npm install nusantara-api
 *
 * Usage:
 * <WilayahSelector @select="handleSelect" />
 */

import { ref, computed, watch } from 'vue';
import WilayahIndonesia from 'nusantara-api';

// Props
const emit = defineEmits(['select']);

// Initialize Nusantara API
const wilayah = new WilayahIndonesia();

// State
const selectedProvince = ref('');
const selectedKabupaten = ref('');
const selectedKecamatan = ref('');
const selectedKelurahan = ref('');

// Get all provinces
const provinces = computed(() => wilayah.getProvinces());

// Get kabupaten based on selected province
const kabupatenList = computed(() => {
  if (!selectedProvince.value) return [];
  return wilayah.getKabupaten(selectedProvince.value);
});

// Get kecamatan based on selected kabupaten
const kecamatanList = computed(() => {
  if (!selectedKabupaten.value) return [];
  return wilayah.getKecamatan(selectedKabupaten.value);
});

// Get kelurahan based on selected kecamatan
const kelurahanList = computed(() => {
  if (!selectedKecamatan.value) return [];
  return wilayah.getKelurahan(selectedKecamatan.value);
});

// Handlers
const onProvinceChange = () => {
  selectedKabupaten.value = '';
  selectedKecamatan.value = '';
  selectedKelurahan.value = '';
};

const onKabupatenChange = () => {
  selectedKecamatan.value = '';
  selectedKelurahan.value = '';
};

const onKecamatanChange = () => {
  selectedKelurahan.value = '';
};

const onKelurahanChange = () => {
  if (selectedKelurahan.value) {
    emit('select', {
      province: wilayah.getName(selectedProvince.value),
      kabupaten: wilayah.getName(selectedKabupaten.value),
      kecamatan: wilayah.getName(selectedKecamatan.value),
      kelurahan: wilayah.getName(selectedKelurahan.value),
      kodes: {
        province: selectedProvince.value,
        kabupaten: selectedKabupaten.value,
        kecamatan: selectedKecamatan.value,
        kelurahan: selectedKelurahan.value
      }
    });
  }
};
</script>

<style scoped>
.wilayah-selector {
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>
