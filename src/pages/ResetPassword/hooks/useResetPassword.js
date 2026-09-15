import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "@/services/api"; // ajuste o caminho conforme sua estrutura

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
        return null;
    }
}

export default function useResetPassword() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const email = currentUser?.email || "";

    const [verificationCode, setVerificationCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [sendingCode, setSendingCode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSendCode() {
        setSendingCode(true);
        setErrors((p) => ({ ...p, code: "" }));
        setSuccessMessage("");

        try {
            await apiFetch("/User/esqueci-senha", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            setCodeSent(true);
            setCodeVerified(false);
            setVerificationCode("");
        } catch (err) {
            setErrors((p) => ({ ...p, code: err.message || "Não foi possível enviar o código." }));
        } finally {
            setSendingCode(false);
        }
    }

    function handleCodeChange(event) {
        const value = event.target.value.replace(/\D/g, "").slice(0, 6);
        setVerificationCode(value);
        setErrors((p) => ({ ...p, code: "" }));
    }

    // Igual no ForgotPassword: o back só valida o código junto da senha nova,
    // então isso aqui só confere o formato (6 dígitos) pra liberar a próxima etapa.
    function handleVerifyCode() {
        if (!verificationCode) {
            setErrors((p) => ({ ...p, code: "Informe o código de verificação." }));
            return;
        }
        if (verificationCode.length !== 6) {
            setErrors((p) => ({ ...p, code: "O código deve conter 6 números." }));
            return;
        }
        setCodeVerified(true);
        setErrors((p) => ({ ...p, code: "" }));
    }

    function validatePassword() {
        const passwordErrors = {};

        if (!newPassword) {
            passwordErrors.newPassword = "Digite sua nova senha.";
        } else if (newPassword.length < 8) {
            passwordErrors.newPassword = "A senha deve possuir pelo menos 8 caracteres.";
        } else if (!/[A-Z]/.test(newPassword)) {
            passwordErrors.newPassword = "A senha deve possuir pelo menos uma letra maiúscula.";
        } else if (!/[0-9]/.test(newPassword)) {
            passwordErrors.newPassword = "A senha deve possuir pelo menos um número.";
        }

        if (!confirmPassword) {
            passwordErrors.confirmPassword = "Confirme sua nova senha.";
        } else if (newPassword !== confirmPassword) {
            passwordErrors.confirmPassword = "As senhas não coincidem.";
        }

        setErrors((p) => ({ ...p, ...passwordErrors }));
        return Object.keys(passwordErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!codeVerified) {
            setErrors((p) => ({ ...p, code: "Valide o código antes de alterar sua senha." }));
            return;
        }
        if (!validatePassword()) return;

        setSubmitting(true);
        setSuccessMessage("");

        try {
            await apiFetch("/User/redefinir-senha", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    codigo: verificationCode,
                    senhaNova: newPassword,
                }),
            });

            setSuccessMessage("Senha alterada com sucesso.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setErrors((p) => ({ ...p, code: err.message || "Código inválido ou expirado." }));
        } finally {
            setSubmitting(false);
        }
    }

    function handleNewPasswordChange(event) {
        setNewPassword(event.target.value);
        setErrors((p) => ({ ...p, newPassword: "" }));
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
        setErrors((p) => ({ ...p, confirmPassword: "" }));
    }

    function toggleNewPasswordVisibility() {
        setShowNewPassword((p) => !p);
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((p) => !p);
    }

    function handleBack() {
        navigate("/profile");
    }

    function handleCancel() {
        navigate("/profile");
    }

    return {
        email,
        verificationCode,
        codeSent,
        codeVerified,
        newPassword,
        confirmPassword,
        showNewPassword,
        showConfirmPassword,
        errors,
        successMessage,
        sendingCode,
        submitting,
        handleSendCode,
        handleCodeChange,
        handleVerifyCode,
        handleNewPasswordChange,
        handleConfirmPasswordChange,
        toggleNewPasswordVisibility,
        toggleConfirmPasswordVisibility,
        handleSubmit,
        handleBack,
        handleCancel,
    };
}