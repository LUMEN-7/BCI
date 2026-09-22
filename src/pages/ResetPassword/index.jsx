import {
    FiArrowLeft,
    FiCheck,
    FiLock,
} from "react-icons/fi";

import useForgotPassword from "./hooks/useResetPassword";

import VerificationSection from "./sections/VerificationSection";
import NewPasswordSection from "./sections/NewPasswordSection";

import "./style.css";


export default function ForgotPassword() {
    const controller =
        useForgotPassword();


    return (
        <main className="reset-password-page">

            <div className="reset-password-container">

                {/* ===================================================
            VOLTAR
        ==================================================== */}

                <button
                    type="button"
                    className="reset-password-back"
                    onClick={
                        controller.handleBack
                    }
                >

                    <FiArrowLeft />

                    VOLTAR

                </button>


                {/* ===================================================
            HEADER
        ==================================================== */}

                <header className="reset-password-header">

                    <div>

                        <span className="reset-page-eyebrow">
                            SEGURANÇA
                        </span>


                        <h1>
                            REDEFINIR SENHA
                        </h1>

                    </div>


                    <p>
                        Confirme sua identidade e defina uma nova senha para recuperar o acesso à sua conta.
                    </p>

                </header>


                {/* ===================================================
            FORM
        ==================================================== */}

                <form
                    onSubmit={
                        controller.handleSubmit
                    }
                >

                    {/* =================================================
              VERIFICAÇÃO
          ================================================= */}

                    <VerificationSection
                        email={
                            controller.email
                        }

                        verificationCode={
                            controller.verificationCode
                        }

                        codeSent={
                            controller.codeSent
                        }

                        codeVerified={
                            controller.codeVerified
                        }

                        codeSentMessage={
                            controller.codeSentMessage
                        }

                        sendingCode={
                            controller.sendingCode
                        }

                        error={
                            controller.errors.code
                        }

                        emailError={
                            controller.errors.email
                        }

                        onEmailChange={
                            controller.handleEmailChange
                        }

                        onSendCode={
                            controller.handleSendCode
                        }

                        onCodeChange={
                            controller.handleCodeChange
                        }

                        onVerifyCode={
                            controller.handleVerifyCode
                        }
                    />


                    {/* =================================================
              NOVA SENHA
          ================================================= */}

                    {controller.codeVerified && (

                        <NewPasswordSection
                            newPassword={
                                controller.newPassword
                            }

                            confirmPassword={
                                controller.confirmPassword
                            }

                            showNewPassword={
                                controller.showNewPassword
                            }

                            showConfirmPassword={
                                controller.showConfirmPassword
                            }

                            errors={
                                controller.errors
                            }

                            onNewPasswordChange={
                                controller.handleNewPasswordChange
                            }

                            onConfirmPasswordChange={
                                controller.handleConfirmPasswordChange
                            }

                            onToggleNewPassword={
                                controller.toggleNewPasswordVisibility
                            }

                            onToggleConfirmPassword={
                                controller.toggleConfirmPasswordVisibility
                            }
                        />

                    )}


                    {/* =================================================
              SUCESSO FINAL
          ================================================= */}

                    {controller.successMessage && (

                        <div className="reset-password-success-message">

                            <FiCheck />

                            {
                                controller.successMessage
                            }

                        </div>

                    )}


                    {/* =================================================
              AÇÕES FINAIS
          ================================================= */}

                    {controller.codeVerified && (

                        <div className="reset-password-actions">

                            <button
                                type="button"
                                className="reset-button reset-button-cancel"
                                onClick={
                                    controller.handleCancel
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="submit"
                                className="reset-button reset-button-save"
                                disabled={
                                    controller.submitting
                                }
                            >

                                <FiLock />


                                {
                                    controller.submitting
                                        ? "REDEFININDO..."
                                        : "REDEFINIR SENHA"
                                }

                            </button>

                        </div>

                    )}

                </form>

            </div>

        </main>
    );
}