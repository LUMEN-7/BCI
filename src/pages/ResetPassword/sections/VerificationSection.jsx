import {
    FiCheckCircle,
    FiMail,
    FiRefreshCw,
    FiShield,
} from "react-icons/fi";

export default function VerificationSection({
    email,
    verificationCode,
    codeSent,
    codeVerified,
    error,
    onSendCode,
    onCodeChange,
    onVerifyCode,
}) {
    return (
        <section className="reset-password-card">
            <div className="reset-section-heading">
                <div className="reset-section-title">

                    <h2>Confirme sua identidade</h2>
                </div>

                <p>
                    Enviaremos um código de segurança para confirmar que esta conta
                    pertence a você.
                </p>
            </div>

            <div className="verification-email-box">
                <div className="verification-email-icon">
                    <FiMail />
                </div>

                <div>
                    <span>CÓDIGO ENVIADO PARA</span>
                    <strong>{email || "E-mail não encontrado"}</strong>
                </div>
            </div>

            {!codeSent && (
                <button
                    type="button"
                    className="reset-button reset-button-primary"
                    onClick={onSendCode}
                    disabled={!email}
                >
                    <FiShield />

                    ENVIAR CÓDIGO DE VERIFICAÇÃO
                </button>
            )}

            {codeSent && (
                <>
                    <div className="verification-code-area">
                        <label htmlFor="verificationCode">
                            CÓDIGO DE VERIFICAÇÃO
                        </label>

                        <div
                            className={`verification-code-input ${error ? "verification-code-input-error" : ""
                                } ${codeVerified ? "verification-code-input-success" : ""
                                }`}
                        >
                            <FiShield />

                            <input
                                id="verificationCode"
                                type="text"
                                inputMode="numeric"
                                value={verificationCode}
                                onChange={onCodeChange}
                                placeholder="000000"
                                maxLength={6}
                                disabled={codeVerified}
                            />

                            {codeVerified && <FiCheckCircle />}
                        </div>

                        {error && (
                            <span className="reset-field-error">
                                {error}
                            </span>
                        )}
                    </div>

                    <div className="verification-actions">
                        {!codeVerified && (
                            <button
                                type="button"
                                className="reset-button reset-button-primary"
                                onClick={onVerifyCode}
                            >
                                <FiCheckCircle />

                                VERIFICAR CÓDIGO
                            </button>
                        )}

                        {!codeVerified && (
                            <button
                                type="button"
                                className="reset-button reset-button-secondary"
                                onClick={onSendCode}
                            >
                                <FiRefreshCw />

                                REENVIAR CÓDIGO
                            </button>
                        )}
                    </div>

                    {codeVerified && (
                        <div className="verification-success">
                            <FiCheckCircle />

                            <div>
                                <strong>Identidade confirmada</strong>
                                <span>
                                    Agora você pode cadastrar uma nova senha.
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}