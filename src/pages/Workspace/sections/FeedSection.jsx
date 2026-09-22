import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiSearch,
} from "react-icons/fi";

import SectionLoader from "@/components/SectionLoader/index.jsx";

import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import ThreadDrawer from "../components/ThreadDrawer";
import ActivitySidebar from "../components/ActivitySidebar";

import {
  linkedContentTypes,
} from "../data";


/* =========================================================
   CONFIG
========================================================= */

const POSTS_PER_PAGE =
  6;


/* =========================================================
   FEED
========================================================= */

export default function FeedSection({
  loading,

  posts,
  postTypes,
  posting,
  members,
  activities,

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
  /* =========================================================
     PAGINAÇÃO VISUAL
  ========================================================= */

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(
    POSTS_PER_PAGE
  );


  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);


  const loadMoreRef =
    useRef(null);


  const loadingMoreRef =
    useRef(false);


  const timerRef =
    useRef(null);


  const temAtribuicao =
    newPost.type ===
    "review";


  /* =========================================================
     POSTS VISÍVEIS
  ========================================================= */

  const visiblePosts =
    posts.slice(
      0,
      visibleCount
    );


  const hasMorePosts =
    visibleCount <
    posts.length;


  /* =========================================================
     RESET AO FILTRAR
  ========================================================= */

  useEffect(() => {
    setVisibleCount(
      POSTS_PER_PAGE
    );


    loadingMoreRef.current =
      false;


    setLoadingMore(
      false
    );

  }, [
    search,
    selectedType,
  ]);


  /* =========================================================
     INFINITE SCROLL
  ========================================================= */

  useEffect(() => {
    const element =
      loadMoreRef.current;


    if (
      loading ||
      !element ||
      !hasMorePosts
    ) {
      return undefined;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {
          const [
            entry,
          ] = entries;


          if (
            !entry.isIntersecting ||
            loadingMoreRef.current
          ) {
            return;
          }


          loadingMoreRef.current =
            true;


          setLoadingMore(
            true
          );


          timerRef.current =
            window.setTimeout(
              () => {

                setVisibleCount(
                  (current) =>
                    Math.min(
                      current +
                      POSTS_PER_PAGE,

                      posts.length
                    )
                );


                loadingMoreRef.current =
                  false;


                setLoadingMore(
                  false
                );

              },
              450
            );
        },
        {
          root:
            null,

          rootMargin:
            "250px 0px",

          threshold:
            0.01,
        }
      );


    observer.observe(
      element
    );


    return () => {
      observer.disconnect();


      if (
        timerRef.current
      ) {
        window.clearTimeout(
          timerRef.current
        );


        timerRef.current =
          null;
      }
    };

  }, [
    loading,
    hasMorePosts,
    posts.length,
  ]);


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      <div className="workspace-feed-layout">

        {/* =====================================================
            MAIN
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

                {/* TIPO */}

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
                        key={
                          key
                        }
                        value={
                          key
                        }
                      >
                        {
                          type.label
                        }
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


                {/* RESPONSÁVEL */}

                {temAtribuicao && (

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


                      {members.map(
                        (member) => (

                          <option
                            key={
                              member.id
                            }
                            value={
                              member.id
                            }
                          >
                            {
                              member.name
                            }
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


                {/* CONTEÚDO VINCULADO */}

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
                        key={
                          key
                        }
                        value={
                          key
                        }
                      >
                        {
                          item.label
                        }
                      </option>

                    )
                  )}

                </select>


                {newPost.linkedType && (

                  <>

                    <label htmlFor="linked-item">
                      SELECIONAR CONTEÚDO
                    </label>


                    {
                      newPost.linkedType ===
                        "research"
                        ? (

                          <input
                            id="linked-item"
                            name="linkedItemTitle"
                            type="text"
                            value={
                              newPost
                                .linkedItemTitle
                            }
                            onChange={
                              onNewPostChange
                            }
                            placeholder="Título da pesquisa"
                          />

                        )
                        : (

                          <select
                            id="linked-item"
                            name="linkedItemId"
                            value={
                              newPost
                                .linkedItemId
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
                                  {
                                    item.title
                                  }
                                </option>

                              )
                            )}

                          </select>

                        )
                    }

                  </>

                )}


                {/* AÇÕES */}

                <div className="create-post-actions">

                  <button
                    type="button"
                    className="workspace-secondary-button"
                    onClick={
                      onCancelPost
                    }
                    disabled={
                      posting
                    }
                  >
                    CANCELAR
                  </button>


                  <button
                    type="button"
                    className="workspace-primary-button"
                    disabled={
                      posting
                    }
                    onClick={() => {
                      if (
                        !posting
                      ) {
                        onCreatePost();
                      }
                    }}
                  >
                    {
                      posting
                        ? "PUBLICANDO..."
                        : "PUBLICAR"
                    }
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
                      event
                        .target
                        .value
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
                    event
                      .target
                      .value
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
                    key={
                      key
                    }
                    value={
                      key
                    }
                  >
                    {
                      type.label
                    }
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

            {loading ? (

              /* ===============================================
                 MESMO LOADING DAS OUTRAS SEÇÕES
              ================================================ */

              <SectionLoader
                message="Carregando publicações"
              />

            ) : posts.length > 0 ? (

              <>

                {/* POSTS */}

                {visiblePosts.map(
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
                )}


                {/* =============================================
                    INFINITE SCROLL
                ============================================== */}

                {hasMorePosts && (

                  <div
                    ref={
                      loadMoreRef
                    }
                  >

                    {loadingMore ? (

                      <SectionLoader
                        message="Carregando mais publicações"
                        compact
                      />

                    ) : (

                      <SectionLoader
                        message="Carregando mais publicações"
                        compact
                      />

                    )}

                  </div>

                )}


                {/* FIM */}

                {!hasMorePosts &&
                  posts.length >
                  POSTS_PER_PAGE && (

                    <div className="workspace-feed-end">

                      <span>
                        Você chegou ao fim das publicações.
                      </span>

                    </div>

                  )}

              </>

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
            activities
          }
          members={
            members
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