import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars, getFavorites, addFavorites, removeFavorite } from '@/services/carsService';
import { appendNavigationActivity } from '@/utils/navigationActivity';
import { getRecentViewedCars, appendRecentViewedCar } from '@/utils/recentViewedCars';

function adaptCar(car) {
  return {
    id: String(car.linhagemId ?? car.id),
    brand: car.marca ?? car.brand ?? 'Ford',
    modelo: car.modelo ? (car.modelo.includes(String(car.ano ?? '')) ? car.modelo : `${car.modelo} ${car.ano ?? ''}`.trim()) : (car.name ?? 'Modelo'),
    ano: car.ano ?? car.year ?? '',
    image: car.imagemUrl ?? car.image ?? null,
    segment: car.categoria?.Fontes?.[0]?.Valor ?? car.categoria ?? car.segment ?? '',
  };
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
    const [recentCars, setRecentCars] = useState(() => getRecentViewedCars(5));

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            setError('');
            try {
                const [carrosResult, favoritosResult] = await Promise.all([
                    getCars().catch(() => []),
                    getFavorites().catch(() => ({ favoriteCarros: [] })),
                ]);
                if (Array.isArray(carrosResult) && carrosResult.length > 0) {
                    setCars(carrosResult.map(adaptCar));
                }
                setFavorites(favoritosResult.favoriteCarros?.map((c) => String(c.linhagemId ?? c.id)) ?? []);
            } catch (err) {
                setError(err.message || 'Não foi possível carregar os carros.');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    useEffect(() => {
        function updateRecent() {
            setRecentCars(getRecentViewedCars(5));
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
                car.segment.toLowerCase().includes(term);

            const matchesBrand =
                !selectedBrand ||
                car.brand.toLowerCase() === selectedBrand.toLowerCase();

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
            console.log(err)   
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
        setSelectedYear(val);
        setValidationError('');
    }

    function handleDetails(id) {
        const strId = String(id);
        const selectedCar = cars.find((car) => String(car.id) === strId) ||
            recentCars.find((car) => String(car.id) === strId);

        const carName = selectedCar?.modelo || selectedCar?.name || `Carro ${id}`;

        if (selectedCar) {
            appendRecentViewedCar(selectedCar);
        }
        appendNavigationActivity(`/information/${id}`, { car: { name: carName } });
        navigate(`/information/${id}`, { state: { car: selectedCar } });
    }

    function executeSearch() {
        if (!search.trim() && !selectedBrand && !selectedYear) {
            setIsSearchExecuted(false);
            setValidationError('Digite um termo de pesquisa ou selecione um filtro para começar.');
            return;
        }

        setValidationError('');
        setIsSearchExecuted(true);
    }

    return {
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
        executeSearch,
        handleSearchChange,
        handleBrandChange,
        handleYearChange,
        removeFilter,
        toggleFavorite,
        clearFilters,
        handleDetails,
    };
}