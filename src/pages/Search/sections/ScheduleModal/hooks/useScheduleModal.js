import { useState, useEffect, useMemo } from 'react';
import {
  getScheduledSearches,
  saveScheduledSearch,
  deleteScheduledSearch,
  toggleScheduledSearchStatus,
} from '@/utils/scheduledSearchesStorage';
import { mockCars } from '@/pages/Compare/data';
import { getRecentViewedCars } from '@/utils/recentViewedCars';
import { getFavoriteCars } from '@/utils/savedItemsStorage';

export const RECURRENCE_OPTIONS = [
  { id: 'once', label: 'Uma única vez' },
  { id: 'daily', label: 'Diariamente' },
  { id: 'weekly', label: 'Semanalmente' },
  { id: 'monthly', label: 'Mensalmente' },
];

export function useScheduleModal({ isOpen, onClose, availableCars = [], initialSelectedCar, onExecuteScheduledSearch }) {
  const [activeTab, setActiveTab] = useState('NEW');
  const [scheduledList, setScheduledList] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [carSearch, setCarSearch] = useState('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('once');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const allCars = useMemo(() => {
    const map = new Map();
    const sourceLists = [availableCars, getFavoriteCars(), getRecentViewedCars(10), mockCars];

    sourceLists.forEach((list) => {
      if (Array.isArray(list)) {
        list.forEach((c) => {
          if (!c) return;
          const id = String(c.id || c.linhagemId || '');
          if (id && !map.has(id)) {
            map.set(id, {
              id,
              modelo: c.modelo || c.name || `Veículo ${id}`,
              brand: c.brand || c.marca || 'Ford',
              image: c.image || c.imagemUrl || null,
              ano: c.ano || c.year || '',
              segment: c.segment || c.categoria || c.type || 'Veículo',
            });
          }
        });
      }
    });

    return Array.from(map.values());
  }, [availableCars]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const refreshScheduledList = () => setScheduledList(getScheduledSearches());

  useEffect(() => {
    if (isOpen) {
      refreshScheduledList();
      if (initialSelectedCar) {
        setSelectedCarId(String(initialSelectedCar.id));
        setIsCarDropdownOpen(false);
      } else if (!selectedCarId && allCars.length > 0) {
        setSelectedCarId(String(allCars[0].id));
      }

      if (!date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialSelectedCar, allCars]);

  useEffect(() => {
    window.addEventListener('scheduled-searches-updated', refreshScheduledList);
    window.addEventListener('storage', refreshScheduledList);
    return () => {
      window.removeEventListener('scheduled-searches-updated', refreshScheduledList);
      window.removeEventListener('storage', refreshScheduledList);
    };
  }, []);

  const selectedCar = useMemo(() => {
    return allCars.find((c) => String(c.id) === String(selectedCarId)) || allCars[0] || null;
  }, [allCars, selectedCarId]);

  const filteredCars = useMemo(() => {
    const term = carSearch.toLowerCase().trim();
    if (!term) return allCars;
    return allCars.filter((c) => {
      const name = c.modelo || c.name || '';
      const brand = c.brand || '';
      const seg = c.segment || '';
      return (
        name.toLowerCase().includes(term) ||
        brand.toLowerCase().includes(term) ||
        seg.toLowerCase().includes(term)
      );
    });
  }, [allCars, carSearch]);

  const handleSelectCar = (car) => {
    setSelectedCarId(String(car.id));
    setIsCarDropdownOpen(false);
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedCar) return setFormError('Selecione um modelo de veículo para a pesquisa.');
    if (!date) return setFormError('Escolha a data da pesquisa.');
    if (!time) return setFormError('Escolha o horário da pesquisa.');

    saveScheduledSearch({
      carId: selectedCar.id,
      carName: selectedCar.modelo || selectedCar.name || 'Veículo',
      carBrand: selectedCar.brand || 'Ford',
      carImage: selectedCar.image || null,
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
    deleteScheduledSearch(id);
    refreshScheduledList();
  };

  const handleToggleStatus = (id, e) => {
    e.stopPropagation();
    toggleScheduledSearchStatus(id);
    refreshScheduledList();
  };

  const handleRunNow = (item, e) => {
    e.stopPropagation();
    onExecuteScheduledSearch?.(item);
    onClose();
  };

  return {
    state: {
      activeTab,
      scheduledList,
      selectedCar,
      carSearch,
      isCarDropdownOpen,
      date,
      time,
      recurrence,
      notes,
      formError,
      successToast,
      todayStr,
      filteredCars,
    },
    actions: {
      setActiveTab,
      setCarSearch,
      setIsCarDropdownOpen,
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