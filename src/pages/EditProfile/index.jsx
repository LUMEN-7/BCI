import {
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";

import useEditProfile from "./hooks/useEditProfile";

import AvatarSection from "./sections/AvatarSection";
import PersonalDataSection from "./sections/PersonalDataSection";
import TwoFactorSection from "./sections/TwoFactorSection";

import "./style.css";


/* =========================================================
   MODAL DE SALVAMENTO
========================================================= */

function SavingModal() {
  return (
    <div
      className="edit-profile-saving-backdrop"
      role="presentation"
    >
      <section
        className="edit-profile-saving-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-saving-title"
      >
        <span
          className="edit-profile-saving-spinner"
          aria-hidden="true"
        />

        <div className="edit-profile-saving-content">
          <strong id="edit-profile-saving-title">
            Salvando alterações...
          </strong>

          <span>
            Aguarde enquanto atualizamos suas informações.
          </span>
        </div>
      </section>
    </div>
  );
}


/* =========================================================
   EDIT PROFILE
========================================================= */

export default function EditProfile() {
  const controller =
    useEditProfile();


  return (
    <main className="edit-profile-page">

      <div className="edit-profile-container">

        {/* =================================================
            VOLTAR
        ================================================= */}

        <button
          type="button"
          className="edit-profile-back"
          onClick={controller.handleBack}
          disabled={controller.saving}
        >
          <FiArrowLeft />

          VOLTAR
        </button>


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="edit-profile-header">

          <div>
            <span className="page-eyebrow">
              PERFIL
            </span>

            <h1>
              EDITAR PERFIL
            </h1>
          </div>


          <p>
            Atualize seus dados pessoais e mantenha
            suas informações sempre atualizadas.
          </p>

        </header>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={controller.handleSubmit}
        >

          {/* ===============================================
              AVATAR
          =============================================== */}

          <AvatarSection
            name={
              controller.formData.name
            }
            email={
              controller.formData.email
            }
            photo={
              controller.formData.photo
            }
            error={
              controller.errors.photo
            }
            onPhotoChange={
              controller.handlePhotoChange
            }
            onRemovePhoto={
              controller.handleRemovePhoto
            }
          />


          {/* ===============================================
              DADOS PESSOAIS
          =============================================== */}

          <PersonalDataSection
            formData={
              controller.formData
            }
            errors={
              controller.errors
            }
            onChange={
              controller.handleChange
            }
          />


          {/* ===============================================
              AUTENTICAÇÃO EM DUAS ETAPAS
          =============================================== */}

          <TwoFactorSection
            doisFatores={
              controller.doisFatores
            }
          />


          {/* ===============================================
              OUTRAS MENSAGENS DE SUCESSO

              Continua sendo usada para foto e 2FA.
              O salvamento do perfil não usa mais esse bloco.
          =============================================== */}

          {controller.successMessage && (
            <div className="profile-success-message">

              <FiCheck />

              {controller.successMessage}

            </div>
          )}


          {/* ===============================================
              AÇÕES
          =============================================== */}

          <div className="edit-profile-actions">

            <button
              type="button"
              className="button button-cancel"
              onClick={
                controller.handleCancel
              }
              disabled={
                controller.saving
              }
            >
              CANCELAR
            </button>


            <button
              type="submit"
              className="button button-save"
              disabled={
                !controller.hasChanges ||
                controller.saving
              }
            >
              <FiCheck />

              SALVAR ALTERAÇÕES
            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          MODAL DE SALVAMENTO
      ====================================================== */}

      {controller.saving && (
        <SavingModal />
      )}

    </main>
  );
}