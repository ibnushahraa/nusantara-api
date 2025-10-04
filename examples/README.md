# Examples

Collection of example scripts demonstrating how to use Nusantara API.

## Running Examples

### Node.js Examples (CommonJS)

```bash
cd examples
node basic.js
node search.js
node hierarchical.js
node express-api.js
```

### ES Modules Example

```javascript
// example.mjs
import WilayahIndonesia from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const aceh = wilayah.findById('11');
console.log(aceh);
```

```bash
node example.mjs
```

### TypeScript Example

```typescript
// example.ts
import WilayahIndonesia, { Wilayah } from 'nusantara-api';

const wilayah = new WilayahIndonesia();
const result: Wilayah | null = wilayah.findById('11');
console.log(result);
```

## Available Examples

### 1. basic.js
Basic usage examples (CommonJS):
- Find wilayah by ID
- Get nama by kode
- Get all provinces
- Handle invalid IDs

```bash
node basic.js
```

### 2. search.js
Search and autocomplete examples:
- Search by nama
- Case-insensitive search
- Cached search (performance)
- Handle empty queries and no results

```bash
node search.js
```

### 3. hierarchical.js
Hierarchical navigation examples:
- Navigate provinsi → kabupaten → kecamatan → kelurahan
- Get children by parent kode
- Get statistics by level
- Full hierarchy tree navigation

```bash
node hierarchical.js
```

### 4. express-api.js
Complete REST API with Express.js:
- GET `/provinces` - Get all provinces
- GET `/search?q=query` - Search wilayah
- GET `/wilayah/:kode` - Get by kode
- GET `/kabupaten/:provinceKode` - Get kabupaten
- And more...

**Install dependencies:**
```bash
npm install express
```

**Run:**
```bash
node express-api.js
```

**Test:**
```bash
curl http://localhost:3000/provinces
curl http://localhost:3000/search?q=jakarta&limit=5
curl http://localhost:3000/wilayah/11
```

### 5. react-app.jsx
React components (React 18+):
- `WilayahSelector` - Cascading dropdown component
- `WilayahAutocomplete` - Autocomplete search component

**Features:**
- ✅ Support React hooks (useState, useEffect, useMemo)
- ✅ Optimized re-rendering
- ✅ TypeScript support via index.d.ts

**Usage:**
```jsx
import { WilayahSelector } from './examples/react-app';

function App() {
  return <WilayahSelector onSelect={(w) => console.log(w)} />;
}
```

### 6. vue-app.vue
Vue 3 components:
- `WilayahSelector.vue` - Cascading dropdown component
- `WilayahAutocomplete.vue` - Autocomplete search component

**Features:**
- ✅ Vue 3 Composition API
- ✅ Reactive state management
- ✅ Scoped styles
- ✅ TypeScript support

**Usage:**
```vue
<script setup>
import WilayahSelector from './vue-components/WilayahSelector.vue';
</script>

<template>
  <WilayahSelector @select="handleSelect" />
</template>
```

## Use Cases

### Autocomplete in Forms
```javascript
const wilayah = new WilayahIndonesia();

// User types "jak..."
const suggestions = wilayah.autocomplete('jak', 5);
// Returns: Jakarta-related regions
```

### Dropdown Cascading
```javascript
// User selects province
const provinceKode = '11'; // Aceh
const kabupatenList = wilayah.getKabupaten(provinceKode);

// User selects kabupaten
const kabupatenKode = '11.01';
const kecamatanList = wilayah.getKecamatan(kabupatenKode);
```

### Validation
```javascript
function validateKode(kode) {
    const region = wilayah.findById(kode);
    return region !== null;
}

console.log(validateKode('11')); // true
console.log(validateKode('99.99')); // false
```

### Display Full Address
```javascript
function getFullAddress(kode) {
    const parts = kode.split('.');
    const address = [];

    for (let i = 1; i <= parts.length; i++) {
        const partialKode = parts.slice(0, i).join('.');
        const nama = wilayah.getName(partialKode);
        if (nama) address.push(nama);
    }

    return address.join(', ');
}

console.log(getFullAddress('11.01.01.2001'));
// Output: "Keude Bakongan, Bakongan, Kabupaten Aceh Selatan, Aceh"
```
