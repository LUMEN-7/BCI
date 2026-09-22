import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiFetch from "@/services/api";


function getCurrentUser() {
    try {
        return (
            JSON.parse(
                localStorage.getItem("currentUser")
            ) || null
        );
    } catch {
        return null;
    }
}


export default function useResetPassword() {
    const navigate = useNavigate();

    const currentUser =
        getCurrentUser();


    /* =========================================================
       E-MAIL
    ========================================================= */

    const [
        email,
        setEmail,
    ] = useState(
        currentUser?.email || ""
    );


    /* =========================================================
       VERIFICAÇÃO
    ========================================================= */

    const [
        verificationCode,
        setVerificationCode,
    ] = useState("");


    const [
        codeSent,
        setCodeSent,
    ] = useState(false);


    const [
        codeVerified,
        setCodeVerified,
    ] = useState(false);


    /* =========================================================
       SENHA
    ========================================================= */

    const [
        newPassword,
        setNewPassword,
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");


    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);


    /* =========================================================
       ESTADOS
    ========================================================= */

    const [
        errors,
        setErrors,
    ] = useState({});


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const [
        codeSentMessage,
        setCodeSentMessage,
    ] = useState("");


    const [
        sendingCode,
        setSendingCode,
    ] = useState(false);


    const [
        submitting,
        setSubmitting,
    ] = useState(false);


    /* =========================================================
       ALTERAR E-MAIL
    ========================================================= */

    function handleEmailChange(event) {
        const value =
            event.target.value;


        setEmail(
            value
        );


        setErrors(
            (previous) => ({
                ...previous,
                email: "",
                code: "",
            })
        );


        setCodeSentMessage(
            ""
        );
    }


    /* =========================================================
       ENVIAR CÓDIGO
    ========================================================= */

    async function handleSendCode() {
        const normalizedEmail =
            email.trim();


        if (!normalizedEmail) {
            setErrors(
                (previous) => ({
                    ...previous,
                    email:
                        "Informe seu e-mail.",
                })
            );

            return;
        }


        setSendingCode(
            true
        );


        setErrors(
            (previous) => ({
                ...previous,
                email: "",
                code: "",
            })
        );


        setSuccessMessage(
            ""
        );


        setCodeSentMessage(
            ""
        );


        try {
            await apiFetch(
                "/User/esqueci-senha",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email:
                            normalizedEmail,
                    }),
                }
            );


            /*
              Só libera a etapa do código
              depois que a API confirmar
              que o envio foi realizado.
            */

            setEmail(
                normalizedEmail
            );


            setCodeSent(
                true
            );


            setCodeVerified(
                false
            );


            setVerificationCode(
                ""
            );


            setCodeSentMessage(
                `Código enviado ao e-mail ${normalizedEmail}.`
            );

        } catch (err) {

            setCodeSent(
                false
            );


            setCodeSentMessage(
                ""
            );


            setErrors(
                (previous) => ({
                    ...previous,

                    email:
                        err.message ||
                        "Não foi possível enviar o código.",
                })
            );

        } finally {

            setSendingCode(
                false
            );

        }
    }


    /* =========================================================
       ALTERAR CÓDIGO
    ========================================================= */

    function handleCodeChange(event) {
        const value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);


        setVerificationCode(
            value
        );


        setErrors(
            (previous) => ({
                ...previous,
                code: "",
            })
        );
    }


    /* =========================================================
       VERIFICAR CÓDIGO
    ========================================================= */

    function handleVerifyCode() {
        if (
            !verificationCode
        ) {
            setErrors(
                (previous) => ({
                    ...previous,

                    code:
                        "Informe o código de verificação.",
                })
            );

            return;
        }


        if (
            verificationCode.length !==
            6
        ) {
            setErrors(
                (previous) => ({
                    ...previous,

                    code:
                        "O código deve conter 6 números.",
                })
            );

            return;
        }


        /*
          Atualmente o backend valida
          o código junto da redefinição
          da senha.
    
          Aqui validamos apenas o formato
          para liberar a próxima etapa.
        */

        setCodeVerified(
            true
        );


        setErrors(
            (previous) => ({
                ...previous,
                code: "",
            })
        );
    }


    /* =========================================================
       VALIDAR SENHA
    ========================================================= */

    function validatePassword() {
        const passwordErrors =
            {};


        if (
            !newPassword
        ) {
            passwordErrors.newPassword =
                "Digite sua nova senha.";

        } else if (
            newPassword.length <
            8
        ) {
            passwordErrors.newPassword =
                "A senha deve possuir pelo menos 8 caracteres.";

        } else if (
            !/[A-Z]/.test(
                newPassword
            )
        ) {
            passwordErrors.newPassword =
                "A senha deve possuir pelo menos uma letra maiúscula.";

        } else if (
            !/[0-9]/.test(
                newPassword
            )
        ) {
            passwordErrors.newPassword =
                "A senha deve possuir pelo menos um número.";
        }


        if (
            !confirmPassword
        ) {
            passwordErrors.confirmPassword =
                "Confirme sua nova senha.";

        } else if (
            newPassword !==
            confirmPassword
        ) {
            passwordErrors.confirmPassword =
                "As senhas não coincidem.";
        }


        setErrors(
            (previous) => ({
                ...previous,
                ...passwordErrors,
            })
        );


        return (
            Object.keys(
                passwordErrors
            ).length === 0
        );
    }


    /* =========================================================
       REDEFINIR SENHA
    ========================================================= */

    async function handleSubmit(event) {
        event.preventDefault();


        if (
            !codeVerified
        ) {
            setErrors(
                (previous) => ({
                    ...previous,

                    code:
                        "Valide o código antes de alterar sua senha.",
                })
            );

            return;
        }


        if (
            !validatePassword()
        ) {
            return;
        }


        setSubmitting(
            true
        );


        setSuccessMessage(
            ""
        );


        try {
            await apiFetch(
                "/User/redefinir-senha",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,

                        codigo:
                            verificationCode,

                        senhaNova:
                            newPassword,
                    }),
                }
            );


            setSuccessMessage(
                "Senha alterada com sucesso."
            );


            setNewPassword(
                ""
            );


            setConfirmPassword(
                ""
            );

        } catch (err) {

            setErrors(
                (previous) => ({
                    ...previous,

                    code:
                        err.message ||
                        "Código inválido ou expirado.",
                })
            );

        } finally {

            setSubmitting(
                false
            );

        }
    }


    /* =========================================================
       CAMPOS DA SENHA
    ========================================================= */

    function handleNewPasswordChange(
        event
    ) {
        setNewPassword(
            event.target.value
        );


        setErrors(
            (previous) => ({
                ...previous,
                newPassword: "",
            })
        );
    }


    function handleConfirmPasswordChange(
        event
    ) {
        setConfirmPassword(
            event.target.value
        );


        setErrors(
            (previous) => ({
                ...previous,
                confirmPassword: "",
            })
        );
    }


    /* =========================================================
       VISIBILIDADE
    ========================================================= */

    function toggleNewPasswordVisibility() {
        setShowNewPassword(
            (previous) =>
                !previous
        );
    }


    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword(
            (previous) =>
                !previous
        );
    }


    /* =========================================================
       NAVEGAÇÃO
    ========================================================= */

    function handleBack() {
        navigate(
            "/profile"
        );
    }


    function handleCancel() {
        navigate(
            "/profile"
        );
    }


    /* =========================================================
       RETURN
    ========================================================= */

    return {
        email,

        verificationCode,

        codeSent,

        codeVerified,

        codeSentMessage,

        newPassword,

        confirmPassword,

        showNewPassword,

        showConfirmPassword,

        errors,

        successMessage,

        sendingCode,

        submitting,

        handleEmailChange,

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