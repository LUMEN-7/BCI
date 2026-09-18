import Navbar from "../../components/Navbar/Navbar";
import CarGrid from "./sections/CarGrid";
import Controls from "./sections/Controls";
import EmptyState from "./sections/EmptyState";
import Header from "./sections/Header";
import InitialState from "./sections/InitialState";
import RecentViewed from "./sections/RecentViewed";
import ResultsHeader from "./sections/ResultsHeader";
import ScheduleModal from "./sections/ScheduleModal";
import useSearchController from "./hooks/useSearchController";

import "./style.css";

export default function Search() {
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
    handleImportCars,
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
            onImport={handleImportCars}
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
    </main>
  );
}
