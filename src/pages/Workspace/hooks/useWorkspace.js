import { useMemo, useState } from "react";

import {
  initialPosts,
  postTypes,
} from "../data";

export default function useWorkspace() {
  const [posts, setPosts] = useState(initialPosts);

  const [activeTab, setActiveTab] = useState("feed");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [newPostOpen, setNewPostOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    type: "update",
    content: "",
    tags: "",
  });

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return posts.filter((post) => {
      const matchesType =
        selectedType === "all" ||
        post.type === selectedType;

      const searchableContent = [
        post.author.name,
        post.content,
        ...post.tags,
        post.linkedItem?.title || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableContent.includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }, [posts, search, selectedType]);

  const summary = useMemo(() => {
    return {
      posts: posts.length,

      insights: posts.filter(
        (post) => post.type === "insight"
      ).length,

      reviews: posts.filter(
        (post) => post.type === "review"
      ).length,

      decisions: posts.filter(
        (post) => post.type === "decision"
      ).length,
    };
  }, [posts]);

  function toggleLike(postId) {
    setPosts((previous) =>
      previous.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked
            ? post.likes - 1
            : post.likes + 1,
        };
      })
    );
  }

  function addComment(postId, content) {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      return;
    }

    setPosts((previous) =>
      previous.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const comment = {
          id: Date.now(),
          author: "Ianny Raquel",
          initials: "IR",
          time: "agora",
          content: normalizedContent,
        };

        return {
          ...post,
          comments: [
            ...post.comments,
            comment,
          ],
        };
      })
    );
  }

  function handleNewPostChange(event) {
    const { name, value } = event.target;

    setNewPost((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function createPost() {
    if (!newPost.content.trim()) {
      return;
    }

    const tags = newPost.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const post = {
      id: Date.now(),

      type: newPost.type,

      author: {
        name: "Ianny Raquel",
        initials: "IR",
      },

      createdAt: "agora",

      content: newPost.content.trim(),

      tags,

      linkedItem: null,

      likes: 0,
      liked: false,

      comments: [],
    };

    setPosts((previous) => [
      post,
      ...previous,
    ]);

    setNewPost({
      type: "update",
      content: "",
      tags: "",
    });

    setNewPostOpen(false);
  }

  function cancelNewPost() {
    setNewPost({
      type: "update",
      content: "",
      tags: "",
    });

    setNewPostOpen(false);
  }

  return {
    posts,
    filteredPosts,
    postTypes,

    summary,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    selectedType,
    setSelectedType,

    newPost,
    newPostOpen,
    setNewPostOpen,

    toggleLike,
    addComment,

    handleNewPostChange,
    createPost,
    cancelNewPost,
  };
}