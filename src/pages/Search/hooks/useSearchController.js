import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars, getFavorites, addFavorites, removeFavorite } from '@/services/carsService';

function adaptCar(car) {
  return {
    id: car.linhagemId,
    brand: car.marca,
    modelo: `${car.modelo} ${car.ano}`,
    ano: car.ano,
    image: null, // sem fonte de foto de car ainda — pausado
    segment: car.categoria?.Fontes?.[0]?.Valor ?? '',
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

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            setError('');
            try {
                const [carrosResult, favoritosResult] = await Promise.all([getCars(), getFavorites()]);
                setCars(carrosResult.map(adaptCar));
                setFavorites(favoritosResult.favoriteCarros?.map((c) => c.linhagemId) ?? []);
            } catch (err) {
                setError(err.message || 'Não foi possível carregar os carros.');
            } finally {
                setLoading(false);
            }
            
        }
        carregar();
    }, []);

    const brands = useMemo(() => [...new Set(cars.map((car) => car.brand))], [cars]);
    const years = useMemo(() => [...new Set(cars.map((car) => car.ano))].sort((a, b) => b - a), [cars]);

    const results = useMemo(() => {
        const term = search.toLowerCase().trim();
        return cars.filter((car) => {
            const matchesSearch = !term || car.modelo.toLowerCase().includes(term) || car.brand.toLowerCase().includes(term) || car.segment.toLowerCase().includes(term);
            const matchesBrand = !selectedBrand || car.brand === selectedBrand;
            const matchesYear = !selectedYear || car.ano === Number(selectedYear);
            return matchesSearch && matchesBrand && matchesYear;
        });
    }, [cars, search, selectedBrand, selectedYear]);

    const hasFilters = Boolean(search.trim() || selectedBrand || selectedYear);

    async function toggleFavorite(id) {
        const jaFavoritado = favorites.includes(id);
        try {
            if (jaFavoritado) {
                await removeFavorite(id);
                setFavorites((prev) => prev.filter((f) => f !== id));
            } else {
                await addFavorites(id);
                setFavorites((prev) => [...prev, id]);
            }
            return { success: true, acao: jaFavoritado ? 'removido' : 'adicionado' };
        } catch (err) {
            setError(err.message || 'Não foi possível atualizar os favoritos.');
            return { success: false };
        }
    }

    function clearFilters() { setSearch(''); setSelectedBrand(''); setSelectedYear(''); }
    function handleSearchChange(e) { setSearch(e.target.value); }
    function handleBrandChange(e) { setSelectedBrand(e.target.value); }
    function handleYearChange(e) { setSelectedYear(e.target.value); }
    function handleDetails(id) { navigate(`/information/${id}`); }

    return {
        brands, years, results, search, selectedBrand, selectedYear, favorites,
        hasFilters, loading, error,
        handleSearchChange, handleBrandChange, handleYearChange, toggleFavorite, clearFilters, handleDetails,
    };
}