import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoRefreshOutline,
} from "react-icons/io5";

import "./style.css";

export default function ErrorState({
  title = "Não foi possível carregar os dados",
  message = "Ocorreu um problema ao buscar as informações.",
  onRetry,
  onBack,
  backLabel = "VOLTAR",
}) {
  function handleRetry() {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  }

  return (
    <div
      className="error-state"
      role="alert"
    >
      <div className="error-state-icon">
        <IoAlertCircleOutline />
      </div>

      <div className="error-state-content">
        <strong>
          {title}
        </strong>

        <p>
          {message}
        </p>
      </div>

      <div className="error-state-actions">
        {onBack && (
          <button
            type="button"
            className="
              error-state-button
              error-state-button-secondary
            "
            onClick={onBack}
          >
            <IoArrowBackOutline />

            {backLabel}
          </button>
        )}

        <button
          type="button"
          className="
            error-state-button
            error-state-button-primary
          "
          onClick={handleRetry}
        >
          <IoRefreshOutline />

          TENTAR NOVAMENTE
        </button>
      </div>
    </div>
  );
}