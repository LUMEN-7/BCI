import { useMemo, useState } from "react";
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
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

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
  }

  function validateForm() {
    const newErrors = {};

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      newErrors.name = "Informe seu nome.";
    } else if (trimmedName.length < 3) {
      newErrors.name = "O nome deve ter pelo menos 3 letras.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

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
    hasChanges,
    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    handleSubmit,
    handleCancel,
    handleBack,
  };
}