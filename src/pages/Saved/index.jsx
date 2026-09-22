import Navbar from "../../components/Navbar/Navbar";
import SavedGrid from "./sections/Grid";
import SavedHeader from "./sections/Header";
import useSavedController from "./hooks/useSavedController";

import "./style.css";

export default function Saved() {
  const controller = useSavedController();

  return (
    <main className="saved-page">

      <Navbar />

      <section className="saved-container">

        <SavedHeader
          activeTab={controller.activeTab}
          carCount={controller.savedCars.length}
          comparisonCount={controller.savedComparisons.length}
          onChangeTab={controller.changeTab}
        />

        <SavedGrid
          activeTab={controller.activeTab}
          items={controller.currentItems}
          openCards={controller.openCards}

          loading={controller.loading}

          hasUnreadUpdates={controller.hasUnreadUpdates}
          getUnreadCount={controller.getUnreadCount}
          isUpdateRead={controller.isUpdateRead}

          onToggleCard={controller.toggleCard}
          onDelete={controller.deleteItem}
          onMarkRead={controller.markItemAsRead}
          onCarDetails={controller.handleCarDetails}
          onComparisonDetails={controller.handleComparisonDetails}
        />

      </section>

    </main>
  );
}