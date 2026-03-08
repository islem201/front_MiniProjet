<script setup>
import { API_BASE_URL } from '../utils/constants.js';

defineProps({
  med: { type: Object, required: true },
});

defineEmits(['delete', 'edit', 'updateStock']);

const getImageUrl = (filename) => {
  if (!filename) return 'https://via.placeholder.com/60';
  if (filename.startsWith('data:image')) return filename;
  return `${API_BASE_URL}/images/${filename}`;
};
</script>

<template>
  <div class="card">
    <div class="card-img">
      <img :src="getImageUrl(med.photo)" alt="Photo" />
    </div>

    <div class="card-info">
      <h3>{{ med.denomination }}</h3>
      <p class="forme">{{ med.formepharmaceutique }}</p>
    </div>

    <div class="card-stock">
      <span>Stock: {{ med.qte }}</span>
    </div>

    <div class="card-actions">
      <div class="stock-btn">
        <button @click="$emit('updateStock', med, -1)">-1</button>
        <button @click="$emit('updateStock', med, 1)">+1</button>
      </div>
      <div class="edit-btn">
        <button class="btn-warning" @click="$emit('edit', med)">
          Modifier
        </button>
        <button class="btn-danger" @click="$emit('delete', med.id)">
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: white;
  gap: 1rem;
}
.card-img img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.card-info {
  flex: 1;
}
.card-info h3 {
  margin: 0;
  font-size: 1.1rem;
}
.forme {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
button {
  cursor: pointer;
  padding: 4px 8px;
}
.btn-danger {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #c62828;
}
.btn-warning {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ef6c00;
}
</style>
