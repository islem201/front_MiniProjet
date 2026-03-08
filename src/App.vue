<script setup>
import { onMounted, ref, computed } from 'vue';
// Ajout des extensions .js pour garantir la compatibilité
import { usePharmacy } from './composables/usePharmacy.js';
import { PHARMACY_ID } from './utils/constants.js';

import MedicationCard from './components/MedicationCard.vue';
import MedicationForm from './components/MedicationForm.vue';

const {
  medicaments,
  chargement,
  chargerMedicaments,
  supprimerMedicament,
  modifierStock,
  sauvegarderMedicament,
} = usePharmacy();

const recherche = ref('');
const showModal = ref(false);
const itemToEdit = ref(null);

// Fonctionnalité de recherche demandée [cite: 42]
const listeFiltree = computed(() => {
  if (!recherche.value) return medicaments.value;
  return medicaments.value.filter((m) =>
    m.denomination.toLowerCase().includes(recherche.value.toLowerCase())
  );
});

const openAdd = () => {
  itemToEdit.value = null;
  showModal.value = true;
};

const openEdit = (med) => {
  // On passe une copie pour ne pas modifier l'original avant la validation
  itemToEdit.value = { ...med };
  showModal.value = true;
};

const handleSave = async (medData) => {
  const success = await sauvegarderMedicament(medData);
  if (success) showModal.value = false;
};

onMounted(() => {
  chargerMedicaments(); // Afficher le contenu de la pharmacie au chargement [cite: 37]
});
</script>

<template>
  <div class="container">
    <header>
      <h1>Pharmacie Front (ID: {{ PHARMACY_ID }})</h1>
      <input
        v-model="recherche"
        placeholder="Rechercher un médicament..."
        class="search-input"
      />
      <button @click="openAdd" class="btn-add">+ Ajouter Médicament</button>
    </header>

    <main>
      <div v-if="chargement">Chargement...</div>

      <div v-else class="list">
        <MedicationCard
          v-for="med in listeFiltree"
          :key="med.id"
          :med="med"
          @delete="supprimerMedicament"
          @updateStock="modifierStock"
          @edit="openEdit"
        />

        <p v-if="listeFiltree.length === 0">Aucun médicament trouvé.</p>
      </div>
    </main>

    <MedicationForm
      v-if="showModal"
      :initialData="itemToEdit"
      @submit="handleSave"
      @cancel="showModal = false"
    />
  </div>
</template>

<style scoped>
@import './style.css';

.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
</style>
