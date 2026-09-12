import apiFetch from "./api";

function limparConteudoEmbutido(content) {
    return content
        .replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, '')   // remove imagem em base64 embutida no texto
        .replace(/::car\[[^\]]*\]\{[^}]*\}/g, '')             // remove a diretiva de carro embutida
        .trim();
}

function paraBlocosBackend({ content, attachedCars, attachedImages }) {
    const blocos = [];
    if (content?.trim()) {
      const textoLimpo = limparConteudoEmbutido(content);
      if (textoLimpo) blocos.push({ tipo: "Paragrafo", texto: textoLimpo });
    }
    for (const car of attachedCars ?? []) {
        if (car?.id) blocos.push({ tipo: "CardCarro", linhagemIdReferenciado: Number(car.id) });
    }
    for (const image of attachedImages ?? []) {
        if (image?.url) blocos.push({ tipo: "Imagem", texto: image.url });
    }
    return blocos;
}

function deBlocosParaNota(anotacao) {
    const blocoTexto = anotacao.blocos.find((b) => b.tipo === "Paragrafo");
    const carrosBlocos = anotacao.blocos.filter((b) => b.tipo === "CardCarro" && b.cardCarro);
    const imagensBlocos = anotacao.blocos.filter((b) => b.tipo === "Imagem" && b.texto);

    return {
        id: anotacao.id,
        title: anotacao.titulo,
        content: blocoTexto?.texto ?? "",
        savedCars: carrosBlocos.map((b) => ({
            id: b.cardCarro.linhagemId,
            name: `${b.cardCarro.marca} ${b.cardCarro.modelo} ${b.cardCarro.ano}`,
            brand: b.cardCarro.marca,
        })),
        images: imagensBlocos.map((b, i) => ({ id: `img-${anotacao.id}-${i}`, url: b.texto })),
        createdAt: anotacao.criadoEm,
        updatedAt: anotacao.atualizadoEm,
    };
}

export async function listarAnotacoesCompletas() {
    const anotacoes = await apiFetch("/Anotacao/minhas", { method: "GET" });
    return anotacoes.map(deBlocosParaNota);
}

export async function obterAnotacaoCompleta(id) {
    const anotacao = await apiFetch(`/Anotacao/${id}`, { method: "GET" });
    return deBlocosParaNota(anotacao);
}

export async function salvarAnotacaoCompleta({ id, title, content, attachedCars, attachedImages }) {
    const anotacaoId = id ?? (await apiFetch("/Anotacao", {
        method: "POST",
        body: JSON.stringify({ titulo: title }),
    })).id;

    if (id) {
        await apiFetch(`/Anotacao/${id}`, { method: "PATCH", body: JSON.stringify({ titulo: title }) });
    }

    await apiFetch(`/Anotacao/${anotacaoId}/blocos`, {
        method: "PUT",
        body: JSON.stringify({ blocos: paraBlocosBackend({ content, attachedCars, attachedImages }) }),
    });

    return obterAnotacaoCompleta(anotacaoId);
}

export async function excluirAnotacaoCompleta(id) {
    return apiFetch(`/Anotacao/${id}`, { method: "DELETE" });
}