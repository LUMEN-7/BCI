import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

export default function useEditProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    photo: currentUser?.photo || null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

    setSuccessMessage("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        photo: "Selecione uma imagem JPG, PNG ou WEBP.",
      }));

      return;
    }

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

      setSuccessMessage("");
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

    setSuccessMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Informe seu nome.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const updatedUser = {
        ...currentUser,
        name: formData.name.trim(),
        email: currentUser?.email,
        photo: formData.photo,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setSuccessMessage("Perfil atualizado com sucesso.");
  }

  function handleCancel() {
    navigate("/profile");
  }

  function handleBack() {
    navigate("/profile");
  }

  return {
    formData,
    errors,
    successMessage,
    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    handleSubmit,
    handleCancel,
    handleBack,
  };
}