import { useNavigate } from 'react-router-dom';
import { profileMenuItems } from '../data';

function getCurrentUser() {
	try {
		return JSON.parse(localStorage.getItem('currentUser')) || null;
	} catch {
		return null;
	}
}

export default function useProfileController() {
	const navigate = useNavigate();
	const currentUser = getCurrentUser();

	return {
		displayName: currentUser?.name?.trim() || 'Usuário',
		displayEmail: currentUser?.email || 'Sem e-mail',
		profilePhoto: currentUser?.photo || null,
		menuItems: profileMenuItems,
		handleBack: () => navigate('/home'),
		handleMenuNavigate: (route) => navigate(route),
		handleLogout: () => {
			localStorage.removeItem('currentUser');
			navigate('/');
		},
	};
}
