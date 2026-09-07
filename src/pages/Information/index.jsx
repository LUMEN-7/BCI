import Topbar from './sections/Topbar';
import Hero from './sections/Hero';
import Specs from './sections/Specs';
import Technical from './sections/Technical';
import AiAnalysis from './sections/AiAnalysis';
import useInformationController from './hooks/useInformationController';
import './style.css';

export default function Information() {
    const {
        car,
        favorite,
        openSection,
        showSources,
        goBack,
        goHome,
        toggleFavorite,
        toggleSection,
        toggleSources,
        handleCompare,
    } = useInformationController();

    if (!car) {
        return (
            <main className="information-page">
                <div className="information-container">
                    <button className="back-button" onClick={goBack}>Voltar</button>
                    <h1>Modelo não encontrado</h1>
                </div>
            </main>
        );
    }

    return (
        <main className="information-page">
            <div className="information-container">
                <Topbar favorite={favorite} onBack={goBack} onHome={goHome} onToggleFavorite={toggleFavorite} />
                <Hero car={car} onCompare={handleCompare} />
                <Specs specs={car.specs} />
                <Technical car={car} openSection={openSection} showSources={showSources} onToggleSection={toggleSection} onToggleSources={toggleSources} />
                <AiAnalysis analysis={car.aiAnalysis} />
            </div>
        </main>
    );
}
