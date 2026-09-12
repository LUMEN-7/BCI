import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoAddOutline,
  IoArrowBackOutline,
  IoCarSportOutline,
  IoCheckboxOutline,
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoChevronUpOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoImageOutline,
  IoListOutline,
  IoPencilOutline,
  IoReaderOutline,
  IoSaveOutline,
  IoSearchOutline,
  IoTrashOutline,
} from 'react-icons/io5';

import {
  deleteNote,
  getStoredNotes,
  saveNote,
} from '../../utils/notesStorage';
import MarkdownRenderer from './MarkdownRenderer';
import VehicleSelectorModal from './VehicleSelectorModal';
import './style.css';

export default function FloatingNotes() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const toolbarScrollRef = useRef(null);

  // Estados principais
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' | 'EDIT'
  const [activeTab, setActiveTab] = useState('WRITE'); // 'WRITE' | 'PREVIEW'
  const [notes, setNotes] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Estado de expansão de notas na lista
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Estado do formulário de anotação
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedCars, setAttachedCars] = useState([]);
  const [attachedImages, setAttachedImages] = useState([]);

  // Toast / Mensagem de feedback sem alert
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Modal / Popover de confirmação de exclusão customizado
  const [deletingNote, setDeletingNote] = useState(null);

  // Modal de seleção de veículo
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Modal de visualização expandida de imagem
  const [previewImage, setPreviewImage] = useState(null);

  // Toolbar scroll
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Funções para toolbar
  const updateToolbarArrows = () => {
    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;

    const { scrollLeft, scrollWidth, clientWidth } = toolbar;
    const hasLeftScroll = scrollLeft > 2;
    const hasRightScroll = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2;

    setCanScrollLeft(hasLeftScroll);
    setCanScrollRight(hasRightScroll);
  };

  const scrollToolbar = (direction) => {
    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;

    const amount = 200;
    toolbar.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });

    // Atualizar setas durante e após animação do scroll
    setTimeout(updateToolbarArrows, 100);
    setTimeout(updateToolbarArrows, 300);
  };

  // Observa scroll, redimensionamento e visibilidade do toolbar
  useEffect(() => {
    if (!isOpen || viewMode !== 'EDIT' || activeTab !== 'WRITE') return;

    const toolbar = toolbarScrollRef.current;
    if (!toolbar) return;

    const handleScroll = () => updateToolbarArrows();
    const handleResize = () => updateToolbarArrows();

    toolbar.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateToolbarArrows();
      });
      resizeObserver.observe(toolbar);
    }

    // Delays para sincronizar com transições CSS do painel
    const timer1 = setTimeout(updateToolbarArrows, 50);
    const timer2 = setTimeout(updateToolbarArrows, 150);
    const timer3 = setTimeout(updateToolbarArrows, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      toolbar.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isOpen, viewMode, activeTab]);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Carrega e sincroniza as anotações
  useEffect(() => {
    function loadNotes() {
      setNotes(getStoredNotes());
    }

    loadNotes();
    window.addEventListener('floating-notes-updated', loadNotes);
    window.addEventListener('storage', loadNotes);

    return () => {
      window.removeEventListener('floating-notes-updated', loadNotes);
      window.removeEventListener('storage', loadNotes);
    };
  }, []);

  // Fechar no ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (previewImage) {
          setPreviewImage(null);
        } else if (deletingNote) {
          setDeletingNote(null);
        } else if (isVehicleModalOpen) {
          setIsVehicleModalOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isVehicleModalOpen, deletingNote, previewImage]);

  // Abre editor para nova anotação
  const handleStartNewNote = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAttachedCars([]);
    setAttachedImages([]);
    setActiveTab('WRITE');
    setViewMode('EDIT');
  };

  // Abre editor para anotação existente
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

  // Alterna expansão de uma nota na lista
  const handleToggleExpandNote = (id) => {
    setExpandedNoteId((prev) => (prev === id ? null : id));
  };

  // Salva anotação atual (criação ou edição)
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      showToast('Preencha ao menos o título ou conteúdo da nota.', 'error');
      return;
    }

    const isEdit = Boolean(editingId);
    saveNote({
      id: editingId,
      title: title.trim() || 'Sem título',
      content,
      savedCars: attachedCars,
      images: attachedImages,
    });

    setNotes(getStoredNotes());
    setEditingId(null);
    setTitle('');
    setContent('');
    setAttachedCars([]);
    setAttachedImages([]);
    setViewMode('LIST');
    showToast(isEdit ? 'Anotação atualizada com sucesso!' : 'Anotação salva com sucesso!');
  };

  // Solicita confirmação de exclusão (sem alert)
  const handlePromptDelete = (note, e) => {
    e?.stopPropagation();
    setDeletingNote(note);
  };

  // Confirma exclusão da anotação
  const handleConfirmDelete = () => {
    if (!deletingNote) return;

    deleteNote(deletingNote.id);
    showToast('Anotação excluída.');

    if (expandedNoteId === deletingNote.id) {
      setExpandedNoteId(null);
    }
    if (editingId === deletingNote.id) {
      setViewMode('LIST');
    }
    setDeletingNote(null);
  };

  // Aplica formatação de markdown no textarea
  const applyFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    let prefix = '';
    let suffix = '';
    let defaultText = '';

    switch (type) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        defaultText = 'texto em negrito';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        defaultText = 'texto em itálico';
        break;
      case 'underline':
        prefix = '<u>';
        suffix = '</u>';
        defaultText = 'texto sublinhado';
        break;
      case 'h1':
        prefix = '\n# ';
        defaultText = 'Título principal';
        break;
      case 'h2':
        prefix = '\n## ';
        defaultText = 'Subtítulo';
        break;
      case 'h3':
        prefix = '\n### ';
        defaultText = 'Seção';
        break;
      case 'bullet':
        prefix = '\n- ';
        defaultText = 'Item da lista';
        break;
      case 'number':
        prefix = '\n1. ';
        defaultText = 'Item numerado';
        break;
      case 'checklist':
        prefix = '\n- [ ] ';
        defaultText = 'Nova tarefa';
        break;
      default:
        break;
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

  // Insere veículo selecionado na anotação
  const handleSelectCar = (car) => {
    if (!car) return;

    if (!attachedCars.some((c) => String(c.id) === String(car.id))) {
      setAttachedCars((prev) => [...prev, car]);
    }

    const carName = car.name || car.modelo || 'Veículo';
    const carBrand = car.brand || car.marca || 'Ford';
    const carImg = car.image || car.imagemUrl || '';
    const carEngine = car.engine || car.specs?.engine?.value || '';
    const carPower = car.power || car.specs?.power?.value || '';
    const carType = car.type || car.segment || car.categoria || '';

    // Formata card estruturado que é reconhecido pelo MarkdownRenderer
    const carMarkdown = `\n\n:::car[${carName}]{\n  id: "${car.id}",\n  brand: "${carBrand}",\n  image: "${carImg}",\n  engine: "${carEngine}",\n  power: "${carPower}",\n  type: "${carType}"\n}\n\n`;
    setContent((prev) => `${prev.trimEnd()}${carMarkdown}`);
    showToast(`Veículo ${carName} adicionado à anotação.`);
  };

  const handleRemoveCar = (carId) => {
    setAttachedCars((prev) => prev.filter((c) => String(c.id) !== String(carId)));
  };

  // Redimensionamento e compressão de imagem para persistência segura
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Upload de imagem
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const input = e.target;

    try {
      const safeName = (file.name || 'Foto').replace(/[\[\]\(\)]/g, '');
      const dataUrl = await compressImage(file);

      const imageObj = {
        id: `img-${Date.now()}`,
        name: safeName,
        url: dataUrl,
      };

      setAttachedImages((prev) => [...prev, imageObj]);
      showToast('Imagem adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao carregar imagem:', err);
      showToast('Erro ao carregar a imagem.', 'error');
    } finally {
      input.value = '';
    }
  };

  const handleRemoveImage = (imgId) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleToggleChecklist = (lineIndex, checked) => {
    const lines = content.split('\n');
    if (lines[lineIndex]) {
      const line = lines[lineIndex];
      const nextBox = checked ? '- [x] ' : '- [ ] ';
      lines[lineIndex] = line.replace(/^-\s*\[([ xX])\]\s*/, nextBox);
      const updated = lines.join('\n');
      setContent(updated);

      if (editingId) {
        saveNote({
          id: editingId,
          title: title.trim() || 'Sem título',
          content: updated,
          savedCars: attachedCars,
          images: attachedImages,
        });
      }
    }
  };

  const handleToggleNoteChecklist = (noteId, lineIndex, checked) => {
    const targetNote = notes.find((n) => String(n.id) === String(noteId));
    if (!targetNote) return;
    const lines = (targetNote.content || '').split('\n');
    if (lines[lineIndex]) {
      const line = lines[lineIndex];
      const nextBox = checked ? '- [x] ' : '- [ ] ';
      lines[lineIndex] = line.replace(/^-\s*\[([ xX])\]\s*/, nextBox);
      const updatedContent = lines.join('\n');
      saveNote({
        id: targetNote.id,
        title: targetNote.title,
        content: updatedContent,
        savedCars: targetNote.savedCars,
        images: targetNote.images,
      });
      setNotes(getStoredNotes());
    }
  };

  const handleNavigateCar = (carId) => {
    setIsOpen(false);
    navigate(`/information/${carId}`);
  };

  const filteredNotesList = notes.filter((note) => {
    const term = searchFilter.toLowerCase().trim();
    if (!term) return true;
    return (
      note.title?.toLowerCase().includes(term) ||
      note.content?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className={`floating-notes ${isOpen ? 'is-open' : ''}`}>
        {/* TOAST FEEDBACK NOTIFICATION */}
        {toast && (
          <div className={`floating-notes-toast ${toast.type}`} role="status">
            <span>{toast.message}</span>
          </div>
        )}

        {/* =====================================================
            DRAWER / PAINEL LATERAL
        ===================================================== */}
        <aside className="notes-panel" role="region" aria-label="Painel de Anotações BCI">
          {viewMode === 'LIST' ? (
            /* ===================================================
               MODO LISTA DE ANOTAÇÕES
            =================================================== */
            <div className="notes-list-view">
              <header className="notes-panel-header">
                <div className="notes-panel-title">
                  <div className="notes-icon">
                    <IoDocumentTextOutline />
                  </div>
                  <div>
                    <span>BCI NOTAS</span>
                    <h2>Anotações</h2>
                  </div>
                </div>

                <div className="notes-header-actions">
                  <button
                    type="button"
                    className="notes-new-btn"
                    onClick={handleStartNewNote}
                    title="Nova anotação"
                  >
                    <IoAddOutline />
                    <span>Nova</span>
                  </button>
                  <button
                    type="button"
                    className="notes-close-button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Fechar anotações"
                  >
                    <IoCloseOutline />
                  </button>
                </div>
              </header>

              <div className="notes-list-search">
                <IoSearchOutline />
                <input
                  type="text"
                  placeholder="Buscar nas anotações..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              <div className="notes-list-content">
                {filteredNotesList.length > 0 ? (
                  <div className="notes-cards-grid">
                    {filteredNotesList.map((note) => {
                      const isExpanded = expandedNoteId === note.id;

                      return (
                        <article
                          key={note.id}
                          className={`note-card-item ${isExpanded ? 'is-expanded' : ''}`}
                          onClick={() => handleToggleExpandNote(note.id)}
                        >
                          <div className="note-card-header">
                            <div className="note-card-title-wrap">
                              <h4>{note.title || 'Sem título'}</h4>
                              <span className="note-card-expand-indicator">
                                {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                              </span>
                            </div>

                            <div className="note-card-actions-quick" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="note-card-edit-btn"
                                onClick={(e) => handleEditNote(note, e)}
                                title="Editar anotação"
                              >
                                <IoPencilOutline />
                              </button>
                              <button
                                type="button"
                                className="note-card-delete"
                                onClick={(e) => handlePromptDelete(note, e)}
                                title="Excluir anotação"
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </div>

                          {!isExpanded ? (
                            <p className="note-card-snippet">
                              {note.content
                                ? note.content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/[#*`_>()[\]]/g, '').slice(0, 95)
                                : 'Nenhum texto informado...'}
                            </p>
                          ) : (
                            <div
                              className="note-card-expanded-body"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MarkdownRenderer
                                content={note.content}
                                onToggleChecklist={(lineIndex, checked) =>
                                  handleToggleNoteChecklist(note.id, lineIndex, checked)
                                }
                                onNavigateCar={handleNavigateCar}
                                onImageClick={(img) => setPreviewImage(img)}
                              />

                              {note.images?.length > 0 && (
                                <div className="note-card-images-grid">
                                  {note.images.map((img) => (
                                    <div
                                      key={img.id}
                                      className="note-card-image-item"
                                      onClick={() => setPreviewImage(img)}
                                      title="Clique para expandir"
                                    >
                                      <img src={img.url} alt={img.name || 'Imagem'} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="note-card-footer">
                            <span className="note-card-date">
                              {new Date(note.updatedAt || note.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>

                            <div className="note-card-badges">
                              {note.savedCars?.length > 0 && (
                                <span className="note-mini-badge" title="Veículos vinculados">
                                  <IoCarSportOutline />
                                  {note.savedCars.length}
                                </span>
                              )}
                              {note.images?.length > 0 && (
                                <span className="note-mini-badge" title="Imagens anexadas">
                                  <IoImageOutline />
                                  {note.images.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="notes-empty-state">
                    <IoReaderOutline />
                    <h3>Nenhuma anotação encontrada</h3>
                    <p>Comece criando sua primeira anotação clicando no botão abaixo.</p>
                    <button
                      type="button"
                      className="notes-empty-create-btn"
                      onClick={handleStartNewNote}
                    >
                      <IoAddOutline />
                      <span>Criar anotação</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ===================================================
               MODO EDIÇÃO / CRIAÇÃO
            =================================================== */
            <div className="notes-editor-view">
              <header className="notes-panel-header">
                <div className="notes-panel-title">
                  <button
                    type="button"
                    className="notes-back-btn"
                    onClick={() => setViewMode('LIST')}
                    title="Voltar para a lista"
                  >
                    <IoArrowBackOutline />
                  </button>
                  <div>
                    <span>{editingId ? 'EDITANDO NOTA' : 'NOVA NOTA'}</span>
                    <h2>{title || 'Sem título'}</h2>
                  </div>
                </div>

                <div className="notes-header-actions">
                  <div className="notes-tab-switcher">
                    <button
                      type="button"
                      className={`tab-btn ${activeTab === 'WRITE' ? 'is-active' : ''}`}
                      onClick={() => setActiveTab('WRITE')}
                    >
                      <IoPencilOutline />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeTab === 'PREVIEW' ? 'is-active' : ''}`}
                      onClick={() => setActiveTab('PREVIEW')}
                    >
                      <IoEyeOutline />
                      <span>Ver</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="notes-close-button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Fechar anotações"
                  >
                    <IoCloseOutline />
                  </button>
                </div>
              </header>

              <div className="notes-editor-body">
                <div className="notes-title-input-wrapper">
                  <input
                    type="text"
                    placeholder="Título da anotação..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {activeTab === 'WRITE' ? (
                  <>
                    {/* BARRA DE FERRAMENTAS COM SCROLL */}
                    <div className="notes-toolbar-wrapper">
                      <button
                        type="button"
                        className={`toolbar-arrow-btn left ${!canScrollLeft ? 'is-disabled' : ''}`}
                        onClick={() => scrollToolbar('left')}
                        disabled={!canScrollLeft}
                        aria-label="Mover barra de ferramentas para esquerda"
                        title="Mover para esquerda"
                      >
                        <IoChevronBackOutline />
                      </button>

                      <div className="notes-toolbar-viewport">
                        <div 
                          className="notes-toolbar" 
                          ref={toolbarScrollRef} 
                          role="toolbar"
                        >
                          <div className="toolbar-group" title="Formatação de texto">
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('bold')}
                              title="Negrito (**texto**)"
                            >
                              <strong>B</strong>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('italic')}
                              title="Itálico (*texto*)"
                            >
                              <em>I</em>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('underline')}
                              title="Sublinhado (<u>texto</u>)"
                            >
                              <u>U</u>
                            </button>
                          </div>

                          <div className="toolbar-divider" />

                          <div className="toolbar-group" title="Títulos">
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('h1')}
                              title="Título 1 (# )"
                            >
                              H1
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('h2')}
                              title="Título 2 (## )"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('h3')}
                              title="Título 3 (### )"
                            >
                              H3
                            </button>
                          </div>

                          <div className="toolbar-divider" />

                          <div className="toolbar-group" title="Listas e Tarefas">
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('bullet')}
                              title="Lista com marcadores (- )"
                            >
                              <IoListOutline />
                              <span className="toolbar-btn-text">Lista</span>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('number')}
                              title="Lista numerada (1. )"
                            >
                              <span style={{ fontWeight: 'bold' }}>1.</span>
                              <span className="toolbar-btn-text">Numérica</span>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => applyFormat('checklist')}
                              title="Checklist / Tarefa (- [ ] )"
                            >
                              <IoCheckboxOutline />
                              <span className="toolbar-btn-text">Checklist</span>
                            </button>
                          </div>

                          <div className="toolbar-divider" />

                          <div className="toolbar-group" title="Inserir conteúdo">
                            <button
                              type="button"
                              className="toolbar-btn toolbar-btn-highlight"
                              onClick={() => setIsVehicleModalOpen(true)}
                              title="Inserir veículo salvo"
                            >
                              <IoCarSportOutline />
                              <span>Veículo</span>
                            </button>

                            <button
                              type="button"
                              className="toolbar-btn toolbar-btn-highlight"
                              onClick={() => fileInputRef.current?.click()}
                              title="Adicionar imagem"
                            >
                              <IoImageOutline />
                              <span>Imagem</span>
                            </button>

                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: 'none' }}
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`toolbar-arrow-btn right ${!canScrollRight ? 'is-disabled' : ''}`}
                        onClick={() => scrollToolbar('right')}
                        disabled={!canScrollRight}
                        aria-label="Mover barra de ferramentas para direita"
                        title="Mover para direita"
                      >
                        <IoChevronForwardOutline />
                      </button>
                    </div>

                    {/* ÁREA DE TEXTO */}
                    <div className="notes-textarea-container">
                      <textarea
                        ref={textareaRef}
                        placeholder="Escreva sua anotação aqui em Markdown..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>

                    {/* VEÍCULOS E IMAGENS ANEXADOS */}
                    {(attachedCars.length > 0 || attachedImages.length > 0) && (
                      <div className="notes-attachments-preview">
                        {attachedCars.length > 0 && (
                          <div className="attachment-row">
                            <span className="attachment-label">Veículos vinculados:</span>
                            <div className="attachment-chips">
                              {attachedCars.map((car) => (
                                <span key={car.id} className="attachment-chip">
                                  <IoCarSportOutline />
                                  <span>{car.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCar(car.id)}
                                    title="Remover anexo"
                                  >
                                    <IoCloseOutline />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {attachedImages.length > 0 && (
                          <div className="attachment-row">
                            <span className="attachment-label">Imagens anexadas:</span>
                            <div className="attachment-thumbs-list">
                              {attachedImages.map((img) => (
                                <div
                                  key={img.id}
                                  className="attachment-thumb-card"
                                  onClick={() => setPreviewImage(img)}
                                  title="Clique para expandir"
                                >
                                  <img src={img.url} alt={img.name || 'Foto'} />
                                  <button
                                    type="button"
                                    className="attachment-thumb-remove"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImage(img.id);
                                    }}
                                    title="Remover imagem"
                                  >
                                    <IoCloseOutline />
                                  </button>
                                  <span className="attachment-thumb-name">{img.name || 'Foto'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* MODO VISUALIZAÇÃO / PREVIEW INTERATIVO */
                  <div className="notes-preview-scroll">
                    <MarkdownRenderer
                      content={content}
                      onToggleChecklist={handleToggleChecklist}
                      onNavigateCar={handleNavigateCar}
                      onImageClick={(img) => setPreviewImage(img)}
                    />

                    {attachedImages.length > 0 && (
                      <div className="note-card-images-grid">
                        {attachedImages.map((img) => (
                          <div
                            key={img.id}
                            className="note-card-image-item"
                            onClick={() => setPreviewImage(img)}
                            title="Clique para expandir"
                          >
                            <img src={img.url} alt={img.name || 'Imagem'} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <footer className="notes-footer">
                <button
                  type="button"
                  className="notes-cancel-button"
                  onClick={() => setViewMode('LIST')}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  className="notes-save-button"
                  onClick={handleSave}
                  disabled={!title.trim() && !content.trim()}
                >
                  <IoSaveOutline />
                  <span>Salvar Anotação</span>
                </button>
              </footer>
            </div>
          )}
        </aside>

        {/* =====================================================
            BOTÃO FLUTUANTE (DESKTOP CIRCULAR / MOBILE PILL)
        ===================================================== */}
        <button
          type="button"
          className="floating-notes-button"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          aria-label={isOpen ? 'Fechar anotações' : 'Abrir anotações'}
          aria-expanded={isOpen}
        >
          <IoDocumentTextOutline className="notes-btn-icon" />
          <span className="notes-btn-label">Anotações</span>
        </button>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO (SEM ALERT) */}
      {deletingNote && (
        <div className="notes-delete-modal-backdrop" onClick={() => setDeletingNote(null)}>
          <div
            className="notes-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="delete-dialog-title"
          >
            <div className="delete-modal-icon">
              <IoTrashOutline />
            </div>
            <h3 id="delete-dialog-title">Excluir anotação?</h3>
            <p>
              Você está prestes a remover <strong>"{deletingNote.title || 'Sem título'}"</strong>. Essa ação não poderá ser desfeita.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setDeletingNote(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleConfirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SELEÇÃO DE VEÍCULO */}
      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSelectCar={handleSelectCar}
      />

      {/* LIGHTBOX / MODAL DE VISUALIZAÇÃO EXPANDIDA DE IMAGEM */}
      {previewImage && (
        <div
          className="notes-image-lightbox-backdrop"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-label="Visualização de imagem"
        >
          <div
            className="notes-image-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="notes-image-lightbox-close"
              onClick={() => setPreviewImage(null)}
              aria-label="Fechar visualização"
            >
              <IoCloseOutline />
            </button>
            <img src={previewImage.url} alt={previewImage.name || 'Visualização da imagem'} />
            {previewImage.name && previewImage.name !== 'Foto' && (
              <span className="notes-image-lightbox-caption">{previewImage.name}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}