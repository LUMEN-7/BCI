import "./style.css";
import Navbar from "../../components/Navbar/Navbar";
import Header from "./sections/Header";
import Summary from "./sections/Summary";
import Toolbar from "./sections/Toolbar";
import List from "./sections/List";
import useAlertsController from "./hooks/useAlertsController";

export default function Alerts() {
 const {
        loading,
        error,
        alerts,
        activeFilter,
        filteredAlerts,
        unreadCount,
        setActiveFilter,
        markAllAsRead,
        markAsRead,
        deleteAlert,
        handleAlertClick,
    } = useAlertsController();

    if (loading) {
        return (
            <div className="alerts-loading">
                <p>Carregando notificações...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alerts-error">
                <p>{error}</p>
            </div>
        );
    }

  return (
    <main className="alerts-page">
      <Navbar />

      <section className="alerts-container">
        <Header
          unreadCount={unreadCount}
          onMarkAllAsRead={markAllAsRead}
        />
        <Summary unreadCount={unreadCount} />
        <Toolbar
          activeFilter={activeFilter}
          alertCount={alerts.length}
          unreadCount={unreadCount}
          onFilterChange={setActiveFilter}
        />
        <List
          alerts={filteredAlerts}
          activeFilter={activeFilter}
          onAlertClick={handleAlertClick}
          onMarkAsRead={markAsRead}
          onDelete={deleteAlert}
        />
      </section>
    </main>
  );
}
