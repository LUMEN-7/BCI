// Utilitário central para persistir "favoritos" e "comparações salvas" no navegador.
// Tudo é guardado em localStorage (não depende de backend/Firestore).
// Se um dia o projeto passar a usar um banco de dados de verdade, é só trocar
// a implementação das funções abaixo — o resto do app continua igual.

const FAVORITES_KEY = 'lumen-favorite-cars';
const COMPARISONS_KEY = 'lumen-saved-comparisons';

function readList(key) {
	try {
		const raw = localStorage.getItem(key);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeList(key, list) {
	try {
		localStorage.setItem(key, JSON.stringify(list));
	} catch (error) {
		console.error(`Não foi possível salvar em "${key}":`, error);
	}
}

// Formata uma data para "dd/mm/aaaa hh:mm" (usado para mostrar quando a comparação foi salva)
export function formatDateTime(date = new Date()) {
	return date.toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

function normalizeCar(car) {
	return {
		id: car.id,
		name: car.name || 'Modelo sem nome',
		brand: car.brand || '—',
		image: car.image || '',
		engine: car.engine || car.specs?.engine?.value || '—',
		power: car.power || car.specs?.power?.value || '—',
		type: car.type || car.specs?.type?.value || '—',
		description: car.description || '',
	};
}

/* ------------------------- Carros favoritos ------------------------- */

export function getFavoriteCars() {
	return readList(FAVORITES_KEY);
}

export function getFavoriteCarIds() {
	return getFavoriteCars().map((car) => car.id);
}

export function isCarFavorite(id) {
	return getFavoriteCarIds().includes(id);
}

// Alterna o carro entre favoritado/não favoritado e já salva no localStorage.
// Recebe o objeto do carro (precisa ao menos de id e name) e devolve a lista atualizada.
export function toggleFavoriteCar(car) {
	const current = getFavoriteCars();
	const alreadyFavorite = current.some((item) => item.id === car.id);

	const next = alreadyFavorite
		? current.filter((item) => item.id !== car.id)
		: [...current, { ...normalizeCar(car), savedAt: new Date().toISOString() }];

	writeList(FAVORITES_KEY, next);
	return next;
}

export function removeFavoriteCar(id) {
	const next = getFavoriteCars().filter((item) => item.id !== id);
	writeList(FAVORITES_KEY, next);
	return next;
}

/* ------------------------- Comparações salvas ------------------------- */

export function getSavedComparisons() {
	return readList(COMPARISONS_KEY);
}

// Cada chamada cria uma comparação NOVA e única (com id e data/hora próprios),
// mesmo que sejam os mesmos dois carros de uma comparação salva antes.
export function addSavedComparison({ firstCar, secondCar, result, description }) {
	const now = new Date();
	const entry = {
		id: `comparison-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
		savedAt: now.toISOString(),
		savedAtLabel: formatDateTime(now),
		firstCar: firstCar.name,
		secondCar: secondCar.name,
		firstImage: firstCar.image,
		secondImage: secondCar.image,
		result: result || `${firstCar.name} vs ${secondCar.name}`,
		description: description || '',
		updates: [],
		// guarda os carros completos para conseguir reabrir a comparação depois
		firstCarData: firstCar,
		secondCarData: secondCar,
	};

	const next = [entry, ...getSavedComparisons()];
	writeList(COMPARISONS_KEY, next);
	return entry;
}

export function removeSavedComparison(id) {
	const next = getSavedComparisons().filter((item) => item.id !== id);
	writeList(COMPARISONS_KEY, next);
	return next;
}
