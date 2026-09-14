import { useLocation, useNavigate } from "react-router-dom";

import {
    IoArrowBackOutline,
    IoRefreshOutline,
} from "react-icons/io5";

import "./style.css";


const ERROR_CONFIG = {
    400: {
        title: "Não foi possível concluir a solicitação.",
        description:
            "Algumas informações enviadas não puderam ser processadas.",
    },

    401: {
        title: "Sua sessão precisa ser validada.",
        description:
            "Faça login novamente para continuar acessando o BCI.",
    },

    403: {
        title: "Acesso não autorizado.",
        description:
            "Você não possui permissão para acessar este recurso.",
    },

    404: {
        title: "Parece que essa rota saiu do mapa.",
        description:
            "Não foi possível encontrar a página que você tentou acessar.",
    },

    408: {
        title: "A solicitação demorou mais que o esperado.",
        description:
            "O tempo limite da operação foi excedido. Tente novamente.",
    },

    429: {
        title: "Muitas solicitações foram realizadas.",
        description:
            "Aguarde alguns instantes antes de tentar novamente.",
    },

    500: {
        title: "Algo não saiu como esperado.",
        description:
            "Encontramos um problema interno ao processar sua solicitação.",
    },

    502: {
        title: "Não conseguimos acessar o serviço.",
        description:
            "Um dos serviços necessários para o BCI está temporariamente indisponível.",
    },

    503: {
        title: "Serviço temporariamente indisponível.",
        description:
            "O BCI não conseguiu concluir esta operação neste momento.",
    },

    504: {
        title: "O serviço demorou para responder.",
        description:
            "Não recebemos uma resposta dentro do tempo esperado.",
    },
};


export default function Error({
    statusCode: statusCodeProp,
    errorMessage: errorMessageProp,
    onReset,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    /*
      O erro pode chegar de três maneiras:

      1. Prop:
         <Error statusCode={404} />

      2. Navigation state:
         navigate("/error", {
             state: {
                 statusCode: 500,
                 message: "..."
             }
         })

      3. Fallback:
         500
    */

    const statusCode =
        statusCodeProp ||
        location.state?.statusCode ||
        location.state?.status ||
        500;


    const receivedMessage =
        errorMessageProp ||
        location.state?.message ||
        null;


    const errorConfig =
        ERROR_CONFIG[statusCode] ||
        {
            title: "Encontramos um problema.",
            description:
                "Não foi possível concluir esta operação.",
        };


    function handleGoHome() {
        if (onReset) {
            onReset();
            return;
        }

        navigate("/home");
    }


    function handleRetry() {
        window.location.reload();
    }


    return (
        <main className="error-page">

            <div
                className="
                    error-background-glow
                    error-background-glow-one
                "
            />

            <div
                className="
                    error-background-glow
                    error-background-glow-two
                "
            />


            <section className="error-content">

                <span className="error-label">
                    ERRO DE NAVEGAÇÃO
                </span>


                <div className="error-code-wrapper">

                    <h1 className="error-code-base">
                        {statusCode}
                    </h1>

                    <h1
                        className="error-code-fill"
                        aria-hidden="true"
                    >
                        {statusCode}
                    </h1>

                </div>


                <p className="error-brand-name">
                    BEYOND COMPARE INTELLIGENCE
                </p>


                <div className="error-message">

                    <h2>
                        {errorConfig.title}
                    </h2>

                    <p>
                        {errorConfig.description}
                    </p>


                    {receivedMessage && (
                        <div className="error-technical-message">
                            <span>
                                DETALHES
                            </span>

                            <p>
                                {receivedMessage}
                            </p>
                        </div>
                    )}

                </div>


                <div className="error-actions">

                    <button
                        type="button"
                        className="
                            error-button
                            error-button-primary
                        "
                        onClick={handleGoHome}
                    >
                        <IoArrowBackOutline />

                        VOLTAR PARA A HOME
                    </button>


                    <button
                        type="button"
                        className="
                            error-button
                            error-button-secondary
                        "
                        onClick={handleRetry}
                    >
                        <IoRefreshOutline />

                        TENTAR NOVAMENTE
                    </button>

                </div>

            </section>


            <footer className="error-footer">

                <span>
                    EQUIPE LUMEN
                </span>

                <div />

                <span>
                    BCI 2026
                </span>

            </footer>

        </main>
    );
}