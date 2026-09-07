import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cars } from '../data';

export default function useSearchController() {
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState([]);

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

        return cars.filter((car) => {
            const matchesSearch =
                !term ||
                car.name.toLowerCase().includes(term) ||
                car.brand.toLowerCase().includes(term) ||
                car.segment.toLowerCase().includes(term);
            const matchesBrand = !selectedBrand || car.brand === selectedBrand;
            const matchesYear = !selectedYear || car.year === Number(selectedYear);

            return matchesSearch && matchesBrand && matchesYear;
        });
    }, [search, selectedBrand, selectedYear]);

    const hasFilters = Boolean(search.trim() || selectedBrand || selectedYear);

    function toggleFavorite(id) {
        setFavorites((previousFavorites) =>
            previousFavorites.includes(id)
                ? previousFavorites.filter((item) => item !== id)
                : [...previousFavorites, id]
        );
    }

    function clearFilters() {
        setSearch('');
        setSelectedBrand('');
        setSelectedYear('');
    }

    function handleSearchChange(event) {
        setSearch(event.target.value);
    }

    function handleBrandChange(event) {
        setSelectedBrand(event.target.value);
    }

    function handleYearChange(event) {
        setSelectedYear(event.target.value);
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
        handleSearchChange,
        handleBrandChange,
        handleYearChange,
        toggleFavorite,
        clearFilters,
        handleDetails,
    };
}
