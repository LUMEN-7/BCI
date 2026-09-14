import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, getComparacoesSalvas, removerComparacaoSalva,  } from '@/services/userService';
import {getImage} from "@/services/carsService"

function adaptarCarroSalvo(carro) {
    const specs = carro.especificacoes?.[0] || {};
    return {
        id: `car-${carro.linhagemId ?? carro.id}`,
        linhagemId: carro.linhagemId ?? carro.id,
        name: `${carro.modelo} ${carro.ano}`,
        brand: carro.marca,
        image: carro.imagemUrl || 'https://via.placeholder.com/600x400?text=Sem+Foto',
        engine: specs.transmissao?.Fontes?.[0]?.Valor ?? 'N/D', // ver nota abaixo sobre esse campo
        power: specs.potencia?.Fontes?.[0]?.Valor ? `${specs.potencia.Fontes[0].Valor} cv` : 'N/D',
        type: carro.categoria?.Fontes?.[0]?.Valor ?? 'Veículo',
        description: 'Veículo favoritado. Acompanhe especificações e fique de olho nas atualizações do mercado automotivo.',
    };
}

async function adaptarComparacaoSalva(comparacao) {
	const payload = JSON.parse(comparacao.requestPayload ?? '{}');
	const [primeiro, segundo] = payload.carrosIds ?? [];
    const [car1imagem, car2imagem] = await Promise.all([
        primeiro ? getImage(primeiro).catch(() => null) : Promise.resolve(null),
        segundo ? getImage(segundo).catch(() => null) : Promise.resolve(null),
    ]);
    return {
        id: comparacao.id,
        result: comparacao.titulo,
        description: `Análise comparativa do tipo ${comparacao.tipo}.`,
        requestPayload: comparacao.requestPayload,
        firstCar: 'Modelo Base',
        secondCar: 'Adversários',
        firstImage: car1imagem?.imagemUrl ?? "",
        secondImage: car2imagem?.imagemUrl ?? "" ,
    };
}

export default function useSavedController() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('cars');
	const [savedCars, setSavedCars] = useState([]);
	const [savedComparisons, setSavedComparisons] = useState([]);
	const [openCards, setOpenCards] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function carregar() {
			setLoading(true);
			setError('');
			try {
				const [carros, comparacoes] = await Promise.all([getFavorites(), getComparacoesSalvas()]);
				setSavedCars((carros.favoriteCarros ?? carros).map(adaptarCarroSalvo));
				setSavedComparisons(await Promise.all(comparacoes.map(adaptarComparacaoSalva)));
			} catch (err) {
				setError(err.message || 'Não foi possível carregar seus salvos.');
			} finally {
				setLoading(false);
			}
		}
		carregar();
	}, []);

	const currentItems = useMemo(() => activeTab === 'cars' ? savedCars : savedComparisons, [activeTab, savedCars, savedComparisons]);
	const toggleCard = (id) => setOpenCards((current) => ({ ...current, [id]: !current[id] }));
	const changeTab = (tab) => { setActiveTab(tab); setOpenCards({}); };

	function handleComparisonDetails(comparacaoId) {
		const comparacao = savedComparisons.find((c) => c.id === comparacaoId);
		if (!comparacao) return;
		try {
			const payload = JSON.parse(comparacao.requestPayload ?? '{}');
			const [primeiro, segundo] = payload.carrosIds ?? [];
			navigate('/compare/detail', { state: { firstCar: primeiro, secondCar: segundo } });
		} catch {
			navigate('/saved');
		}
	}

	async function deleteItem(id) {
		const anterior = { cars: savedCars, comparisons: savedComparisons };
		const item = currentItems.find((i) => i.id === id);

		if (activeTab === 'cars') setSavedCars((current) => current.filter((car) => car.id !== id));
		else setSavedComparisons((current) => current.filter((c) => c.id !== id));
		setOpenCards((current) => { const next = { ...current }; delete next[id]; return next; });

		try {
			if (activeTab === 'cars') await removeFavorite(item.linhagemId);
			else await removerComparacaoSalva(id);
		} catch (err) {
			setSavedCars(anterior.cars);
			setSavedComparisons(anterior.comparisons);
			setError(err.message || 'Não foi possível remover.');
		}
	}

	return {
		activeTab, savedCars, savedComparisons, currentItems, openCards, loading, error,
		toggleCard, changeTab, deleteItem,
		handleCarDetails: (id) => navigate(`/information/${id.replace('car-', '')}`),
		handleComparisonDetails,
	};
}