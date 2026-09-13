import { useMemo, useState } from "react";
import Filter from "./sections/Filter";
import Overview from "./sections/Overview";
import Trends from "./sections/Trends";
import Comparison from "./sections/Comparison";
import Sources from "./sections/Sources";
import Feed from "./sections/Feed";
import { INSIGHTS, SCATTER_DATA, SEGMENT_BRAND } from "./data";
import "./style.css";

export default function CompetitiveIntelDashboard() {
  const [segment, setSegment] = useState("Todos");
  const [visibleFeatures, setVisibleFeatures] = useState({ adas2: true, hibrido: true, tetoPanoramico: true });
  const [insights, setInsights] = useState(INSIGHTS);

  const segmentBars = useMemo(() => {
    if (segment !== "Todos") return SEGMENT_BRAND[segment] || [];
    const totals = {};
    Object.values(SEGMENT_BRAND).flat().forEach(({ marca, pct }) => {
      totals[marca] ||= { total: 0, count: 0 };
      totals[marca].total += pct;
      totals[marca].count += 1;
    });
    return Object.entries(totals).map(([marca, value]) => ({ marca, pct: Math.round(value.total / value.count) }));
  }, [segment]);

  const scatterData = useMemo(() => {
    if (segment === "Todos") return SCATTER_DATA;
    const brands = new Set((SEGMENT_BRAND[segment] || []).map(({ marca }) => marca));
    return SCATTER_DATA.filter(({ marca }) => brands.has(marca));
  }, [segment]);

  const resolveInsight = (index, status) => setInsights((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item));

  return <main className="insights-dashboard"><Filter value={segment} onChange={setSegment} /><Overview /><Trends visibleFeatures={visibleFeatures} onToggleFeature={(key) => setVisibleFeatures((current) => ({ ...current, [key]: !current[key] }))} /><Comparison segment={segment} segmentBars={segmentBars} scatterData={scatterData} /><Sources /><Feed items={insights} onResolve={resolveInsight} /><p className="insights-footnote">Dados fictícios, apenas para ilustrar layout e tipos de gráfico.</p></main>;
}
