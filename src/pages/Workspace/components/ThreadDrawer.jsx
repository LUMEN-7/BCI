import {
  IoAttachOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
  IoOpenOutline,
  IoPersonOutline,
  IoSend,
} from "react-icons/io5";


export default function ThreadDrawer({
  post,
  type,
  onClose,
  onComment,
  onStatusChange,
}) {
  if (!post) {
    return null;
  }


  /* =========================================================
     ENVIAR COMENTÁRIO
  ========================================================= */

  function handleSubmit(event) {
    event.preventDefault();

    const form =
      event.currentTarget;

    const input =
      form.elements.comment;

    const value =
      input.value.trim();


    if (!value) {
      return;
    }


    onComment(
      post.id,
      value
    );


    form.reset();
  }


  /* =========================================================
     STATUS
  ========================================================= */

  const status =
    post.status ||
    "pending";


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      {/* =====================================================
          OVERLAY
      ====================================================== */}

      <div
        className="thread-overlay"
        onClick={onClose}
        role="presentation"
      />


      {/* =====================================================
          MODAL
      ====================================================== */}

      <section
        className="thread-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thread-title"
      >

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="thread-drawer-header">

          <div>

            <span>
              DISCUSSÃO
            </span>


            <h2 id="thread-title">
              Thread
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar discussão"
          >
            <IoCloseOutline />
          </button>

        </header>


        {/* ===================================================
            BODY
        ==================================================== */}

        <div className="thread-drawer-body">

          {/* =================================================
              POST ORIGINAL
          ================================================= */}

          <article className="thread-original-post">

            {/* AUTOR */}

            <div className="thread-author">

              <div className="post-avatar">

                {
                  post.author?.initials ||
                  "?"
                }

              </div>


              <div>

                <strong>
                  {
                    post.author?.name ||
                    "Usuário"
                  }
                </strong>


                <span>
                  {
                    post.createdAt ||
                    "Agora"
                  }
                </span>

              </div>

            </div>


            {/* TIPO */}

            <div className="post-meta-row">

              <span
                className={
                  `post-type post-type-${
                    type?.className ||
                    "update"
                  }`
                }
              >
                {
                  type?.label ||
                  "Atualização"
                }
              </span>

            </div>


            {/* TEXTO */}

            <p>
              {post.content}
            </p>


            {/* TAGS */}

            {post.tags?.length > 0 && (

              <div className="post-tags">

                {post.tags.map(
                  (tag) => (

                    <span key={tag}>
                      #{tag}
                    </span>

                  )
                )}

              </div>

            )}


            {/* =================================================
                RESPONSÁVEL
            ================================================= */}

            <div className="thread-responsible">

              <IoPersonOutline />


              <div>

                <span>
                  RESPONSÁVEL
                </span>


                <strong>
                  {
                    post.responsible ||
                    "Não definido"
                  }
                </strong>

              </div>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="thread-status-area">

              <span>
                STATUS
              </span>


              <select
                value={status}
                onChange={(event) =>
                  onStatusChange(
                    post.id,
                    event.target.value
                  )
                }
              >

                <option value="pending">
                  Pendente
                </option>


                <option value="progress">
                  Em análise
                </option>


                <option value="resolved">
                  Resolvido
                </option>

              </select>

            </div>


            {/* =================================================
                CONTEÚDO VINCULADO
            ================================================= */}

            {post.linkedItem && (

              <button
                type="button"
                className="thread-linked-item"
              >

                <IoAttachOutline />


                <div>

                  <span>
                    CONTEÚDO VINCULADO
                  </span>


                  <strong>
                    {
                      post.linkedItem.title
                    }
                  </strong>


                  {post.linkedItem.type && (

                    <small>
                      {
                        post.linkedItem.type
                      }
                    </small>

                  )}

                </div>


                <IoOpenOutline />

              </button>

            )}

          </article>


          {/* =================================================
              DIVISOR
          ================================================= */}

          <div className="thread-divider">

            <span>
              DISCUSSÃO
            </span>


            <strong>
              {
                post.comments?.length ||
                0
              }
            </strong>

          </div>


          {/* =================================================
              COMENTÁRIOS
          ================================================= */}

          <div className="thread-drawer-comments">

            {post.comments?.length > 0 ? (

              post.comments.map(
                (comment) => (

                  <article
                    className="workspace-comment"
                    key={comment.id}
                  >

                    {/* AVATAR */}

                    <div className="comment-avatar">

                      {
                        comment.initials ||
                        "?"
                      }

                    </div>


                    {/* CONTEÚDO */}

                    <div className="comment-content">

                      <div className="comment-header">

                        <strong>
                          {
                            comment.author ||
                            "Usuário"
                          }
                        </strong>


                        <span>
                          {
                            comment.time ||
                            "Agora"
                          }
                        </span>

                      </div>


                      <p>
                        {
                          comment.content
                        }
                      </p>

                    </div>

                  </article>

                )
              )

            ) : (

              /* =============================================
                 SEM COMENTÁRIOS
              ============================================== */

              <div className="thread-empty">

                <IoCheckmarkDoneOutline />


                <strong>
                  Nenhum comentário ainda
                </strong>


                <span>
                  Seja a primeira pessoa a
                  participar dessa discussão.
                </span>

              </div>

            )}

          </div>

        </div>


        {/* ===================================================
            FORMULÁRIO
        ==================================================== */}

        <form
          className="thread-drawer-form"
          onSubmit={handleSubmit}
        >

          <div className="comment-avatar">

            {
              post.author?.initials ||
              "?"
            }

          </div>


          <div>

            <textarea
              name="comment"
              placeholder="Escreva uma resposta..."
              rows="1"
              autoComplete="off"
            />


            <button
              type="submit"
              aria-label="Enviar comentário"
            >
              <IoSend />
            </button>

          </div>

        </form>

      </section>

    </>
  );
}