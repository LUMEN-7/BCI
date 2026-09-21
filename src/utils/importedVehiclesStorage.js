import { getUserScopedItem, setUserScopedItem } from './userScopedStorage';

const IMPORTED_VEHICLES_KEY = 'lumen-imported-vehicles';

function readVehicles() {
  try {
    const raw = getUserScopedItem(IMPORTED_VEHICLES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeVehicles(vehicles) {
  setUserScopedItem(IMPORTED_VEHICLES_KEY, JSON.stringify(vehicles));
  window.dispatchEvent(new CustomEvent('imported-vehicles-updated'));
}

export function getImportedVehicles() {
  return readVehicles();
}

export function saveImportedVehicle(vehicle) {
  const current = readVehicles();
  const id = String(vehicle.id || `imported-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const saved = {
    id,
    brand: vehicle.brand?.trim() || 'Ford',
    modelo: vehicle.modelo?.trim() || 'Modelo sem nome',
    ano: vehicle.ano ? String(vehicle.ano) : '',
    image: vehicle.image || null,
    segment: vehicle.segment?.trim() || 'Veículo importado',
    engine: vehicle.engine?.trim() || '',
    power: vehicle.power?.trim() || '',
    transmission: vehicle.transmission?.trim() || '',
    price: vehicle.price?.trim() || '',
    consumption: vehicle.consumption?.trim() || '',
    cityConsumption: vehicle.cityConsumption?.trim() || '',
    highwayConsumption: vehicle.highwayConsumption?.trim() || '',
    torque: vehicle.torque?.trim() || '',
    drivetrain: vehicle.drivetrain?.trim() || '',
    length: vehicle.length?.trim() || '',
    width: vehicle.width?.trim() || '',
    height: vehicle.height?.trim() || '',
    wheelbase: vehicle.wheelbase?.trim() || '',
    tireType: vehicle.tireType?.trim() || '',
    rim: vehicle.rim?.trim() || '',
    tireWidth: vehicle.tireWidth?.trim() || '',
    tireProfile: vehicle.tireProfile?.trim() || '',
    tankCapacity: vehicle.tankCapacity?.trim() || '',
    fuelType: vehicle.fuelType?.trim() || '',
    loadCapacity: vehicle.loadCapacity?.trim() || '',
    towingCapacity: vehicle.towingCapacity?.trim() || '',
    performance: vehicle.performance || [],
    security: vehicle.security || [],
    technology: vehicle.technology || [],
    comfort: vehicle.comfort || [],
    description: vehicle.description?.trim() || '',
    isImported: true,
    updatedAt: new Date().toISOString(),
  };
  const next = [saved, ...current.filter((item) => String(item.id) !== id)];
  writeVehicles(next);
  return saved;
}

export function removeImportedVehicle(id) {
  writeVehicles(readVehicles().filter((vehicle) => String(vehicle.id) !== String(id)));
}
