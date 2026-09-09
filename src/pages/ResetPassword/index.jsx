import {
    FiArrowLeft,
    FiCheck,
    FiLock,
} from "react-icons/fi";

import useResetPassword from "./hooks/useResetPassword";

import VerificationSection from "./sections/VerificationSection";
import NewPasswordSection from "./sections/NewPasswordSection";

import "./style.css";

export default function ResetPassword() {
    const controller = useResetPassword();

    return (
        <main className="reset-password-page">
            <div className="reset-password-container">
                <button
                    type="button"
                    className="reset-password-back"
                    onClick={controller.handleBack}
                >
                    <FiArrowLeft />

                    VOLTAR
                </button>

                <header className="reset-password-header">
                    <div>
                        <span className="reset-page-eyebrow">
                            SEGURANÇA
                        </span>

                        <h1>REDEFINIR SENHA</h1>
                    </div>

                    <p>
                        Confirme sua identidade e defina uma nova senha
                        para proteger sua conta.
                    </p>
                </header>

                <form onSubmit={controller.handleSubmit}>
                    <VerificationSection
                        email={controller.email}
                        verificationCode={
                            controller.verificationCode
                        }
                        codeSent={controller.codeSent}
                        codeVerified={controller.codeVerified}
                        error={controller.errors.code}
                        onSendCode={controller.handleSendCode}
                        onCodeChange={controller.handleCodeChange}
                        onVerifyCode={controller.handleVerifyCode}
                    />

                    {controller.codeVerified && (
                        <NewPasswordSection
                            newPassword={controller.newPassword}
                            confirmPassword={
                                controller.confirmPassword
                            }
                            showNewPassword={
                                controller.showNewPassword
                            }
                            showConfirmPassword={
                                controller.showConfirmPassword
                            }
                            errors={controller.errors}
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

                    {controller.successMessage && (
                        <div className="reset-password-success-message">
                            <FiCheck />

                            {controller.successMessage}
                        </div>
                    )}

                    {controller.codeVerified && (
                        <div className="reset-password-actions">
                            <button
                                type="button"
                                className="reset-button reset-button-cancel"
                                onClick={controller.handleCancel}
                            >
                                CANCELAR
                            </button>

                            <button
                                type="submit"
                                className="reset-button reset-button-save"
                            >
                                <FiLock />

                                ALTERAR SENHA
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}