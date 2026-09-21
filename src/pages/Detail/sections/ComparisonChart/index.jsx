import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./style.css";

const AXES = [
  ["Performance", "performance"],
  ["Segurança", "security"],
  ["Tecnologia", "technology"],
  ["Conforto", "comfort"],
  ["Eficiência", "efficiency"],
];

const RADAR_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#f97316", "#7c3aed"];

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function numberFrom(value) {
  const match = String(value ?? "").replace(",", ".").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function scoreSection(items = []) {
  return clamp(items.length * 25);
}

function scorePerformance(car) {
  return clamp(numberFrom(car.specs?.power) / 6 + (car.sections?.performance?.length || 0) * 8);
}

function scoreEfficiency(car) {
  const city = numberFrom(car.specs?.cityConsumption);
  const highway = numberFrom(car.specs?.highwayConsumption);
  return clamp(((city + highway) / 2) * 8);
}

function createChartData(cars) {
  return AXES.map(([label, key]) => {
    const point = { atributo: label };

    cars.forEach((car, index) => {
      point[`model-${index}`] = key === "performance"
        ? scorePerformance(car)
        : key === "efficiency"
          ? scoreEfficiency(car)
          : scoreSection(car.sections?.[key]);
    });

    return point;
  });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="comparison-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value}/100
        </span>
      ))}
    </div>
  );
}

export default function ComparisonChart({ cars = [] }) {
  if (cars.length < 2) return null;

  const data = createChartData(cars);

  return (
    <section className="comparison-chart-section">
      <div className="comparison-chart-heading">
        <span className="section-eyebrow">ÍNDICES COMPARATIVOS</span>
        <h2>Perfil dos modelos</h2>
        <p>Comparação visual de performance, recursos e eficiência em uma escala de 0 a 100.</p>
      </div>

      <div className="comparison-chart-panel">
        <ResponsiveContainer width="100%" height={330}>
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="#e8edf2" />
            <PolarAngleAxis
              dataKey="atributo"
              tick={{ fill: "#637184", fontFamily: "Titillium Web, sans-serif", fontSize: 11 }}
            />
            <PolarRadiusAxis
              tick={false}
              axisLine={false}
              domain={[0, 100]}
            />
            {cars.map((car, index) => (
              <Radar
                key={car.id || index}
                name={car.name || `Modelo ${index + 1}`}
                dataKey={`model-${index}`}
                stroke={RADAR_COLORS[index % RADAR_COLORS.length]}
                fill={RADAR_COLORS[index % RADAR_COLORS.length]}
                fillOpacity={0.08}
                strokeWidth={1.75}
              />
            ))}
            <Tooltip content={<ChartTooltip />} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="comparison-chart-legend">
          {cars.map((car, index) => (
            <span key={car.id || index}>
              <i style={{ background: RADAR_COLORS[index % RADAR_COLORS.length] }} />
              {car.name || `Modelo ${index + 1}`}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}