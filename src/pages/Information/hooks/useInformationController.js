import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { cars } from '../data';

export default function useInformationController() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [favorite, setFavorite] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [showSources, setShowSources] = useState(false);

    const car = useMemo(() => cars.find((item) => item.id === id), [id]);

    return {
        car,
        favorite,
        openSection,
        showSources,
        goBack: () => navigate(-1),
        goHome: () => navigate('/home'),
        toggleFavorite: () => setFavorite((current) => !current),
        toggleSection: (section) => setOpenSection((current) => current === section ? null : section),
        toggleSources: () => setShowSources((current) => !current),
        handleCompare: () => navigate('/compare', { state: { firstCar: car } }),
    };
}
