import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockCars } from '../data';
import { addSavedComparison, removeSavedComparison } from '../../../utils/savedItemsStorage';

export default function useDetailController() {
	const navigate = useNavigate();
	const location = useLocation();
	const [expandedSection, setExpandedSection] = useState('base');
	const firstCar = mockCars[location.state?.firstCar?.id] || location.state?.firstCar || mockCars['1'];
	const secondCar = mockCars[location.state?.secondCar?.id] || location.state?.secondCar || mockCars['2'];
	const comparisonSummary = useMemo(() => `${firstCar.name} se destaca por uma proposta mais esportiva e focada em desempenho, enquanto ${secondCar.name} entrega mais versatilidade, robustez e capacidade para diferentes tipos de terreno. A melhor escolha depende do objetivo do usuário: emoção ao dirigir ou uso mais aventureiro e funcional.`, [firstCar.name, secondCar.name]);

	// Se a pessoa chegou aqui clicando em "Ver comparação" nos salvos, já vem com o id da comparação salva.
	const [savedComparisonId, setSavedComparisonId] = useState(location.state?.savedComparisonId || null);
	const [favorite, setFavorite] = useState(Boolean(location.state?.savedComparisonId));

	function toggleSection(sectionId) {
		setExpandedSection((current) => current === sectionId ? null : sectionId);
	}

	function toggleFavorite() {
		if (favorite) {
			if (savedComparisonId) removeSavedComparison(savedComparisonId);
			setSavedComparisonId(null);
			setFavorite(false);
			return;
		}

		// Cada clique em "favoritar" cria uma comparação salva nova, com data/hora do momento em que foi salva.
		const entry = addSavedComparison({
			firstCar,
			secondCar,
			result: `${firstCar.type || firstCar.brand} vs ${secondCar.type || secondCar.brand}`,
			description: comparisonSummary,
		});
		setSavedComparisonId(entry.id);
		setFavorite(true);
	}

	return {
		firstCar, secondCar, favorite, expandedSection, comparisonSummary,
		handleBack: () => navigate(-1),
		handleHome: () => navigate('/home'),
		toggleFavorite,
		toggleSection,
	};
}