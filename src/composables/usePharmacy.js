import { ref } from 'vue';
import { API_BASE_URL, PHARMACY_ID } from '../utils/constants.js';

export function usePharmacy() {
  const medicaments = ref([]);
  const chargement = ref(false);

  const chargerMedicaments = async () => {
    chargement.value = true;
    try {
      const url = `${API_BASE_URL}/api/${PHARMACY_ID}/medicaments`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Erreur serveur HTTP');

      medicaments.value = await response.json();
    } catch (error) {
      console.error('Échec du chargement:', error);
    } finally {
      chargement.value = false;
    }
  };

  const sauvegarderMedicament = async (med) => {
    const isEdit = !!med.id;
    const url = `${API_BASE_URL}/api/${PHARMACY_ID}/medicaments`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med),
      });

      const data = await response.json();

      if (data.status === 1) {
        await chargerMedicaments();
        return true;
      } else {
        alert("Erreur de l'API : " + data.message);
        return false;
      }
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      return false;
    }
  };

  const supprimerMedicament = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce médicament ?')) return;

    try {
      const url = `${API_BASE_URL}/api/${PHARMACY_ID}/medicaments/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json();

      if (data.status === 1) {
        medicaments.value = medicaments.value.filter((m) => m.id !== id);
      } else {
        alert('Erreur : ' + data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const modifierStock = async (med, delta) => {
    const nouvelleQte = med.qte + delta;
    if (nouvelleQte < 0) return;

    const payload = { ...med, qte: nouvelleQte };
    await sauvegarderMedicament(payload);
  };

  return {
    medicaments,
    chargement,
    chargerMedicaments,
    supprimerMedicament,
    modifierStock,
    sauvegarderMedicament,
  };
}
