import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_SIMILAR_MODELS, SIMILARITY_FILTERS, computeSimilarity, matchesSimilarity } from '../data';

export default function useMultiCompareController({ cars }) {
    const navigate = useNavigate();

    const [referenceCar, setReferenceCar] = useState(null);
    const [referenceSearch, setReferenceSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeSimilarityFilters, setActiveSimilarityFilters] = useState([]);
    const [similarityConfirmed, setSimilarityConfirmed] = useState(false);

    const referenceResults = useMemo(() => {
        const term = referenceSearch.trim().toLowerCase();
        if (!term) return cars;
        return cars.filter((car) =>
            `${car.brand} ${car.name} ${car.engine} ${car.power} ${car.type}`
                .toLowerCase()
                .includes(term)
        );
    }, [cars, referenceSearch]);

    const similarCars = useMemo(() => {
        if (!referenceCar || !similarityConfirmed) return [];
        return cars
            .filter((car) => car.id !== referenceCar.id)
            .filter((car) => activeSimilarityFilters.every((filterId) => matchesSimilarity(car, referenceCar, filterId)))
            .map((car) => ({ ...car, similarity: computeSimilarity(car, referenceCar) }))
            .sort((a, b) => b.similarity - a.similarity);
    }, [activeSimilarityFilters, cars, referenceCar, similarityConfirmed]);

    const selectedCars = useMemo(
        () => similarCars.filter((car) => selectedIds.includes(car.id)),
        [similarCars, selectedIds]
    );

    function selectReference(car) {
        setReferenceCar(car);
        setSelectedIds([]);
        setReferenceSearch('');
        setActiveSimilarityFilters([]);
        setSimilarityConfirmed(false);
    }

    function changeReference() {
        setReferenceCar(null);
        setSelectedIds([]);
        setActiveSimilarityFilters([]);
        setSimilarityConfirmed(false);
    }

    function toggleSimilarityFilter(filterId) {
        setActiveSimilarityFilters((current) =>
            current.includes(filterId)
                ? current.filter((id) => id !== filterId)
                : [...current, filterId]
        );
        setSimilarityConfirmed(false);
        setSelectedIds([]);
    }

    function confirmSimilarity() {
        if (activeSimilarityFilters.length === 0) return;
        setSelectedIds([]);
        setSimilarityConfirmed(true);
    }

    function toggleSimilar(car) {
        setSelectedIds((current) => {
            if (current.includes(car.id)) return current.filter((id) => id !== car.id);
            if (current.length >= MAX_SIMILAR_MODELS) return current;
            return [...current, car.id];
        });
    }

    const canCompare = selectedCars.length >= 2;

    function handleCompare() {
        if (!canCompare || !referenceCar) return;
        navigate('/compare/detail', { state: { cars: [referenceCar, ...selectedCars] } });
    }

    return {
        referenceCar,
        referenceSearch,
        setReferenceSearch,
        referenceResults,
        similarCars,
        selectedIds,
        selectedCars,
        similarityFilters: SIMILARITY_FILTERS,
        activeSimilarityFilters,
        similarityConfirmed,
        canCompare,
        maxSimilar: MAX_SIMILAR_MODELS,
        selectReference,
        changeReference,
        toggleSimilarityFilter,
        confirmSimilarity,
        toggleSimilar,
        handleCompare,
    };
}
