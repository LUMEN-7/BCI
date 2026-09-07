import { IoChevronForwardOutline, IoLockClosedOutline, IoPencilOutline } from 'react-icons/io5';
import './style.css';

const icons = {
	edit: <IoPencilOutline />,
	password: <IoLockClosedOutline />,
};

export default function ProfileSettings({ items, onNavigate }) {
	return <section className="profile-settings"><div className="profile-section-heading"><div><span className="section-eyebrow">Preferências</span><h2 className="section-title">Configurações</h2></div><p>Gerencie seus dados e sua experiência no app.</p></div><div className="profile-menu">{items.map((item) => <button key={item.title} type="button" className="profile-menu-item" onClick={() => onNavigate(item.route)}><span className="profile-menu-icon">{icons[item.icon]}</span><span className="profile-menu-text"><strong>{item.title}</strong><small>{item.subtitle}</small></span><span className="profile-chevron"><IoChevronForwardOutline /></span></button>)}</div></section>;
}
