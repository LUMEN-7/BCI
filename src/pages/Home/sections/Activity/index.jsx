import { IoArrowForward, IoGitCompareOutline, IoSearchOutline, IoStatsChartOutline } from 'react-icons/io5';

import './style.css';

function getActivityIcon(type) {
    if (type === 'COMPARAÇÃO') return <IoGitCompareOutline />;
    if (type === 'PESQUISA') return <IoSearchOutline />;
    return <IoStatsChartOutline />;
}

export default function Activity({ items }) {
    return (
        <section className="activity-section">
            <div className="section-heading">
                <span>ATIVIDADE RECENTE</span>
                <div />
            </div>

            <div className="activity-list">
                {items.map((item) => (
                    <button className="activity-item" key={`${item.type}-${item.title}`}>
                        <div className="activity-icon">{getActivityIcon(item.type)}</div>
                        <div className="activity-info">
                            <span>{item.type}</span>
                            <strong>{item.title}</strong>
                        </div>
                        <time>{item.date}</time>
                        <IoArrowForward />
                    </button>
                ))}
            </div>
        </section>
    );
}
