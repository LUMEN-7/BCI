import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars, iniciarBusca, getJobStatus } from '@/services/carsService';
import { getFavorites, getFavoriteIds, addFavorites, removeFavorite } from '@/services/userService';
import { appendNavigationActivity } from '@/utils/navigationActivity';
import { getRecentViewedCars, appendRecentViewedCar } from '@/utils/recentViewedCars';
import { getScheduledSearches } from '@/utils/scheduledSearchesStorage';
import {
  getUserScopedItem,
  getUserScopedJson,
  removeUserScopedItem,
  setUserScopedItem,
  setUserScopedJson,
} from '@/utils/userScopedStorage';
import { getImportedVehicles } from '@/utils/importedVehiclesStorage';

const INFLIGHT_KEY = 'search-inflight';

function normalizarTextoBusca(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function chaveBusca(brand, model, year) {
  const ano = String(year || '').replace(/\D/g, '').slice(0, 4);
  return `${normalizarTextoBusca(brand)}|${normalizarTextoBusca(model)}|${ano}`;
}

function modeloSemAno(modelo, ano) {
  const texto = String(modelo || '').trim();
  const anoStr = String(ano || '').trim();
  if (!anoStr) return texto;
  return texto.replace(new RegExp(`\\s*${anoStr}\\s*$`), '').trim() || texto;
}

function carroBateComBusca(car, brand, model, year) {
  if (normalizarTextoBusca(car.brand) !== normalizarTextoBusca(brand)) return false;

  const modeloCarro = normalizarTextoBusca(modeloSemAno(car.modelo || car.name, car.ano));
  const modeloBusca = normalizarTextoBusca(model);
  if (modeloBusca && modeloCarro !== modeloBusca && !modeloCarro.includes(modeloBusca)) {
    return false;
  }

  if (year) return Number(car.ano) === Number(year);
  return true;
}

function adaptCar(car) {
  return {
    id: String(car.linhagemId ?? car.id),
    brand: car.marca ?? car.brand ?? 'Ford',
    modelo: car.modelo
      ? (car.modelo.includes(String(car.ano ?? '')) ? car.modelo : `${car.modelo} ${car.ano ?? ''}`.trim())
      : (car.name ?? 'Modelo'),
    ano: car.ano ?? car.year ?? '',
    image: car.imagemUrl ?? car.image ?? null,
    segment: car.categoria?.Fontes?.[0]?.Valor ?? car.categoria ?? car.segment ?? '',
  };
}

function adaptImportedCar(car) {
  return {
    ...car,
    id: String(car.id),
    modelo: car.modelo || 'Modelo sem nome',
    brand: car.brand || 'Ford',
    ano: car.ano || '',
    image: car.image || null,
    segment: car.segment || 'Veículo importado',
    isImported: true,
  };
}

function markImportedRecentCars(cars) {
  const importedIds = new Set(getImportedVehicles().map((car) => String(car.id)));
  return cars.map((car) => ({
    ...car,
    isImported: Boolean(car.isImported || importedIds.has(String(car.id))),
  }));
}

export default function useSearchController() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [recentCars, setRecentCars] = useState(() => markImportedRecentCars(getRecentViewedCars(5)));
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleInitialCar, setScheduleInitialCar] = useState(null);
  const [scheduledCount, setScheduledCount] = useState(() => getScheduledSearches().length);
  const [jobId, setJobId] = useState(() => getUserScopedItem('jobId'));
  const [jobStatus, setJobStatus] = useState(() => (getUserScopedItem('jobId') ? 'pending' : null));
  const [searchInFlight, setSearchInFlight] = useState(() => getUserScopedJson(INFLIGHT_KEY));

  const isSearchInFlight = Boolean(
    searchInFlight && jobId && jobStatus !== 'done' && jobStatus !== 'error'
  );

  const updateScheduledCount = () => {
    setScheduledCount(getScheduledSearches().length);
  };

  useEffect(() => {
    window.addEventListener('scheduled-searches-updated', updateScheduledCount);
    window.addEventListener('storage', updateScheduledCount);
    return () => {
      window.removeEventListener('scheduled-searches-updated', updateScheduledCount);
      window.removeEventListener('storage', updateScheduledCount);
    };
  }, []);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setError('');
      try {
        const [carrosResult, favoritosResult] = await Promise.all([
          getCars().catch(() => []),
          getFavorites().catch(() => ({ favoriteCarros: [] })),
        ]);
        const catalogCars = Array.isArray(carrosResult) ? carrosResult.map(adaptCar) : [];
        const importedCars = getImportedVehicles().map(adaptImportedCar);
        setCars([
          ...importedCars,
          ...catalogCars.filter((car) => !importedCars.some((imported) => imported.id === car.id)),
        ]);
        setFavorites(getFavoriteIds(favoritosResult));
      } catch (err) {
        setError(err.message || 'Não foi possível carregar os carros.');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  useEffect(() => {
    function updateImportedCars() {
      const importedCars = getImportedVehicles().map(adaptImportedCar);
      setCars((current) => [
        ...importedCars,
        ...current.filter((car) => !car.isImported && !importedCars.some((imported) => imported.id === car.id)),
      ]);
    }

    window.addEventListener('imported-vehicles-updated', updateImportedCars);
    return () => window.removeEventListener('imported-vehicles-updated', updateImportedCars);
  }, []);

  useEffect(() => {
    function updateRecent() {
      setRecentCars(markImportedRecentCars(getRecentViewedCars(5)));
    }

    window.addEventListener('recent-viewed-cars-updated', updateRecent);
    window.addEventListener('storage', updateRecent);

    return () => {
      window.removeEventListener('recent-viewed-cars-updated', updateRecent);
      window.removeEventListener('storage', updateRecent);
    };
  }, []);

  const brands = useMemo(() => {
    const set = new Set(cars.map((car) => car.brand).filter(Boolean));
    return [...set].sort();
  }, [cars]);

  const years = useMemo(() => {
    const set = new Set(cars.map((car) => car.ano).filter(Boolean));
    return [...set].sort((a, b) => b - a);
  }, [cars]);

  const hasFilters = Boolean(search.trim() || selectedBrand || selectedYear);

  const results = useMemo(() => {
    if (!hasFilters && !isSearchExecuted) return [];

    const term = search.toLowerCase().trim();

    return cars.filter((car) => {
      const matchesSearch =
        !term ||
        car.modelo.toLowerCase().includes(term) ||
        car.brand.toLowerCase().includes(term) ||
        String(car.segment || '').toLowerCase().includes(term);

      const matchesBrand =
        !selectedBrand ||
        car.brand.toLowerCase() === selectedBrand.trim().toLowerCase();

      const matchesYear =
        !selectedYear ||
        Number(car.ano) === Number(selectedYear);

      return matchesSearch && matchesBrand && matchesYear;
    });
  }, [cars, search, selectedBrand, selectedYear, hasFilters, isSearchExecuted]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (search.trim()) {
      chips.push({ id: 'search', label: `Busca: "${search.trim()}"`, type: 'search' });
    }
    if (selectedBrand) {
      chips.push({ id: 'brand', label: `Marca: ${selectedBrand}`, type: 'brand' });
    }
    if (selectedYear) {
      chips.push({ id: 'year', label: `Ano: ${selectedYear}`, type: 'year' });
    }
    return chips;
  }, [search, selectedBrand, selectedYear]);

  function gravarInflight(payload) {
    setSearchInFlight(payload);
    if (payload) setUserScopedJson(INFLIGHT_KEY, payload);
    else removeUserScopedItem(INFLIGHT_KEY);
  }

  async function toggleFavorite(id) {
    const strId = String(id);
    const jaFavoritado = favorites.includes(strId);
    try {
      if (jaFavoritado) {
        await removeFavorite(id);
        setFavorites((prev) => prev.filter((f) => f !== strId));
      } else {
        await addFavorites(id);
        setFavorites((prev) => [...prev, strId]);
      }
      return { success: true, acao: jaFavoritado ? 'removido' : 'adicionado' };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  function removeFilter(type) {
    if (type === 'search') setSearch('');
    if (type === 'brand') setSelectedBrand('');
    if (type === 'year') setSelectedYear('');
    setValidationError('');
  }

  function clearFilters() {
    setSearch('');
    setSelectedBrand('');
    setSelectedYear('');
    setIsSearchExecuted(false);
    setValidationError('');
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setValidationError('');
  }

  function handleBrandChange(brandOrEvent) {
    const val = typeof brandOrEvent === 'string' ? brandOrEvent : (brandOrEvent?.target?.value ?? '');
    setSelectedBrand(val);
    setValidationError('');
  }

  function handleYearChange(yearOrEvent) {
    const val = typeof yearOrEvent === 'string' || typeof yearOrEvent === 'number'
      ? String(yearOrEvent)
      : (yearOrEvent?.target?.value ?? '');
    setSelectedYear(val.replace(/\D/g, '').slice(0, 4));
    setValidationError('');
  }

  function handleDetails(id, carOverride = null) {
    const strId = String(id);
    const selectedCar = cars.find((car) => String(car.id) === strId) ||
      recentCars.find((car) => String(car.id) === strId);

    const carName = selectedCar?.modelo || selectedCar?.name || `Carro ${id}`;

    if (selectedCar) {
      appendRecentViewedCar(selectedCar);
    }
    appendNavigationActivity(`/information/${id}`, { car: { name: carName } });
    navigate(`/information/${id}`, { state: { car: carOverride || selectedCar } });
  }

  async function executeSearch() {
    if (!selectedBrand.trim()) {
      setValidationError('Digite uma marca para realizar a pesquisa.');
      return;
    }

    if (!search.trim() && !selectedBrand && !selectedYear) {
      setIsSearchExecuted(false);
      setValidationError('Digite um termo de pesquisa ou informe uma marca ou ano para começar.');
      return;
    }

    if (selectedYear) {
      const year = Number(selectedYear);
      if (!Number.isInteger(year) || year < 1950 || year > 2050) {
        setValidationError('Digite um ano válido.');
        return;
      }
    }

    const brand = selectedBrand.trim();
    const model = search.trim();
    const year = selectedYear;
    const chave = chaveBusca(brand, model, year);

    if (cars.some((car) => carroBateComBusca(car, brand, model, year))) {
      setValidationError('');
      setIsSearchExecuted(true);
      return;
    }

    if (searchInFlight?.key === chave && jobId && jobStatus !== 'done' && jobStatus !== 'error') {
      setValidationError('');
      setIsSearchExecuted(true);
      return;
    }

    setValidationError('');
    const response = await iniciarBusca({ model, brand, year });
    const id = response.job_id ?? response.jobId;

    setJobId(id);
    setJobStatus('pending');
    setIsSearchExecuted(true);
    setUserScopedItem('jobId', id);
    gravarInflight({
      key: chave,
      jobId: id,
      label: `${brand} ${model} ${year}`.trim(),
      status: 'pending',
    });
  }

  useEffect(() => {
    if (!jobId || jobStatus === 'done' || jobStatus === 'error') return;

    const interval = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId);
        setJobStatus(status.status);

        if (status.status === 'done' && status.carro) {
          setCars((prev) => {
            const novoId = String(status.carro.linhagemId ?? status.carro.id);
            const existe = prev.some((c) => String(c.id) === novoId);
            return existe ? prev : [adaptCar(status.carro), ...prev];
          });
          removeUserScopedItem('jobId');
          gravarInflight(null);
        }

        if (status.status === 'error') {
          gravarInflight(null);
          removeUserScopedItem('jobId');
        }
      } catch {
        setJobStatus('error');
        gravarInflight(null);
        removeUserScopedItem('jobId');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, jobStatus]);

  function handleOpenSchedule(car = null) {
    setScheduleInitialCar(car);
    setIsScheduleModalOpen(true);
  }

  function handleCloseSchedule() {
    setIsScheduleModalOpen(false);
    setScheduleInitialCar(null);
  }

  function handleImportedVehicle(vehicle) {
    const imported = adaptImportedCar(vehicle);
    setCars((current) => [imported, ...current.filter((car) => car.id !== imported.id)]);
    setIsSearchExecuted(true);
    return imported;
  }

  function handleExecuteScheduledSearch(scheduledItem) {
    if (!scheduledItem) return;
    const targetCar = cars.find((c) => String(c.id) === String(scheduledItem.carId));
    if (targetCar) {
      setSearch(targetCar.modelo || targetCar.name || '');
      setSelectedBrand(targetCar.brand || '');
      setSelectedYear(targetCar.ano ? String(targetCar.ano) : '');
      setIsSearchExecuted(true);
    } else {
      setSearch(scheduledItem.carName || '');
      setSelectedBrand(scheduledItem.carBrand || '');
      setSelectedYear(scheduledItem.carYear ? String(scheduledItem.carYear) : '');
      setIsSearchExecuted(true);
    }
  }

  return {
    cars,
    brands,
    years,
    results,
    search,
    selectedBrand,
    selectedYear,
    favorites,
    recentCars,
    hasFilters,
    loading,
    error,
    validationError,
    activeFilterChips,
    isScheduleModalOpen,
    scheduleInitialCar,
    scheduledCount,
    isSearchInFlight,
    inFlightLabel: searchInFlight?.label ?? '',
    executeSearch,
    handleSearchChange,
    handleBrandChange,
    handleYearChange,
    removeFilter,
    toggleFavorite,
    clearFilters,
    handleDetails,
    handleOpenSchedule,
    handleCloseSchedule,
    handleExecuteScheduledSearch,
    handleImportedVehicle,
  };
}
