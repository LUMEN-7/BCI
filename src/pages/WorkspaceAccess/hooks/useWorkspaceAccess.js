import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMinhasEquipes, criarEquipe, entrarComCodigo } from "@/services/equipeService";
import { ACTIVE_WORKSPACE_STORAGE_KEY } from "../data";

export default function useWorkspaceAccess() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState(null);
  const [joinView, setJoinView] = useState("code");
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const lista = await listarMinhasEquipes();
        setWorkspaces(lista);
        setJoinView(lista.length > 0 ? "mine" : "code");
      } catch (err) {
        setError(err.message || "Não foi possível carregar seus workspaces.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const filteredWorkspaces = useMemo(() => {
    const term = workspaceSearch.trim().toLowerCase();
    if (!term) return workspaces;
    return workspaces.filter((w) => [w.name, w.description].filter(Boolean).join(" ").toLowerCase().includes(term));
  }, [workspaceSearch, workspaces]);

  function openWorkspace(workspace) {
    if (!workspace?.id) return;
    localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspace.id);
    navigate(`/workspace/${workspace.id}`);
  }

  function openCreate() { setError(""); setCreateForm({ name: "", description: "" }); setActiveMode("create"); }
  function openJoin() {
    setError(""); setInviteCode(""); setWorkspaceSearch("");
    setJoinView(workspaces.length > 0 ? "mine" : "code");
    setActiveMode("join");
  }
  function changeJoinView(view) { setError(""); setJoinView(view); }
  function closeMode() {
    setError(""); setInviteCode(""); setWorkspaceSearch("");
    setCreateForm({ name: "", description: "" }); setActiveMode(null);
  }
  function handleCreateChange(event) {
    const { name, value } = event.target;
    setCreateForm((current) => ({ ...current, [name]: value }));
    setError("");
  }
  function handleWorkspaceSearch(event) { setWorkspaceSearch(event.target.value); }
  function handleInviteCodeChange(event) { setInviteCode(event.target.value.toUpperCase()); setError(""); }

  async function createWorkspace(event) {
    event.preventDefault();
    const name = createForm.name.trim();
    if (name.length < 3) { setError("Digite um nome com pelo menos 3 caracteres."); return; }

    setSubmitting(true);
    try {
      const novo = await criarEquipe(name, createForm.description.trim() || null);
      setWorkspaces((current) => [...current, novo]);
      openWorkspace(novo);
    } catch (err) {
      setError(err.message || "Não foi possível criar o workspace.");
    } finally {
      setSubmitting(false);
    }
  }

  async function joinWorkspace(event) {
    event.preventDefault();
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!normalizedCode) { setError("Digite o código de convite."); return; }

    setSubmitting(true);
    try {
      const workspace = await entrarComCodigo(normalizedCode);
      setWorkspaces((current) => current.some((w) => w.id === workspace.id) ? current : [...current, workspace]);
      openWorkspace(workspace);
    } catch (err) {
      setError(err.message || "Código de convite inválido.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    workspaces, filteredWorkspaces, loading, activeMode, joinView, workspaceSearch,
    createForm, inviteCode, error, submitting,
    openWorkspace, openCreate, openJoin, changeJoinView, closeMode,
    handleCreateChange, handleWorkspaceSearch, handleInviteCodeChange,
    createWorkspace, joinWorkspace,
  };
}