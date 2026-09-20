import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ACTIVE_WORKSPACE_STORAGE_KEY,
  MOCK_WORKSPACES,
  WORKSPACE_STORAGE_KEY,
} from "../data";


/* =========================================================
   STORAGE
========================================================= */

function getStoredWorkspaces() {
  try {
    const stored =
      localStorage.getItem(
        WORKSPACE_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch {
    return [];
  }
}


function saveWorkspaces(
  workspaces
) {
  localStorage.setItem(
    WORKSPACE_STORAGE_KEY,
    JSON.stringify(
      workspaces
    )
  );
}


/* =========================================================
   HOOK
========================================================= */

export default function useWorkspaceAccess() {
  const navigate =
    useNavigate();


  const [
    workspaces,
    setWorkspaces,
  ] = useState(
    () => getStoredWorkspaces()
  );


  const [
    activeMode,
    setActiveMode,
  ] = useState(null);


  /*
   * Dentro de "Entrar em Workspace":
   *
   * mine = meus workspaces
   * code = usar código
   */
  const [
    joinView,
    setJoinView,
  ] = useState(
    workspaces.length > 0
      ? "mine"
      : "code"
  );


  const [
    workspaceSearch,
    setWorkspaceSearch,
  ] = useState("");


  const [
    createForm,
    setCreateForm,
  ] = useState({
    name: "",
    description: "",
  });


  const [
    inviteCode,
    setInviteCode,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     FILTRO DOS WORKSPACES
  ======================================================= */

  const filteredWorkspaces =
    useMemo(() => {
      const term =
        workspaceSearch
          .trim()
          .toLowerCase();


      if (!term) {
        return workspaces;
      }


      return workspaces.filter(
        (workspace) => {
          const searchable = [
            workspace.name,
            workspace.description,
            workspace.owner,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return searchable.includes(
            term
          );
        }
      );

    }, [
      workspaceSearch,
      workspaces,
    ]);


  /* =======================================================
     ABRIR WORKSPACE
  ======================================================= */

  function openWorkspace(
    workspace
  ) {
    if (!workspace?.id) {
      return;
    }


    localStorage.setItem(
      ACTIVE_WORKSPACE_STORAGE_KEY,
      workspace.id
    );


    navigate(
      `/workspace/${workspace.id}`
    );
  }


  /* =======================================================
     CRIAR
  ======================================================= */

  function openCreate() {
    setError("");

    setCreateForm({
      name: "",
      description: "",
    });

    setActiveMode(
      "create"
    );
  }


  /* =======================================================
     ENTRAR
  ======================================================= */

  function openJoin() {
    setError("");
    setInviteCode("");
    setWorkspaceSearch("");

    /*
     * Se ele já participa de algum,
     * abre diretamente "Meus Workspaces".
     *
     * Caso contrário abre "Usar código".
     */
    setJoinView(
      workspaces.length > 0
        ? "mine"
        : "code"
    );

    setActiveMode(
      "join"
    );
  }


  /* =======================================================
     ALTERAR ABA DA ENTRADA
  ======================================================= */

  function changeJoinView(
    view
  ) {
    setError("");

    setJoinView(
      view
    );
  }


  /* =======================================================
     FECHAR
  ======================================================= */

  function closeMode() {
    setError("");

    setInviteCode("");

    setWorkspaceSearch("");

    setCreateForm({
      name: "",
      description: "",
    });

    setActiveMode(null);
  }


  /* =======================================================
     FORM CRIAÇÃO
  ======================================================= */

  function handleCreateChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;


    setCreateForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );


    setError("");
  }


  /* =======================================================
     BUSCA DOS WORKSPACES
  ======================================================= */

  function handleWorkspaceSearch(
    event
  ) {
    setWorkspaceSearch(
      event.target.value
    );
  }


  /* =======================================================
     CÓDIGO
  ======================================================= */

  function handleInviteCodeChange(
    event
  ) {
    setInviteCode(
      event.target.value
        .toUpperCase()
    );


    setError("");
  }


  /* =======================================================
     CRIAR WORKSPACE
  ======================================================= */

  function createWorkspace(
    event
  ) {
    event.preventDefault();


    const name =
      createForm.name.trim();


    const description =
      createForm
        .description
        .trim();


    if (
      name.length < 3
    ) {
      setError(
        "Digite um nome com pelo menos 3 caracteres."
      );

      return;
    }


    const workspaceId =
      `ws-${Date.now()}`;


    const generatedInviteCode =
      `BCI-${name
        .replace(
          /[^a-zA-Z0-9]/g,
          ""
        )
        .slice(0, 5)
        .toUpperCase()}-${String(
          Date.now()
        ).slice(-4)}`;


    const newWorkspace = {
      id: workspaceId,

      name,

      description:
        description ||
        "Workspace colaborativo do BCI.",

      members: 1,

      inviteCode:
        generatedInviteCode,

      owner: "Você",

      role: "owner",
    };


    const updatedWorkspaces = [
      ...workspaces,
      newWorkspace,
    ];


    saveWorkspaces(
      updatedWorkspaces
    );


    setWorkspaces(
      updatedWorkspaces
    );


    openWorkspace(
      newWorkspace
    );
  }


  /* =======================================================
     ENTRAR COM CÓDIGO
  ======================================================= */

  function joinWorkspace(
    event
  ) {
    event.preventDefault();


    const normalizedCode =
      inviteCode
        .trim()
        .toUpperCase();


    if (!normalizedCode) {
      setError(
        "Digite o código de convite."
      );

      return;
    }


    /*
     * Enquanto essa área estiver mockada,
     * os códigos disponíveis para entrada
     * vêm de MOCK_WORKSPACES.
     */
    const workspace =
      MOCK_WORKSPACES.find(
        (item) =>
          item.inviteCode
            ?.toUpperCase() ===
          normalizedCode
      );


    if (!workspace) {
      setError(
        "Código de convite inválido."
      );

      return;
    }


    /*
     * Verifica se já participa.
     */
    const existingWorkspace =
      workspaces.find(
        (item) =>
          String(item.id) ===
          String(workspace.id)
      );


    /*
     * Se já participa, só abre.
     */
    if (
      existingWorkspace
    ) {
      openWorkspace(
        existingWorkspace
      );

      return;
    }


    /*
     * Primeiro acesso.
     */
    const joinedWorkspace = {
      ...workspace,

      role: "member",
    };


    const updatedWorkspaces = [
      ...workspaces,
      joinedWorkspace,
    ];


    saveWorkspaces(
      updatedWorkspaces
    );


    setWorkspaces(
      updatedWorkspaces
    );


    openWorkspace(
      joinedWorkspace
    );
  }


  return {
    workspaces,

    filteredWorkspaces,

    activeMode,

    joinView,

    workspaceSearch,

    createForm,

    inviteCode,

    error,

    openWorkspace,

    openCreate,

    openJoin,

    changeJoinView,

    closeMode,

    handleCreateChange,

    handleWorkspaceSearch,

    handleInviteCodeChange,

    createWorkspace,

    joinWorkspace,
  };
}