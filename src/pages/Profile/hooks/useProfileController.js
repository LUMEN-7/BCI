import { useNavigate } from 'react-router-dom';
import { profileMenuItems } from '../data';
import {logout} from '@/services/userService'

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

	async function logoutUser(params) {
			localStorage.removeItem('currentUser');
			await logout();
			navigate('/');
	}

	return {
		displayName: currentUser?.nomeExibicao?.trim() || currentUser?.userName || 'Usuário',
		displayEmail: currentUser?.email || 'Sem e-mail',
		profilePhoto: currentUser?.fotoPerfilUrl || null,
		menuItems: profileMenuItems,
		handleBack: () => navigate('/home'),
		handleMenuNavigate: (route) => navigate(route),
		handleLogout: () => {logoutUser()},
	};
}
