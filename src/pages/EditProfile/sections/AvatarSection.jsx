import { FiCamera, FiTrash2, FiUser } from "react-icons/fi";

export default function AvatarSection({
  name,
  email,
  photo,
  error,
  onPhotoChange,
  onRemovePhoto,
}) {
  return (
    <section className="edit-profile-card avatar-section">
      <div className="section-heading">
        <div className="section-heading-title">
          <h2>Imagem da conta</h2>
        </div>

        <p>
          Escolha uma foto para personalizar sua identificação dentro do BCI.
        </p>
      </div>

      <div className="avatar-content">
        <div className="avatar-preview">
          {photo ? (
            <img src={photo} alt={`Foto de perfil de ${name}`} />
          ) : (
            <FiUser />
          )}
        </div>

        <div className="avatar-info">
          <strong>{name || "Usuário"}</strong>
          <span>{email || "Sem e-mail"}</span>

          <div className="avatar-actions">
            <label className="button button-primary avatar-upload">
              <FiCamera />
              ALTERAR FOTO

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onPhotoChange}
              />
            </label>

            {photo && (
              <button
                type="button"
                className="button button-secondary"
                onClick={onRemovePhoto}
              >
                <FiTrash2 />
                REMOVER
              </button>
            )}
          </div>

          <small>JPG, PNG ou WEBP. Tamanho máximo de 2 MB.</small>

          {error && <span className="field-error">{error}</span>}
        </div>
      </div>
    </section>
  );
}