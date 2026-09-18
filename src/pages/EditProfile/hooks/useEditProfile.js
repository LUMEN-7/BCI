import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { atualizarPerfil, uploadFotoPerfil, removerFotoPerfil, iniciarDoisFatores, confirmarDoisFatores, desativarDoisFatores } from "@/services/userService";

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")) || null; } catch { return null; }
}

export default function useEditProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const initialName = currentUser?.nomeExibicao || currentUser?.userName || "";

  const [formData, setFormData] = useState({
    name: initialName,
    email: currentUser?.email || "",
    photo: currentUser?.fotoPerfilUrl || null,
  });

  const hasChanges = formData.name.trim() !== initialName.trim() && formData.name.trim().length > 0;

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [doisFatoresAtivo, setDoisFatoresAtivo] = useState(currentUser?.doisFatoresAtivo || false);
  const [qrCodeUri, setQrCodeUri] = useState(null);
  const [chaveManual, setChaveManual] = useState(null);
  const [codigo2fa, setCodigo2fa] = useState("");
  const [erro2fa, setErro2fa] = useState("");
  const [carregando2fa, setCarregando2fa] = useState(false);

  function atualizarCurrentUserLocal(mudancas) {
    localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...mudancas }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setSuccessMessage("");
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return setErrors((p) => ({ ...p, photo: "Selecione uma imagem JPG, PNG ou WEBP." }));
    if (file.size > 2 * 1024 * 1024) return setErrors((p) => ({ ...p, photo: "A imagem deve ter no máximo 2 MB." }));

    setUploadingPhoto(true);
    setErrors((p) => ({ ...p, photo: "" }));
    try {
      const resultado = await uploadFotoPerfil(file);
      setFormData((p) => ({ ...p, photo: resultado.fotoPerfilUrl }));
      atualizarCurrentUserLocal({ fotoPerfilUrl: resultado.fotoPerfilUrl });
      setSuccessMessage("Foto atualizada com sucesso.");
    } catch (err) {
      setErrors((p) => ({ ...p, photo: err.message || "Não foi possível enviar a imagem." }));
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  }

  async function handleRemovePhoto() {
    setUploadingPhoto(true);
    try {
      await removerFotoPerfil();
      setFormData((p) => ({ ...p, photo: null }));
      atualizarCurrentUserLocal({ fotoPerfilUrl: null });
    } catch (err) {
      setErrors((p) => ({ ...p, photo: err.message || "Não foi possível remover a imagem." }));
    } finally {
      setUploadingPhoto(false);
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Informe seu nome.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage("");
    try {
      await atualizarPerfil(formData.name.trim());
      atualizarCurrentUserLocal({ nomeExibicao: formData.name.trim() });
      setSuccessMessage("Perfil atualizado com sucesso.");
    } catch (err) {
      setErrors((p) => ({ ...p, name: err.message || "Não foi possível salvar." }));
    } finally {
      setSaving(false);
    }
  }

  async function handleIniciarDoisFatores() {
    setErro2fa('');
    setCarregando2fa(true);
    try {
      const resultado = await iniciarDoisFatores();
      setQrCodeUri(resultado.qrCodeUri);
      setChaveManual(resultado.chaveManual);
    } catch (err) {
      setErro2fa(err.message || 'Não foi possível iniciar a configuração.');
    } finally {
      setCarregando2fa(false);
    }
  }

  async function handleConfirmarDoisFatores(event) {
    event.preventDefault();
    setErro2fa('');
    setCarregando2fa(true);
    try {
      await confirmarDoisFatores(codigo2fa);
      setDoisFatoresAtivo(true);
      setQrCodeUri(null);
      setChaveManual(null);
      setCodigo2fa('');
      atualizarCurrentUserLocal({ doisFatoresAtivo: true });
      setSuccessMessage('Autenticação em duas etapas ativada.');
    } catch (err) {
      setErro2fa(err.message || 'Código inválido.');
    } finally {
      setCarregando2fa(false);
    }
  }

  async function handleDesativarDoisFatores() {
    setErro2fa('');
    setCarregando2fa(true);
    try {
      await desativarDoisFatores();
      setDoisFatoresAtivo(false);
      atualizarCurrentUserLocal({ doisFatoresAtivo: false });
      setSuccessMessage('Autenticação em duas etapas desativada.');
    } catch (err) {
      setErro2fa(err.message || 'Não foi possível desativar.');
    } finally {
      setCarregando2fa(false);
    }
  }

  function handleCancelarDoisFatores() {
    setQrCodeUri(null);
    setChaveManual(null);
    setCodigo2fa('');
    setErro2fa('');
  }

  return {
    formData, errors, successMessage, saving, uploadingPhoto, hasChanges,
    handleChange, handlePhotoChange, handleRemovePhoto, handleSubmit,
    handleCancel: () => navigate("/profile"),
    handleBack: () => navigate("/profile"),
    doisFatores: {
      ativo: doisFatoresAtivo, qrCodeUri, chaveManual, codigo: codigo2fa, erro: erro2fa, carregando: carregando2fa,
      setCodigo: setCodigo2fa,
      iniciar: handleIniciarDoisFatores,
      confirmar: handleConfirmarDoisFatores,
      desativar: handleDesativarDoisFatores,
      cancelar: handleCancelarDoisFatores,
    },
  };
}