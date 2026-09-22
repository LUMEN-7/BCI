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

    codeSentMessage,

    sendingCode,

    error,

    emailError,

    onEmailChange,

    onSendCode,

    onCodeChange,

    onVerifyCode,
}) {
    return (
        <section className="reset-password-card">

            {/* =====================================================
          HEADER
      ====================================================== */}

            <div className="reset-section-heading">

                <div className="reset-section-title">

                    <h2>
                        Confirme sua identidade
                    </h2>

                </div>


                <p>
                    Informe o e-mail da sua conta para receber um código de segurança.
                </p>

            </div>


            {/* =====================================================
          ETAPA 1 — E-MAIL
      ====================================================== */}

            {!codeSent && (

                <>

                    <div className="verification-code-area">

                        <label htmlFor="email">
                            E-MAIL
                        </label>


                        <div
                            className={
                                `verification-code-input ${emailError
                                    ? "verification-code-input-error"
                                    : ""
                                }`
                            }
                        >

                            <FiMail />


                            <input
                                id="email"
                                type="email"
                                value={
                                    email
                                }
                                onChange={
                                    onEmailChange
                                }
                                placeholder="seuemail@exemplo.com"
                                autoComplete="email"
                                disabled={
                                    sendingCode
                                }
                            />

                        </div>


                        {emailError && (

                            <span className="reset-field-error">
                                {
                                    emailError
                                }
                            </span>

                        )}

                    </div>


                    <button
                        type="button"
                        className="reset-button reset-button-primary"
                        onClick={
                            onSendCode
                        }
                        disabled={
                            !email ||
                            sendingCode
                        }
                    >

                        <FiShield />


                        {
                            sendingCode
                                ? "ENVIANDO..."
                                : "ENVIAR CÓDIGO DE VERIFICAÇÃO"
                        }

                    </button>

                </>

            )}


            {/* =====================================================
          ETAPA 2 — CÓDIGO ENVIADO
      ====================================================== */}

            {codeSent && (

                <>

                    {/* =================================================
              MENSAGEM DE SUCESSO
          ================================================= */}

                    <div
                        className="verification-code-sent"
                        role="status"
                        aria-live="polite"
                    >

                        <div className="verification-code-sent-icon">

                            <FiCheckCircle />

                        </div>


                        <div>

                            <strong>
                                Código enviado com sucesso
                            </strong>


                            <span>
                                {
                                    codeSentMessage ||
                                    `Código enviado ao e-mail ${email}.`
                                }
                            </span>

                        </div>

                    </div>


                    {/* =================================================
              CAMPO DO CÓDIGO
          ================================================= */}

                    <div className="verification-code-area">

                        <label htmlFor="verificationCode">
                            CÓDIGO DE VERIFICAÇÃO
                        </label>


                        <div
                            className={
                                `verification-code-input ${error
                                    ? "verification-code-input-error"
                                    : ""
                                } ${codeVerified
                                    ? "verification-code-input-success"
                                    : ""
                                }`
                            }
                        >

                            <FiShield />


                            <input
                                id="verificationCode"
                                type="text"
                                inputMode="numeric"
                                value={
                                    verificationCode
                                }
                                onChange={
                                    onCodeChange
                                }
                                placeholder="000000"
                                maxLength={
                                    6
                                }
                                autoComplete="one-time-code"
                                disabled={
                                    codeVerified
                                }
                            />


                            {codeVerified && (
                                <FiCheckCircle />
                            )}

                        </div>


                        {error && (

                            <span className="reset-field-error">
                                {error}
                            </span>

                        )}

                    </div>


                    {/* =================================================
              AÇÕES
          ================================================= */}

                    <div className="verification-actions">

                        {!codeVerified && (

                            <button
                                type="button"
                                className="reset-button reset-button-primary"
                                onClick={
                                    onVerifyCode
                                }
                                disabled={
                                    verificationCode.length !==
                                    6
                                }
                            >

                                <FiCheckCircle />

                                VERIFICAR CÓDIGO

                            </button>

                        )}


                        {!codeVerified && (

                            <button
                                type="button"
                                className="reset-button reset-button-secondary"
                                onClick={
                                    onSendCode
                                }
                                disabled={
                                    sendingCode
                                }
                            >

                                <FiRefreshCw />


                                {
                                    sendingCode
                                        ? "REENVIANDO..."
                                        : "REENVIAR CÓDIGO"
                                }

                            </button>

                        )}

                    </div>


                    {/* =================================================
              IDENTIDADE CONFIRMADA
          ================================================= */}

                    {codeVerified && (

                        <div className="verification-success">

                            <FiCheckCircle />


                            <div>

                                <strong>
                                    Identidade confirmada
                                </strong>


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