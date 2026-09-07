import { IoLogOutOutline } from 'react-icons/io5';
import './style.css';

export default function ProfileDanger({ onLogout }) {
	return <section className="profile-danger"><div><span className="section-eyebrow">Sessão</span><strong>Sair da conta</strong><p>Encerre sua sessão neste dispositivo.</p></div><button type="button" className="logout-button" onClick={onLogout}><IoLogOutOutline />Sair</button></section>;
}
