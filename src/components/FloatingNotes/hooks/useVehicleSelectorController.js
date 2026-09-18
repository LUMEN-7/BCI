import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFavorites } from '@/services/userService';
import { getRecentViewedCars } from '@/utils/recentViewedCars';

function adaptarCarroApi(c) {
  return {
    id: String(c.linhagemId ?? c.id),
    name: `${c.marca ?? ''} ${c.modelo ?? ''} ${c.ano ?? ''}`.trim(),
    brand: c.marca ?? 'Ford',
    image: c.imagemUrl ?? null,
    engine: c.especificacoes?.[0]?.motor?.fontes?.[0]?.valor ?? '',
    power: c.especificacoes?.[0]?.potencia?.fontes?.[0]?.valor ?? '',
    type: c.categoria?.fontes?.[0]?.valor ?? 'Veículo',
    year: c.ano ?? '',
  };
}

function adaptarCarroRecente(car) {
  const id = String(car.id ?? car.linhagemId ?? '');
  return {
    id,
    name: car.name ?? car.modelo ?? `Veículo ${id}`,
    brand: car.brand ?? car.marca ?? 'Ford',
    image: car.image ?? car.imagemUrl ?? null,
    engine: car.engine ?? '',
    power: car.power ?? '',
    type: car.type ?? car.segment ?? 'Veículo',
    year: car.year ?? car.ano ?? '',
  };
}

export function useVehicleSelectorController(isOpen) {
  const [favoritos, setFavoritos] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function loadCars() {
      setLoading(true);
      setError('');
      try {
        const res = await getFavorites();
        const lista = res?.favoriteCarros ?? res ?? [];
        const favoritosAdaptados = lista.map(adaptarCarroApi);
        setFavoritos(favoritosAdaptados);

        const idsFavoritos = new Set(favoritosAdaptados.map((c) => c.id));
        const recentesAdaptados = getRecentViewedCars(10)
          .map(adaptarCarroRecente)
          .filter((c) => c.id && !idsFavoritos.has(c.id));
        setRecentes(recentesAdaptados);
      } catch (err) {
        setError(err.message || 'Não foi possível carregar seus veículos salvos.');
        setFavoritos([]);
        setRecentes([]);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [isOpen]);

  const filtrar = useCallback((lista) => {
    const term = search.toLowerCase().trim();
    if (!term) return lista;
    return lista.filter((car) =>
      [car.name, car.brand, car.type, car.engine].filter(Boolean).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [search]);

  const favoritosFiltrados = useMemo(() => filtrar(favoritos), [favoritos, filtrar]);
  const recentesFiltrados = useMemo(() => filtrar(recentes), [recentes, filtrar]);
  const semResultado = !loading && !error && favoritosFiltrados.length === 0 && recentesFiltrados.length === 0;

  return { search, setSearch, loading, error, favoritosFiltrados, recentesFiltrados, semResultado };
}
