import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoAddOutline,
  IoArrowBackOutline,
  IoCarSportOutline,
  IoCheckboxOutline,
  IoChevronDownOutline,
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
        if (deletingNote) {
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
  }, [isOpen, isVehicleModalOpen, deletingNote]);

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

    showToast(isEdit ? 'Anotação atualizada com sucesso!' : 'Anotação salva com sucesso!');
    setViewMode('LIST');
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

    const carMarkdown = `\n\n> 🚗 **[${car.name}](/information/${car.id})**\n> ${car.brand || 'Ford'} · ${car.year || ''} ${car.type ? `· ${car.type}` : ''}\n\n`;
    setContent((prev) => `${prev.trimEnd()}${carMarkdown}`);
    showToast(`Veículo ${car.name} vinculado.`);
  };

  const handleRemoveCar = (carId) => {
    setAttachedCars((prev) => prev.filter((c) => String(c.id) !== String(carId)));
  };

  // Upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        const imageObj = {
          id: `img-${Date.now()}`,
          name: file.name,
          url: dataUrl,
        };

        setAttachedImages((prev) => [...prev, imageObj]);
        const imageMarkdown = `\n\n![${file.name}](${dataUrl})\n\n`;
        setContent((prev) => `${prev.trimEnd()}${imageMarkdown}`);
        showToast('Imagem adicionada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
                                ? note.content.replace(/[#*`_>\[\]\(\)]/g, '').slice(0, 95)
                                : 'Nenhum texto informado...'}
                            </p>
                          ) : (
                            <div
                              className="note-card-expanded-body"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MarkdownRenderer
                                content={note.content}
                                onNavigateCar={handleNavigateCar}
                              />
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
                    {/* BARRA DE FERRAMENTAS REESTRUTURADA E CONFORTÁVEL */}
                    <div className="notes-toolbar" role="toolbar" aria-label="Ferramentas de formatação">
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
                            <div className="attachment-chips">
                              {attachedImages.map((img) => (
                                <span key={img.id} className="attachment-chip">
                                  <IoImageOutline />
                                  <span>{img.name || 'Foto'}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(img.id)}
                                    title="Remover imagem"
                                  >
                                    <IoCloseOutline />
                                  </button>
                                </span>
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
                    />
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
            if (!isOpen) {
              handleStartNewNote();
            }
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
    </>
  );
}