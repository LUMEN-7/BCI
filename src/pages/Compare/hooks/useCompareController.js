import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCars } from '@/services/carsService';

export const SIMILARITY_FILTERS = [
    { id: 'engine', label: 'Motor semelhante' },
    { id: 'price', label: 'Faixa de preço semelhante' },
    { id: 'performance', label: 'Desempenho semelhante' },
    { id: 'category', label: 'Mesma categoria' },
    { id: 'transmission', label: 'Mesma transmissão' },
    { id: 'dimensions', label: 'Dimensões semelhantes' },
    { id: 'safety', label: 'Mesmos recursos de segurança' },
    { id: 'technology', label: 'Mesmos recursos de tecnologia' },
];

function parseNumber(value) {
    if (value === null || value === undefined) return null;
    const match = String(value).match(/(\d+(?:[.,]\d+)?)/);
    if (!match) return null;
    return Number(match[1].replace(',', '.'));
}

// sem dado em algum dos lados: não bloqueia o resultado, apenas não compara
function withinTolerance(a, b, tolerance) {
    if (a === null || b === null) return true;
    const base = Math.max(Math.abs(a), Math.abs(b), 1);
    return Math.abs(a - b) / base <= tolerance;
}

function textOverlaps(a, b) {
    if (!a || !b) return true;
    const normA = String(a).toLowerCase().trim();
    const normB = String(b).toLowerCase().trim();
    return normA === normB || normA.includes(normB) || normB.includes(normA);
}

function listOverlapRatio(listA = [], listB = []) {
    if (!listA.length || !listB.length) return true;
    const setB = new Set(listB.map((item) => String(item).toLowerCase().trim()));
    const shared = listA.filter((item) => setB.has(String(item).toLowerCase().trim())).length;
    return shared / Math.max(listA.length, listB.length) >= 0.5;
}

function matchesSimilarity(car, reference, filterId) {
    switch (filterId) {
        case 'engine':
            return textOverlaps(car.engine, reference.engine) || withinTolerance(parseNumber(car.engine), parseNumber(reference.engine), 0.25);
        case 'price':
            return withinTolerance(car.price, reference.price, 0.2);
        case 'performance':
            return withinTolerance(car.powerValue, reference.powerValue, 0.2);
        case 'category':
            return textOverlaps(car.type, reference.type);
        case 'transmission':
            return textOverlaps(car.transmission, reference.transmission);
        case 'dimensions': {
            const carRef = car.dimensions?.wheelbase ?? car.dimensions?.length;
            const referenceRef = reference.dimensions?.wheelbase ?? reference.dimensions?.length;
            return withinTolerance(carRef, referenceRef, 0.1);
        }
        case 'safety':
            return listOverlapRatio(car.safetyFeatures, reference.safetyFeatures);
        case 'technology':
            return listOverlapRatio(car.technologyFeatures, reference.technologyFeatures);
        default:
            return true;
    }
}

// Adaptador para traduzir o DTO do C# para os cards da tela de seleção
function adaptCarToSelection(carDto) {
    const safeGet = (obj, key) => obj?.[key]?.Fontes?.[0]?.Valor;
    const specs = carDto.especificacoes?.[0] || {};
    const dimensoesDto = carDto.dimensoes?.[0] || {};
    const secoes = carDto.secoes || carDto.sections || {};
    const categoria = carDto.categoria?.Fontes?.[0]?.Valor || 'Geral';
    const potenciaValor = safeGet(specs, 'potencia');

    return {
        id: carDto.id,
        brand: carDto.marca,
        name: `${carDto.modelo} ${carDto.ano}`,
        image: carDto.imagemUrl || null,
        // Ajuste 'motor' e 'potencia' conforme a grafia exata do seu DTO em C#
        engine: safeGet(specs, 'motor') || 'Motor não informado', 
        power: potenciaValor ? `${potenciaValor} cv` : '-- cv',
        powerValue: parseNumber(potenciaValor),
        type: categoria,
        transmission: safeGet(specs, 'transmissao') || null,
        price: safeGet(carDto.preco?.[0] || {}, 'valor') ?? carDto.precoMedio ?? null,
        dimensions: {
            length: safeGet(dimensoesDto, 'comprimento') ?? null,
            width: safeGet(dimensoesDto, 'largura') ?? null,
            height: safeGet(dimensoesDto, 'altura') ?? null,
            wheelbase: safeGet(dimensoesDto, 'entreEixos') ?? null,
        },
        safetyFeatures: secoes.seguranca || secoes.security || [],
        technologyFeatures: secoes.tecnologia || secoes.technology || [],
    };
}

export default function useCompareController() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialFirstCar = location.state?.firstCar || null;
    const [firstCar, setFirstCar] = useState(initialFirstCar);
    const [secondCar, setSecondCar] = useState(null);
    const [activeSlot, setActiveSlot] = useState(initialFirstCar ? 'second' : 'first');
    const [search, setSearch] = useState('');
    const [activeSimilarityFilters, setActiveSimilarityFilters] = useState([]);

    // Estados da API
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCars() {
            try {
                setLoading(true);
                // Rota que lista todos os carros. Ajuste se a URL for diferente.
                const response = await getCars();

                setCars(response.map(adaptCarToSelection));
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar o catálogo.');
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    // Aplica o filtro de busca local na lista já baixada da API
    const referenceCar = firstCar || secondCar || null;

    const results = useMemo(() => {
        const term = search.trim().toLowerCase();
        let list = cars;

        if (term) {
            list = list.filter((car) =>
                `${car.brand} ${car.name} ${car.engine} ${car.power} ${car.type}`
                    .toLowerCase()
                    .includes(term)
            );
        }

        if (referenceCar && activeSimilarityFilters.length > 0) {
            list = list.filter((car) =>
                car.id === referenceCar.id ||
                activeSimilarityFilters.every((filterId) => matchesSimilarity(car, referenceCar, filterId))
            );
        }

        return list;
    }, [search, cars, activeSimilarityFilters, referenceCar]);

    function toggleSimilarityFilter(filterId) {
        setActiveSimilarityFilters((prev) =>
            prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
        );
    }

    const canCompare = Boolean(firstCar && secondCar);

    function selectCar(car) {
        if (firstCar?.id === car.id) {
            setFirstCar(null);
            setActiveSlot('first');
            return;
        }
        if (secondCar?.id === car.id) {
            setSecondCar(null);
            setActiveSlot('second');
            return;
        }
        if (!firstCar) {
            setFirstCar(car);
            setActiveSlot('second');
            return;
        }
        if (!secondCar) {
            setSecondCar(car);
            return;
        }
        if (activeSlot === 'first') setFirstCar(car);
        else setSecondCar(car);
    }

    function removeCar(slot) {
        if (slot === 'first') {
            setFirstCar(null);
            setActiveSlot('first');
            return;
        }
        setSecondCar(null);
        setActiveSlot('second');
    }

    function handleCompare() {
        if (!canCompare) return;
        navigate('/compare/detail', { state: { firstCar, secondCar } });
    }

    return {
        loading,
        error,
        cars,
        firstCar,
        secondCar,
        activeSlot,
        search,
        results,
        canCompare,
        referenceCar,
        similarityFilters: SIMILARITY_FILTERS,
        activeSimilarityFilters,
        toggleSimilarityFilter,
        setActiveSlot,
        setSearch,
        selectCar,
        removeCar,
        handleCompare,
    };
}