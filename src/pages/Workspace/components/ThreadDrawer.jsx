import {
  IoCloseOutline,
  IoCheckmarkDoneOutline,
  IoPersonOutline,
  IoAttachOutline,
  IoOpenOutline,
  IoSend,
} from "react-icons/io5";

import "./style.css";

export default function ThreadDrawer({
  post,
  type,
  onClose,
  onComment,
  onStatusChange,
}) {
  if (!post) return null;

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const input = form.elements.comment;
    const value = input.value.trim();

    if (!value) return;

    onComment(post.id, value);
    form.reset();
  }

  return (
    <div
      className="thread-drawer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="thread-drawer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thread-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="thread-drawer-header">
          <div>
            <span className="thread-drawer-eyebrow">DISCUSSÃO</span>
            <h2 id="thread-title">Thread</h2>
          </div>

          <button
            type="button"
            className="thread-drawer-close"
            onClick={onClose}
            aria-label="Fechar thread"
          >
            <IoCloseOutline />
          </button>
        </header>

        <div className="thread-drawer-body">
          <article className="thread-post-card">
            <div className="thread-post-top">
              <div className="thread-author-avatar">
                {post.author?.initials || "BCI"}
              </div>

              <div className="thread-author-info">
                <strong>{post.author?.name || "Usuário"}</strong>
                <span>{post.time || "Agora"}</span>
              </div>
            </div>

            <div className="thread-post-type-row">
              <span className={`thread-post-type ${type?.className || ""}`}>
                {type?.label || post.type}
              </span>
            </div>

            <p className="thread-post-text">{post.content}</p>

            {post.tags?.length > 0 && (
              <div className="thread-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}

            <div className="thread-post-meta-grid">
              <div className="thread-post-meta-card">
                <span className="thread-meta-label">RESPONSÁVEL</span>
                <div className="thread-meta-content">
                  <IoPersonOutline />
                  <strong>{post.assignee || "Não definido"}</strong>
                </div>
              </div>

              <div className="thread-post-status-wrapper">
                <span className="thread-meta-label">STATUS</span>
                <select
                  value={post.status || "pendente"}
                  onChange={(event) =>
                    onStatusChange(post.id, event.target.value)
                  }
                  className="thread-status-select"
                >
                  <option value="pendente">Pendente</option>
                  <option value="andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </div>
            </div>

            {post.linkedContent && (
              <button
                type="button"
                className="thread-linked-content"
              >
                <div className="thread-linked-content-info">
                  <span>CONTEÚDO VINCULADO</span>
                  <strong>{post.linkedContent.title}</strong>
                  <small>{post.linkedContent.type}</small>
                </div>

                <IoOpenOutline />
              </button>
            )}
          </article>

          <section className="thread-comments-section">
            <div className="thread-comments-header">
              <span>DISCUSSÃO</span>
              <div className="thread-comments-count">
                {post.comments?.length || 0}
              </div>
            </div>

            {post.comments?.length ? (
              <div className="thread-comments-list">
                {post.comments.map((comment) => (
                  <article className="thread-comment-card" key={comment.id}>
                    <div className="thread-comment-avatar">
                      {comment.initials || "U"}
                    </div>

                    <div className="thread-comment-content">
                      <div className="thread-comment-header">
                        <strong>{comment.author}</strong>
                        <span>{comment.time}</span>
                      </div>

                      <p>{comment.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="thread-comments-empty">
                <IoCheckmarkDoneOutline />
                <strong>Nenhum comentário ainda</strong>
                <p>Seja a primeira pessoa a participar dessa discussão.</p>
              </div>
            )}
          </section>
        </div>

        <footer className="thread-drawer-footer">
          <form className="thread-reply-form" onSubmit={handleSubmit}>
            <div className="thread-reply-avatar">
              {post.author?.initials || "BCI"}
            </div>

            <input
              type="text"
              name="comment"
              placeholder="Escreva uma resposta..."
              autoComplete="off"
            />

            <button type="submit" aria-label="Enviar comentário">
              <IoSend />
            </button>
          </form>
        </footer>
      </section>
    </div>
  );
}