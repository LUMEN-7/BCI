import AiAnalysis from "./sections/AiAnalysis";
import ComparisonChart from "./sections/ComparisonChart";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Technical from "./sections/Technical";
import Topbar from "./sections/Topbar";

import PageLoader from "../../components/PageLoader/PageLoader";
import ErrorState from "../../components/ErrorState";

import useDetailController from "./hooks/useDetailController";

import "./style.css";


export default function CompareDetail() {
    const controller = useDetailController();


    /* =========================================================
       LOADING GLOBAL
    ========================================================= */

    if (controller.loading) {
        return (
            <PageLoader message="comparação automotiva" />
        );
    }


    /* =========================================================
       ERRO
    ========================================================= */

    if (controller.error) {
        return (
            <main className="compare-detail-page">
                <div className="compare-detail-container">

                    <ErrorState
                        title="Não foi possível gerar a comparação"
                        message={controller.error}
                        onBack={controller.handleBack}
                    />

                </div>
            </main>
        );
    }


    /* =========================================================
       CONTEÚDO
    ========================================================= */

    return (
        <main className="compare-detail-page">

            <div className="compare-detail-container">

                <Topbar
                    favorite={controller.favorite}
                    onBack={controller.handleBack}
                    onHome={controller.handleHome}
                    onToggleFavorite={controller.toggleFavorite}
                    handleExport={controller.handleExport}
                />


                <Header />


                <Hero
                    cars={controller.cars}
                />


                <ComparisonChart
                    cars={controller.cars}
                />


                <Technical
                    cars={controller.cars}
                    expandedSection={controller.expandedSection}
                    showSources={controller.showSources}
                    onToggleSection={controller.toggleSection}
                    onToggleSources={controller.toggleSources}
                />


                <AiAnalysis
                    cars={controller.cars}
                    comparisonSummary={
                        controller.comparisonSummary
                    }
                    mathConclusions={
                        controller.mathConclusions
                    }
                />

            </div>

        </main>
    );
}