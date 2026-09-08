import Navbar from "../../components/Navbar/Navbar";
import CarGrid from "./sections/CarGrid";
import Controls from "./sections/Controls";
import EmptyState from "./sections/EmptyState";
import Header from "./sections/Header";
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
    hasFilters,
    handleSearchChange,
    handleBrandChange,
    handleYearChange,
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
          hasFilters={hasFilters}
          onSearchChange={handleSearchChange}
          onBrandChange={handleBrandChange}
          onYearChange={handleYearChange}
          onClear={clearFilters}
        />
        <ResultsHeader
          hasFilters={hasFilters}
          search={search}
          resultCount={results.length}
        />
        {results.length > 0 ? (
          <CarGrid
            cars={results}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onDetails={handleDetails}
          />
        ) : (
          <EmptyState onClear={clearFilters} />
        )}
      </div>
    </main>
  );
}
