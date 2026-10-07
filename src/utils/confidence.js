export function normalizeConfidence(value) {
  if (value === null || value === undefined || value === '') return 0;
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(Math.min(100, Math.max(0, number <= 1 ? number * 100 : number)));
}

export function getInformationStatus(item) {
  const value = item?.value;
  const missing = value === null || value === undefined ||
    (typeof value === 'string' && ['', 'não informado', 'n/a'].includes(value.trim().toLowerCase()));
  const iaGen = !missing && Boolean(item?.iaGen || item?.isAiGenerated);
  const number = Number(item?.confidence ?? 0);
  const confidence = missing || !Number.isFinite(number) ? 0
    : Math.min(iaGen ? 99 : 100, Math.max(0, Math.round(number)));
  return { missing, iaGen, confidence, verified: !missing && !iaGen && confidence > 90 };
}

// A confiança consolidada considera concordâncias e conflitos entre fontes.
export function extractConfidenceList(source, inherited = {}) {
  if (source === null || source === undefined) return [];
  if (Array.isArray(source)) {
    return source.flatMap((item) => extractConfidenceList(item, inherited));
  }
  if (typeof source !== 'object') {
    return String(source).split(/[;\n,]/).map((value) => value.trim())
      .filter(Boolean).map((value) => ({ value, source: null, confidence: 0, ...inherited }));
  }

  const rawConfidence = source.confianca ?? source.Confianca ?? source.confidence;
  const metadata = {
    iaGen: Boolean(inherited.iaGen || source.iaGen || source.isAiGenerated),
    source: source.fonte ?? source.Fonte ?? source.source ?? inherited.source ?? null,
    confidence: inherited.confidence ?? normalizeConfidence(rawConfidence),
  };
  const fontes = source.fontes ?? source.Fontes;
  if (fontes && (Array.isArray(fontes) ? fontes.length : true)) {
    const parentMetadata = rawConfidence == null && inherited.confidence == null
      ? { source: metadata.source, iaGen: metadata.iaGen }
      : metadata;
    return extractConfidenceList(Array.isArray(fontes) ? fontes : [fontes], parentMetadata);
  }
  return extractConfidenceList(source.valor ?? source.Valor ?? source.value, metadata);
}
