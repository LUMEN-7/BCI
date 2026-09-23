import {
  useEffect,
  useState,
} from "react";

import {
  IoCheckmarkCircleOutline,
  IoClose,
} from "react-icons/io5";

import Navbar from "../../components/Navbar/Navbar";
import PageLoader from "../../components/PageLoader/PageLoader";

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

import "./style.css";


function SaveLoadingModal() {
  return (
    <div
      className="search-save-loading-backdrop"
      role="presentation"
    >
      <section
        className="search-save-loading-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-save-loading-title"
      >
        <span
          className="search-save-loading-spinner"
          aria-hidden="true"
        />

        <div className="search-save-loading-content">
          <strong id="search-save-loading-title">
            Salvando informações...
          </strong>

          <span>
            Aguarde enquanto salvamos esta pesquisa.
          </span>
        </div>
      </section>
    </div>
  );
}


function SaveSuccessToast({
  onClose,
}) {
  return (
    <div
      className="search-save-success-toast"
      role="status"
      aria-live="polite"
    >
      <div className="search-save-success-icon">
        <IoCheckmarkCircleOutline />
      </div>

      <div className="search-save-success-content">
        <strong>
          Pesquisa salva
        </strong>

        <span>
          O veículo foi adicionado aos salvos.
        </span>
      </div>

      <button
        type="button"
        className="search-save-success-close"
        onClick={onClose}
        aria-label="Fechar aviso"
      >
        <IoClose />
      </button>
    </div>
  );
}


export default function Search() {
  const [
    isImportModalOpen,
    setIsImportModalOpen,
  ] = useState(false);

  const [
    editingVehicle,
    setEditingVehicle,
  ] = useState(null);

  const [
    savingCarId,
    setSavingCarId,
  ] = useState(null);

  const [
    showSaveSuccess,
    setShowSaveSuccess,
  ] = useState(false);


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
    isSearchInFlight,
    avisoBuscaDuplicada,
    inFlightLabel,

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


  useEffect(() => {
    if (!showSaveSuccess) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [showSaveSuccess]);


  async function handleFavoriteClick(
    carId
  ) {
    const isFavorite =
      favorites.includes(
        String(carId)
      );

    if (isFavorite) {
      await toggleFavorite(
        carId
      );

      return;
    }

    try {
      setShowSaveSuccess(false);

      setSavingCarId(
        String(carId)
      );

      const result =
        await toggleFavorite(
          carId
        );

      if (
        result?.success &&
        result?.acao === "adicionado"
      ) {
        setShowSaveSuccess(true);
      }

    } catch (error) {
      console.error(
        "Erro ao salvar pesquisa:",
        error
      );

    } finally {
      setSavingCarId(null);
    }
  }


  if (loading) {
    return (
      <PageLoader
        message="pesquisa de veículos"
      />
    );
  }


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
          scheduledCount={scheduledCount}
          isSearchInFlight={isSearchInFlight}
          inFlightLabel={inFlightLabel}
          avisoBuscaDuplicada={avisoBuscaDuplicada}
          onSearchChange={handleSearchChange}
          onBrandChange={handleBrandChange}
          onYearChange={handleYearChange}
          onRemoveFilter={removeFilter}
          onExecute={executeSearch}
          onClear={clearFilters}

          onOpenSchedule={() =>
            handleOpenSchedule()
          }

          onOpenImport={() => {
            setEditingVehicle(null);

            setIsImportModalOpen(
              true
            );
          }}
        />


        {hasFilters ? (

          results.length > 0 ? (

            <>
              <ResultsHeader
                hasFilters={hasFilters}
                search={search}
                resultCount={
                  results.length
                }
              />


              <CarGrid
                cars={results}
                favorites={favorites}

                onToggleFavorite={
                  handleFavoriteClick
                }

                onDetails={
                  handleDetails
                }

                onSchedule={
                  handleOpenSchedule
                }

                onEdit={(car) => {
                  setEditingVehicle(
                    car
                  );

                  setIsImportModalOpen(
                    true
                  );
                }}
              />
            </>

          ) : (

            <EmptyState
              onClear={
                clearFilters
              }
            />

          )

        ) : recentCars &&
          recentCars.length > 0 ? (

          <RecentViewed
            cars={recentCars}
            favorites={favorites}

            onToggleFavorite={
              handleFavoriteClick
            }

            onDetails={
              handleDetails
            }

            onSchedule={
              handleOpenSchedule
            }

            onEdit={(car) => {
              setEditingVehicle(
                car
              );

              setIsImportModalOpen(
                true
              );
            }}
          />

        ) : (

          <InitialState />

        )}

      </div>


      <ScheduleModal
        isOpen={
          isScheduleModalOpen
        }

        onClose={
          handleCloseSchedule
        }

        availableCars={
          cars.length > 0
            ? cars
            : recentCars
        }

        initialSelectedCar={
          scheduleInitialCar
        }

        onExecuteScheduledSearch={
          handleExecuteScheduledSearch
        }
      />


      <ImportVehicleModal
        isOpen={
          isImportModalOpen
        }

        initialVehicle={
          editingVehicle
        }

        onClose={() => {
          setIsImportModalOpen(
            false
          );

          setEditingVehicle(
            null
          );
        }}

        onSaved={(vehicle) => {
          handleImportedVehicle(
            vehicle
          );

          setIsImportModalOpen(
            false
          );

          setEditingVehicle(
            null
          );
        }}
      />


      {savingCarId && (
        <SaveLoadingModal />
      )}


      {showSaveSuccess && (

        <SaveSuccessToast
          onClose={() =>
            setShowSaveSuccess(
              false
            )
          }
        />

      )}

    </main>
  );
}
