import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, getComparacoesSalvas, removerComparacaoSalva } from '@/services/carsService';

const READ_UPDATES_KEY = 'readUpdates';

function getReadUpdates() {
	try { return JSON.parse(localStorage.getItem(READ_UPDATES_KEY)) || []; } catch { return []; }
}

const safeExtract = (obj, suffix = '') => {
    let val = obj?.Fontes?.[0]?.Valor;
    if (Array.isArray(val)) {
        val = val.join(', ');
    }
    return val && val !== 'Não informado' ? `${val}${suffix}` : 'Não informado';
};

function adaptarCarroSalvo(carro) {
    const specs = carro.especificacoes?.[0] || {};

    return { 
        id: `car-${carro.id || carro.linhagemId}`, 
        linhagemId: carro.id || carro.linhagemId, 
        name: `${carro.marca} ${carro.modelo} ${carro.ano}`,
        brand: carro.marca,
        image: carro.imagemUrl || 'https://via.placeholder.com/600x400?text=Sem+Foto',
        
        // Os campos abaixo são os que o expand-button do React aguardava!
        engine: safeExtract(specs.motor) !== 'Não informado' ? safeExtract(specs.motor) : 'Motor N/D',
        power: safeExtract(specs.potencia, ' cv'),
        type: safeExtract(carro.categoria),
        description: 'Veículo favoritado. Acompanhe especificações e fique de olho nas atualizações do mercado automotivo.',
        updates: [] 
    };
}
function adaptarComparacaoSalva(comparacao) {
    return { 
        id: comparacao.id, 
        result: comparacao.titulo,
        description: `Análise comparativa do tipo ${comparacao.tipo}.`,
		requestPayload: comparacao.requestPayload,
        
        // Como o backend salva apenas o RequestPayload, colocamos placeholders. 
        // Você pode depois extrair as infos lendo o JSON de comparacao.requestPayload
        firstCar: 'Modelo Base', 
        secondCar: 'Adversários',
        firstImage: 'https://via.placeholder.com/300x200?text=Carro+Base',
        secondImage: 'https://via.placeholder.com/300x200?text=Alvo',
        
        updates: [] 
    };
}

export default function useSavedController() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('cars');
	const [savedCars, setSavedCars] = useState([]);
	const [savedComparisons, setSavedComparisons] = useState([]);
	const [openCards, setOpenCards] = useState({});
	const [firstCar, setFirstCar] = useState(null);
    const [secondCar, setSecondCar] = useState(null);
	const [readUpdates, setReadUpdates] = useState(getReadUpdates);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => localStorage.setItem(READ_UPDATES_KEY, JSON.stringify(readUpdates)), [readUpdates]);

	useEffect(() => {
		async function carregar() {
			setLoading(true);
			setError('');
			try {
				const [carros, comparacoes] = await Promise.all([getFavorites(), getComparacoesSalvas()]);
				setSavedCars((carros.favoriteCarros ?? carros).map(adaptarCarroSalvo));
				setSavedComparisons(comparacoes.map(adaptarComparacaoSalva));
			} catch (err) {
				setError(err.message || 'Não foi possível carregar seus salvos.');
			} finally {
				setLoading(false);
			}
		}
		carregar();
	}, []);

	const currentItems = useMemo(() => activeTab === 'cars' ? savedCars : savedComparisons, [activeTab, savedCars, savedComparisons]);
	const isUpdateRead = (updateId) => readUpdates.includes(updateId);
	const hasUnreadUpdates = (item) => item.updates?.some((update) => !isUpdateRead(update.id));
	const getUnreadCount = (item) => item.updates?.filter((update) => !isUpdateRead(update.id)).length || 0;
	const toggleCard = (id) => setOpenCards((current) => ({ ...current, [id]: !current[id] }));
	const changeTab = (tab) => { setActiveTab(tab); setOpenCards({}); };
	const markItemAsRead = (item) => setReadUpdates((current) => [...new Set([...current, ...(item.updates?.map((u) => u.id) || [])])]);

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
		isUpdateRead, hasUnreadUpdates, getUnreadCount, toggleCard, changeTab, markItemAsRead, deleteItem,
		handleCarDetails: (id) => navigate(`/information/${id.replace('car-', '')}`),
		handleComparisonDetails,
	};
}