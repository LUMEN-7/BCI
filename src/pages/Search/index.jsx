import Navbar from "../../components/Navbar/Navbar";
import CarGrid from "./sections/CarGrid";
import Controls from "./sections/Controls";
import EmptyState from "./sections/EmptyState";
import Header from "./sections/Header";
import InitialState from "./sections/InitialState";
import RecentViewed from "./sections/RecentViewed";
import ResultsHeader from "./sections/ResultsHeader";
import useSearchController from "./hooks/useSearchController";

import "./style.css";

export default function Search() {
  const {
    brands,
    years,
    results,
    search,
    selectedBrand,
    selectedYear,
    favorites,
    recentCars,
    hasFilters,
    validationError,
    activeFilterChips,
    handleSearchChange,
    handleBrandChange,
    handleYearChange,
    removeFilter,
    executeSearch,
    toggleFavorite,
    clearFilters,
    handleDetails,
  } = useSearchController();

  return (
    <main className="search-page">
      <Navbar />

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
          onSearchChange={handleSearchChange}
          onBrandChange={handleBrandChange}
          onYearChange={handleYearChange}
          onRemoveFilter={removeFilter}
          onExecute={executeSearch}
          onClear={clearFilters}
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
          />
        ) : (
          <InitialState />
        )}
      </div>
    </main>
  );
}
