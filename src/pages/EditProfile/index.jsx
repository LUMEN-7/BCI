import { FiArrowLeft, FiCheck } from "react-icons/fi";

import useEditProfile from "./hooks/useEditProfile";
import AvatarSection from "./sections/AvatarSection";
import PersonalDataSection from "./sections/PersonalDataSection";

import "./style.css";

export default function EditProfile() {
  const controller = useEditProfile();

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-container">
        <button
          type="button"
          className="edit-profile-back"
          onClick={controller.handleBack}
        >
          <FiArrowLeft />
          VOLTAR
        </button>

        <header className="edit-profile-header">
          <div>
            <span className="page-eyebrow">
              PERFIL
            </span>

            <h1>EDITAR PERFIL</h1>
          </div>

          <p>
            Atualize seus dados pessoais e mantenha suas informações sempre
            atualizadas.
          </p>
        </header>

        <form onSubmit={controller.handleSubmit}>
          <AvatarSection
            name={controller.formData.name}
            email={controller.formData.email}
            photo={controller.formData.photo}
            error={controller.errors.photo}
            onPhotoChange={controller.handlePhotoChange}
            onRemovePhoto={controller.handleRemovePhoto}
          />

          <PersonalDataSection
            formData={controller.formData}
            errors={controller.errors}
            onChange={controller.handleChange}
          />

          <div className="edit-profile-actions">
            <button
              type="button"
              className="button button-cancel"
              onClick={controller.handleCancel}
            >
              CANCELAR
            </button>

            <button
              type="submit"
              className="button button-save"
              disabled={!controller.hasChanges}
            >
              <FiCheck />
              SALVAR ALTERAÇÕES
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}