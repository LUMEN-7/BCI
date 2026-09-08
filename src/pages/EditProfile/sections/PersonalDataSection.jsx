import { FiLock, FiMail, FiUser } from "react-icons/fi";

export default function PersonalDataSection({
  formData,
  errors,
  onChange,
}) {
  return (
    <section className="edit-profile-card personal-data-section">
      <div className="section-heading">
        <div className="section-heading-title">
          <h2>Dados pessoais</h2>
        </div>

        <p>
          Atualize as informações utilizadas para identificar sua conta.
        </p>
      </div>

      <div className="profile-form-grid">
        <div className="form-group">
          <label htmlFor="name">NOME COMPLETO</label>

          <div
            className={`input-wrapper ${
              errors.name ? "input-wrapper-error" : ""
            }`}
          >
            <FiUser />

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              placeholder="Digite seu nome"
              autoComplete="name"
            />
          </div>

          {errors.name && (
            <span className="field-error">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-MAIL</label>

          <div className="input-wrapper input-wrapper-readonly">
            <FiMail />

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              tabIndex="-1"
            />

            <FiLock className="readonly-lock" />
          </div>

          <span className="field-helper">
            O e-mail da conta não pode ser alterado.
          </span>
        </div>
      </div>
    </section>
  );
}