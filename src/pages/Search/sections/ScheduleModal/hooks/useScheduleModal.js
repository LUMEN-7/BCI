import { useState, useEffect, useMemo } from 'react';
import { getScheduledSearches, saveScheduledSearch, deleteScheduledSearch, toggleScheduledSearchStatus, executarAgendamentoAgora } from '@/services/agendamentoService';
import { getFavorites } from '@/services/userService';
import {
  getScheduledSearches,
  saveScheduledSearch,
  deleteScheduledSearch,
  toggleScheduledSearchStatus,
} from '@/utils/scheduledSearchesStorage';
import { getRecentViewedCars } from '@/utils/recentViewedCars';

export const RECURRENCE_OPTIONS = [
  { id: 'once', label: 'Uma única vez' },
  { id: 'daily', label: 'Diariamente' },
  { id: 'weekly', label: 'Semanalmente' },
  { id: 'monthly', label: 'Mensalmente' },
];

function adaptarCarroApi(c) {
  return { id: String(c.linhagemId ?? c.id), modelo: c.modelo, brand: c.marca ?? 'Ford', image: c.imagemUrl ?? null, ano: c.ano ?? '', segment: c.categoria?.fontes?.[0]?.valor ?? 'Veículo' };
}

function adaptarCarroRecente(c) {
  const id = String(c.id ?? c.linhagemId ?? '');
  return { id, modelo: c.name ?? c.modelo ?? `Veículo ${id}`, brand: c.brand ?? c.marca ?? 'Ford', image: c.image ?? null, ano: c.year ?? c.ano ?? '', segment: c.segment ?? c.type ?? 'Veículo' };
}

export function useScheduleModal({ isOpen, onClose, initialSelectedCar, onExecuteScheduledSearch }) {
  const [activeTab, setActiveTab] = useState('NEW');
  const [scheduledList, setScheduledList] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [carSearch, setCarSearch] = useState('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [isUnreleased, setIsUnreleased] = useState(false);
  const [unreleasedName, setUnreleasedName] = useState('');
  const [unreleasedBrand, setUnreleasedBrand] = useState('');
  const [unreleasedYear, setUnreleasedYear] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('once');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

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
        const favoritosResult = await getFavorites();
        const favoritos = (favoritosResult.favoriteCarros ?? favoritosResult).map(adaptarCarroApi);
        const idsFavoritos = new Set(favoritos.map((c) => c.id));
        const recentes = getRecentViewedCars(10).map(adaptarCarroRecente).filter((c) => c.id && !idsFavoritos.has(c.id));
        setAllCars([...favoritos, ...recentes]);
      } catch (err) {
        setFormError(err.message || 'Não foi possível carregar seus veículos.');
      }
    }
    carregar();

    if (initialSelectedCar) {
      setSelectedCarId(String(initialSelectedCar.id));
      setIsCarDropdownOpen(false);
    }
    if (!date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, initialSelectedCar]);

  const selectedCar = useMemo(
    () => allCars.find((c) => String(c.id) === String(selectedCarId)) || allCars[0] || null,
    [allCars, selectedCarId]
  );

  const filteredCars = useMemo(() => {
    const term = carSearch.toLowerCase().trim();
    if (!term) return allCars;
    return allCars.filter((c) => [c.modelo, c.brand, c.segment].filter(Boolean).some((v) => v.toLowerCase().includes(term)));
  }, [allCars, carSearch]);

  const handleSelectCar = (car) => {
    setSelectedCarId(String(car.id));
    setIsCarDropdownOpen(false);
    setFormError('');
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
      await saveScheduledSearch({ car: selectedCar, date, time, recurrence, notes: notes.trim() });
      await refreshScheduledList();
      setSuccessToast(`Pesquisa agendada para ${selectedCar.modelo}!`);
      setTimeout(() => { setSuccessToast(''); setActiveTab('LIST'); }, 1200);
    } catch (err) {
      setFormError(err.message || 'Não foi possível agendar a pesquisa.');
    }
  }

  async function handleDeleteSchedule(id, e) {
    saveScheduledSearch({
      carId: selectedCar.id,
      carName: selectedCar.modelo || selectedCar.name || 'Veículo',
      carBrand: selectedCar.brand || 'Ford',
      carImage: selectedCar.image || null,
      carYear: selectedCar.ano || '',
      isUnreleased,
      date,
      time,
      recurrence,
      notes: notes.trim(),
    });

    setSuccessToast(`Pesquisa agendada para ${selectedCar.modelo || selectedCar.name}!`);
    setTimeout(() => {
      setSuccessToast('');
      setActiveTab('LIST');
    }, 1200);
  };

  const handleDeleteSchedule = (id, e) => {
    e.stopPropagation();
    try { await deleteScheduledSearch(id); await refreshScheduledList(); }
    catch (err) { setFormError(err.message || 'Não foi possível excluir.'); }
  }

  async function handleToggleStatus(id, e) {
    e.stopPropagation();
    try { await toggleScheduledSearchStatus(id); await refreshScheduledList(); }
    catch (err) { setFormError(err.message || 'Não foi possível atualizar o status.'); }
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
    state: { activeTab, scheduledList, selectedCar, carSearch, isCarDropdownOpen, date, time, recurrence, notes, formError, successToast, todayStr, filteredCars },
    actions: { setActiveTab, setCarSearch, setIsCarDropdownOpen, setDate, setTime, setRecurrence, setNotes, handleSelectCar, handleSubmit, handleDeleteSchedule, handleToggleStatus, handleRunNow },
  };
}