import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const email = currentUser?.email || "";

    function generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function handleSendCode() {
        const code = generateCode();

        setGeneratedCode(code);
        setCodeSent(true);
        setCodeVerified(false);
        setVerificationCode("");
        setSuccessMessage("");

        setErrors((previous) => ({
            ...previous,
            code: "",
        }));

        console.log("Código de verificação BCI:", code);
    }

    function handleCodeChange(event) {
        const value = event.target.value.replace(/\D/g, "").slice(0, 6);

        setVerificationCode(value);

        setErrors((previous) => ({
            ...previous,
            code: "",
        }));
    }

    function handleVerifyCode() {
        if (!verificationCode) {
            setErrors((previous) => ({
                ...previous,
                code: "Informe o código de verificação.",
            }));

            return;
        }

        if (verificationCode.length !== 6) {
            setErrors((previous) => ({
                ...previous,
                code: "O código deve conter 6 números.",
            }));

            return;
        }

        if (verificationCode !== generatedCode) {
            setErrors((previous) => ({
                ...previous,
                code: "Código inválido. Verifique e tente novamente.",
            }));

            return;
        }

        setCodeVerified(true);

        setErrors((previous) => ({
            ...previous,
            code: "",
        }));
    }

    function validatePassword() {
        const passwordErrors = {};

        if (!newPassword) {
            passwordErrors.newPassword = "Digite sua nova senha.";
        } else {
            if (newPassword.length < 8) {
                passwordErrors.newPassword =
                    "A senha deve possuir pelo menos 8 caracteres.";
            } else if (!/[A-Z]/.test(newPassword)) {
                passwordErrors.newPassword =
                    "A senha deve possuir pelo menos uma letra maiúscula.";
            } else if (!/[0-9]/.test(newPassword)) {
                passwordErrors.newPassword =
                    "A senha deve possuir pelo menos um número.";
            }
        }

        if (!confirmPassword) {
            passwordErrors.confirmPassword = "Confirme sua nova senha.";
        } else if (newPassword !== confirmPassword) {
            passwordErrors.confirmPassword = "As senhas não coincidem.";
        }

        setErrors((previous) => ({
            ...previous,
            ...passwordErrors,
        }));

        return Object.keys(passwordErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!codeVerified) {
            setErrors((previous) => ({
                ...previous,
                code: "Valide o código antes de alterar sua senha.",
            }));

            return;
        }

        if (!validatePassword()) return;

        const updatedUser = {
            ...currentUser,
            password: newPassword,
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        setSuccessMessage("Senha alterada com sucesso.");

        setNewPassword("");
        setConfirmPassword("");
    }

    function handleNewPasswordChange(event) {
        setNewPassword(event.target.value);

        setErrors((previous) => ({
            ...previous,
            newPassword: "",
        }));
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);

        setErrors((previous) => ({
            ...previous,
            confirmPassword: "",
        }));
    }

    function handleBack() {
        navigate("/profile");
    }

    function handleCancel() {
        navigate("/profile");
    }

    function toggleNewPasswordVisibility() {
        setShowNewPassword((previous) => !previous);
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((previous) => !previous);
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