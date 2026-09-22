import "./style.css";

export default function SectionLoader({
    message = "Carregando informações",
    description = "",
    compact = false,
}) {
    return (
        <div
            className={`section-loader ${compact
                    ? "section-loader--compact"
                    : ""
                }`}
            role="status"
            aria-live="polite"
        >
            <span
                className="section-loader__spinner"
                aria-hidden="true"
            />

            <div className="section-loader__content">
                <strong>
                    {message}
                    <span className="section-loader__dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </strong>

                {description && (
                    <span className="section-loader__description">
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
}