import Navbar from "../../components/Navbar/Navbar";
import CarGrid from "./sections/CarGrid";
import Controls from "./sections/Controls";
import EmptyState from "./sections/EmptyState";
import Header from "./sections/Header";
import InitialState from "./sections/InitialState";
import RecentViewed from "./sections/RecentViewed";
import ResultsHeader from "./sections/ResultsHeader";
import ScheduleModal from "./sections/ScheduleModal";
import ImportVehicleModal from "./sections/ImportVehicleModal";
import useSearchController from "./hooks/useSearchController";
import { useState } from "react";

import "./style.css";

export default function Search() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const {
    cars,
    brands,
    years,
    results,
    search,
    selectedBrand,
    selectedYear,
    favorites,
    recentCars,
    hasFilters,
    loading,
    validationError,
    activeFilterChips,
    isScheduleModalOpen,
    scheduleInitialCar,
    scheduledCount,
    handleSearchChange,
    handleBrandChange,
    handleYearChange,
    removeFilter,
    executeSearch,
    toggleFavorite,
    clearFilters,
    handleDetails,
    handleOpenSchedule,
    handleCloseSchedule,
    handleExecuteScheduledSearch,
    handleImportedVehicle,
  } = useSearchController();

  return (
    <main className="search-page">
      <Navbar />

      {loading ? (
        <div className="search-loading-screen" role="status" aria-live="polite">
          <div className="search-loading-spinner" />
          <strong>CARREGANDO PESQUISA</strong>
          <span>Buscando veículos disponíveis...</span>
        </div>
      ) : (
        <div className="search-container">
          <Header />
          <Controls
            search={search}
            brands={brands}
            years={years}
            selectedBrand={selectedBrand}
            selectedYear={selectedYear}
            activeFilterChips={activeFilterChips}
            validationError={validationError}
            scheduledCount={scheduledCount}
            onSearchChange={handleSearchChange}
            onBrandChange={handleBrandChange}
            onYearChange={handleYearChange}
            onRemoveFilter={removeFilter}
            onExecute={executeSearch}
            onClear={clearFilters}
            onOpenSchedule={() => handleOpenSchedule()}
            onOpenImport={() => {
              setEditingVehicle(null);
              setIsImportModalOpen(true);
            }}
          />

          {hasFilters ? (
            results.length > 0 ? (
              <>
                <ResultsHeader
                  hasFilters={hasFilters}
                  search={search}
                  resultCount={results.length}
                />
                <CarGrid
                  cars={results}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onDetails={handleDetails}
                  onSchedule={handleOpenSchedule}
                  onEdit={(car) => {
                    setEditingVehicle(car);
                    setIsImportModalOpen(true);
                  }}
                />
              </>
            ) : (
              <EmptyState onClear={clearFilters} />
            )
          ) : recentCars && recentCars.length > 0 ? (
            <RecentViewed
              cars={recentCars}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onDetails={handleDetails}
              onSchedule={handleOpenSchedule}
              onEdit={(car) => {
                setEditingVehicle(car);
                setIsImportModalOpen(true);
              }}
            />
          ) : (
            <InitialState />
          )}
        </div>
      )}

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseSchedule}
        availableCars={cars.length > 0 ? cars : recentCars}
        initialSelectedCar={scheduleInitialCar}
        onExecuteScheduledSearch={handleExecuteScheduledSearch}
      />

      <ImportVehicleModal
        isOpen={isImportModalOpen}
        initialVehicle={editingVehicle}
        onClose={() => {
          setIsImportModalOpen(false);
          setEditingVehicle(null);
        }}
        onSaved={(vehicle) => {
          handleImportedVehicle(vehicle);
          setIsImportModalOpen(false);
          setEditingVehicle(null);
        }}
      />
    </main>
  );
}
