import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialSavedCars, initialSavedComparisons, READ_UPDATES_KEY } from '../data';

function getReadUpdates() {
	try { return JSON.parse(localStorage.getItem(READ_UPDATES_KEY)) || []; } catch { return []; }
}

export default function useSavedController() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('cars');
	const [savedCars, setSavedCars] = useState(initialSavedCars);
	const [savedComparisons, setSavedComparisons] = useState(initialSavedComparisons);
	const [openCards, setOpenCards] = useState({});
	const [readUpdates, setReadUpdates] = useState(getReadUpdates);
	useEffect(() => localStorage.setItem(READ_UPDATES_KEY, JSON.stringify(readUpdates)), [readUpdates]);
	const currentItems = useMemo(() => activeTab === 'cars' ? savedCars : savedComparisons, [activeTab, savedCars, savedComparisons]);
	const isUpdateRead = (updateId) => readUpdates.includes(updateId);
	const hasUnreadUpdates = (item) => item.updates?.some((update) => !isUpdateRead(update.id));
	const getUnreadCount = (item) => item.updates?.filter((update) => !isUpdateRead(update.id)).length || 0;
	const toggleCard = (id) => setOpenCards((current) => ({ ...current, [id]: !current[id] }));
	const changeTab = (tab) => { setActiveTab(tab); setOpenCards({}); };
	const markItemAsRead = (item) => setReadUpdates((current) => [...new Set([...current, ...(item.updates?.map((update) => update.id) || [])])]);
	const deleteItem = (id) => {
		if (activeTab === 'cars') setSavedCars((current) => current.filter((car) => car.id !== id));
		else setSavedComparisons((current) => current.filter((comparison) => comparison.id !== id));
		setOpenCards((current) => { const next = { ...current }; delete next[id]; return next; });
	};
	return { activeTab, savedCars, savedComparisons, currentItems, openCards, isUpdateRead, hasUnreadUpdates, getUnreadCount, toggleCard, changeTab, markItemAsRead, deleteItem, handleCarDetails: (id) => navigate(`/information/${id.replace('car-', '')}`), handleComparisonDetails: () => navigate('/compare/detail') };
}
