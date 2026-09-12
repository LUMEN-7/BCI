import {
  FiSearch,
} from "react-icons/fi";

import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import ThreadDrawer from "../components/ThreadDrawer";
import ActivitySidebar from "../components/ActivitySidebar";

import {
  linkedContentTypes,
  recentActivities,
  workspaceMembers,
} from "../data";


export default function FeedSection({
  posts,
  postTypes,

  search,
  onSearchChange,

  selectedType,
  onTypeChange,

  onLike,

  onTogglePin,
  onDelete,

  selectedPost,
  onOpenThread,
  onActivityClick,
  onCloseThread,

  onComment,
  onStatusChange,

  newPostOpen,
  onOpenNewPost,

  newPost,
  onNewPostChange,

  availableLinkedContents,

  onCreatePost,
  onCancelPost,
}) {

  const isReview =
    newPost.type ===
    "review";


  return (
    <>
      <div className="workspace-feed-layout">

        {/* =====================================================
            CONTEÚDO PRINCIPAL
        ====================================================== */}

        <section className="workspace-feed-main">

          {/* ===================================================
              NOVA PUBLICAÇÃO
          ==================================================== */}

          {newPostOpen && (
            <section className="create-post-card">

              <div className="create-post-header">

                <span>
                  WORKSPACE
                </span>

                <h2>
                  Nova publicação
                </h2>

              </div>


              <div className="create-post-form">

                {/* =================================================
                    TIPO
                ================================================= */}

                <label htmlFor="post-type">
                  TIPO DA PUBLICAÇÃO
                </label>

                <select
                  id="post-type"
                  name="type"
                  value={
                    newPost.type
                  }
                  onChange={
                    onNewPostChange
                  }
                >
                  {Object.entries(
                    postTypes
                  ).map(
                    ([
                      key,
                      type,
                    ]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {type.label}
                      </option>
                    )
                  )}
                </select>


                {/* =================================================
                    CONTEÚDO
                ================================================= */}

                <label htmlFor="post-content">
                  CONTEÚDO
                </label>

                <textarea
                  id="post-content"
                  name="content"
                  value={
                    newPost.content
                  }
                  onChange={
                    onNewPostChange
                  }
                  placeholder="Compartilhe uma atualização, descoberta, análise ou decisão com a equipe..."
                />


                {/* =================================================
                    TAGS
                ================================================= */}

                <label htmlFor="post-tags">
                  TAGS
                </label>

                <input
                  id="post-tags"
                  name="tags"
                  type="text"
                  value={
                    newPost.tags
                  }
                  onChange={
                    onNewPostChange
                  }
                  placeholder="Ex.: Territory, Compass, Tecnologia"
                />

                <span className="create-post-helper">
                  Separe as tags por vírgula.
                </span>


                {/* =================================================
                    CAMPOS DE REVISÃO
                ================================================= */}

                {isReview && (
                  <>
                    <label htmlFor="post-responsible">
                      RESPONSÁVEL
                    </label>

                    <select
                      id="post-responsible"
                      name="responsible"
                      value={
                        newPost.responsible
                      }
                      onChange={
                        onNewPostChange
                      }
                    >
                      <option value="">
                        Selecionar responsável
                      </option>

                      {workspaceMembers.map(
                        (member) => (
                          <option
                            key={
                              member.id
                            }
                            value={
                              member.name
                            }
                          >
                            {member.name}
                          </option>
                        )
                      )}
                    </select>


                    <label htmlFor="post-status">
                      STATUS
                    </label>

                    <select
                      id="post-status"
                      name="status"
                      value={
                        newPost.status ||
                        "pending"
                      }
                      onChange={
                        onNewPostChange
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
                  </>
                )}


                {/* =================================================
                    CONTEÚDO VINCULADO
                ================================================= */}

                <label htmlFor="linked-type">
                  CONTEÚDO VINCULADO
                </label>

                <select
                  id="linked-type"
                  name="linkedType"
                  value={
                    newPost.linkedType
                  }
                  onChange={
                    onNewPostChange
                  }
                >
                  <option value="">
                    Não vincular conteúdo
                  </option>

                  {Object.entries(
                    linkedContentTypes
                  ).map(
                    ([
                      key,
                      item,
                    ]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>


                {newPost.linkedType && (
                  <>
                    <label htmlFor="linked-item">
                      SELECIONAR CONTEÚDO
                    </label>

                    <select
                      id="linked-item"
                      name="linkedItemId"
                      value={
                        newPost.linkedItemId
                      }
                      onChange={
                        onNewPostChange
                      }
                    >
                      <option value="">
                        Selecionar conteúdo
                      </option>

                      {availableLinkedContents.map(
                        (item) => (
                          <option
                            key={
                              item.id
                            }
                            value={
                              item.id
                            }
                          >
                            {item.title}
                          </option>
                        )
                      )}
                    </select>
                  </>
                )}


                {/* =================================================
                    AÇÕES
                ================================================= */}

                <div className="create-post-actions">

                  <button
                    type="button"
                    className="workspace-secondary-button"
                    onClick={
                      onCancelPost
                    }
                  >
                    CANCELAR
                  </button>

                  <button
                    type="button"
                    className="workspace-primary-button"
                    onClick={
                      onCreatePost
                    }
                  >
                    PUBLICAR
                  </button>

                </div>

              </div>
            </section>
          )}


          {/* ===================================================
              TOOLBAR
          ==================================================== */}

          <div className="feed-toolbar">

            <div className="feed-search">

              <FiSearch />

              <input
                type="text"
                value={
                  search
                }
                onChange={
                  (event) =>
                    onSearchChange(
                      event.target.value
                    )
                }
                placeholder="Buscar no Workspace..."
              />

            </div>


            <select
              className="feed-filter"
              value={
                selectedType
              }
              onChange={
                (event) =>
                  onTypeChange(
                    event.target.value
                  )
              }
            >
              <option value="all">
                Todos os tipos
              </option>

              {Object.entries(
                postTypes
              ).map(
                ([
                  key,
                  type,
                ]) => (
                  <option
                    key={key}
                    value={key}
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>


            <PostComposer
              onOpen={
                onOpenNewPost
              }
            />

          </div>


          {/* ===================================================
              FEED
          ==================================================== */}

          <div className="workspace-feed">

            {posts.length > 0 ? (

              posts.map(
                (post) => (
                  <PostCard
                    key={
                      post.id
                    }

                    post={
                      post
                    }

                    type={
                      postTypes[
                        post.type
                      ]
                    }

                    onLike={
                      onLike
                    }

                    onOpenThread={
                      onOpenThread
                    }

                    onTogglePin={
                      onTogglePin
                    }

                    onDelete={
                      onDelete
                    }
                  />
                )
              )

            ) : (

              <div className="workspace-empty-feed">

                <strong>
                  Nenhuma publicação encontrada
                </strong>

                <span>
                  Tente alterar os filtros
                  ou faça uma nova publicação.
                </span>

              </div>
            )}

          </div>
        </section>


        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <ActivitySidebar
          activities={
            recentActivities
          }

          members={
            workspaceMembers
          }

          onActivityClick={
            onActivityClick
          }
        />

      </div>


      {/* =======================================================
          THREAD
      ======================================================== */}

      {selectedPost && (
        <ThreadDrawer
          post={
            selectedPost
          }

          type={
            postTypes[
              selectedPost.type
            ]
          }

          onClose={
            onCloseThread
          }

          onComment={
            onComment
          }

          onStatusChange={
            onStatusChange
          }
        />
      )}
    </>
  );
}