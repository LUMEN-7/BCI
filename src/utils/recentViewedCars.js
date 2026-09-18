// Utilitário central para persistir os "Últimos veículos vistos" pelo usuário em localStorage.
// Baseado no comportamento real de navegação do usuário (sem dados mockados).

export const RECENT_VIEWED_CARS_KEY = 'lumen-recent-viewed-cars';
import { getUserScopedItem, removeUserScopedItem, setUserScopedItem } from './userScopedStorage';
const MAX_STORED = 10;

function readStorage() {
  try {
    const raw = getUserScopedItem(RECENT_VIEWED_CARS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(list) {
  try {
    setUserScopedItem(RECENT_VIEWED_CARS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('recent-viewed-cars-updated', { detail: list }));
  } catch (error) {
    console.error('Erro ao salvar veículos visualizados:', error);
  }
}

export function getRecentViewedCars(limit = 5) {
  const list = readStorage();
  return list.slice(0, limit);
}

export function appendRecentViewedCar(car) {
  if (!car) return getRecentViewedCars();
  const rawId = car.id || car.linhagemId || car.Id || car.LinhagemId;
  if (!rawId) return getRecentViewedCars();

  const id = String(rawId);
  const brand = car.brand || car.marca || car.Marca || 'Ford';
  const rawName = car.modelo || car.name || car.Modelo || car.title || `Veículo ${id}`;
  const year = car.ano || car.year || car.Ano || (typeof car.specs?.year === 'object' ? car.specs?.year?.value : car.specs?.year) || '';
  const segment = car.segment || car.categoria || (typeof car.specs?.type === 'object' ? car.specs?.type?.value : car.specs?.type) || '';
  const image = car.image || car.imagemUrl || car.ImagemUrl || null;

  const entry = {
    id,
    brand,
    modelo: rawName,
    ano: year ? Number(year) || year : '',
    segment,
    image,
    viewedAt: new Date().toISOString(),
  };

  const current = readStorage();
  // Evitar duplicatas: se já existe, remove da posição anterior para subir para o topo (mais recente)
  const filtered = current.filter((item) => String(item.id) !== id);
  const updated = [entry, ...filtered].slice(0, MAX_STORED);

  writeStorage(updated);
  return updated.slice(0, 5);
}

export function clearRecentViewedCars() {
  try {
    removeUserScopedItem(RECENT_VIEWED_CARS_KEY);
    window.dispatchEvent(new CustomEvent('recent-viewed-cars-updated', { detail: [] }));
  } catch (error) {
    console.error(error);
  }
}
