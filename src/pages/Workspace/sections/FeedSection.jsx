import {
  FiFilter,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

import PostCard from "../components/PostCard";

export default function FeedSection({
  posts,
  postTypes,

  search,
  onSearchChange,

  selectedType,
  onTypeChange,

  onLike,
  onComment,

  newPostOpen,
  onOpenNewPost,

  newPost,
  onNewPostChange,
  onCreatePost,
  onCancelPost,
}) {
  return (
    <section className="workspace-feed-layout">
      <div className="workspace-feed-main">
        <div className="feed-toolbar">
          <div className="feed-search">
            <FiSearch />

            <input
              type="text"
              value={search}
              placeholder="Buscar no workspace..."
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
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
            ).map(([key, value]) => (
              <option
                value={key}
                key={key}
              >
                {value.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="workspace-create-button"
            onClick={onOpenNewPost}
          >
            <FiPlus />

            NOVA PUBLICAÇÃO
          </button>
        </div>

        {newPostOpen && (
          <div className="create-post-card">
            <div className="create-post-header">
              <div>
                <span>
                  NOVA PUBLICAÇÃO
                </span>

                <h2>
                  Compartilhe com a equipe
                </h2>
              </div>
            </div>

            <div className="create-post-form">
              <label>
                TIPO DA PUBLICAÇÃO
              </label>

              <select
                name="type"
                value={newPost.type}
                onChange={onNewPostChange}
              >
                {Object.entries(
                  postTypes
                ).map(([key, value]) => (
                  <option
                    value={key}
                    key={key}
                  >
                    {value.label}
                  </option>
                ))}
              </select>

              <label>
                CONTEÚDO
              </label>

              <textarea
                name="content"
                value={newPost.content}
                placeholder="Compartilhe uma atualização, insight ou decisão..."
                onChange={onNewPostChange}
              />

              <label>
                TAGS
              </label>

              <input
                name="tags"
                type="text"
                value={newPost.tags}
                placeholder="Territory, Compass, Motorização..."
                onChange={onNewPostChange}
              />

              <span className="create-post-helper">
                Separe as tags por vírgulas.
              </span>

              <div className="create-post-actions">
                <button
                  type="button"
                  className="workspace-secondary-button"
                  onClick={onCancelPost}
                >
                  CANCELAR
                </button>

                <button
                  type="button"
                  className="workspace-primary-button"
                  onClick={onCreatePost}
                >
                  PUBLICAR
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="workspace-feed">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              type={postTypes[post.type]}
              onLike={onLike}
              onComment={onComment}
            />
          ))}

          {posts.length === 0 && (
            <div className="workspace-empty-feed">
              <FiFilter />

              <strong>
                Nenhuma publicação encontrada
              </strong>

              <span>
                Tente alterar os filtros ou
                realizar uma nova busca.
              </span>
            </div>
          )}
        </div>
      </div>

      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-card">
          <span className="sidebar-eyebrow">
            WORKSPACE
          </span>

          <h3>
            Inteligência Competitiva
          </h3>

          <p>
            Espaço colaborativo para
            compartilhar análises, decisões
            e informações da equipe.
          </p>
        </div>

        <div className="workspace-sidebar-card">
          <span className="sidebar-eyebrow">
            TIPOS DE PUBLICAÇÃO
          </span>

          <div className="sidebar-post-types">
            {Object.entries(
              postTypes
            ).map(([key, value]) => (
              <button
                type="button"
                key={key}
                onClick={() =>
                  onTypeChange(key)
                }
              >
                <span
                  className={`sidebar-type-dot sidebar-type-${value.className}`}
                />

                {value.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}