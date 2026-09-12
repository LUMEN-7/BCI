import AiAnalysis from './sections/AiAnalysis';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Technical from './sections/Technical';
import Topbar from './sections/Topbar';
import useDetailController from './hooks/useDetailController';
import './style.css';

export default function CompareDetail() {
    const controller = useDetailController();

    // 1. Tela de Carregamento enquanto o C# calcula
    if (controller.loading) {
        return (
            <main className="compare-detail-page">
                <div className="compare-detail-container loading-container">
                    <h2>Cruzando dados automotivos...</h2>
                    {/* Aqui você pode colocar um CSS Spinner bonitinho */}
                </div>
            </main>
        );
    }

    // 2. Tela de Erro caso a API esteja fora do ar
    if (controller.error) {
        return (
            <main className="compare-detail-page">
                <div className="compare-detail-container loading-container">
                    <h2>{controller.error}</h2>
                    <button onClick={controller.handleBack}>Voltar</button>
                </div>
            </main>
        );
    }

    // 3. A Tela Real
    return (
        <main className="compare-detail-page">
            <div className="compare-detail-container">
                <Topbar
                    favorite={controller.favorite}
                    onBack={controller.handleBack}
                    onHome={controller.handleHome}
                    onToggleFavorite={controller.toggleFavorite}
                    handleExport = {controller.handleExport}
                />
                <Header />
                <Hero firstCar={controller.firstCar} secondCar={controller.secondCar} />
                <Technical
                    firstCar={controller.firstCar}
                    secondCar={controller.secondCar}
                    expandedSection={controller.expandedSection}
                    showSources={controller.showSources}
                    onToggleSection={controller.toggleSection}
                    onToggleSources={controller.toggleSources}
                />

                <AiAnalysis
                    firstCar={controller.firstCar}
                    secondCar={controller.secondCar}
                    comparisonSummary={controller.comparisonSummary}
                    mathConclusions={controller.mathConclusions}
                />
                
                {/* BÔNUS: Placar de Matemática do C# */}
                {/* Se quiser renderizar as conclusões matemáticas prontas do C#, 
                    elas estão disponíveis em controller.mathConclusions */}
            </div>
        </main>
    );
}