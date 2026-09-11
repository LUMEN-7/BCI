import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cars } from '../data';
import { getFavoriteCarIds, toggleFavoriteCar } from '../../../utils/savedItemsStorage';

export default function useSearchController() {
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState(() => getFavoriteCarIds());
    const [isSearchExecuted, setIsSearchExecuted] = useState(false);
    const [validationError, setValidationError] = useState('');

    const brands = useMemo(
        () => [...new Set(cars.map((car) => car.brand))],
        []
    );

    const years = useMemo(
        () => [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a),
        []
    );

    const results = useMemo(() => {
        const term = search.toLowerCase().trim();

        if (!isSearchExecuted || !term || !selectedBrand || !selectedYear) {
            return [];
        }

        return cars.filter((car) => {
            const matchesSearch =
                car.name.toLowerCase().includes(term) ||
                car.brand.toLowerCase().includes(term) ||
                car.segment.toLowerCase().includes(term);
            const matchesBrand = car.brand === selectedBrand;
            const matchesYear = car.year === Number(selectedYear);

            return matchesSearch && matchesBrand && matchesYear;
        });
    }, [search, selectedBrand, selectedYear, isSearchExecuted]);

    const hasFilters = Boolean(search.trim() || selectedBrand || selectedYear);

    function toggleFavorite(id) {
        const car = cars.find((item) => item.id === id);
        if (!car) return;

        const updatedFavorites = toggleFavoriteCar(car);
        setFavorites(updatedFavorites.map((item) => item.id));
    }

    function clearFilters() {
        setSearch('');
        setSelectedBrand('');
        setSelectedYear('');
        setIsSearchExecuted(false);
        setValidationError('');
    }

    function handleSearchChange(event) {
        setSearch(event.target.value);
        setIsSearchExecuted(false);
        setValidationError('');
    }

    function handleBrandChange(event) {
        setSelectedBrand(event.target.value);
        setIsSearchExecuted(false);
        setValidationError('');
    }

    function handleYearChange(event) {
        setSelectedYear(event.target.value);
        setIsSearchExecuted(false);
        setValidationError('');
    }

    function executeSearch() {
        const missingFields = [];

        if (!search.trim()) {
            missingFields.push('digite o nome do modelo');
        }
        if (!selectedBrand) {
            missingFields.push('selecione uma marca');
        }
        if (!selectedYear) {
            missingFields.push('selecione um ano');
        }

        if (missingFields.length > 0) {
            const lastMissingField = missingFields.pop();
            const missingFieldsText = missingFields.length > 0
                ? `${missingFields.join(', ')} e ${lastMissingField}`
                : lastMissingField;

            setIsSearchExecuted(false);
            setValidationError(`Para pesquisar, ${missingFieldsText}.`);
            return;
        }

        setValidationError('');
        setIsSearchExecuted(true);
    }

    function handleDetails(id) {
        navigate(`/information/${id}`);
    }

    return {
        brands,
        years,
        results,
        search,
        selectedBrand,
        selectedYear,
        favorites,
        hasFilters,
        validationError,
        handleSearchChange,
        handleBrandChange,
        handleYearChange,
        executeSearch,
        toggleFavorite,
        clearFilters,
        handleDetails,
    };
}
