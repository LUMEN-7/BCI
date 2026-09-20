import {
  useEffect,
  useState,
} from "react";

import {
  FiKey,
  FiMail,
  FiSend,
  FiX,
} from "react-icons/fi";

import "./style.css";


export default function WorkspaceInviteModal({
  workspace,
  onClose,
}) {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  /* =========================================================
     FECHAR COM ESC
  ========================================================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    onClose,
  ]);


  /* =========================================================
     ALTERAÇÃO DO E-MAIL
  ========================================================= */

  function handleEmailChange(event) {
    setEmail(
      event.target.value
    );

    setError("");
  }


  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  }


  /* =========================================================
     ENVIAR CONVITE
  ========================================================= */

  function handleSendInvite(event) {
    event.preventDefault();

    const normalizedEmail =
      email.trim();

    if (!normalizedEmail) {
      setError(
        "Digite o e-mail da pessoa que deseja convidar."
      );

      return;
    }

    if (
      !isValidEmail(
        normalizedEmail
      )
    ) {
      setError(
        "Digite um endereço de e-mail válido."
      );

      return;
    }

    if (
      !workspace?.inviteCode
    ) {
      setError(
        "Este workspace não possui um código de convite."
      );

      return;
    }


    const workspaceName =
      workspace.name ||
      "Workspace BCI";


    const inviteCode =
      workspace.inviteCode;


    const accessUrl =
      `${window.location.origin}/workspace?choose=true`;


    const subject =
      `Convite para o workspace ${workspaceName} | BCI`;


    const body = `
Olá!

Você recebeu um convite para participar do workspace "${workspaceName}" no BCI - Beyond Compare Intelligence.

Código de convite:
${inviteCode}

Para participar:

1. Acesse o BCI.
2. Entre na área Workspace.
3. Selecione "Entrar em um workspace".
4. Informe o código de convite acima.

Acesso:
${accessUrl}

Até breve!

Equipe BCI
    `.trim();


    const mailto =
      `mailto:${encodeURIComponent(
        normalizedEmail
      )}` +
      `?subject=${encodeURIComponent(
        subject
      )}` +
      `&body=${encodeURIComponent(
        body
      )}`;


    window.location.href =
      mailto;
  }


  /* =========================================================
     OVERLAY
  ========================================================= */

  function handleOverlayClick(
    event
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  }


  return (
    <div
      className="workspace-invite-modal-overlay"
      role="presentation"
      onMouseDown={
        handleOverlayClick
      }
    >
      <section
        className="workspace-invite-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-invite-modal-title"
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="workspace-invite-modal-header">

          <div className="workspace-invite-modal-heading">

            <div className="workspace-invite-modal-heading-icon">
              <FiMail />
            </div>


            <div>
              <span>
                CONVIDAR MEMBRO
              </span>

              <h2
                id="workspace-invite-modal-title"
              >
                Enviar convite por e-mail
              </h2>

              <p>
                Convide alguém para participar de{" "}
                <strong>
                  {workspace?.name}
                </strong>
                .
              </p>
            </div>

          </div>


          <button
            type="button"
            className="workspace-invite-modal-close"
            onClick={
              onClose
            }
            aria-label="Fechar"
          >
            <FiX />
          </button>

        </header>


        {/* =====================================================
            CÓDIGO
        ====================================================== */}

        <div className="workspace-invite-modal-code">

          <div>
            <FiKey />
          </div>


          <span>
            CÓDIGO DE CONVITE
          </span>


          <strong>
            {
              workspace
                ?.inviteCode ||
              "Não disponível"
            }
          </strong>

        </div>


        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          className="workspace-invite-modal-form"
          onSubmit={
            handleSendInvite
          }
        >

          <label>

            <span>
              E-MAIL DO CONVIDADO
            </span>


            <div className="workspace-invite-email-input">

              <FiMail />


              <input
                type="email"
                value={
                  email
                }
                onChange={
                  handleEmailChange
                }
                placeholder="exemplo@empresa.com"
                autoComplete="email"
                autoFocus
              />

            </div>

          </label>


          {
            error && (
              <p className="workspace-invite-modal-error">
                {error}
              </p>
            )
          }


          <div className="workspace-invite-modal-note">

            <p>
              Nesta versão do projeto, o BCI abrirá
              seu aplicativo de e-mail com a mensagem
              e o código de convite preenchidos
              automaticamente.
            </p>

          </div>


          <div className="workspace-invite-modal-actions">

            <button
              type="button"
              className="workspace-invite-modal-cancel"
              onClick={
                onClose
              }
            >
              CANCELAR
            </button>


            <button
              type="submit"
              className="workspace-invite-modal-send"
            >
              <FiSend />

              ENVIAR CONVITE
            </button>

          </div>

        </form>

      </section>
    </div>
  );
}