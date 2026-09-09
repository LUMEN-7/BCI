import Navbar from '../../components/Navbar/Navbar';
import FloatingNotes from "../../components/FloantingNotes/FloatingNotes";
import useCompareController from './hooks/useCompareController';
import Footer from './sections/Footer';
import Header from './sections/Header';
import Results from './sections/Results';
import Search from './sections/Search';
import Selection from './sections/Selection';
import './style.css';

export default function Compare() {
	const controller = useCompareController();

	return (
		<main className="compare-page">
			<Navbar />
			<div className="compare-container">
				<Header />
				<Selection
					firstCar={controller.firstCar}
					secondCar={controller.secondCar}
					activeSlot={controller.activeSlot}
					canCompare={controller.canCompare}
					setActiveSlot={controller.setActiveSlot}
					removeCar={controller.removeCar}
					onCompare={controller.handleCompare}
				/>
				<Search activeSlot={controller.activeSlot} search={controller.search} setSearch={controller.setSearch} />
				<Results
					results={controller.results}
					search={controller.search}
					firstCar={controller.firstCar}
					secondCar={controller.secondCar}
					onSelect={controller.selectCar}
					onClear={() => controller.setSearch('')}
				/>
				<Footer canCompare={controller.canCompare} onCompare={controller.handleCompare} />
			</div>
			<FloatingNotes />
		</main>
	);
}