import apiFetch from "./api";

const RECORRENCIA_MAP = { once: "Unica", daily: "Diaria", weekly: "Semanal", monthly: "Mensal" };
const RECORRENCIA_MAP_INVERSO = { Unica: "once", Diaria: "daily", Semanal: "weekly", Mensal: "monthly" };

function formatarDataParaExibicao(proximaExecucao) {
  if (!proximaExecucao) return { date: "", time: "" };

  // Tratamento caso a API retorne no formato ISO: "2026-09-13T01:04:00"
  if (proximaExecucao.includes("T")) {
    const [d, t] = proximaExecucao.split("T");
    return { date: d, time: t ? t.slice(0, 5) : "" };
  }

  // Tratamento caso a API retorne no formato customizado: "13/09/2026-01:04"
  if (proximaExecucao.includes("-")) {
    const [d, t] = proximaExecucao.split("-");
    if (d && d.includes("/")) {
      const [dia, mes, ano] = d.split("/");
      return { date: `${ano}-${mes}-${dia}`, time: t ? t.slice(0, 5) : "" };
    }
    return { date: d, time: t ? t.slice(0, 5) : "" };
  }

  return { date: "", time: "" };
}

function adaptarAgendamento(a) {
  const { date, time } = formatarDataParaExibicao(a.proximaExecucao);

  return {
    id: a.id,
    carId: a.linhagemId ? String(a.linhagemId) : null,
    carName: a.modelo,
    carBrand: a.marca,
    carYear: a.ano,
    date,
    time,
    recurrence: RECORRENCIA_MAP_INVERSO[a.recorrencia] ?? "once",
    notes: a.notas ?? "",
    status: a.status,
  };
}

export async function getScheduledSearches() {
  const lista = await apiFetch("/AgendamentoPesquisa/meus", { method: "GET" });
  return lista.map(adaptarAgendamento);
}

export async function saveScheduledSearch({ car, date, time, recurrence, notes }) {
  // Converte "YYYY-MM-DD" para "dd/MM/yyyy"
  const [ano, mes, dia] = date.split("-");
  const dataAgendadaFormatada = `${dia}/${mes}/${ano}-${time}`;

  await apiFetch("/AgendamentoPesquisa", {
    method: "POST",
    body: JSON.stringify({
      marca: car.brand,
      modelo: car.modelo,
      ano: car.ano ? Number(car.ano) : null,
      linhagemId: car.id ? Number(car.id) : null,
      dataAgendada: dataAgendadaFormatada,
      recorrencia: RECORRENCIA_MAP[recurrence] ?? "Unica",
      notas: notes || null,
    }),
  });
}

export async function deleteScheduledSearch(id) {
  return apiFetch(`/AgendamentoPesquisa/${id}`, { method: "DELETE" });
}

export async function toggleScheduledSearchStatus(id) {
  return apiFetch(`/AgendamentoPesquisa/${id}/alternar-status`, { method: "PATCH" });
}

export async function executarAgendamentoAgora(id) {
  return apiFetch(`/AgendamentoPesquisa/${id}/executar-agora`, { method: "POST" });
}