import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { atualizarPerfil, uploadFotoPerfil, removerFotoPerfil, iniciarDoisFatores, confirmarDoisFatores, desativarDoisFatores } from "@/services/userService";

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")) || null; } catch { return null; }
}

export default function useEditProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

<<<<<<< HEAD
  const initialData = {
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    photo: currentUser?.photo || null,
  };

  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
=======
  const [formData, setFormData] = useState({
    name: currentUser?.nomeExibicao || currentUser?.userName || "",
    email: currentUser?.email || "",
    photo: currentUser?.fotoPerfilUrl || null,
  });

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
>>>>>>> ai-analysis
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

<<<<<<< HEAD
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
=======
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return setErrors((p) => ({ ...p, photo: "Selecione uma imagem JPG, PNG ou WEBP." }));
    if (file.size > 2 * 1024 * 1024) return setErrors((p) => ({ ...p, photo: "A imagem deve ter no máximo 2 MB." }));
>>>>>>> ai-analysis

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
<<<<<<< HEAD

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrors((previous) => ({
        ...previous,
        photo: "A imagem deve ter no máximo 2 MB.",
      }));

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previous) => ({
        ...previous,
        photo: reader.result,
      }));

      setErrors((previous) => ({
        ...previous,
        photo: "",
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setFormData((previous) => ({
      ...previous,
      photo: null,
    }));

    setErrors((previous) => ({
      ...previous,
      photo: "",
    }));
=======
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
>>>>>>> ai-analysis
  }

  function validateForm() {
    const newErrors = {};
<<<<<<< HEAD

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      newErrors.name = "Informe seu nome.";
    } else if (trimmedName.length < 3) {
      newErrors.name = "O nome deve ter pelo menos 3 letras.";
    }

=======
    if (!formData.name.trim()) newErrors.name = "Informe seu nome.";
>>>>>>> ai-analysis
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

<<<<<<< HEAD
  const hasChanges = useMemo(() => {
    return (
      formData.name.trim() !== initialData.name.trim() ||
      formData.photo !== initialData.photo
    );
  }, [
    formData.name,
    formData.photo,
    initialData.name,
    initialData.photo,
  ]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!hasChanges) return;

    if (!validateForm()) return;

    const updatedUser = {
      ...currentUser,
      name: formData.name.trim(),
      email: currentUser?.email,
      photo: formData.photo,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    navigate("/profile", {
      state: {
        successMessage:
          "Informações alteradas com sucesso.",
      },
    });
=======
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
>>>>>>> ai-analysis
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
<<<<<<< HEAD
    formData,
    errors,
    hasChanges,
    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    handleSubmit,
    handleCancel,
    handleBack,
=======
    formData, errors, successMessage, saving, uploadingPhoto,
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
>>>>>>> ai-analysis
  };
}