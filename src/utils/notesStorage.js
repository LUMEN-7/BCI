// Utilitário central para persistência e sincronização de anotações do BCI.
// Funciona offline / via localStorage e emite eventos para sincronização em tempo real entre componentes.

export const NOTES_STORAGE_KEY = 'lumen-floating-notes';

function readStorage() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(notes) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent('floating-notes-updated', { detail: notes }));
  } catch (error) {
    console.error('Erro ao salvar anotações no localStorage:', error);
  }
}

export function getStoredNotes() {
  const notes = readStorage();
  // Ordena da mais recente (updatedAt) para a mais antiga
  return notes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
}

export function getNoteById(id) {
  const notes = readStorage();
  return notes.find((n) => String(n.id) === String(id)) || null;
}

export function saveNote({ id, title, content, savedCars = [], images = [] }) {
  const notes = readStorage();
  const now = new Date().toISOString();

  let updatedNotes;
  let noteResult;

  if (id) {
    // Atualização de anotação existente
    const index = notes.findIndex((n) => String(n.id) === String(id));
    if (index !== -1) {
      noteResult = {
        ...notes[index],
        title: title || 'Sem título',
        content: content || '',
        savedCars: savedCars || [],
        images: images || [],
        updatedAt: now,
      };
      updatedNotes = [...notes];
      updatedNotes[index] = noteResult;
    } else {
      noteResult = {
        id: String(id),
        title: title || 'Sem título',
        content: content || '',
        savedCars: savedCars || [],
        images: images || [],
        createdAt: now,
        updatedAt: now,
      };
      updatedNotes = [noteResult, ...notes];
    }
  } else {
    // Nova anotação
    const newId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    noteResult = {
      id: newId,
      title: title || 'Sem título',
      content: content || '',
      savedCars: savedCars || [],
      images: images || [],
      createdAt: now,
      updatedAt: now,
    };
    updatedNotes = [noteResult, ...notes];
  }

  writeStorage(updatedNotes);
  return noteResult;
}

export function deleteNote(id) {
  const notes = readStorage();
  const updatedNotes = notes.filter((n) => String(n.id) !== String(id));
  writeStorage(updatedNotes);
  return updatedNotes;
}
