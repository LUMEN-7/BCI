import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { cars } from '../data';
import { isCarFavorite, toggleFavoriteCar } from '../../../utils/savedItemsStorage';

export default function useInformationController() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openSection, setOpenSection] = useState(null);
    const [showSources, setShowSources] = useState(false);

    const car = useMemo(() => cars.find((item) => item.id === id), [id]);

    const [favorite, setFavorite] = useState(() => (car ? isCarFavorite(car.id) : false));

    function toggleFavorite() {
        if (!car) return;
        toggleFavoriteCar(car);
        setFavorite((current) => !current);
    }

    return {
        car,
        favorite,
        openSection,
        showSources,
        goBack: () => navigate(-1),
        goHome: () => navigate('/home'),
        toggleFavorite,
        toggleSection: (section) => setOpenSection((current) => current === section ? null : section),
        toggleSources: () => setShowSources((current) => !current),
        handleCompare: () => navigate('/compare', { state: { firstCar: car } }),
    };
}
