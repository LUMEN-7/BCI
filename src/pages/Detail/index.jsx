import AiAnalysis from './sections/AiAnalysis';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Technical from './sections/Technical';
import Topbar from './sections/Topbar';
import useDetailController from './hooks/useDetailController';
import './style.css';

export default function CompareDetail() {
	const controller = useDetailController();

	return (
		<main className="compare-detail-page">
			<div className="compare-detail-container">
				<Topbar
					favorite={controller.favorite}
					onBack={controller.handleBack}
					onHome={controller.handleHome}
					onToggleFavorite={controller.toggleFavorite}
				/>
				<Header />
				<Hero firstCar={controller.firstCar} secondCar={controller.secondCar} />
				<AiAnalysis
					firstCar={controller.firstCar}
					secondCar={controller.secondCar}
					comparisonSummary={controller.comparisonSummary}
				/>
				<Technical
					firstCar={controller.firstCar}
					secondCar={controller.secondCar}
					expandedSection={controller.expandedSection}
					onToggleSection={controller.toggleSection}
				/>
			</div>
		</main>
	);
}
