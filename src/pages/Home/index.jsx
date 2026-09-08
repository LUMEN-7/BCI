import Navbar from "../../components/Navbar/Navbar";
import Activity from "./sections/Activity";
import Alerts from "./sections/Alerts";
import Coverage from "./sections/Coverage";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import Highlights from "./sections/Highlights";
import Overview from "./sections/Overview";
import useHomeController from "./hooks/useHomeController";
import { cars, coverage, highlights, metrics, recentActivity } from "./data";
import "./style.css";

export default function Home() {
  const {
    firstName,
    greeting,
    handleSearch,
    handleCompare,
    handleReviewAlerts,
  } = useHomeController();

  return (
    <main className="home-page">
      <Navbar />
      <Hero
        cars={cars}
        firstName={firstName}
        greeting={greeting}
        onSearch={handleSearch}
        onCompare={handleCompare}
      />
      <Overview metrics={metrics} />
      <Highlights items={highlights} />
      <Coverage items={coverage} />
      <Alerts onReview={handleReviewAlerts} />
      <Activity items={recentActivity} />
      <Footer />
    </main>
  );
}
