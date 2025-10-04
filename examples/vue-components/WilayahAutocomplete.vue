<template>
  <div class="autocomplete-wrapper">
    <input
      v-model="query"
      @input="onInput"
      @focus="showResults = true"
      @blur="onBlur"
      :placeholder="placeholder"
      class="autocomplete-input"
      type="text"
    />
    <ul v-if="showResults && results.length > 0" class="autocomplete-results">
      <li
        v-for="item in results"
        :key="item.kode"
        @mousedown="selectItem(item)"
        class="autocomplete-item"
      >
        <strong>{{ item.nama }}</strong>
        <span class="kode">({{ item.kode }})</span>
      </li>
    </ul>
    <div v-if="showResults && query.length >= 2 && results.length === 0" class="no-results">
      Tidak ada hasil
    </div>
  </div>
</template>

<script setup>
/**
 * WilayahAutocomplete Component - Vue 3
 *
 * Install:
 * npm install nusantara-api
 *
 * Usage:
 * <WilayahAutocomplete
 *   placeholder="Cari wilayah..."
 *   @select="handleSelect"
 * />
 */

import { ref, watch } from 'vue';
import WilayahIndonesia from 'nusantara-api';

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Cari wilayah...'
  },
  limit: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['select']);

// Initialize Nusantara API
const wilayah = new WilayahIndonesia();

// State
const query = ref('');
const results = ref([]);
const showResults = ref(false);

// Watch query changes
watch(query, (newQuery) => {
  if (newQuery.length < 2) {
    results.value = [];
    return;
  }

  results.value = wilayah.autocomplete(newQuery, props.limit);
});

// Handlers
const onInput = () => {
  showResults.value = true;
};

const onBlur = () => {
  // Delay to allow click on results
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const selectItem = (item) => {
  query.value = item.nama;
  results.value = [];
  showResults.value = false;
  emit('select', item);
};
</script>

<style scoped>
.autocomplete-wrapper {
  position: relative;
  max-width: 600px;
}

.autocomplete-input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.autocomplete-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.autocomplete-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  margin: 5px 0 0 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.autocomplete-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover {
  background: #f5f5f5;
}

.autocomplete-item strong {
  color: #333;
}

.autocomplete-item .kode {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: #999;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  background: white;
}
</style>
