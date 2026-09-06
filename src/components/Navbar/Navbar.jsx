import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    IoSearchOutline,
    IoGitCompareOutline,
    IoPersonCircleOutline,
    IoBookmarkOutline,
    IoDocumentTextOutline,
    IoHomeOutline,
    IoAnalyticsOutline,
    IoNotificationsOutline,
    IoGridOutline,
    IoClose,
    IoMenu,
} from 'react-icons/io5';

import './style.css';

const navigationItems = [
    { icon: IoHomeOutline, label: 'Home', path: '/insights' },
    { icon: IoSearchOutline, label: 'Pesquisar', path: '/search' },
    { icon: IoGitCompareOutline, label: 'Comparar', path: '/compare' },
    { icon: IoAnalyticsOutline, label: 'Insights', path: '/insights' },
    { icon: IoNotificationsOutline, label: 'Alertas', path: '/alerts', alert: true },
    { icon: IoGridOutline, label: 'Workspace', path: '/notes' },
    { icon: IoBookmarkOutline, label: 'Salvos', path: '/saved' },
    { icon: IoDocumentTextOutline, label: 'Anotações', path: '/notes' },
];

function NavItems({ navigate }) {
    return navigationItems.map(({ icon: Icon, label, path, alert }) => (
        <button
            className={`nav-item ${alert ? 'nav-alerts' : ''}`}
            key={label}
            onClick={() => navigate(path)}
            title={label}
        >
            <Icon />
            <span>{label}</span>
            {alert && <span className="alert-indicator" />}
        </button>
    ));
}

export default function Navbar() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className={`mobile-navbar ${mobileMenuOpen ? 'is-open' : ''}`}>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
                    aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <IoClose /> : <IoMenu />}
                </button>

                <div className="mobile-menu">
                    <div className="navbar-main">
                        <NavItems navigate={navigate} />
                    </div>

                    <div className="navbar-bottom">
                        <button
                            className="nav-item"
                            onClick={() => navigate('/profile')}
                            title="Perfil"
                        >
                            <IoPersonCircleOutline />
                            <span>Perfil</span>
                        </button>
                    </div>
                </div>
            </div>

            <aside className="home-navbar">
                <div className="navbar-main">
                    <NavItems navigate={navigate} />
                </div>

                <div className="navbar-bottom">
                    <button
                        className="nav-item"
                        onClick={() => navigate('/profile')}
                        title="Perfil"
                    >
                        <IoPersonCircleOutline />
                        <span>Perfil</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
