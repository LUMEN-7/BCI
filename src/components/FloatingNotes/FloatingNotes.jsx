// src/components/FloatingNotes/FloatingNotes.jsx
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
  IoTrashOutline
} from 'react-icons/io5';

import { useFloatingController } from './hooks/useFloatingController';
import { resizeImage } from '@/utils/imageUtils';
import { uploadImagemAnotacao } from '@/services/noteService';

import MarkdownRenderer from './components/MarkdownRenderer';
import VehicleSelectorModal from './components/VehicleSelectorModal';
import VehicleCard from './components/VehicleCard';
import './style.css';

export default function FloatingNotes() {
  const { refs, state, actions } = useFloatingController();

  async function dataUrlParaBlob(dataUrl) {
      const resposta = await fetch(dataUrl);
      return resposta.blob();
  }

  const handleImageUpload = async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      for (const file of files) {
        try {
          const dataUrlRedimensionada = await resizeImage(file);
          const blob = await dataUrlParaBlob(dataUrlRedimensionada);

          const { url } = await uploadImagemAnotacao(blob, file.name);

          const newImg = { id: Date.now() + Math.random(), url, name: file.name };
          if (actions.setAttachedImages) {
            actions.setAttachedImages((prev) => [...prev, newImg]);
          }
        } catch (err) {
          console.error('Erro ao processar imagem', err);
          actions.showToast?.('Não foi possível enviar a imagem.', 'error');
        }
      }
      e.target.value = '';
  };
  const handleRemoveCar = (carId) => {
    if (actions.handleRemoveCar) {
      actions.handleRemoveCar(carId);
    } else if (actions.setAttachedCars) {
      actions.setAttachedCars((prev) => prev.filter((c) => c.id !== carId));
    }
  };

  const handleRemoveImage = (imgId) => {
    if (actions.handleRemoveImage) {
      actions.handleRemoveImage(imgId);
    } else if (actions.setAttachedImages) {
      actions.setAttachedImages((prev) => prev.filter((i) => (i.id || i) !== imgId));
    }
  };

  return (
    <>
      <div className={`floating-notes ${state.isOpen ? 'is-open' : ''}`}>
        {/* Toast Notification */}
        {state.toast && (
          <div className={`floating-notes-toast ${state.toast.type}`} role="status">
            <span>{state.toast.message}</span>
          </div>
        )}

        <aside className="notes-panel" role="region" aria-label="Painel de Anotações">
          {state.viewMode === 'LIST' ? (
            /* --- MODO LISTA DE ANOTAÇÕES --- */
            <div className="notes-list-view">
              <header className="notes-panel-header">
                <div className="notes-panel-title">
                  <div className="notes-icon"><IoDocumentTextOutline /></div>
                  <div>
                    <span>BCI NOTAS</span>
                    <h2>Anotações</h2>
                  </div>
                </div>

                <div className="notes-header-actions">
                  <button type="button" className="notes-new-btn" onClick={actions.handleStartNewNote}>
                    <IoAddOutline /> <span>Nova</span>
                  </button>
                  <button type="button" className="notes-close-button" onClick={() => actions.setIsOpen(false)}>
                    <IoCloseOutline />
                  </button>
                </div>
              </header>

              <div className="notes-list-search">
                <IoSearchOutline />
                <input
                  type="text"
                  placeholder="Buscar nas anotações..."
                  value={state.searchFilter}
                  onChange={(e) => actions.setSearchFilter(e.target.value)}
                />
              </div>

              <div className="notes-list-content">
                {state.filteredNotesList && state.filteredNotesList.length > 0 ? (
                  <div className="notes-cards-grid">
                    {state.filteredNotesList.map((note) => {
                      const isExpanded = state.expandedNoteId === note.id;
                      return (
                        <article
                          key={note.id}
                          className={`note-card-item ${isExpanded ? 'is-expanded' : ''}`}
                          onClick={() => actions.setExpandedNoteId(isExpanded ? null : note.id)}
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
                                onClick={(e) => actions.handleEditNote(note, e)}
                                title="Editar Nota"
                              >
                                <IoPencilOutline />
                              </button>
                              <button
                                type="button"
                                className="note-card-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actions.setDeletingNote(note);
                                }}
                                title="Excluir Nota"
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </div>
                          {!isExpanded ? (
                            <p className="note-card-snippet">
                              {note.content ? note.content.replace(/[#*`_>()[\]]/g, '').slice(0, 95) : 'Nenhum texto informado...'}
                            </p>
                          ) :  (
                                <div className="note-card-expanded-body" onClick={(e) => e.stopPropagation()}>
                                  <MarkdownRenderer
                                    content={note.content}
                                    onNavigateCar={actions.handleNavigateCar}
                                    onImageClick={(img) => actions.setPreviewImage(img)}
                                  />

                                  {note.savedCars?.length > 0 && (
                                    <div className="note-card-cars-grid">
                                      {note.savedCars.map((car) => (
                                        <VehicleCard
                                          key={car.id}
                                          car={car}
                                          onNavigate={actions.handleNavigateCar}
                                        />
                                      ))}
                                    </div>
                                  )}

                                  {note.images?.length > 0 && (
                                    <div className="note-card-images-grid">
                                      {note.images.map((img) => {
                                        const imgUrl = typeof img === 'string' ? img : img.url;
                                        const imgId = typeof img === 'string' ? img : img.id;
                                        const imgName = typeof img === 'string' ? 'Imagem' : (img.name || 'Imagem');
                                        return (
                                          <div
                                            key={imgId}
                                            className="note-card-image-item"
                                            onClick={() => actions.setPreviewImage(img)}
                                            title="Clique para expandir"
                                          >
                                            <img src={imgUrl} alt={imgName} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="notes-empty-state">
                    <IoReaderOutline />
                    <h3>Nenhuma anotação encontrada</h3>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- MODO EDIÇÃO / CRIAÇÃO DE NOTA --- */
            <div className="notes-editor-view">
              <header className="notes-panel-header">
                <div className="notes-panel-title">
                  <button
                    type="button"
                    className="notes-back-btn"
                    onClick={() => actions.setViewMode('LIST')}
                    title="Voltar para a lista"
                  >
                    <IoArrowBackOutline />
                  </button>
                  <div>
                    <span>{state.editingId ? 'EDITANDO NOTA' : 'NOVA NOTA'}</span>
                    <h2>{state.title || 'Sem título'}</h2>
                  </div>
                </div>

                <div className="notes-header-actions">
                  <div className="notes-tab-switcher">
                    <button
                      type="button"
                      className={`tab-btn ${state.activeTab === 'WRITE' ? 'is-active' : ''}`}
                      onClick={() => actions.setActiveTab('WRITE')}
                    >
                      <IoPencilOutline />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${state.activeTab === 'PREVIEW' ? 'is-active' : ''}`}
                      onClick={() => actions.setActiveTab('PREVIEW')}
                    >
                      <IoEyeOutline />
                      <span>Ver</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="notes-close-button"
                    onClick={() => actions.setIsOpen(false)}
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
                    value={state.title}
                    onChange={(e) => actions.setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {state.activeTab === 'WRITE' ? (
                  <>
                    {/* BARRA DE FERRAMENTAS COM SCROLL */}
                    <div className="notes-toolbar-wrapper">
                      <button
                        type="button"
                        className={`toolbar-arrow-btn left ${!state.canScrollLeft ? 'is-disabled' : ''}`}
                        onClick={() => actions.scrollToolbar('left')}
                        disabled={!state.canScrollLeft}
                        aria-label="Mover barra de ferramentas para esquerda"
                        title="Mover para esquerda"
                      >
                        <IoChevronBackOutline />
                      </button>

                      <div className="notes-toolbar-viewport">
                        <div 
                          className="notes-toolbar" 
                          ref={refs.toolbarScrollRef} 
                          role="toolbar"
                        >
                          <div className="toolbar-group" title="Formatação de texto">
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('bold')}
                              title="Negrito (**texto**)"
                            >
                              <strong>B</strong>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('italic')}
                              title="Itálico (*texto*)"
                            >
                              <em>I</em>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('underline')}
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
                              onClick={() => actions.applyFormat('h1')}
                              title="Título 1 (# )"
                            >
                              H1
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('h2')}
                              title="Título 2 (## )"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('h3')}
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
                              onClick={() => actions.applyFormat('bullet')}
                              title="Lista com marcadores (- )"
                            >
                              <IoListOutline />
                              <span className="toolbar-btn-text">Lista</span>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('number')}
                              title="Lista numerada (1. )"
                            >
                              <span style={{ fontWeight: 'bold' }}>1.</span>
                              <span className="toolbar-btn-text">Numérica</span>
                            </button>
                            <button
                              type="button"
                              className="toolbar-btn"
                              onClick={() => actions.applyFormat('checklist')}
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
                              onClick={() => actions.setIsVehicleModalOpen(true)}
                              title="Inserir veículo salvo"
                            >
                              <IoCarSportOutline />
                              <span>Veículo</span>
                            </button>

                            <button
                              type="button"
                              className="toolbar-btn toolbar-btn-highlight"
                              onClick={() => refs.fileInputRef.current?.click()}
                              title="Adicionar imagem"
                            >
                              <IoImageOutline />
                              <span>Imagem</span>
                            </button>

                            <input
                              type="file"
                              ref={refs.fileInputRef}
                              style={{ display: 'none' }}
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`toolbar-arrow-btn right ${!state.canScrollRight ? 'is-disabled' : ''}`}
                        onClick={() => actions.scrollToolbar('right')}
                        disabled={!state.canScrollRight}
                        aria-label="Mover barra de ferramentas para direita"
                        title="Mover para direita"
                      >
                        <IoChevronForwardOutline />
                      </button>
                    </div>

                    {/* ÁREA DE TEXTO */}
                    <div className="notes-textarea-container">
                      <textarea
                        ref={refs.textareaRef}
                        placeholder="Escreva sua anotação aqui em Markdown..."
                        value={state.content}
                        onChange={(e) => actions.setContent(e.target.value)}
                      />
                    </div>

                    {/* VEÍCULOS E IMAGENS ANEXADOS */}
                    {((state.attachedCars?.length > 0) || (state.attachedImages?.length > 0)) && (
                      <div className="notes-attachments-preview">
                        {state.attachedCars?.length > 0 && (
                          <div className="attachment-row">
                            <span className="attachment-label">Veículos vinculados:</span>
                            <div className="attached-vehicles-list">
                              {state.attachedCars.map((car) => (
                                <VehicleCard
                                  key={car.id}
                                  car={car}
                                  onNavigate={actions.handleNavigateCar}
                                  onRemove={handleRemoveCar}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {state.attachedImages?.length > 0 && (
                          <div className="attachment-row">
                            <span className="attachment-label">Imagens anexadas:</span>
                            <div className="attachment-thumbs-list">
                              {state.attachedImages.map((img) => {
                                const imgUrl = typeof img === 'string' ? img : img.url;
                                const imgId = typeof img === 'string' ? img : img.id;
                                const imgName = typeof img === 'string' ? 'Foto' : (img.name || 'Foto');
                                return (
                                  <div
                                    key={imgId}
                                    className="attachment-thumb-card"
                                    onClick={() => actions.setPreviewImage(img)}
                                    title="Clique para expandir"
                                  >
                                    <img src={imgUrl} alt={imgName} />
                                    <button
                                      type="button"
                                      className="attachment-thumb-remove"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(imgId);
                                      }}
                                      title="Remover imagem"
                                    >
                                      <IoCloseOutline />
                                    </button>
                                    <span className="attachment-thumb-name">{imgName}</span>
                                  </div>
                                );
                              })}
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
                      content={state.content}
                      onToggleChecklist={actions.handleToggleChecklist}
                      onNavigateCar={actions.handleNavigateCar}
                      onImageClick={(img) => actions.setPreviewImage(img)}
                    />

                    {state.attachedCars?.length > 0 && (
                      <div className="note-card-cars-grid">
                        {state.attachedCars.map((car) => (
                          <VehicleCard
                            key={car.id}
                            car={car}
                            onNavigate={actions.handleNavigateCar}
                          />
                        ))}
                      </div>
                    )}

                    {state.attachedImages?.length > 0 && (
                      <div className="note-card-images-grid">
                        {state.attachedImages.map((img) => {
                          const imgUrl = typeof img === 'string' ? img : img.url;
                          const imgId = typeof img === 'string' ? img : img.id;
                          const imgName = typeof img === 'string' ? 'Imagem' : (img.name || 'Imagem');
                          return (
                            <div
                              key={imgId}
                              className="note-card-image-item"
                              onClick={() => actions.setPreviewImage(img)}
                              title="Clique para expandir"
                            >
                              <img src={imgUrl} alt={imgName} />
                            </div>
                          );
                        })}
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
                  onClick={() => actions.setViewMode('LIST')}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  className="notes-save-button"
                  onClick={actions.handleSave}
                  disabled={!state.title?.trim() && !state.content?.trim()}
                >
                  <IoSaveOutline />
                  <span>Salvar Anotação</span>
                </button>
              </footer>
            </div>
          )}
        </aside>

        {/* Botão Flutuante */}
        <button
          type="button"
          className="floating-notes-button"
          onClick={() => actions.setIsOpen((prev) => !prev)}
        >
          <IoDocumentTextOutline className="notes-btn-icon" />
          <span className="notes-btn-label">Anotações</span>
        </button>
      </div>

      {/* Modal de Seleção de Veículo */}
      <VehicleSelectorModal
        isOpen={state.isVehicleModalOpen}
        onClose={() => actions.setIsVehicleModalOpen(false)}
        onSelectCar={(car) => {
          if (actions.setAttachedCars) {
            actions.setAttachedCars((prev) => [...prev, car]);
          }
          // const carTag = `\n:car[${car.name || car.model}]{id="${car.id}"}\n`;
          // actions.setContent((prev) => prev + carTag);
        }}
      />

      {/* Modal de Exclusão */}
      {state.deletingNote && (
        <div className="notes-delete-modal-backdrop" onClick={() => actions.setDeletingNote(null)}>
          <div className="notes-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <IoTrashOutline />
            </div>
            <h3>Excluir Anotação</h3>
            <p>Tem certeza de que deseja excluir "<strong>{state.deletingNote.title || 'Sem título'}</strong>"? Esta ação não pode ser desfeita.</p>
            <div className="delete-modal-actions">
              <button type="button" className="delete-modal-cancel" onClick={() => actions.setDeletingNote(null)}>
                Cancelar
              </button>
              <button type="button" className="delete-modal-confirm" onClick={actions.handleConfirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preview de Imagem */}
      {state.previewImage && (
        <div className="notes-modal-overlay" onClick={() => actions.setPreviewImage(null)}>
          <div className="notes-image-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="notes-image-preview-close"
              onClick={() => actions.setPreviewImage(null)}
            >
              <IoCloseOutline />
            </button>
            <img src={state.previewImage} alt="Visualização expandida" />
          </div>
        </div>
      )}
    </>
  );
}