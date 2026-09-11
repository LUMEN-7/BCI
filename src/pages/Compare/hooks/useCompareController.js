import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCars } from '@/services/carsService';

// Adaptador para traduzir o DTO do C# para os cards da tela de seleção
function adaptCarToSelection(carDto) {
    const safeGet = (obj, key) => obj?.[key]?.Fontes?.[0]?.Valor;
    const specs = carDto.especificacoes?.[0] || {};
    const categoria = carDto.categoria?.Fontes?.[0]?.Valor || 'Geral';

    return {
        id: carDto.id,
        brand: carDto.marca,
        name: `${carDto.modelo} ${carDto.ano}`,
        image: carDto.imagemUrl || null,
        // Ajuste 'motor' e 'potencia' conforme a grafia exata do seu DTO em C#
        engine: safeGet(specs, 'motor') || 'Motor não informado', 
        power: safeGet(specs, 'potencia') ? `${safeGet(specs, 'potencia')} cv` : '-- cv',
        type: categoria,
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
    const results = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return cars;

        return cars.filter((car) =>
            `${car.brand} ${car.name} ${car.engine} ${car.power} ${car.type}`
                .toLowerCase()
                .includes(term)
        );
    }, [search, cars]);

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
        firstCar,
        secondCar,
        activeSlot,
        search,
        results,
        canCompare,
        setActiveSlot,
        setSearch,
        selectCar,
        removeCar,
        handleCompare,
    };
}