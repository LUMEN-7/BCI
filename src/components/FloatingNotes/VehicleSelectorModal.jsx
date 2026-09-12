import { useEffect, useMemo, useState } from 'react';
import {
  IoCarSportOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { getFavoriteCars } from '../../utils/savedItemsStorage';
import { getFavorites } from '../../services/carsService';

export default function VehicleSelectorModal({ isOpen, onClose, onSelectCar }) {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadCars() {
      setLoading(true);
      try {
        // 1. Carrega favoritos do localStorage
        const localFavorites = getFavoriteCars();

        // 2. Tenta complementar com favoritos do backend
        let apiFavorites = [];
        try {
          const res = await getFavorites();
          if (res?.favoriteCarros) {
            apiFavorites = res.favoriteCarros.map((c) => ({
              id: String(c.linhagemId || c.id),
              name: `${c.modelo || c.name || ''} ${c.ano || ''}`.trim(),
              brand: c.marca || c.brand || 'Ford',
              image: c.imagemUrl || c.image || null,
              type: c.categoria || c.segment || 'Veículo',
            }));
          }
        } catch {
          // Utiliza os locais se offline / mock
        }

        // Mescla sem duplicar pelo id
        const map = new Map();
        [...localFavorites, ...apiFavorites].forEach((car) => {
          if (car && car.id && !map.has(String(car.id))) {
            map.set(String(car.id), car);
          }
        });

        setCars(Array.from(map.values()));
      } catch (err) {
        console.error('Erro ao carregar veículos salvos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [isOpen]);

  const filteredCars = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return cars;
    return cars.filter((car) =>
      [car.name, car.brand, car.type, car.engine]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(term))
    );
  }, [cars, search]);

  if (!isOpen) return null;

  return (
    <div className="floating-vehicle-modal-backdrop" onClick={onClose}>
      <div
        className="floating-vehicle-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Selecionar veículo salvo"
      >
        <div className="floating-vehicle-modal-header">
          <div className="floating-vehicle-title">
            <div className="floating-vehicle-icon">
              <IoCarSportOutline />
            </div>
            <div>
              <span>Veículos Salvos</span>
              <h3>Inserir na Anotação</h3>
            </div>
          </div>
          <button
            type="button"
            className="floating-vehicle-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className="floating-vehicle-search">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Buscar em veículos salvos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="floating-vehicle-list">
          {loading ? (
            <div className="floating-vehicle-empty">
              <span>Carregando seus veículos salvos...</span>
            </div>
          ) : filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <button
                type="button"
                key={car.id}
                className="floating-vehicle-item"
                onClick={() => {
                  onSelectCar(car);
                  onClose();
                }}
              >
                <div className="floating-vehicle-thumb">
                  {car.image ? (
                    <img src={car.image} alt={car.name} />
                  ) : (
                    <IoCarSportOutline />
                  )}
                </div>
                <div className="floating-vehicle-info">
                  <span className="floating-vehicle-brand">{car.brand}</span>
                  <strong>{car.name}</strong>
                  <small>
                    {[car.year, car.type || car.segment, car.engine || car.power]
                      .filter(Boolean)
                      .join(' · ')}
                  </small>
                </div>
                <IoCheckmarkOutline className="floating-vehicle-check" />
              </button>
            ))
          ) : (
            <div className="floating-vehicle-empty">
              <IoCarSportOutline />
              <p>Nenhum veículo salvo encontrado</p>
              <small>
                Favorite ou salve veículos no catálogo para inseri-los facilmente nas suas anotações.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
