import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  atualizarPerfil,
  uploadFotoPerfil,
  removerFotoPerfil,
  iniciarDoisFatores,
  confirmarDoisFatores,
  desativarDoisFatores,
} from "@/services/userService";


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      ) || null
    );
  } catch {
    return null;
  }
}


/* =========================================================
   CONTROLLER
========================================================= */

export default function useEditProfile() {
  const navigate =
    useNavigate();

  const currentUser =
    getCurrentUser();


  const initialName =
    currentUser?.nomeExibicao ||
    currentUser?.userName ||
    "";


  /* =========================================================
     FORM
  ========================================================= */

  const [
    formData,
    setFormData,
  ] = useState({
    name: initialName,
    email:
      currentUser?.email ||
      "",
    photo:
      currentUser?.fotoPerfilUrl ||
      null,
  });


  const hasChanges =
    formData.name.trim() !==
      initialName.trim() &&
    formData.name.trim().length > 0;


  /* =========================================================
     STATES
  ========================================================= */

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingPhoto,
    setUploadingPhoto,
  ] = useState(false);


  /* =========================================================
     2FA
  ========================================================= */

  const [
    doisFatoresAtivo,
    setDoisFatoresAtivo,
  ] = useState(
    currentUser?.doisFatoresAtivo ||
    false
  );

  const [
    qrCodeUri,
    setQrCodeUri,
  ] = useState(null);

  const [
    chaveManual,
    setChaveManual,
  ] = useState(null);

  const [
    codigo2fa,
    setCodigo2fa,
  ] = useState("");

  const [
    erro2fa,
    setErro2fa,
  ] = useState("");

  const [
    carregando2fa,
    setCarregando2fa,
  ] = useState(false);


  /* =========================================================
     ATUALIZAR CURRENT USER LOCAL
  ========================================================= */

  function atualizarCurrentUserLocal(
    mudancas
  ) {
    const usuarioAtual =
      getCurrentUser() ||
      currentUser ||
      {};

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        ...usuarioAtual,
        ...mudancas,
      })
    );
  }


  /* =========================================================
     ALTERAÇÃO DO FORM
  ========================================================= */

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));


    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));


    setSuccessMessage("");
  }


  /* =========================================================
     FOTO
  ========================================================= */

  async function handlePhotoChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrors((previous) => ({
        ...previous,
        photo:
          "Selecione uma imagem JPG, PNG ou WEBP.",
      }));

      return;
    }


    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setErrors((previous) => ({
        ...previous,
        photo:
          "A imagem deve ter no máximo 2 MB.",
      }));

      return;
    }


    setUploadingPhoto(true);

    setErrors((previous) => ({
      ...previous,
      photo: "",
    }));


    try {
      const resultado =
        await uploadFotoPerfil(
          file
        );


      setFormData(
        (previous) => ({
          ...previous,
          photo:
            resultado.fotoPerfilUrl,
        })
      );


      atualizarCurrentUserLocal({
        fotoPerfilUrl:
          resultado.fotoPerfilUrl,
      });


      setSuccessMessage(
        "Foto atualizada com sucesso."
      );

    } catch (err) {

      setErrors((previous) => ({
        ...previous,
        photo:
          err.message ||
          "Não foi possível enviar a imagem.",
      }));

    } finally {

      setUploadingPhoto(false);

      event.target.value = "";

    }
  }


  /* =========================================================
     REMOVER FOTO
  ========================================================= */

  async function handleRemovePhoto() {
    setUploadingPhoto(true);


    try {
      await removerFotoPerfil();


      setFormData(
        (previous) => ({
          ...previous,
          photo: null,
        })
      );


      atualizarCurrentUserLocal({
        fotoPerfilUrl: null,
      });

    } catch (err) {

      setErrors((previous) => ({
        ...previous,
        photo:
          err.message ||
          "Não foi possível remover a imagem.",
      }));

    } finally {

      setUploadingPhoto(false);

    }
  }


  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function validateForm() {
    const newErrors = {};


    if (
      !formData.name.trim()
    ) {
      newErrors.name =
        "Informe seu nome.";
    }


    setErrors(
      newErrors
    );


    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  }


  /* =========================================================
     SALVAR PERFIL
  ========================================================= */

  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    if (
      !validateForm() ||
      saving
    ) {
      return;
    }


    setSaving(true);

    setSuccessMessage("");


    try {
      /* ===============================================
         API
      =============================================== */

      await atualizarPerfil(
        formData.name.trim()
      );


      /* ===============================================
         LOCAL STORAGE
      =============================================== */

      atualizarCurrentUserLocal({
        nomeExibicao:
          formData.name.trim(),
      });


      /* ===============================================
         SUCESSO

         Só navega se a API realmente terminar
         sem lançar erro.
      =============================================== */

      navigate(
        "/profile",
        {
          replace: true,

          state: {
            successMessage:
              "Alterações feitas com sucesso.",
          },
        }
      );

    } catch (err) {

      /*
        Se der erro:
        - modal desaparece;
        - continua em EditProfile;
        - exibe o erro no campo;
        - NÃO mostra toast de sucesso.
      */

      setErrors(
        (previous) => ({
          ...previous,

          name:
            err.message ||
            "Não foi possível salvar as alterações.",
        })
      );

    } finally {

      setSaving(false);

    }
  }


  /* =========================================================
     INICIAR 2FA
  ========================================================= */

  async function handleIniciarDoisFatores() {
    setErro2fa("");

    setCarregando2fa(true);


    try {
      const resultado =
        await iniciarDoisFatores();


      setQrCodeUri(
        resultado.qrCodeUri
      );

      setChaveManual(
        resultado.chaveManual
      );

    } catch (err) {

      setErro2fa(
        err.message ||
        "Não foi possível iniciar a configuração."
      );

    } finally {

      setCarregando2fa(false);

    }
  }


  /* =========================================================
     CONFIRMAR 2FA
  ========================================================= */

  async function handleConfirmarDoisFatores(
    event
  ) {
    event.preventDefault();


    setErro2fa("");

    setCarregando2fa(true);


    try {
      await confirmarDoisFatores(
        codigo2fa
      );


      setDoisFatoresAtivo(
        true
      );

      setQrCodeUri(null);

      setChaveManual(null);

      setCodigo2fa("");


      atualizarCurrentUserLocal({
        doisFatoresAtivo: true,
      });


      setSuccessMessage(
        "Autenticação em duas etapas ativada."
      );

    } catch (err) {

      setErro2fa(
        err.message ||
        "Código inválido."
      );

    } finally {

      setCarregando2fa(false);

    }
  }


  /* =========================================================
     DESATIVAR 2FA
  ========================================================= */

  async function handleDesativarDoisFatores() {
    setErro2fa("");

    setCarregando2fa(true);


    try {
      await desativarDoisFatores();


      setDoisFatoresAtivo(
        false
      );


      atualizarCurrentUserLocal({
        doisFatoresAtivo: false,
      });


      setSuccessMessage(
        "Autenticação em duas etapas desativada."
      );

    } catch (err) {

      setErro2fa(
        err.message ||
        "Não foi possível desativar."
      );

    } finally {

      setCarregando2fa(false);

    }
  }


  /* =========================================================
     CANCELAR CONFIGURAÇÃO 2FA
  ========================================================= */

  function handleCancelarDoisFatores() {
    setQrCodeUri(null);

    setChaveManual(null);

    setCodigo2fa("");

    setErro2fa("");
  }


  /* =========================================================
     RETURN
  ========================================================= */

  return {
    formData,
    errors,
    successMessage,
    saving,
    uploadingPhoto,
    hasChanges,

    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    handleSubmit,

    handleCancel: () =>
      navigate("/profile"),

    handleBack: () =>
      navigate("/profile"),

    doisFatores: {
      ativo:
        doisFatoresAtivo,

      qrCodeUri,
      chaveManual,

      codigo:
        codigo2fa,

      erro:
        erro2fa,

      carregando:
        carregando2fa,

      setCodigo:
        setCodigo2fa,

      iniciar:
        handleIniciarDoisFatores,

      confirmar:
        handleConfirmarDoisFatores,

      desativar:
        handleDesativarDoisFatores,

      cancelar:
        handleCancelarDoisFatores,
    },
  };
}