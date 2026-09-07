import { useNavigate } from 'react-router-dom';

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function getFirstName(user) {
    return user?.name?.trim()?.split(/\s+/)[0] || 'Usuário';
}

function getGreetingByHour(hour = new Date().getHours()) {
    if (hour < 12) return 'BOM DIA,';
    if (hour < 18) return 'BOA TARDE,';
    return 'BOA NOITE,';
}

export default function useHomeController() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    return {
        firstName: getFirstName(currentUser),
        greeting: getGreetingByHour(),
        handleSearch: () => navigate('/search'),
        handleCompare: () => navigate('/compare'),
        handleReviewAlerts: () => navigate('/search'),
    };
}
