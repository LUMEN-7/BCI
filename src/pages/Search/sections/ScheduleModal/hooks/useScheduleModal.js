import { useState, useEffect, useMemo } from 'react';
import { getScheduledSearches, saveScheduledSearch, deleteScheduledSearch, toggleScheduledSearchStatus, executarAgendamentoAgora } from '@/services/agendamentoService';
import { getFavorites } from '@/services/userService';
import { getRecentViewedCars } from '@/utils/recentViewedCars';

export const RECURRENCE_OPTIONS = [
  { id: 'once', label: 'Uma única vez' },
  { id: 'daily', label: 'Diariamente' },
  { id: 'weekly', label: 'Semanalmente' },
  { id: 'monthly', label: 'Mensalmente' },
];

function adaptarCarroApi(c) {
  return {
    id: String(c.linhagemId ?? c.id),
    modelo: c.modelo,
    brand: c.marca ?? 'Ford',
    image: c.imagemUrl ?? null,
    ano: c.ano ?? '',
    segment: c.categoria?.fontes?.[0]?.valor ?? 'Veículo',
  };
}

function adaptarCarroRecente(c) {
  const id = String(c.id ?? c.linhagemId ?? '');
  return {
    id,
    modelo: c.name ?? c.modelo ?? `Veículo ${id}`,
    brand: c.brand ?? c.marca ?? 'Ford',
    image: c.image ?? c.imagemUrl ?? null,
    ano: c.year ?? c.ano ?? '',
    segment: c.segment ?? c.type ?? 'Veículo',
  };
}

export function useScheduleModal({
  isOpen,
  onClose,
  availableCars = [],
  initialSelectedCar,
  onExecuteScheduledSearch,
}) {
  const [activeTab, setActiveTab] = useState('NEW');
  const [scheduledList, setScheduledList] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [carSearch, setCarSearch] = useState('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

  // Feature: Carro não lançado
  const [isUnreleased, setIsUnreleased] = useState(false);
  const [unreleasedName, setUnreleasedName] = useState('');
  const [unreleasedBrand, setUnreleasedBrand] = useState('');
  const [unreleasedYear, setUnreleasedYear] = useState('');

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('once');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const brandOptions = useMemo(() => {
    return [...new Set(allCars.map((car) => car.brand).filter(Boolean))].sort();
  }, [allCars]);

  async function refreshScheduledList() {
    try {
      setScheduledList(await getScheduledSearches());
    } catch (err) {
      setFormError(err.message || 'Não foi possível carregar os agendamentos.');
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    async function carregar() {
      refreshScheduledList();
      try {
        const disponiveis = availableCars.map(adaptarCarroRecente);
        const favoritosResult = await getFavorites();
        const favoritos = (favoritosResult.favoriteCarros ?? favoritosResult).map(adaptarCarroApi);
        
        const map = new Map();
        [...disponiveis, ...favoritos].forEach((c) => {
          if (c.id && !map.has(c.id)) map.set(c.id, c);
        });

        const recentes = getRecentViewedCars(10)
          .map(adaptarCarroRecente)
          .filter((c) => c.id && !map.has(c.id));

        const listaFinal = [...map.values(), ...recentes];
        setAllCars(listaFinal);

        if (initialSelectedCar) {
          setSelectedCarId(String(initialSelectedCar.id));
          setIsCarDropdownOpen(false);
        } else if (listaFinal.length > 0) {
          setSelectedCarId((currentId) => currentId || String(listaFinal[0].id));
        }
      } catch (err) {
        setFormError(err.message || 'Não foi possível carregar seus veículos.');
      }
    }

    carregar();
  }, [isOpen, initialSelectedCar, availableCars]);

  const selectedCar = useMemo(() => {
    if (isUnreleased) {
      return {
        id: `unreleased-${unreleasedName.trim().toLowerCase().replace(/\s+/g, '-') || 'vehicle'}`,
        modelo: unreleasedName.trim(),
        brand: unreleasedBrand.trim(),
        ano: unreleasedYear,
        image: null,
        segment: 'Não lançado',
        isUnreleased: true,
      };
    }

    return allCars.find((c) => String(c.id) === String(selectedCarId)) || allCars[0] || null;
  }, [allCars, selectedCarId, isUnreleased, unreleasedName, unreleasedBrand, unreleasedYear]);

  const filteredCars = useMemo(() => {
    const term = carSearch.toLowerCase().trim();
    if (!term) return allCars;
    return allCars.filter((c) =>
      [c.modelo, c.brand, c.segment].filter(Boolean).some((v) => v.toLowerCase().includes(term))
    );
  }, [allCars, carSearch]);

  const handleSelectCar = (car) => {
    setSelectedCarId(String(car.id));
    setIsCarDropdownOpen(false);
    setFormError('');
  };

  const handleToggleUnreleased = (value) => {
    setIsUnreleased(value);
    setIsCarDropdownOpen(false);
    setFormError('');
    if (!value && !selectedCarId && allCars.length > 0) {
      setSelectedCarId(String(allCars[0].id));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (isUnreleased) {
      if (!unreleasedName.trim()) return setFormError('Informe o nome do carro não lançado.');
      if (!unreleasedBrand.trim()) return setFormError('Informe a marca do carro não lançado.');
      if (!/^\d{4}$/.test(unreleasedYear)) return setFormError('Informe um ano válido com quatro dígitos.');
    } else if (!selectedCar) {
      return setFormError('Selecione um modelo de veículo para a pesquisa.');
    }

    if (!date) return setFormError('Escolha a data da pesquisa.');
    if (!time) return setFormError('Escolha o horário da pesquisa.');

    try {
      await saveScheduledSearch({
        car: selectedCar,
        date,
        time,
        recurrence,
        notes: notes.trim(),
      });
      await refreshScheduledList();
      setSuccessToast(`Pesquisa agendada para ${selectedCar.modelo}!`);
      setTimeout(() => {
        setSuccessToast('');
        setActiveTab('LIST');
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Não foi possível agendar a pesquisa.');
    }
  }

  async function handleDeleteSchedule(id, e) {
    e.stopPropagation();
    try {
      await deleteScheduledSearch(id);
      await refreshScheduledList();
    } catch (err) {
      setFormError(err.message || 'Não foi possível excluir.');
    }
  }

  async function handleToggleStatus(id, e) {
    e.stopPropagation();
    try {
      await toggleScheduledSearchStatus(id);
      await refreshScheduledList();
    } catch (err) {
      setFormError(err.message || 'Não foi possível atualizar o status.');
    }
  }

  async function handleRunNow(item, e) {
    e.stopPropagation();
    try {
      const resultado = await executarAgendamentoAgora(item.id);
      onExecuteScheduledSearch?.(item, resultado.job_id);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Não foi possível executar agora.');
    }
  }

  return {
    state: {
      activeTab,
      scheduledList,
      selectedCar,
      carSearch,
      isCarDropdownOpen,
      isUnreleased,
      unreleasedName,
      unreleasedBrand,
      unreleasedYear,
      date,
      time,
      recurrence,
      notes,
      formError,
      successToast,
      todayStr,
      filteredCars,
      brandOptions,
    },
    actions: {
      setActiveTab,
      setCarSearch,
      setIsCarDropdownOpen,
      setIsUnreleased: handleToggleUnreleased,
      setUnreleasedName,
      setUnreleasedBrand,
      setUnreleasedYear,
      setDate,
      setTime,
      setRecurrence,
      setNotes,
      handleSelectCar,
      handleSubmit,
      handleDeleteSchedule,
      handleToggleStatus,
      handleRunNow,
    },
  };
}
