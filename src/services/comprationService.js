import apiFetch from "./api";

export async function direct(carIds) {
    
    return await apiFetch('/Comparacao/direta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        carrosIds: carIds // Envia apenas os IDs
    })
});
}

