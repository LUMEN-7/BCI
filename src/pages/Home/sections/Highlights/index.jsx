import { IoArrowForward, IoTrendingUpOutline } from 'react-icons/io5';

import './style.css';

export default function Highlights({ items }) {
    return (
        <section className="highlights-section">
            <div className="section-heading">
                <span>DESTAQUES DA SEMANA</span>
                <div />
            </div>

            <div className="highlights-grid">
                {items.map((item) => (
                    <article
                        key={item.title}
                        className={`highlight-card ${item.featured ? 'featured' : ''}`}
                    >
                        <div className="highlight-content">
                            <span className="card-category">{item.category}</span>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </div>

                        {item.featured ? (
                            <div className="highlight-variation">
                                <IoTrendingUpOutline />
                                <span>{item.variation}</span>
                            </div>
                        ) : (
                            <IoArrowForward className="card-arrow" />
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}
