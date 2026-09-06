import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    IoSearchOutline,
    IoGitCompareOutline,
    IoPersonCircleOutline,
    IoBookmarkOutline,
    IoDocumentTextOutline,
    IoArrowForward,
    IoTrendingUpOutline,
    IoTimeOutline,
    IoWarningOutline,
    IoStatsChartOutline,
} from 'react-icons/io5';

import './style.css';

const cars = [
    {
        id: '1',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
    },
    {
        id: '2',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
    },
    {
        id: '3',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
    },
    {
        id: '4',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_expedition.png',
    },
    {
        id: '5',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
    },
    {
        id: '6',
        image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_mustang_mach.png',
    },
];

const highlights = [
    {
        category: 'PICKUP',
        title: 'FORD RANGER',
        description: 'Maior crescimento de intenção de compra na semana.',
        variation: '↑ 4,2%',
        featured: true,
    },
    {
        category: 'SUV COMPACTO',
        title: 'HYUNDAI CRETA',
        description: 'Subiu 2 posições no ranking Q3.',
        featured: false,
    },
    {
        category: 'HATCHBACK',
        title: 'CHEVROLET ONIX',
        description: 'Queda de avaliações pós-recall voluntário.',
        featured: false,
    },
];

const coverage = [
    {
        name: 'SUVs Compactos',
        models: 34,
        percentage: 82,
    },
    {
        name: 'Pickups',
        models: 22,
        percentage: 67,
    },
    {
        name: 'Hatchbacks',
        models: 41,
        percentage: 54,
    },
    {
        name: 'Sedãs',
        models: 17,
        percentage: 38,
    },
];

const recentActivity = [
    {
        type: 'ANÁLISE DE MERCADO',
        title: 'SUVs compactos',
        date: 'Hoje, 14:32',
    },
    {
        type: 'COMPARAÇÃO',
        title: 'Ford Territory × Jeep Compass',
        date: 'Hoje, 11:18',
    },
    {
        type: 'PESQUISA',
        title: 'Ford Ranger',
        date: 'Ontem, 17:42',
    },
];

export default function Home() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    const currentUser =
        JSON.parse(localStorage.getItem('currentUser')) || null;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === cars.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const firstName =
        currentUser?.name?.trim()?.split(/\s+/)[0] || 'Usuário';

    function getGreetingByHour() {
        const hour = new Date().getHours();

        if (hour < 12) return 'BOM DIA,';
        if (hour < 18) return 'BOA TARDE,';

        return 'BOA NOITE,';
    }

    return (
        <main className="home-page">

            {/* NAVBAR LATERAL */}
            <aside className="home-navbar">

                <button
                    className="nav-item"
                    onClick={() => navigate('/profile')}
                    title="Perfil"
                >
                    <IoPersonCircleOutline />
                    <span>Perfil</span>
                </button>

                <button
                    className="nav-item"
                    onClick={() => navigate('/saved')}
                    title="Salvos"
                >
                    <IoBookmarkOutline />
                    <span>Salvos</span>
                </button>

                <button
                    className="nav-item"
                    onClick={() => navigate('/notes')}
                    title="Anotações"
                >
                    <IoDocumentTextOutline />
                    <span>Anotações</span>
                </button>

            </aside>


            {/* HERO */}
            <section className="home-hero">

                <div className="hero-content">

                    <span className="eyebrow">
                        BUSINESS COMPETITIVE INTELLIGENCE
                    </span>

                    <h1>
                        {getGreetingByHour()}
                        <br />
                        {firstName}.
                    </h1>

                    <p className="hero-description">
                        Explore o mercado, compare modelos e transforme
                        dados em decisões estratégicas para a Ford.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="hero-button hero-button-primary"
                            onClick={() => navigate('/search')}
                        >
                            <IoSearchOutline />

                            <span>PESQUISAR</span>

                            <IoArrowForward className="button-arrow" />
                        </button>

                        <button
                            className="hero-button hero-button-secondary"
                            onClick={() => navigate('/compare')}
                        >
                            <IoGitCompareOutline />

                            <span>COMPARAR</span>

                            <IoArrowForward className="button-arrow" />
                        </button>

                    </div>

                </div>


                {/* CARRO */}
                <div className="hero-car">

                    <img
                        src={cars[currentIndex].image}
                        alt="Veículo Ford"
                    />

                    <div className="hero-car-info">
                        <span>
                            {String(currentIndex + 1).padStart(2, '0')}
                        </span>

                        <span>/</span>

                        <span>
                            {String(cars.length).padStart(2, '0')}
                        </span>
                    </div>

                </div>

            </section>


            {/* VISÃO GERAL */}
            <section className="overview-section">

                <div className="section-heading">
                    <span>VISÃO GERAL</span>
                    <div />
                </div>

                <div className="metrics-grid">

                    <div className="metric">
                        <strong>124</strong>
                        <span>MODELOS<br />MONITORADOS</span>
                    </div>

                    <div className="metric">
                        <strong>38</strong>
                        <span>CONCORRENTES<br />MAPEADOS</span>
                    </div>

                    <div className="metric">
                        <strong>17</strong>
                        <span>ANÁLISES<br />ESTA SEMANA</span>
                    </div>

                    <div className="metric">
                        <strong>06</strong>
                        <span>ALERTAS<br />ATIVOS</span>
                    </div>

                </div>

            </section>


            {/* DESTAQUES */}
            <section className="highlights-section">

                <div className="section-heading">
                    <span>DESTAQUES DA SEMANA</span>
                    <div />
                </div>

                <div className="highlights-grid">

                    {highlights.map((item, index) => (
                        <article
                            key={item.title}
                            className={`highlight-card ${
                                item.featured ? 'featured' : ''
                            }`}
                        >

                            <div className="highlight-content">

                                <span className="card-category">
                                    {item.category}
                                </span>

                                <h2>{item.title}</h2>

                                <p>{item.description}</p>

                            </div>

                            {item.featured && (
                                <div className="highlight-variation">
                                    <IoTrendingUpOutline />
                                    <span>{item.variation}</span>
                                </div>
                            )}

                            {!item.featured && (
                                <IoArrowForward className="card-arrow" />
                            )}

                        </article>
                    ))}

                </div>

            </section>


            {/* COBERTURA */}
            <section className="coverage-section">

                <div className="section-heading">
                    <span>COBERTURA DO MERCADO</span>
                    <div />
                </div>

                <div className="coverage-list">

                    {coverage.map((item) => (
                        <div
                            className="coverage-item"
                            key={item.name}
                        >

                            <div className="coverage-header">

                                <strong>{item.name}</strong>

                                <span>
                                    {item.models} modelos — {item.percentage}%
                                </span>

                            </div>

                            <div className="coverage-bar">
                                <div
                                    style={{
                                        width: `${item.percentage}%`,
                                    }}
                                />
                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* ALERTAS */}
            <section className="alerts-section">

                <div className="section-heading">
                    <span>MONITORAMENTO</span>
                    <div />
                </div>

                <div className="alerts-header">

                    <div>
                        <span className="alert-number">27</span>

                        <div>
                            <h2>ALERTAS AGUARDAM REVISÃO</h2>

                            <p>
                                Existem movimentações do mercado
                                que podem exigir sua atenção.
                            </p>
                        </div>
                    </div>

                    <IoWarningOutline />

                </div>


                <div className="alert-card">

                    <span className="alert-dot" />

                    <div>
                        <strong>
                            Variações de competidores detectadas
                            desde segunda-feira.
                        </strong>

                        <button onClick={() => navigate('/search')}>
                            Revisar alertas
                            <IoArrowForward />
                        </button>
                    </div>

                </div>

            </section>


            {/* ATIVIDADE */}
            <section className="activity-section">

                <div className="section-heading">
                    <span>ATIVIDADE RECENTE</span>
                    <div />
                </div>

                <div className="activity-list">

                    {recentActivity.map((activity) => (
                        <button
                            className="activity-item"
                            key={`${activity.type}-${activity.title}`}
                        >

                            <div className="activity-icon">
                                {activity.type === 'COMPARAÇÃO' ? (
                                    <IoGitCompareOutline />
                                ) : activity.type === 'PESQUISA' ? (
                                    <IoSearchOutline />
                                ) : (
                                    <IoStatsChartOutline />
                                )}
                            </div>

                            <div className="activity-info">
                                <span>{activity.type}</span>
                                <strong>{activity.title}</strong>
                            </div>

                            <time>{activity.date}</time>

                            <IoArrowForward />

                        </button>
                    ))}

                </div>

            </section>


            {/* FOOTER */}
            <footer className="home-footer">
                <span>
                    © 2026 Ford Motor Company · Uso interno
                </span>

                <span>
                    BCI · Business Competitive Intelligence
                </span>
            </footer>

        </main>
    );
}