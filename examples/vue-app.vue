<template>
  <div class="nusantara-app">
    <h1>Nusantara API - Vue 3 Example</h1>

    <!-- Cascading Dropdown Section -->
    <section class="section">
      <h2>Cascading Dropdown</h2>
      <WilayahSelector @select="handleWilayahSelect" />
    </section>

    <!-- Autocomplete Section -->
    <section class="section">
      <h2>Autocomplete Search</h2>
      <WilayahAutocomplete
        placeholder="Cari wilayah Indonesia..."
        @select="handleAutocompleteSelect"
      />
    </section>

    <!-- Selected Result -->
    <section v-if="selectedWilayah" class="result">
      <h3>Selected Wilayah:</h3>
      <pre>{{ selectedWilayah }}</pre>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WilayahSelector from './components/WilayahSelector.vue';
import WilayahAutocomplete from './components/WilayahAutocomplete.vue';

const selectedWilayah = ref(null);

const handleWilayahSelect = (wilayah) => {
  selectedWilayah.value = wilayah;
  console.log('Selected:', wilayah);
};

const handleAutocompleteSelect = (wilayah) => {
  selectedWilayah.value = wilayah;
  console.log('Autocomplete selected:', wilayah);
};
</script>

<style scoped>
.nusantara-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 5px;
}

pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
