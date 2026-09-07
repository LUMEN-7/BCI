import { IoArrowBackOutline } from 'react-icons/io5';
import './style.css';

export default function ProfileTopbar({ onBack }) {
	return <header className="profile-topbar"><button type="button" className="profile-back" onClick={onBack}><IoArrowBackOutline /><span>Voltar</span></button></header>;
}
