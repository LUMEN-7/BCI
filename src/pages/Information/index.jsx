import Topbar from './sections/Topbar';
import Hero from './sections/Hero';
import Specs from './sections/Specs';
import Technical from './sections/Technical';
import AiAnalysis from './sections/AiAnalysis';
import useCarDetailController from './hooks/useCarDetailController';
import './style.css';

export default function Information() {
    const controller = useCarDetailController();

    if (controller.loading) {
        return (
            <main className="information-page">
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                    <h2>Carregando ficha técnica...</h2>
                </div>
            </main>
        );
    }

    if (controller.error || !controller.car) {
        return (
            <main className="information-page">
                <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>
                    <h2>{controller.error || "Veículo não encontrado"}</h2>
                    <button onClick={controller.handleBack}>Voltar</button>
                </div>
            </main>
        );
    }

    return (
        <main className="information-page">
            <div className="information-container">
                <Topbar
                    favorites={controller.favorites}
                    onBack={controller.handleBack}
                    onHome={controller.handleHome}
                    onToggleFavorite={controller.toggleFavorite}
                    handleExport = {controller.handleExport}
                />
                
                <Hero 
                    car={controller.car} 
                    onCompare={controller.handleCompare} 
                />
                
                {/* Cards rápidos no topo (Motor, Potência, Tipo, Consumo) */}
                <Specs 
                    specs={controller.car.specs} 
                />
                
                <Technical
                    car={controller.car}
                    openSection={controller.openSection}
                    showSources={controller.showSources}
                    onToggleSection={controller.toggleSection}
                    onToggleSources={controller.toggleSources}
                />
                
                <AiAnalysis 
                    analysis={controller.car.analysis} 
                    loading={controller.analysisLoading}
                    error={controller.analysisError}
                />
            </div>
        </main>
    );
}