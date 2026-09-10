import {
  FiSearch,
} from "react-icons/fi";

import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import ThreadDrawer from "../components/ThreadDrawer";
import ActivitySidebar from "../components/ActivitySidebar";

import {
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
  onCloseThread,

  onComment,
  onStatusChange,

  newPostOpen,
  onOpenNewPost,

  newPost,
  onNewPostChange,

  onCreatePost,
  onCancelPost,
}) {
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

          <PostComposer
            onOpen={onOpenNewPost}
          />

          {/* ===================================================
              FORMULÁRIO DE NOVA PUBLICAÇÃO
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

                {/* TIPO */}

                <label htmlFor="post-type">
                  TIPO DA PUBLICAÇÃO
                </label>

                <select
                  id="post-type"
                  name="type"
                  value={newPost.type}
                  onChange={onNewPostChange}
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

                {/* CONTEÚDO */}

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

                {/* TAGS */}

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

                {/* BOTÕES */}

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
              BUSCA E FILTRO
          ==================================================== */}

          <div className="feed-toolbar">

            <div className="feed-search">
              <FiSearch />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  onSearchChange(
                    event.target.value
                  )
                }
                placeholder="Buscar no Workspace..."
              />
            </div>

            <select
              className="feed-filter"
              value={selectedType}
              onChange={(event) =>
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
          </div>

          {/* ===================================================
              FEED
          ==================================================== */}

          <div className="workspace-feed">

            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
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
              ))
            ) : (
              <div className="workspace-empty-feed">
                <strong>
                  Nenhuma publicação encontrada
                </strong>

                <span>
                  Tente alterar os filtros
                  ou faça uma nova
                  publicação.
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
        />
      </div>

      {/* =======================================================
          THREAD
      ======================================================== */}

      {selectedPost && (
        <ThreadDrawer
          post={selectedPost}
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