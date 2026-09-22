import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  listarPosts,
  criarPost,
  comentar,
  toggleCurtida,
  togglePin,
  atualizarStatus,
  excluirPost,
  listarConteudosVinculaveis,
  listarAtividades,
} from "@/services/workspaceService";

import {
  ListarMembros,
} from "@/services/equipeService";


export const postTypes = {
  update: {
    label: "Atualização",
    className: "update",
  },

  insight: {
    label: "Insight",
    className: "insight",
  },

  review: {
    label: "Dado para revisão",
    className: "review",
  },

  decision: {
    label: "Decisão",
    className: "decision",
  },

  comparison: {
    label: "Comparação",
    className: "comparison",
  },
};


export const linkedContentTypes = {
  research: {
    label: "Pesquisa competitiva",
  },

  comparison: {
    label: "Comparação",
  },

  aiAnalysis: {
    label: "Análise da IA",
  },

  vehicle: {
    label: "Veículo / Modelo",
  },
};


const initialNewPost = {
  type: "update",
  content: "",
  tags: "",
  responsible: "",
  status: "",
  linkedType: "",
  linkedItemId: "",
  linkedItemTitle: "",
};


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      ) || null
    );
  } catch {
    return null;
  }
}


/* =========================================================
   CURRENT WORKSPACE
========================================================= */

function getCurrentWorkspace() {
  try {
    return (
      localStorage.getItem(
        "bci_active_workspace"
      ) || null
    );
  } catch {
    return null;
  }
}


/* =========================================================
   HOOK
========================================================= */

export default function useWorkspace(
  workspaceId
) {
  const currentUser =
    getCurrentUser();

  const currentWorkspace =
    workspaceId ||
    getCurrentWorkspace();

  const currentUserId =
    currentUser?.id;


  /* =========================================================
     DADOS PRINCIPAIS
  ========================================================= */

  const [
    posts,
    setPosts,
  ] = useState([]);

  const [
    members,
    setMembers,
  ] = useState([]);

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /* =========================================================
     INTERFACE
  ========================================================= */

  const [
    activeTab,
    setActiveTab,
  ] = useState("feed");

  const [
    myActivitiesView,
    setMyActivitiesView,
  ] = useState("assigned");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedType,
    setSelectedType,
  ] = useState("all");


  /* =========================================================
     NOVO POST
  ========================================================= */

  const [
    newPostOpen,
    setNewPostOpen,
  ] = useState(false);

  const [
    posting,
    setPosting,
  ] = useState(false);

  const [
    newPost,
    setNewPost,
  ] = useState(
    initialNewPost
  );

  const [
    linkedOptions,
    setLinkedOptions,
  ] = useState([]);


  /* =========================================================
     THREAD
  ========================================================= */

  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState(null);


  /* =========================================================
     CARREGAR WORKSPACE
  ========================================================= */

  useEffect(() => {
    if (!currentWorkspace) {
      setLoading(false);

      return;
    }


    let isCurrentRequest =
      true;


    async function carregar() {
      setLoading(true);
      setError("");


      try {
        const [
          postsResult,
          membersResult,
          activitiesResult,
        ] = await Promise.all([
          listarPosts(
            currentWorkspace
          ),

          ListarMembros(
            currentWorkspace
          ),

          listarAtividades(
            currentWorkspace
          ),
        ]);


        if (!isCurrentRequest) {
          return;
        }


        setPosts(
          postsResult
        );

        setMembers(
          membersResult
        );

        setActivities(
          activitiesResult
        );

      } catch (err) {

        if (!isCurrentRequest) {
          return;
        }


        setError(
          err.message ||
          "Não foi possível carregar o workspace."
        );

      } finally {

        if (
          isCurrentRequest
        ) {
          setLoading(
            false
          );
        }

      }
    }


    carregar();


    return () => {
      isCurrentRequest =
        false;
    };

  }, [currentWorkspace]);


  /* =========================================================
     CONTEÚDO VINCULÁVEL
  ========================================================= */

  useEffect(() => {
    if (
      !newPost.linkedType
    ) {
      setLinkedOptions([]);

      return;
    }


    listarConteudosVinculaveis(
      newPost.linkedType
    )
      .then(
        setLinkedOptions
      )
      .catch(() => {
        setLinkedOptions([]);
      });

  }, [newPost.linkedType]);


  /* =========================================================
     MINHAS PUBLICAÇÕES
  ========================================================= */

  const myPosts =
    useMemo(
      () =>
        posts.filter(
          (post) =>
            post.author?.name ===
            currentUser?.nomeExibicao
        ),
      [
        posts,
        currentUser?.nomeExibicao,
      ]
    );


  /* =========================================================
     ATRIBUÍDAS A MIM
  ========================================================= */

  const assignedPosts =
    useMemo(
      () =>
        posts.filter(
          (post) =>
            post.responsibleUserId ===
            currentUserId
        ),
      [
        posts,
        currentUserId,
      ]
    );


  /* =========================================================
     CONTEÚDOS DISPONÍVEIS
  ========================================================= */

  const availableLinkedContents =
    useMemo(
      () =>
        linkedOptions.map(
          (item) => ({
            id: item.id,
            title: item.title,
          })
        ),
      [linkedOptions]
    );


  /* =========================================================
     FILTROS
  ========================================================= */

  const filteredPosts =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();


      return posts.filter(
        (post) => {

          const matchesType =
            selectedType ===
            "all" ||
            post.type ===
            selectedType;


          const searchable = [
            post.author?.name,
            post.content,
            post.responsible,
            ...(post.tags || []),
            post.linkedItem?.title,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return (
            matchesType &&
            (
              !term ||
              searchable.includes(
                term
              )
            )
          );
        }
      );

    }, [
      posts,
      search,
      selectedType,
    ]);


  /* =========================================================
     POST SELECIONADO
  ========================================================= */

  const selectedPost =
    useMemo(
      () =>
        posts.find(
          (post) =>
            post.id ===
            selectedPostId
        ) || null,
      [
        posts,
        selectedPostId,
      ]
    );


  /* =========================================================
     RESUMO
  ========================================================= */

  const summary =
    useMemo(
      () => ({
        posts:
          posts.length,

        insights:
          posts.filter(
            (post) =>
              post.type ===
              "insight"
          ).length,

        reviews:
          posts.filter(
            (post) =>
              post.type ===
              "review" &&
              post.status !==
              "resolved"
          ).length,

        decisions:
          posts.filter(
            (post) =>
              post.type ===
              "decision"
          ).length,
      }),
      [posts]
    );


  /* =========================================================
     CURTIR
  ========================================================= */

  async function toggleLike(
    postId
  ) {
    setPosts(
      (current) =>
        current.map(
          (post) =>
            post.id ===
              postId
              ? {
                ...post,

                liked:
                  !post.liked,

                likes:
                  post.liked
                    ? post.likes - 1
                    : post.likes + 1,
              }
              : post
        )
    );


    try {
      const resultado =
        await toggleCurtida(
          postId
        );


      setPosts(
        (current) =>
          current.map(
            (post) =>
              post.id ===
                postId
                ? {
                  ...post,

                  likes:
                    resultado
                      .totalCurtidas,
                }
                : post
          )
      );

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível curtir."
      );

    }
  }


  /* =========================================================
     COMENTAR
  ========================================================= */

  async function addComment(
    postId,
    content
  ) {
    if (
      !content?.trim()
    ) {
      return;
    }


    try {
      const novoComentario =
        await comentar(
          postId,
          content
        );


      setPosts(
        (current) =>
          current.map(
            (post) =>
              post.id ===
                postId
                ? {
                  ...post,

                  comments: [
                    ...(post.comments || []),
                    novoComentario,
                  ],
                }
                : post
          )
      );

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível comentar."
      );

    }
  }


  /* =========================================================
     THREAD
  ========================================================= */

  function openThread(
    post
  ) {
    if (!post) {
      return;
    }

    setSelectedPostId(
      post.id
    );
  }


  function openThreadById(
    postId
  ) {
    if (
      posts.some(
        (post) =>
          post.id ===
          postId
      )
    ) {
      setSelectedPostId(
        postId
      );
    }
  }


  function closeThread() {
    setSelectedPostId(
      null
    );
  }


  /* =========================================================
     STATUS
  ========================================================= */

  async function updatePostStatus(
    postId,
    status
  ) {
    setPosts(
      (current) =>
        current.map(
          (post) =>
            post.id ===
              postId
              ? {
                ...post,
                status,
              }
              : post
        )
    );


    try {
      await atualizarStatus(
        postId,
        status
      );

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível atualizar o status."
      );

    }
  }


  /* =========================================================
     FIXAR
  ========================================================= */

  async function togglePinPost(
    postId
  ) {
    setPosts(
      (current) =>
        current.map(
          (post) =>
            post.id ===
              postId
              ? {
                ...post,
                pinned:
                  !post.pinned,
              }
              : post
        )
    );


    try {
      await togglePin(
        postId
      );

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível fixar."
      );

    }
  }


  /* =========================================================
     EXCLUIR
  ========================================================= */

  async function deletePost(
    postId
  ) {
    const anterior =
      posts;


    setPosts(
      (current) =>
        current.filter(
          (post) =>
            post.id !==
            postId
        )
    );


    if (
      selectedPostId ===
      postId
    ) {
      setSelectedPostId(
        null
      );
    }


    try {
      await excluirPost(
        postId
      );

    } catch (err) {

      setPosts(
        anterior
      );


      setError(
        err.message ||
        "Não foi possível excluir."
      );

    }
  }


  /* =========================================================
     ABRIR NOVO POST
  ========================================================= */

  function openNewPost(
    type = "update"
  ) {
    setNewPost({
      ...initialNewPost,

      type,

      status:
        type === "review" ||
          type === "decision"
          ? "pending"
          : "",
    });


    setNewPostOpen(
      true
    );
  }


  /* =========================================================
     ALTERAÇÃO NOVO POST
  ========================================================= */

  function handleNewPostChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;


    if (
      name === "type"
    ) {
      const temAtribuicao =
        value === "review" ||
        value === "decision";


      setNewPost(
        (previous) => ({
          ...previous,

          type:
            value,

          responsible:
            temAtribuicao
              ? previous.responsible
              : "",

          status:
            temAtribuicao
              ? (
                previous.status ||
                "pending"
              )
              : "",
        })
      );


      return;
    }


    if (
      name ===
      "linkedType"
    ) {
      setNewPost(
        (previous) => ({
          ...previous,

          linkedType:
            value,

          linkedItemId:
            "",

          linkedItemTitle:
            "",
        })
      );


      return;
    }


    if (
      name ===
      "linkedItemId"
    ) {
      const item =
        linkedOptions.find(
          (option) =>
            option.id ===
            value
        );


      setNewPost(
        (previous) => ({
          ...previous,

          linkedItemId:
            value,

          linkedItemTitle:
            item?.title ??
            "",
        })
      );


      return;
    }


    setNewPost(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );
  }


  /* =========================================================
     CRIAR POST
  ========================================================= */

  async function createPost() {
    const conteudo =
      newPost.content.trim();


    if (!conteudo) {
      return;
    }


    try {
      setPosting(
        true
      );


      const novoPost =
        await criarPost(
          currentWorkspace,
          {
            type:
              newPost.type,

            content:
              conteudo,

            tags:
              newPost.tags
                .split(",")
                .map(
                  (tag) =>
                    tag.trim()
                )
                .filter(Boolean),

            responsibleUserId:
              newPost.responsible,

            status:
              newPost.status,

            linkedType:
              newPost.linkedType ||
              null,

            linkedItemId:
              newPost.linkedItemId ||
              null,

            linkedItemTitle:
              newPost.linkedType ===
                "research"
                ? newPost
                  .linkedItemTitle
                : (
                  linkedOptions.find(
                    (option) =>
                      option.id ===
                      newPost
                        .linkedItemId
                  )?.title ??
                  null
                ),
          }
        );


      setPosts(
        (current) => [
          novoPost,
          ...current,
        ]
      );


      resetNewPost();

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível publicar."
      );

    } finally {

      setPosting(
        false
      );

    }
  }


  /* =========================================================
     CANCELAR NOVO POST
  ========================================================= */

  function cancelNewPost() {
    resetNewPost();
  }


  /* =========================================================
     RESET NOVO POST
  ========================================================= */

  function resetNewPost() {
    setNewPost(
      initialNewPost
    );

    setNewPostOpen(
      false
    );
  }


  /* =========================================================
     RETURN
  ========================================================= */

  return {
    posts,

    filteredPosts,

    postTypes,

    linkedContents:
      linkedOptions,

    availableLinkedContents,

    members,

    loading,

    error,

    activities,

    summary,

    posting,

    activeTab,

    setActiveTab,

    myActivitiesView,

    setMyActivitiesView,

    myPosts,

    assignedPosts,

    search,

    setSearch,

    selectedType,

    setSelectedType,

    selectedPost,

    openThread,

    openThreadById,

    closeThread,

    newPost,

    newPostOpen,

    openNewPost,

    handleNewPostChange,

    createPost,

    cancelNewPost,

    toggleLike,

    addComment,

    updatePostStatus,

    togglePin:
      togglePinPost,

    deletePost,
  };
}