import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_SIMILAR_MODELS, computeSimilarity } from '../data';

export default function useMultiCompareController({ cars }) {
    const navigate = useNavigate();

    const [referenceCar, setReferenceCar] = useState(null);
    const [referenceSearch, setReferenceSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

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
        if (!referenceCar) return [];
        return cars
            .filter((car) => car.id !== referenceCar.id)
            .map((car) => ({ ...car, similarity: computeSimilarity(car, referenceCar) }))
            .sort((a, b) => b.similarity - a.similarity);
    }, [cars, referenceCar]);

    const selectedCars = useMemo(
        () => similarCars.filter((car) => selectedIds.includes(car.id)),
        [similarCars, selectedIds]
    );

    function selectReference(car) {
        setReferenceCar(car);
        setSelectedIds([]);
        setReferenceSearch('');
    }

    function changeReference() {
        setReferenceCar(null);
        setSelectedIds([]);
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
        canCompare,
        maxSimilar: MAX_SIMILAR_MODELS,
        selectReference,
        changeReference,
        toggleSimilar,
        handleCompare,
    };
}
