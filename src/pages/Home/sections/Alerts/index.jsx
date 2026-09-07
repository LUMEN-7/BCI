import { IoArrowForward, IoWarningOutline } from 'react-icons/io5';

import './style.css';

export default function Alerts({ onReview }) {
    return (
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
                        <p>Existem movimentações do mercado que podem exigir sua atenção.</p>
                    </div>
                </div>
                <IoWarningOutline />
            </div>

            <div className="alert-card">
                <span className="alert-dot" />
                <div>
                    <strong>Variações de competidores detectadas desde segunda-feira.</strong>
                    <button onClick={onReview}>
                        Revisar alertas
                        <IoArrowForward />
                    </button>
                </div>
            </div>
        </section>
    );
}
