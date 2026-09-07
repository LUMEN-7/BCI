export const initialSavedCars = [
	{ id: 'car-1', name: 'Mustang GT 2024', brand: 'Ford', image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png', engine: '5.0 V8', power: '488 cv', type: 'Coupé', description: 'Modelo esportivo com foco em potência, performance e experiência de direção.', updates: [{ id: 'update-1', date: '03/09/2026', title: 'Nova atualização disponível', description: 'Os dados de potência e especificações técnicas foram revisados.' }, { id: 'update-2', date: '28/08/2026', title: 'Dados revisados', description: 'Informações gerais do veículo foram atualizadas.' }] },
	{ id: 'car-2', name: 'Bronco 2021', brand: 'Ford', image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png', engine: '2.7 V6', power: '330 cv', type: 'SUV', description: 'SUV robusto voltado para aventura, trilhas e uso off-road.', updates: [{ id: 'update-3', date: '30/08/2026', title: 'Informações atualizadas', description: 'Foram revisadas informações técnicas do modelo.' }] },
];

export const initialSavedComparisons = [
	{ id: 'comparison-1', firstCar: 'Mustang GT 2024', secondCar: 'Bronco 2021', firstImage: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png', secondImage: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png', result: 'Esportivo vs aventureiro', description: 'Comparação entre desempenho em estrada e capacidade off-road.', updates: [{ id: 'update-4', date: '02/09/2026', title: 'Comparação atualizada', description: 'Novos dados de desempenho foram adicionados à comparação.' }] },
];

export const READ_UPDATES_KEY = 'lumen-read-saved-updates';
