// Utilitário central para persistir pesquisas agendadas no BCI.
// Funciona offline / via localStorage e emite eventos de sincronização em tempo real.

export const SCHEDULED_SEARCHES_KEY = 'lumen-scheduled-searches';

function readStorage() {
  try {
    const raw = localStorage.getItem(SCHEDULED_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(searches) {
  try {
    localStorage.setItem(SCHEDULED_SEARCHES_KEY, JSON.stringify(searches));
    window.dispatchEvent(new CustomEvent('scheduled-searches-updated', { detail: searches }));
  } catch (error) {
    console.error('Erro ao salvar pesquisas agendadas no localStorage:', error);
  }
}

export function getScheduledSearches() {
  const list = readStorage();
  // Ordena por data e hora do agendamento mais próximo
  return list.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return timeA - timeB;
  });
}

export function saveScheduledSearch({
  id,
  carId,
  carName,
  carBrand,
  carImage,
  date,
  time,
  recurrence = 'once',
  notes = '',
}) {
  const list = readStorage();
  const now = new Date().toISOString();

  let result = null;
  let updatedList = [];

  if (id) {
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index !== -1) {
      result = {
        ...list[index],
        carId: String(carId),
        carName: carName || 'Modelo sem nome',
        carBrand: carBrand || 'Ford',
        carImage: carImage || null,
        date,
        time,
        recurrence,
        notes,
        updatedAt: now,
      };
      updatedList = [...list];
      updatedList[index] = result;
    }
  }

  if (!result) {
    const newId = `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    result = {
      id: newId,
      carId: String(carId),
      carName: carName || 'Modelo sem nome',
      carBrand: carBrand || 'Ford',
      carImage: carImage || null,
      date,
      time,
      recurrence,
      notes,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    updatedList = [result, ...list];
  }

  writeStorage(updatedList);
  return result;
}

export function deleteScheduledSearch(id) {
  const list = readStorage();
  const updated = list.filter((item) => String(item.id) !== String(id));
  writeStorage(updated);
  return updated;
}

export function toggleScheduledSearchStatus(id) {
  const list = readStorage();
  const updated = list.map((item) => {
    if (String(item.id) === String(id)) {
      return { ...item, active: !item.active };
    }
    return item;
  });
  writeStorage(updated);
  return updated;
}
