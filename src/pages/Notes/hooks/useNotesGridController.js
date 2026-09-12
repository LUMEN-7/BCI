import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useNotesGridController({ onDelete }) {
  const navigate = useNavigate();

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditingInModal, setIsEditingInModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deletingNote, setDeletingNote] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenModal = (note) => {
    setSelectedNote(note);
    setIsEditingInModal(false);
    setEditTitle(note.title || "");
    setEditContent(note.rawNote?.content || note.description || "");
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setIsEditingInModal(false);
  };

  const handleStartEdit = () => {
    setIsEditingInModal(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() && !editContent.trim()) {
      showToast("Preencha ao menos o título ou conteúdo.");
      return;
    }

  };

  const handlePromptDelete = (note, e) => {
    e?.stopPropagation();
    setDeletingNote(note);
  };

  const handleConfirmDelete = () => {
    if (deletingNote) {
      onDelete(deletingNote.id);
      if (selectedNote?.id === deletingNote.id) {
        setSelectedNote(null);
      }
      setDeletingNote(null);
      showToast("Anotação excluída.");
    }
  };

  const handleNavigateCar = (carId) => {
    navigate(`/information/${carId}`);
  };

  return {
    // Estados do Modal / Edição
    selectedNote,
    isEditingInModal,
    setIsEditingInModal,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    
    // Estados de Exclusão e Mídia
    deletingNote,
    setDeletingNote,
    previewImage,
    setPreviewImage,
    toastMessage,

    // Handlers
    handleOpenModal,
    handleCloseModal,
    handleStartEdit,
    handleSaveEdit,
    handlePromptDelete,
    handleConfirmDelete,
    handleNavigateCar,
  };
}