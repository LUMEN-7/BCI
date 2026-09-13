import Navbar from "../../components/Navbar/Navbar";
import CompetitiveIntelDashboard from "./CompetitiveIntelDashboard";
import { RefreshCw } from "lucide-react";
import "./style.css";

export default function Insights() {
  return (
    <main className="insights-page">
      <Navbar />
      <div className="insights-container">
        <header className="insights-header">
          <div>
            <span className="insights-eyebrow">Inteligência competitiva</span>
            <h1>Insights</h1>
            <p>
              Tendências extraídas do monitoramento contínuo de concorrentes e das versões catalogadas na base interna.
            </p>
          </div>
          <div className="insights-updated">
            <RefreshCw size={14} />
            <span>Atualizado há 4h</span>
          </div>
        </header>
        <CompetitiveIntelDashboard />
      </div>
    </main>
  );
}
