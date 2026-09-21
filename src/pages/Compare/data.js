export const mockCars = [
	{
		id: '1',
		brand: 'Ford',
		name: 'Ford Mustang 2024',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		engine: '5.0 V8',
		power: '488 cv',
		type: 'Coupé',
	},
	{
		id: '2',
		brand: 'Ford',
		name: 'Ford Bronco 2021',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		engine: '2.7 V6',
		power: '330 cv',
		type: 'SUV',
	},
	{
		id: '3',
		brand: 'Ford',
		name: 'Ford Bronco Sport 2025',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
		engine: '2.0 EcoBoost',
		power: '250 cv',
		type: 'SUV',
	},
	{
		id: '4',
		brand: 'Ford',
		name: 'Ford Explorer 2026',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
		engine: '2.3 EcoBoost',
		power: '300 cv',
		type: 'SUV',
	},
];

export const MAX_SIMILAR_MODELS = 5;

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

export function matchesSimilarity(car, reference, filterId) {
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

function textSimilarity(a, b) {
	if (!a || !b) return 0.5; // dado ausente: não penaliza nem favorece
	const normA = String(a).toLowerCase().trim();
	const normB = String(b).toLowerCase().trim();
	if (normA === normB) return 1;
	if (normA.includes(normB) || normB.includes(normA)) return 0.75;
	return 0.2;
}

function numberSimilarity(a, b, tolerance) {
	if (a === null || a === undefined || b === null || b === undefined) return 0.5;
	const base = Math.max(Math.abs(a), Math.abs(b), 1);
	const diff = Math.abs(a - b) / base;
	return Math.max(0, 1 - diff / tolerance);
}

// Retorna um percentual (0-100) de o quão parecido "car" é do modelo de referência
export function computeSimilarity(car, reference) {
	if (!car || !reference) return 0;

	const criteria = [
		{ weight: 0.25, value: textSimilarity(car.type, reference.type) },
		{ weight: 0.2, value: numberSimilarity(car.price, reference.price, 0.35) },
		{ weight: 0.2, value: numberSimilarity(car.powerValue, reference.powerValue, 0.4) },
		{ weight: 0.15, value: textSimilarity(car.engine, reference.engine) },
		{ weight: 0.1, value: textSimilarity(car.transmission, reference.transmission) },
		{ weight: 0.1, value: numberSimilarity(car.dimensions?.wheelbase, reference.dimensions?.wheelbase, 0.2) },
	];

	const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
	const weightedScore = criteria.reduce((sum, c) => sum + c.weight * c.value, 0);

	return Math.round((weightedScore / totalWeight) * 100);
}