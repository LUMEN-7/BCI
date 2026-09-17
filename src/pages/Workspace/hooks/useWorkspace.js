import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  initialPosts,
  linkedContents,
  postTypes,
} from "../data";


const initialNewPost = {
  type: "update",

  content: "",

  tags: "",

  responsible: "",

  status: "",

  linkedType: "",

  linkedItemId: "",
};


export default function useWorkspace() {

  // IDs locais não dependem do relógio, evitando colisões em renderizações repetidas.
  const nextPostIdRef = useRef(10000);

  // =========================================================
  // USUÁRIO ATUAL
  // =========================================================

  const currentUserName =
    "Ianny Raquel";


  // =========================================================
  // POSTS
  // =========================================================

  const [
    posts,
    setPosts,
  ] = useState(
    initialPosts
  );


  // =========================================================
  // TAB ATIVA
  // =========================================================

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "feed"
  );


  // =========================================================
  // MINHAS ATIVIDADES
  // =========================================================

  const [
    myActivitiesView,
    setMyActivitiesView,
  ] = useState(
    "assigned"
  );


  // =========================================================
  // BUSCA
  // =========================================================

  const [
    search,
    setSearch,
  ] = useState(
    ""
  );


  // =========================================================
  // FILTRO
  // =========================================================

  const [
    selectedType,
    setSelectedType,
  ] = useState(
    "all"
  );


  // =========================================================
  // NOVA PUBLICAÇÃO
  // =========================================================

  const [
    newPostOpen,
    setNewPostOpen,
  ] = useState(
    false
  );

  const [
    newPost,
    setNewPost,
  ] = useState(
    initialNewPost
  );


  // =========================================================
  // THREAD
  // =========================================================

  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState(
    null
  );


  // =========================================================
  // MINHAS PUBLICAÇÕES
  // =========================================================

  const myPosts =
    useMemo(() => {

      return posts.filter(
        (post) =>
          post.author?.name ===
          currentUserName
      );

    }, [
      posts,
      currentUserName,
    ]);


  // =========================================================
  // ATRIBUÍDOS A MIM
  // =========================================================

  const assignedPosts =
    useMemo(() => {

      return posts.filter(
        (post) =>
          post.responsible ===
          currentUserName
      );

    }, [
      posts,
      currentUserName,
    ]);


  // =========================================================
  // CONTEÚDOS VINCULÁVEIS
  // =========================================================

  const availableLinkedContents =
    useMemo(() => {

      if (
        !newPost.linkedType
      ) {
        return [];
      }

      return linkedContents.filter(
        (item) =>
          item.type ===
          newPost.linkedType
      );

    }, [
      newPost.linkedType,
    ]);


  // =========================================================
  // FILTRAR POSTS
  // =========================================================

  const filteredPosts =
    useMemo(() => {

      const normalizedSearch =
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

          const searchableContent =
            [
              post.author?.name ||
                "",

              post.content ||
                "",

              post.responsible ||
                "",

              ...(post.tags ||
                []),

              post.linkedItem
                ?.title || "",
            ]
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableContent.includes(
              normalizedSearch
            );

          return (
            matchesType &&
            matchesSearch
          );
        }
      );

    }, [
      posts,
      search,
      selectedType,
    ]);


  // =========================================================
  // POST SELECIONADO
  // =========================================================

  const selectedPost =
    useMemo(() => {

      if (
        selectedPostId ===
        null
      ) {
        return null;
      }

      return (
        posts.find(
          (post) =>
            post.id ===
            selectedPostId
        ) || null
      );

    }, [
      posts,
      selectedPostId,
    ]);


  // =========================================================
  // RESUMO
  // =========================================================

  const summary =
    useMemo(() => {

      return {
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
      };

    }, [
      posts,
    ]);


  // =========================================================
  // CURTIR
  // =========================================================

  function toggleLike(
    postId
  ) {

    setPosts(
      (
        previousPosts
      ) =>
        previousPosts.map(
          (post) => {

            if (
              post.id !==
              postId
            ) {
              return post;
            }

            const newLikedState =
              !post.liked;

            return {
              ...post,

              liked:
                newLikedState,

              likes:
                newLikedState
                  ? (
                      post.likes ||
                      0
                    ) + 1
                  : Math.max(
                      (
                        post.likes ||
                        0
                      ) - 1,
                      0
                    ),
            };
          }
        )
    );
  }


  // =========================================================
  // COMENTAR
  // =========================================================

  function addComment(
    postId,
    content
  ) {

    if (
      !content ||
      !content.trim()
    ) {
      return;
    }

    const newComment = {
      id:
        nextPostIdRef.current++,

      author:
        currentUserName,

      initials:
        "IR",

      time:
        "agora",

      content:
        content.trim(),
    };

    setPosts(
      (
        previousPosts
      ) =>
        previousPosts.map(
          (post) => {

            if (
              post.id !==
              postId
            ) {
              return post;
            }

            return {
              ...post,

              comments: [
                ...(post.comments ||
                  []),

                newComment,
              ],
            };
          }
        )
    );
  }


  // =========================================================
  // THREAD
  // =========================================================

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

    const postExists =
      posts.some(
        (post) =>
          post.id === postId
      );

    if (!postExists) {
      return;
    }

    setSelectedPostId(
      postId
    );
  }


  function closeThread() {

    setSelectedPostId(
      null
    );
  }


  // =========================================================
  // STATUS
  // =========================================================

  function updatePostStatus(
    postId,
    status
  ) {

    setPosts(
      (
        previousPosts
      ) =>
        previousPosts.map(
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
  }


  // =========================================================
  // FIXAR
  // =========================================================

  function togglePin(
    postId
  ) {

    setPosts(
      (
        previousPosts
      ) =>
        previousPosts.map(
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
  }


  // =========================================================
  // EXCLUIR
  // =========================================================

  function deletePost(
    postId
  ) {

    setPosts(
      (
        previousPosts
      ) =>
        previousPosts.filter(
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
  }


  // =========================================================
  // ABRIR NOVA PUBLICAÇÃO
  // =========================================================

  function openNewPost(
    type = "update"
  ) {

    setNewPost({
      ...initialNewPost,

      type,

      status:
        type === "review"
          ? "pending"
          : "",
    });

    setNewPostOpen(
      true
    );
  }


  // =========================================================
  // ALTERAR NOVA PUBLICAÇÃO
  // =========================================================

  function handleNewPostChange(
    event
  ) {

    const {
      name,
      value,
    } =
      event.target;


    if (
      name === "type"
    ) {

      setNewPost(
        (previous) => ({
          ...previous,

          type:
            value,

          responsible:
            value === "review"
              ? previous.responsible
              : "",

          status:
            value === "review"
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
      name === "linkedType"
    ) {

      setNewPost(
        (previous) => ({
          ...previous,

          linkedType:
            value,

          linkedItemId:
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


  // =========================================================
  // CRIAR PUBLICAÇÃO
  // =========================================================

  function createPost() {

    const normalizedContent =
      newPost.content
        .trim();

    if (
      !normalizedContent
    ) {
      return;
    }


    const normalizedTags =
      newPost.tags
        .split(",")
        .map(
          (tag) =>
            tag.trim()
        )
        .filter(
          Boolean
        );


    const selectedLinkedItem =
      newPost.linkedItemId
        ? linkedContents.find(
            (item) =>
              item.id ===
              newPost.linkedItemId
          ) || null
        : null;


    const post = {

      id:
        nextPostIdRef.current++,

      type:
        newPost.type,

      author: {
        name:
          currentUserName,

        initials:
          "IR",
      },

      createdAt:
        "agora",

      content:
        normalizedContent,

      tags:
        normalizedTags,

      responsible:
        newPost.type ===
          "review" &&
        newPost.responsible
          ? newPost.responsible
          : null,

      status:
        newPost.type ===
          "review"
          ? (
              newPost.status ||
              "pending"
            )
          : null,

      linkedItem:
        selectedLinkedItem
          ? {
              ...selectedLinkedItem,
            }
          : null,

      pinned:
        false,

      liked:
        false,

      likes:
        0,

      comments:
        [],
    };


    setPosts(
      (
        previousPosts
      ) => [
        post,
        ...previousPosts,
      ]
    );


    resetNewPost();
  }


  // =========================================================
  // CANCELAR / RESETAR
  // =========================================================

  function cancelNewPost() {

    resetNewPost();
  }


  function resetNewPost() {

    setNewPost(
      initialNewPost
    );

    setNewPostOpen(
      false
    );
  }


  // =========================================================
  // RETURN
  // =========================================================

  return {

    posts,
    filteredPosts,
    postTypes,

    linkedContents,
    availableLinkedContents,


    summary,


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


    togglePin,
    deletePost,
  };
}
