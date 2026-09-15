import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS, SOURCE_FREQUENCY } from "../../data";
import { ChartTooltip } from "../Shared";
import "./style.css";

export default function Sources() { return <section className="insights-sources-section"><div className="insights-panel"><header className="insights-panel-header"><h2>Frequência de atualização por fonte</h2><p>Últimos 90 dias</p></header><ResponsiveContainer width="100%" height={220}><BarChart data={SOURCE_FREQUENCY} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}><CartesianGrid stroke="#e8edf2" horizontal={false} /><XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} /><YAxis type="category" dataKey="fonte" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={118} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="atualizacoes" name="Atualizações" fill={COLORS.cyan} radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div></section>; }
