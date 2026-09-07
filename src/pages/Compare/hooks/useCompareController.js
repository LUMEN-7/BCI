import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { mockCars } from '../data';

export default function useCompareController() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialFirstCar = location.state?.firstCar || null;
	const [firstCar, setFirstCar] = useState(initialFirstCar);
	const [secondCar, setSecondCar] = useState(null);
	const [activeSlot, setActiveSlot] = useState(initialFirstCar ? 'second' : 'first');
	const [search, setSearch] = useState('');

	const results = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return mockCars;

		return mockCars.filter((car) =>
			`${car.brand} ${car.name} ${car.engine} ${car.power} ${car.type}`
				.toLowerCase()
				.includes(term)
		);
	}, [search]);

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