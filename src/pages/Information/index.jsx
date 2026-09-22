import { useState } from "react";

import PageLoader from "../../components/PageLoader/PageLoader";
import ErrorState from "../../components/ErrorState";

import Topbar from "./sections/Topbar";
import Hero from "./sections/Hero";
import Specs from "./sections/Specs";
import Technical from "./sections/Technical";
import AiAnalysis from "./sections/AiAnalysis";

import ImportVehicleModal from "../Search/sections/ImportVehicleModal";

import useCarDetailController from "./hooks/useCarDetailController";

import "./style.css";


export default function Information() {
    const controller = useCarDetailController();

    const [
        isEditOpen,
        setIsEditOpen,
    ] = useState(false);


    /* =========================================================
       LOADING GLOBAL
    ========================================================= */

    if (controller.loading) {
        return (
            <PageLoader message="ficha técnica" />
        );
    }


    /* =========================================================
       ERRO
    ========================================================= */

    if (
        controller.error ||
        !controller.car
    ) {
        return (
            <main className="information-page">

                <div className="information-container">

                    <ErrorState
                        title="Não foi possível carregar o veículo"
                        message={
                            controller.error ||
                            "Veículo não encontrado."
                        }
                        onBack={
                            controller.handleBack
                        }
                    />

                </div>

            </main>
        );
    }


    /* =========================================================
       CONTEÚDO
    ========================================================= */

    return (
        <main className="information-page">

            <div className="information-container">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    isFavorite={
                        controller.isFavorite
                    }
                    isImported={
                        controller.isImported
                    }
                    onBack={
                        controller.handleBack
                    }
                    onHome={
                        controller.handleHome
                    }
                    onToggleFavorite={
                        controller.toggleFavorite
                    }
                    handleExport={
                        controller.handleExport
                    }
                    onEdit={() =>
                        setIsEditOpen(true)
                    }
                    onDelete={() => {

                        if (
                            window.confirm(
                                "Excluir este veículo importado?"
                            )
                        ) {
                            controller.deleteImportedVehicle();
                        }

                    }}
                />


                {/* =================================================
                    HERO
                ================================================= */}

                <Hero
                    car={
                        controller.car
                    }
                    onCompare={
                        controller.handleCompare
                    }
                />


                {/* =================================================
                    SPECS
                ================================================= */}

                <Specs
                    specs={
                        controller.car.specs
                    }
                />


                {/* =================================================
                    INFORMAÇÕES TÉCNICAS
                ================================================= */}

                <Technical
                    car={
                        controller.car
                    }
                    openSection={
                        controller.openSection
                    }
                    showSources={
                        controller.showSources
                    }
                    onToggleSection={
                        controller.toggleSection
                    }
                    onToggleSources={
                        controller.toggleSources
                    }
                    isImported={
                        controller.isImported
                    }
                />


                {/* =================================================
                    ANÁLISE IA
                ================================================= */}

                <AiAnalysis
                    analysis={
                        controller.car.analysis
                    }
                    loading={
                        controller.analysisLoading
                    }
                    error={
                        controller.analysisError
                    }
                    isImported={
                        controller.isImported
                    }
                    onGenerate={
                        controller.generateAnalysis
                    }
                />

            </div>


            {/* =====================================================
                MODAL DE EDIÇÃO
            ====================================================== */}

            <ImportVehicleModal
                isOpen={
                    isEditOpen
                }
                initialVehicle={
                    controller.importedVehicle
                }
                onClose={() =>
                    setIsEditOpen(false)
                }
                onSaved={(vehicle) => {

                    controller.updateImportedVehicle(
                        vehicle
                    );

                    setIsEditOpen(false);

                }}
            />

        </main>
    );
}