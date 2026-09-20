import "./style.css";

export default function PageLoader({
  message = "página",
}) {
  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
    >
      <span
        className="page-loader__spinner"
        aria-hidden="true"
      />

      <p className="page-loader__message">
        Carregando {message}
        <span className="page-loader__dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}