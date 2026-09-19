import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import useCompareController from './hooks/useCompareController';
import Footer from './sections/Footer';
import Header from './sections/Header';
import Results from './sections/Results';
import Search from './sections/Search';
import Selection from './sections/Selection';
import MultiCompare from './sections/MultiCompare';
import './style.css';

export default function Compare() {
    const controller = useCompareController();
    const [activeTab, setActiveTab] = useState('direct');

    return (
        <main className="compare-page">
            <Navbar />
            <div className="compare-container">
                <Header />

                <div className="compare-tabs">
                    <button
                        type="button"
                        className={activeTab === 'direct' ? 'active' : ''}
                        onClick={() => setActiveTab('direct')}
                    >
                        Comparação Direta
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'multi' ? 'active' : ''}
                        onClick={() => setActiveTab('multi')}
                    >
                        Múltiplos Modelos
                    </button>
                </div>

                {activeTab === 'direct' ? (
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

                        {/* Tratamento de Loading da API */}
                        {controller.loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando catálogo de veículos...</div>
                        ) : controller.error ? (
                            <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{controller.error}</div>
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
                ) : controller.loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando catálogo de veículos...</div>
                ) : controller.error ? (
                    <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{controller.error}</div>
                ) : (
                    <MultiCompare cars={controller.cars} />
                )}
            </div>
        </main>
    );
}