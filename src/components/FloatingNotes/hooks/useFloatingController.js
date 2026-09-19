import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAnotacoesCompletas, salvarAnotacaoCompleta, excluirAnotacaoCompleta } from '@/services/noteService';

export function useFloatingController() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const toolbarScrollRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('LIST');
  const [activeTab, setActiveTab] = useState('WRITE');
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedCars, setAttachedCars] = useState([]);
  const [attachedImages, setAttachedImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateToolbarArrows = () => {
    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;
    const { scrollLeft, scrollWidth, clientWidth } = toolbar;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  };

  const scrollToolbar = (direction) => {
    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;
    const amount = 200;
    toolbar.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateToolbarArrows, 100);
    setTimeout(updateToolbarArrows, 300);
  };

  useEffect(() => {
    if (!isOpen || viewMode !== 'EDIT' || activeTab !== 'WRITE') return;
    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;

    const handleScroll = () => updateToolbarArrows();
    const handleResize = () => updateToolbarArrows();
    toolbar.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateToolbarArrows, 150);

    return () => {
      clearTimeout(timer);
      toolbar.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, viewMode, activeTab]);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const loadNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      setNotes(await listarAnotacoesCompletas());
    } catch (err) {
      showToast(err.message || 'Não foi possível carregar as anotações.', 'error');
    } finally {
      setLoadingNotes(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(loadNotes, 0);
    window.addEventListener('floating-notes-updated', loadNotes);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('floating-notes-updated', loadNotes);
    };
  }, [loadNotes]);

  const handleStartNewNote = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAttachedCars([]);
    setAttachedImages([]);
    setActiveTab('WRITE');
    setViewMode('EDIT');
  };

  const handleEditNote = (note, e) => {
    e?.stopPropagation();
    setEditingId(note.id);
    setTitle(note.title || '');
    setContent(note.content || '');
    setAttachedCars(note.savedCars || []);
    setAttachedImages(note.images || []);
    setActiveTab('WRITE');
    setViewMode('EDIT');
  };

  const handleSave = async () => {
    if (saving) return; // evita duplicar a nota com cliques repetidos enquanto salva
    if (!title.trim() && !content.trim()) {
      showToast('Preencha ao menos o título ou conteúdo da nota.', 'error');
      return;
    }
    const isEdit = Boolean(editingId);
    setSaving(true);
    try {
      await salvarAnotacaoCompleta({
        id: editingId,
        title: title.trim() || 'Sem título',
        content,
        attachedCars,
        attachedImages,
      });
      await loadNotes();
      window.dispatchEvent(new CustomEvent('floating-notes-updated'));
      setViewMode('LIST');
      showToast(isEdit ? 'Anotação atualizada com sucesso!' : 'Anotação salva com sucesso!');
    } catch (err) {
      showToast(err.message || 'Não foi possível salvar a anotação.', 'error');
    } finally {
      setSaving(false);
    }
  };

    const handleConfirmDelete = async () => {
        if (!deletingNote) return;
        const idParaExcluir = deletingNote.id;
        const notasAnteriores = notes;

        setNotes((current) => current.filter((n) => n.id !== idParaExcluir)); // some da tela na hora do clique
        setDeletingNote(null);
        if (expandedNoteId === idParaExcluir) setExpandedNoteId(null);
        if (editingId === idParaExcluir) setViewMode('LIST');

        try {
        await excluirAnotacaoCompleta(idParaExcluir);
        window.dispatchEvent(new CustomEvent('floating-notes-updated'));
        showToast('Anotação excluída.');
        } catch (err) {
        setNotes(notasAnteriores); // desfaz se a API recusar
        showToast(err.message || 'Não foi possível excluir.', 'error');
        }
    };

  const applyFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    let prefix = '', suffix = '', defaultText = '';
    switch (type) {
      case 'bold': prefix = '**'; suffix = '**'; defaultText = 'texto em negrito'; break;
      case 'italic': prefix = '*'; suffix = '*'; defaultText = 'texto em itálico'; break;
      case 'underline': prefix = '<u>'; suffix = '</u>'; defaultText = 'texto sublinhado'; break;
      case 'h1': prefix = '\n# '; defaultText = 'Título principal'; break;
      case 'h2': prefix = '\n## '; defaultText = 'Subtítulo'; break;
      case 'h3': prefix = '\n### '; defaultText = 'Seção'; break;
      case 'bullet': prefix = '\n- '; defaultText = 'Item da lista'; break;
      case 'number': prefix = '\n1. '; defaultText = 'Item numerado'; break;
      case 'checklist': prefix = '\n- [ ] '; defaultText = 'Nova tarefa'; break;
      default: break;
    }

    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selected ? selected.length : defaultText.length) + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleNavigateCar = (carId) => {
    setIsOpen(false);
    navigate(`/information/${carId}`);
  };

  const filteredNotesList = notes.filter((note) => {
    const term = searchFilter.toLowerCase().trim();
    if (!term) return true;
    return note.title?.toLowerCase().includes(term) || note.content?.toLowerCase().includes(term);
  });

  return {
    fileInputRef, textareaRef, toolbarScrollRef,
    state: {
      isOpen, viewMode, activeTab, searchFilter, expandedNoteId,
      editingId, title, content, attachedCars, attachedImages,
      toast, deletingNote, isVehicleModalOpen, previewImage,
      canScrollLeft, canScrollRight, filteredNotesList,
      loadingNotes, saving
    },
    actions: {
      setIsOpen, setViewMode, setActiveTab, setSearchFilter, setExpandedNoteId,
      setTitle, setContent, setDeletingNote, setIsVehicleModalOpen, setPreviewImage,
      handleStartNewNote, handleEditNote, handleSave, handleConfirmDelete,
      applyFormat, scrollToolbar, handleNavigateCar,
      setAttachedCars, setAttachedImages, showToast
    }
  };
}
