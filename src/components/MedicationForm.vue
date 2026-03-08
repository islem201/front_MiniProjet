<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: null },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  id: null,
  denomination: '',
  formepharmaceutique: '',
  qte: 1,
  photo: '',
});

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal);
      form.photo = '';
    } else {
      Object.assign(form, {
        id: null,
        denomination: '',
        formepharmaceutique: '',
        qte: 1,
        photo: '',
      });
    }
  },
  { immediate: true }
);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    form.photo = reader.result;
  };
  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  const payload = { ...form };
  if (!payload.id) delete payload.id;
  emit('submit', payload);
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h2>{{ form.id ? 'Modifier' : 'Ajouter' }} un médicament</h2>

      <form @submit.prevent="handleSubmit">
        <label
          >Dénomination: <input v-model="form.denomination" required
        /></label>
        <label
          >Forme: <input v-model="form.formepharmaceutique" required
        /></label>
        <label
          >Quantité: <input type="number" v-model="form.qte" required min="0"
        /></label>

        <label
          >Photo:
          <input
            id="photo"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
        /></label>

        <div class="actions">
          <button type="button" @click="$emit('cancel')">Annuler</button>
          <button type="submit" class="primary">Valider</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 5px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.primary {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
