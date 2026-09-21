import Navbar from "../../components/Navbar/Navbar";
import ErrorState from "../../components/ErrorState";

import useCompareController from "./hooks/useCompareController";

import Footer from "./sections/Footer";
import Header from "./sections/Header";
import MultiCompare from "./sections/MultiCompare";
import Results from "./sections/Results";
import Search from "./sections/Search";
import Selection from "./sections/Selection";

import "./style.css";
import { useState } from "react";

export default function Compare() {
    const controller = useCompareController();
    const [activeTab, setActiveTab] = useState("direct");

    return (
        <main className="compare-page">
            <Navbar />
            <div className="compare-container">
                <Header />

                <div className="compare-tabs" role="tablist" aria-label="Tipos de comparação">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "direct"}
                        className={activeTab === "direct" ? "active" : ""}
                        onClick={() => setActiveTab("direct")}
                    >
                        Comparação direta
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "multi"}
                        className={activeTab === "multi" ? "active" : ""}
                        onClick={() => setActiveTab("multi")}
                    >
                        Comparação múltipla
                    </button>
                </div>

                {activeTab === "multi" ? (
                    <MultiCompare cars={controller.cars} />
                ) : (
                    <>
                        <Selection
                            firstCar={controller.firstCar}
                            secondCar={controller.secondCar}
                            activeSlot={controller.activeSlot}
                            canCompare={controller.canCompare}
                            setActiveSlot={controller.setActiveSlot}
                            removeCar={controller.removeCar}
                            onCompare={controller.handleCompare}
                        />
                        <Search
                            activeSlot={controller.activeSlot}
                            search={controller.search}
                            setSearch={controller.setSearch}
                            referenceCar={controller.referenceCar}
                            similarityFilters={controller.similarityFilters}
                            activeSimilarityFilters={controller.activeSimilarityFilters}
                            onToggleSimilarityFilter={controller.toggleSimilarityFilter}
                        />

                        {controller.loading ? (
                            <div className="compare-status-message">Carregando catálogo de veículos...</div>
                        ) : controller.error ? (
                            <div className="compare-status-message compare-status-message-error">{controller.error}</div>
                        ) : (
                            <Results
                                results={controller.results}
                                search={controller.search}
                                firstCar={controller.firstCar}
                                secondCar={controller.secondCar}
                                onSelect={controller.selectCar}
                                onClear={() => controller.setSearch('')}
                            />
                        )}

                        <Footer canCompare={controller.canCompare} onCompare={controller.handleCompare} />
                    </>
                )}
            </div>
        </main>
    );
}