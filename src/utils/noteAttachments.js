/** Normaliza anexos antigos (URL) e novos (objeto) para a UI de anotações. */
export function getNoteImage(image, fallbackName = 'Imagem') {
  if (typeof image === 'string') {
    return { id: image, url: image, name: fallbackName };
  }

  return {
    id: image?.id || image?.url,
    url: image?.url || '',
    name: image?.name || fallbackName,
  };
}
