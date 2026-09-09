import {
    FiCheck,
    FiEye,
    FiEyeOff,
    FiLock,
} from "react-icons/fi";

export default function NewPasswordSection({
    newPassword,
    confirmPassword,

    showNewPassword,
    showConfirmPassword,

    errors,

    onNewPasswordChange,
    onConfirmPasswordChange,

    onToggleNewPassword,
    onToggleConfirmPassword,
}) {
    const hasMinimumLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    return (
        <section className="reset-password-card">
            <div className="reset-section-heading">
                <div className="reset-section-title">

                    <h2>Crie uma nova senha</h2>
                </div>

                <p>
                    Escolha uma senha segura para proteger o acesso à sua conta.
                </p>
            </div>

            <div className="password-form-grid">
                <div className="reset-form-group">
                    <label htmlFor="newPassword">
                        NOVA SENHA
                    </label>

                    <div
                        className={`reset-input-wrapper ${errors.newPassword
                                ? "reset-input-wrapper-error"
                                : ""
                            }`}
                    >
                        <FiLock />

                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={onNewPasswordChange}
                            placeholder="Digite sua nova senha"
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="password-visibility-button"
                            onClick={onToggleNewPassword}
                            aria-label={
                                showNewPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"
                            }
                        >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {errors.newPassword && (
                        <span className="reset-field-error">
                            {errors.newPassword}
                        </span>
                    )}
                </div>

                <div className="reset-form-group">
                    <label htmlFor="confirmPassword">
                        CONFIRMAR NOVA SENHA
                    </label>

                    <div
                        className={`reset-input-wrapper ${errors.confirmPassword
                                ? "reset-input-wrapper-error"
                                : ""
                            }`}
                    >
                        <FiLock />

                        <input
                            id="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={confirmPassword}
                            onChange={onConfirmPasswordChange}
                            placeholder="Confirme sua nova senha"
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="password-visibility-button"
                            onClick={onToggleConfirmPassword}
                            aria-label={
                                showConfirmPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"
                            }
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff />
                            ) : (
                                <FiEye />
                            )}
                        </button>
                    </div>

                    {errors.confirmPassword && (
                        <span className="reset-field-error">
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>
            </div>

            <div className="password-requirements">
                <span
                    className={
                        hasMinimumLength
                            ? "password-rule password-rule-valid"
                            : "password-rule"
                    }
                >
                    <FiCheck />
                    Mínimo de 8 caracteres
                </span>

                <span
                    className={
                        hasUppercase
                            ? "password-rule password-rule-valid"
                            : "password-rule"
                    }
                >
                    <FiCheck />
                    Uma letra maiúscula
                </span>

                <span
                    className={
                        hasNumber
                            ? "password-rule password-rule-valid"
                            : "password-rule"
                    }
                >
                    <FiCheck />
                    Pelo menos um número
                </span>
            </div>
        </section>
    );
}