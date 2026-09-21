import { useEffect, useMemo, useState } from "react";
import {
  listarPosts, criarPost, comentar, toggleCurtida, togglePin,
  atualizarStatus, excluirPost,listarConteudosVinculaveis,
} from "@/services/workspaceService";

import { ListarMembros } from "@/services/equipeService";

export const postTypes = {
  update: { label: "Atualização", className: "update" },
  insight: { label: "Insight", className: "insight" },
  review: { label: "Dado para revisão", className: "review" },
  decision: { label: "Decisão", className: "decision" },
  comparison: { label: "Comparação", className: "comparison" },
};

export const linkedContentTypes = {
  research: { label: "Pesquisa competitiva" },
  comparison: { label: "Comparação" },
  aiAnalysis: { label: "Análise da IA" },
  vehicle: { label: "Veículo / Modelo" },
};

const initialNewPost = { type: "update", content: "", tags: "", responsible: "", status: "", linkedType: "", linkedItemId: "", linkedItemTitle: "" };

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")) || null; } catch { return null; }
}
function getCurrentWorspace() {

  try { return localStorage.getItem("bci_active_workspace") || null; } catch { return null; }
}

export default function useWorkspace() {
  const currentUser = getCurrentUser();
  const currentWorkspace = getCurrentWorspace();

  const currentUserId = currentUser?.id;
  

  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("feed");
  const [myActivitiesView, setMyActivitiesView] = useState("assigned");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [newPostOpen, setNewPostOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState(initialNewPost);
  const [linkedOptions, setLinkedOptions] = useState([]);

  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setError("");
      try {

        const [postsResult, membrosResult] = await Promise.all([listarPosts(currentWorkspace), ListarMembros(currentWorkspace)]);
        setPosts(postsResult);
        setMembers(membrosResult);
      } catch (err) {
        setError(err.message || "Não foi possível carregar o workspace.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [currentWorkspace]);

  useEffect(() => {
    if (!newPost.linkedType) { setLinkedOptions([]); return; }
    listarConteudosVinculaveis(newPost.linkedType).then(setLinkedOptions).catch(() => setLinkedOptions([]));
  }, [newPost.linkedType]);

  const myPosts = useMemo(() => posts.filter((p) => p.author.name === currentUser?.nomeExibicao), [posts, currentUser]);
  const assignedPosts = useMemo(() => posts.filter((p) => p.responsibleUserId === currentUserId), [posts, currentUserId]);

  const availableLinkedContents = useMemo(
    () => linkedOptions.map((o) => ({ id: o.id, title: o.title })),
    [linkedOptions]
  );

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesType = selectedType === "all" || post.type === selectedType;
      const searchable = [post.author?.name, post.content, post.responsible, ...(post.tags || []), post.linkedItem?.title].filter(Boolean).join(" ").toLowerCase();
      return matchesType && (!term || searchable.includes(term));
    });
  }, [posts, search, selectedType]);

  const selectedPost = useMemo(() => posts.find((p) => p.id === selectedPostId) || null, [posts, selectedPostId]);

  const summary = useMemo(() => ({
    posts: posts.length,
    insights: posts.filter((p) => p.type === "insight").length,
    reviews: posts.filter((p) => p.type === "review" && p.status !== "resolved").length,
    decisions: posts.filter((p) => p.type === "decision").length,
  }), [posts]);

  async function toggleLike(postId) {
    setPosts((current) => current.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    try {
      const resultado = await toggleCurtida(postId);
      setPosts((current) => current.map((p) => p.id === postId ? { ...p, likes: resultado.totalCurtidas } : p));
    } catch (err) {
      setError(err.message || "Não foi possível curtir.");
    }
  }

  async function addComment(postId, content) {
    if (!content?.trim()) return;
    try {
      const novoComentario = await comentar(postId, content);
      setPosts((current) => current.map((p) => p.id === postId ? { ...p, comments: [...p.comments, novoComentario] } : p));
    } catch (err) {
      setError(err.message || "Não foi possível comentar.");
    }
  }

  function openThread(post) { if (post) setSelectedPostId(post.id); }
  function openThreadById(postId) { if (posts.some((p) => p.id === postId)) setSelectedPostId(postId); }
  function closeThread() { setSelectedPostId(null); }

  async function updatePostStatus(postId, status) {
    setPosts((current) => current.map((p) => p.id === postId ? { ...p, status } : p));
    try { await atualizarStatus(postId, status); }
    catch (err) { setError(err.message || "Não foi possível atualizar o status."); }
  }

  async function togglePinPost(postId) {
    setPosts((current) => current.map((p) => p.id === postId ? { ...p, pinned: !p.pinned } : p));
    try { await togglePin(postId); }
    catch (err) { setError(err.message || "Não foi possível fixar."); }
  }

  async function deletePost(postId) {
    const anterior = posts;
    setPosts((current) => current.filter((p) => p.id !== postId));
    if (selectedPostId === postId) setSelectedPostId(null);
    try { await excluirPost(postId); }
    catch (err) { setPosts(anterior); setError(err.message || "Não foi possível excluir."); }
  }

  function openNewPost(type = "update") {
    setNewPost({ ...initialNewPost, type, status: type === "review" ? "pending" : "" });
    setNewPostOpen(true);
  }

  function handleNewPostChange(event) {
    const { name, value } = event.target;
    if (name === "type") {
      setNewPost((p) => ({ ...p, type: value, responsible: value === "review" ? p.responsible : "", status: value === "review" ? (p.status || "pending") : "" }));
      return;
    }
    if (name === "linkedType") {
      setNewPost((p) => ({ ...p, linkedType: value, linkedItemId: "", linkedItemTitle: "" }));
      return;
    }
    if (name === "linkedItemId") {
      const item = linkedOptions.find((o) => o.id === value);
      setNewPost((p) => ({ ...p, linkedItemId: value, linkedItemTitle: item?.title ?? "" }));
      return;
    }
    setNewPost((p) => ({ ...p, [name]: value }));
  }

  async function createPost() {
    const conteudo = newPost.content.trim();
    if (!conteudo) return;

    try {
      setPosting(true);
      const novoPost = await criarPost(currentWorkspace, {
        type: newPost.type,
        content: conteudo,
        tags: newPost.tags.split(",").map((t) => t.trim()).filter(Boolean),
        responsibleUserId: newPost.responsible,
        status: newPost.status,
        linkedType: newPost.linkedType || null,
        linkedItemId: newPost.linkedItemId || null,
        linkedItemTitle: newPost.linkedType === "research" ? newPost.linkedItemTitle : (linkedOptions.find((o) => o.id === newPost.linkedItemId)?.title ?? null),
      });
      setPosting(false);
      setPosts((current) => [novoPost, ...current]);
      resetNewPost();
    } catch (err) {
      setPosting(false);
      setError(err.message || "Não foi possível publicar.");
    }
  }

  function cancelNewPost() { resetNewPost(); }
  function resetNewPost() { setNewPost(initialNewPost); setNewPostOpen(false); }

  return {
    posts, filteredPosts, postTypes, linkedContents: linkedOptions, availableLinkedContents,
    members, loading, error,
    summary,
    posting,
    activeTab, setActiveTab,
    myActivitiesView, setMyActivitiesView,
    myPosts, assignedPosts,
    search, setSearch,
    selectedType, setSelectedType,
    selectedPost, openThread, openThreadById, closeThread,
    newPost, newPostOpen, openNewPost, handleNewPostChange, createPost, cancelNewPost,
    toggleLike, addComment,
    updatePostStatus,
    togglePin: togglePinPost, deletePost,
  };
}