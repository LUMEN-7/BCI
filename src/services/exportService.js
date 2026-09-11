import { apiFetchBlob } from "./api";

function inferirExtensao(contentType, formatoSolicitado) {
    if (contentType.includes("zip")) return "zip";
    if (contentType.includes("spreadsheetml")) return "xlsx";
    if (contentType.includes("csv")) return "csv";
    if (contentType.includes("json")) return "json";
    return formatoSolicitado; // fallback, só se o Content-Type não ajudar
}

export async function exportCar(itens, formato = 'csv', modo = undefined, separador = undefined) {
    const { blob, contentType, filename } = await apiFetchBlob('/Exportacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            itens,
            formato,
            ...(modo ? { modo } : {}),
            ...(formato === 'csv' && separador ? { separador } : {}) // ignorado fora do csv
        })
    });

    const nomeArquivo = filename || `exportacao.${inferirExtensao(contentType, formato)}`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}