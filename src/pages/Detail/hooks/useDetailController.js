import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockCars } from '../data';

export default function useDetailController() {
	const navigate = useNavigate();
	const location = useLocation();
	const [favorite, setFavorite] = useState(false);
	const [expandedSection, setExpandedSection] = useState('base');
	const firstCar = mockCars[location.state?.firstCar?.id] || location.state?.firstCar || mockCars['1'];
	const secondCar = mockCars[location.state?.secondCar?.id] || location.state?.secondCar || mockCars['2'];
	const comparisonSummary = useMemo(() => `${firstCar.name} se destaca por uma proposta mais esportiva e focada em desempenho, enquanto ${secondCar.name} entrega mais versatilidade, robustez e capacidade para diferentes tipos de terreno. A melhor escolha depende do objetivo do usuário: emoção ao dirigir ou uso mais aventureiro e funcional.`, [firstCar.name, secondCar.name]);

	function toggleSection(sectionId) {
		setExpandedSection((current) => current === sectionId ? null : sectionId);
	}

	return {
		firstCar, secondCar, favorite, expandedSection, comparisonSummary,
		handleBack: () => navigate(-1),
		handleHome: () => navigate('/home'),
		toggleFavorite: () => setFavorite((current) => !current),
		toggleSection,
	};
}