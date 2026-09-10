import {
  useMemo,
  useState,
} from "react";

import {
  initialPosts,
  postTypes,
} from "../data";

export default function useWorkspace() {

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
  ] = useState({
    type: "update",
    content: "",
    tags: "",
  });


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
              post.author
                ?.name || "",

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
  // CURTIR / DESCURTIR
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

            const
              newLikedState =
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
  // ADICIONAR COMENTÁRIO
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
        Date.now(),

      author:
        "Ianny Raquel",

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
  // ABRIR THREAD
  // =========================================================

  function openThread(
    post
  ) {

    if (
      !post
    ) {
      return;
    }

    setSelectedPostId(
      post.id
    );
  }


  // =========================================================
  // FECHAR THREAD
  // =========================================================

  function closeThread() {

    setSelectedPostId(
      null
    );
  }


  // =========================================================
  // ALTERAR STATUS
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
  // FIXAR / DESAFIXAR
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
  // EXCLUIR PUBLICAÇÃO
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
      type:
        type,

      content:
        "",

      tags:
        "",
    });

    setNewPostOpen(
      true
    );
  }


  // =========================================================
  // ALTERAR DADOS DO FORMULÁRIO
  // =========================================================

  function handleNewPostChange(
    event
  ) {

    const {
      name,
      value,
    } =
      event.target;

    setNewPost(
      (
        previous
      ) => ({
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

    const post = {

      id:
        Date.now(),

      type:
        newPost.type,

      author: {
        name:
          "Ianny Raquel",

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
        null,

      linkedItem:
        null,

      status:
        newPost.type ===
          "review"
          ? "pending"
          : newPost.type ===
            "decision"
            ? "resolved"
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
  // CANCELAR PUBLICAÇÃO
  // =========================================================

  function cancelNewPost() {

    resetNewPost();
  }


  // =========================================================
  // RESETAR FORMULÁRIO
  // =========================================================

  function resetNewPost() {

    setNewPost({
      type:
        "update",

      content:
        "",

      tags:
        "",
    });

    setNewPostOpen(
      false
    );
  }


  // =========================================================
  // RETURN
  // =========================================================

  return {

    // POSTS
    posts,
    filteredPosts,
    postTypes,


    // RESUMO
    summary,


    // TABS
    activeTab,
    setActiveTab,


    // BUSCA
    search,
    setSearch,


    // FILTRO
    selectedType,
    setSelectedType,


    // THREAD
    selectedPost,
    openThread,
    closeThread,


    // PUBLICAÇÃO
    newPost,
    newPostOpen,
    openNewPost,
    handleNewPostChange,
    createPost,
    cancelNewPost,


    // INTERAÇÕES
    toggleLike,
    addComment,


    // STATUS
    updatePostStatus,


    // GERENCIAMENTO
    togglePin,
    deletePost,
  };
}