import {
  FiCheck,
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiPaperclip,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import {
  BsPinAngle,
  BsPinAngleFill,
} from "react-icons/bs";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function PostCard({
  post,
  type,

  onLike,
  onOpenThread,

  onTogglePin,
  onDelete,

  onOpenLinkedContent,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const statusLabels = {
    pending: "Pendente",
    progress: "Em análise",
    resolved: "Resolvido",
  };

  // =========================================================
  // FECHAR MENU AO CLICAR FORA
  // =========================================================

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // FIXAR / DESAFIXAR
  // =========================================================

  function handlePin() {
    if (!onTogglePin) {
      return;
    }

    onTogglePin(post.id);

    setMenuOpen(false);
  }

  // =========================================================
  // EXCLUIR
  // =========================================================

  function handleDelete() {
    if (!onDelete) {
      return;
    }

    onDelete(post.id);

    setMenuOpen(false);
  }

  // =========================================================
  // CONTEÚDO VINCULADO
  // =========================================================

  function handleLinkedContent() {
    if (!post.linkedItem) {
      return;
    }

    if (onOpenLinkedContent) {
      onOpenLinkedContent(post.linkedItem);
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <article
      className={
        post.pinned
          ? "workspace-post-card workspace-post-pinned"
          : "workspace-post-card"
      }
    >
      {/* =====================================================
          FIXADO
      ====================================================== */}

      {post.pinned && (
        <div className="post-pinned-label">
          <BsPinAngleFill />

          <span>
            PUBLICAÇÃO FIXADA
          </span>
        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="post-header">
        <div className="post-author-area">
          <div className="post-avatar">
            {post.author?.initials || "?"}
          </div>

          <div>
            <strong>
              {post.author?.name || "Usuário"}
            </strong>

            <span>
              {post.createdAt}
            </span>
          </div>
        </div>

        {/* ===================================================
            MENU
        ==================================================== */}

        <div
          className="post-menu-wrapper"
          ref={menuRef}
        >
          <button
            type="button"
            className="post-more-button"
            onClick={() =>
              setMenuOpen(
                (previous) => !previous
              )
            }
            aria-label="Opções da publicação"
            aria-expanded={menuOpen}
          >
            <FiMoreHorizontal />
          </button>

          {menuOpen && (
            <div className="post-options-menu">

              {/* FIXAR / DESAFIXAR */}

              <button
                type="button"
                onClick={handlePin}
              >
                {post.pinned ? (
                  <>
                    <BsPinAngle />

                    <span>
                      Desafixar publicação
                    </span>
                  </>
                ) : (
                  <>
                    <BsPinAngleFill />

                    <span>
                      Fixar publicação
                    </span>
                  </>
                )}
              </button>

              {/* EXCLUIR */}

              <button
                type="button"
                className="post-delete-option"
                onClick={handleDelete}
              >
                <FiTrash2 />

                <span>
                  Excluir publicação
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          BODY
      ====================================================== */}

      <div className="post-body">

        {/* TIPO + STATUS */}

        <div className="post-meta-row">
          <span
            className={`post-type post-type-${type?.className || "update"
              }`}
          >
            {type?.label || "Atualização"}
          </span>

          {post.status && (
            <span
              className={`post-status post-status-${post.status}`}
            >
              {post.status === "resolved" && (
                <FiCheck />
              )}

              {statusLabels[post.status] ||
                post.status}
            </span>
          )}
        </div>

        {/* TEXTO */}

        <p className="post-text">
          {post.content}
        </p>

        {/* RESPONSÁVEL */}

        {post.responsible && (
          <div className="post-responsible">
            <FiUser />

            <span>
              Responsável:
            </span>

            <strong>
              {post.responsible}
            </strong>
          </div>
        )}

        {/* TAGS */}

        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ===================================================
            CONTEÚDO VINCULADO
        ==================================================== */}

        {post.linkedItem && (
          <button
            type="button"
            className="linked-content"
            onClick={handleLinkedContent}
          >
            <FiPaperclip />

            <div>
              <span>
                CONTEÚDO VINCULADO
              </span>

              <strong>
                {post.linkedItem.title}
              </strong>

              {post.linkedItem.type && (
                <small>
                  {post.linkedItem.type}
                </small>
              )}
            </div>

            <FiExternalLink />
          </button>
        )}
      </div>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <footer className="post-actions">

        {/* CURTIR */}

        <button
          type="button"
          className={
            post.liked
              ? "post-action post-action-liked"
              : "post-action"
          }
          onClick={() =>
            onLike?.(post.id)
          }
          aria-label={
            post.liked
              ? "Remover curtida"
              : "Curtir publicação"
          }
        >
          <FiHeart />

          <span>
            {post.likes || 0}
          </span>
        </button>

        {/* COMENTÁRIOS */}

        <button
          type="button"
          className="post-action"
          onClick={() =>
            onOpenThread?.(post)
          }
          aria-label="Abrir comentários"
        >
          <FiMessageCircle />

          <span>
            {post.comments?.length || 0}
          </span>
        </button>

        {/* ABRIR THREAD */}

        <button
          type="button"
          className="post-open-thread"
          onClick={() =>
            onOpenThread?.(post)
          }
        >
          ABRIR DISCUSSÃO

          <FiExternalLink />
        </button>
      </footer>
    </article>
  );
}