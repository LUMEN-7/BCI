// Dados locais pertencentes a uma conta nunca devem usar chaves compartilhadas.
// A sessão permanece em `currentUser`; os demais itens recebem um sufixo estável do usuário.
function getCurrentUser() {
  try {
    const rawUser = localStorage.getItem('currentUser');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserStorageId() {
  const user = getCurrentUser();
  const identifier = user?.id ?? user?.Id ?? user?.usuarioId ?? user?.UsuarioId ?? user?.userId ?? user?.UserId ?? user?.email ?? user?.Email ?? user?.userName ?? user?.UserName;
  return identifier === undefined || identifier === null || identifier === ''
    ? null
    : encodeURIComponent(String(identifier).trim().toLowerCase());
}

export function getUserScopedKey(baseKey) {
  const userId = getCurrentUserStorageId();
  return userId ? `${baseKey}:${userId}` : null;
}

export function getUserScopedItem(baseKey) {
  const key = getUserScopedKey(baseKey);
  return key ? localStorage.getItem(key) : null;
}

export function setUserScopedItem(baseKey, value) {
  const key = getUserScopedKey(baseKey);
  if (key) localStorage.setItem(key, value);
}

export function removeUserScopedItem(baseKey) {
  const key = getUserScopedKey(baseKey);
  if (key) localStorage.removeItem(key);
}

// Versões antigas eram compartilhadas entre contas. Nunca as migramos, pois não há
// como identificar com segurança o proprietário dos dados já gravados.
export function removeLegacySharedUserData() {
  [
    'recentNavigationActivities',
    'lumen-recent-viewed-cars',
    'jobId',
    'lumen-floating-notes',
    'lumen-scheduled-searches',
  ].forEach((key) => localStorage.removeItem(key));
}
