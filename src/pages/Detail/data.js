export const mockCars = {
	'1': {
		id: '1', brand: 'Ford', name: 'Mustang GT 2024',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		sections: { performance: ['Motor 5.0 V8', '488 cv de potência', 'Perfil esportivo e foco em desempenho'], technology: ['Painel digital', 'Central multimídia', 'Apple CarPlay e Android Auto'], security: ['Controle de estabilidade', 'Assistente de frenagem', 'Airbags múltiplos'], comfort: ['Bancos esportivos', 'Ar-condicionado digital', 'Acabamento premium'] },
		specs: { engine: '5.0 V8', power: '488 cv', type: 'Coupé', consumption: '8 km/l', model: 'Mustang GT', brand: 'Ford', year: '2024', driveModes: 'Sport, Eco, Comfort', torque: '57,3 kgfm', powerRpm: '7.250 rpm', torqueRpm: '4.900 rpm', transmission: 'Automática', drivetrain: 'Traseira', cityConsumption: '6,2 km/l', highwayConsumption: '9,8 km/l', length: '4.810 mm', width: '1.916 mm', height: '1.397 mm', wheelbase: '2.719 mm', tireType: 'Performance', rim: '19"', tireWidth: '255 mm', tireProfile: '40', tankCapacity: '61 L', fuelType: 'Gasolina', loadCapacity: '380 kg', towingCapacity: 'Não informado' },
	},
	'2': {
		id: '2', brand: 'Ford', name: 'Bronco 2021',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		sections: { performance: ['Motor 2.7 V6', '330 cv de potência', 'Tração 4x4 para terrenos difíceis'], technology: ['Sistema multimídia', 'Câmeras de apoio', 'Modos de condução off-road'], security: ['Controle de tração', 'Assistente em descidas', 'Monitoramento de estabilidade'], comfort: ['Interior resistente', 'Boa altura do solo', 'Espaço para passageiros'] },
		specs: { engine: '2.7 V6', power: '330 cv', type: 'SUV', consumption: '7 km/l', model: 'Bronco', brand: 'Ford', year: '2021', driveModes: 'Sport, Eco, Comfort, Off-road', torque: '57,6 kgfm', powerRpm: '5.500 rpm', torqueRpm: '3.100 rpm', transmission: 'Automática', drivetrain: '4x4', cityConsumption: '6,5 km/l', highwayConsumption: '8,2 km/l', length: '4.811 mm', width: '1.928 mm', height: '1.852 mm', wheelbase: '2.949 mm', tireType: 'All-terrain', rim: '17"', tireWidth: '285 mm', tireProfile: '70', tankCapacity: '79 L', fuelType: 'Gasolina', loadCapacity: '450 kg', towingCapacity: '1.580 kg' },
	},
};

export const technicalSections = [
	{ id: 'base', title: 'Dados Base', items: [['Modelo', 'model'], ['Marca', 'brand'], ['Ano', 'year'], ['Modos de Condução', 'driveModes']] },
	{ id: 'specs', title: 'Especificações', items: [['Potência', 'power'], ['Torque', 'torque'], ['Potência RPM', 'powerRpm'], ['Torque RPM', 'torqueRpm'], ['Transmissão', 'transmission'], ['Tração', 'drivetrain']] },
	{ id: 'consumption', title: 'Consumos', items: [['Cidade', 'cityConsumption'], ['Estrada', 'highwayConsumption']] },
	{ id: 'dimensions', title: 'Dimensões', items: [['Comprimento', 'length'], ['Largura', 'width'], ['Altura', 'height'], ['Entre-Eixos', 'wheelbase']] },
	{ id: 'tires', title: 'Pneus', verified: true, items: [['Tipo', 'tireType'], ['Aro', 'rim'], ['Largura', 'tireWidth'], ['Perfil', 'tireProfile']] },
	{ id: 'extras', title: 'Extras', items: [['Capacidade do Tanque', 'tankCapacity'], ['Tipo de Combustível', 'fuelType'], ['Capacidade de Carga', 'loadCapacity'], ['Capacidade de Reboque', 'towingCapacity']] },
];

export const resourceSections = [
	{ id: 'performance', title: 'Performance', verified: true },
	{ id: 'technology', title: 'Tecnologia', verified: true },
	{ id: 'security', title: 'Segurança' },
	{ id: 'comfort', title: 'Conforto' },
];