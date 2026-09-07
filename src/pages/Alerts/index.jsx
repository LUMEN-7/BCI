import './style.css';
import Navbar from '../../components/Navbar/Navbar';
import Header from './sections/Header';
import Summary from './sections/Summary';
import Toolbar from './sections/Toolbar';
import List from './sections/List';
import useAlertsController from './hooks/useAlertsController';

export default function Alerts() {
	const controller = useAlertsController();

	return (
		<main className="alerts-page">
			<Navbar />

			<section className="alerts-container">
				<Header unreadCount={controller.unreadCount} onMarkAllAsRead={controller.markAllAsRead} />
				<Summary unreadCount={controller.unreadCount} />
				<Toolbar activeFilter={controller.activeFilter} alertCount={controller.alerts.length} unreadCount={controller.unreadCount} onFilterChange={controller.setActiveFilter} />
				<List alerts={controller.filteredAlerts} activeFilter={controller.activeFilter} onAlertClick={controller.handleAlertClick} onMarkAsRead={controller.markAsRead} onDelete={controller.deleteAlert} />
			</section>
		</main>
	);
}