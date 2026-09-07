import './style.css';

export default function ResultsHeader({ hasFilters, search, resultCount }) {
    return (
        <section className="results-header">
            <div>
                <span className="section-label">
                    {hasFilters ? 'RESULTADOS DA PESQUISA' : 'MODELOS DISPONÍVEIS'}
                </span>
                <h2>
                    {hasFilters
                        ? search
                            ? `RESULTADOS PARA "${search.toUpperCase()}"`
                            : 'MODELOS ENCONTRADOS'
                        : 'EXPLORE OS MODELOS'}
                </h2>
            </div>
            <span className="results-count">
                {resultCount} {resultCount === 1 ? 'MODELO' : 'MODELOS'}
            </span>
        </section>
    );
}
