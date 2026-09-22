import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiActivity,
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiGrid,
  FiKey,
  FiMail,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";

import Navbar from "../../components/Navbar/Navbar";
import PageLoader from "../../components/PageLoader/PageLoader";

import useWorkspace from "./hooks/useWorkspace";

import WorkspaceTabs from "./components/WorkspaceTabs";
import ThreadDrawer from "./components/ThreadDrawer";
import WorkspaceInviteModal from "./components/WorkspaceInviteModal";

import FeedSection from "./sections/FeedSection";
import MyActivitiesSection from "./sections/MyActivitiesSection";

import {
  obterEquipe,
} from "../../services/equipeService";

import {
  ACTIVE_WORKSPACE_STORAGE_KEY,
} from "../WorkspaceAccess/data";

import "./style.css";
import "./workspace-access.css";


/* =========================================================
   WORKSPACE
========================================================= */

export default function Workspace() {
  const navigate =
    useNavigate();


  const {
    workspaceId,
  } = useParams();


  const workspace =
    useWorkspace(
      workspaceId
    );


  /* =========================================================
     STATES
  ========================================================= */

  const [
    copiedInviteCode,
    setCopiedInviteCode,
  ] = useState(false);


  const [
    inviteModalOpen,
    setInviteModalOpen,
  ] = useState(false);


  const [
    currentWorkspace,
    setCurrentWorkspace,
  ] = useState(null);


  const [
    loadingWorkspace,
    setLoadingWorkspace,
  ] = useState(true);


  /* =========================================================
     CARREGAR WORKSPACE
  ========================================================= */

  useEffect(() => {
    if (!workspaceId) {
      setLoadingWorkspace(
        false
      );

      return;
    }


    let isCurrentRequest =
      true;


    setLoadingWorkspace(
      true
    );


    obterEquipe(
      workspaceId
    )
      .then(
        (equipe) => {

          if (
            !isCurrentRequest
          ) {
            return;
          }


          setCurrentWorkspace(
            equipe
          );

        }
      )
      .catch(
        (error) => {

          console.error(
            "Não foi possível carregar o workspace:",
            error
          );


          if (
            !isCurrentRequest
          ) {
            return;
          }


          setCurrentWorkspace(
            null
          );

        }
      )
      .finally(
        () => {

          if (
            isCurrentRequest
          ) {
            setLoadingWorkspace(
              false
            );
          }

        }
      );


    return () => {
      isCurrentRequest =
        false;
    };

  }, [
    workspaceId,
  ]);


  /* =========================================================
     SALVAR WORKSPACE ATIVO
  ========================================================= */

  useEffect(() => {
    if (!workspaceId) {
      return;
    }


    localStorage.setItem(
      ACTIVE_WORKSPACE_STORAGE_KEY,
      workspaceId
    );

  }, [
    workspaceId,
  ]);


  /* =========================================================
     TROCAR WORKSPACE
  ========================================================= */

  function handleChangeWorkspace() {
    navigate(
      "/workspace"
    );
  }


  /* =========================================================
     COPIAR CÓDIGO
  ========================================================= */

  async function handleCopyInviteCode() {
    const inviteCode =
      currentWorkspace
        ?.inviteCode;


    if (!inviteCode) {
      return;
    }


    try {
      await navigator
        .clipboard
        .writeText(
          inviteCode
        );


      setCopiedInviteCode(
        true
      );


      window.setTimeout(
        () => {
          setCopiedInviteCode(
            false
          );
        },
        2000
      );

    } catch (error) {

      console.error(
        "Não foi possível copiar o código:",
        error
      );

    }
  }


  /* =========================================================
     PERMISSÃO
  ========================================================= */

  const canShareInviteCode =
    currentWorkspace
      ?.role ===
    "owner";


  /* =========================================================
     LOADING DA PÁGINA
  ========================================================= */

  if (
    loadingWorkspace
  ) {
    return (
      <PageLoader
        message="workspace"
      />
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      <Navbar />


      <main className="workspace-page">

        <div className="workspace-container">

          {/* =================================================
              CONTEXTO
          ================================================= */}

          <div className="workspace-context-bar">

            <button
              type="button"
              className="workspace-change-button"
              onClick={
                handleChangeWorkspace
              }
            >

              <FiArrowLeft />

              TROCAR WORKSPACE

            </button>


            <div className="workspace-current-area">

              {/* WORKSPACE ATUAL */}

              <div className="workspace-current-info">

                <div className="workspace-current-icon">
                  <FiGrid />
                </div>


                <div>

                  <span>
                    WORKSPACE ATUAL
                  </span>


                  <strong>
                    {
                      currentWorkspace
                        ?.name ||
                      "Workspace BCI"
                    }
                  </strong>

                </div>

              </div>


              {/* CONVITE */}

              {
                canShareInviteCode &&
                currentWorkspace
                  ?.inviteCode && (

                  <div className="workspace-invite">

                    <div className="workspace-invite-icon">
                      <FiKey />
                    </div>


                    <div className="workspace-invite-content">

                      <span>
                        CÓDIGO DE CONVITE
                      </span>


                      <strong>
                        {
                          currentWorkspace
                            .inviteCode
                        }
                      </strong>

                    </div>


                    <div className="workspace-invite-actions">

                      <button
                        type="button"
                        className={
                          `workspace-invite-action ${copiedInviteCode
                            ? "is-copied"
                            : ""
                          }`
                        }
                        onClick={
                          handleCopyInviteCode
                        }
                        title="Copiar código"
                      >

                        {
                          copiedInviteCode
                            ? (
                              <FiCheck />
                            )
                            : (
                              <FiCopy />
                            )
                        }


                        <span>
                          {
                            copiedInviteCode
                              ? "COPIADO"
                              : "COPIAR"
                          }
                        </span>

                      </button>


                      <button
                        type="button"
                        className="workspace-invite-action"
                        onClick={() =>
                          setInviteModalOpen(
                            true
                          )
                        }
                        title="Enviar convite por e-mail"
                      >

                        <FiMail />


                        <span>
                          E-MAIL
                        </span>

                      </button>

                    </div>

                  </div>

                )
              }

            </div>

          </div>


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="workspace-header">

            <div className="workspace-header-content">

              <span className="workspace-eyebrow">
                CENTRAL DA EQUIPE
              </span>


              <h1>
                {
                  currentWorkspace
                    ?.name ||
                  "WORKSPACE"
                }
              </h1>


              <p>
                {
                  currentWorkspace
                    ?.description ||
                  "Compartilhe análises, registre decisões e acompanhe as atividades da equipe em um único ambiente colaborativo."
                }
              </p>

            </div>


            {/* ESTATÍSTICAS */}

            <div className="workspace-header-stats">

              <div>

                <FiMessageSquare />


                <strong>
                  {
                    workspace
                      .summary
                      .posts
                  }
                </strong>


                <span>
                  Publicações
                </span>

              </div>


              <div>

                <FiActivity />


                <strong>
                  {
                    workspace
                      .summary
                      .insights
                  }
                </strong>


                <span>
                  Insights
                </span>

              </div>


              <div>

                <FiUsers />


                <strong>
                  {
                    workspace
                      .members
                      .length ||
                    1
                  }
                </strong>


                <span>
                  Membros
                </span>

              </div>

            </div>

          </header>


          {/* =================================================
              TABS
          ================================================= */}

          <WorkspaceTabs
            activeTab={
              workspace.activeTab
            }
            onChange={
              workspace.setActiveTab
            }
          />


          {/* =================================================
              FEED
          ================================================= */}

          {
            workspace.activeTab ===
            "feed" && (

              <FeedSection
                loading={
                  workspace.loading
                }

                posts={
                  workspace.filteredPosts
                }

                postTypes={
                  workspace.postTypes
                }

                members={
                  workspace.members
                }

                activities={
                  workspace.activities
                }

                search={
                  workspace.search
                }

                onSearchChange={
                  workspace.setSearch
                }

                selectedType={
                  workspace.selectedType
                }

                onTypeChange={
                  workspace.setSelectedType
                }

                onLike={
                  workspace.toggleLike
                }

                onTogglePin={
                  workspace.togglePin
                }

                onDelete={
                  workspace.deletePost
                }

                selectedPost={
                  workspace.selectedPost
                }

                onOpenThread={
                  workspace.openThread
                }

                onActivityClick={
                  workspace.openThreadById
                }

                onCloseThread={
                  workspace.closeThread
                }

                onComment={
                  workspace.addComment
                }

                onStatusChange={
                  workspace.updatePostStatus
                }

                posting={
                  workspace.posting
                }

                newPostOpen={
                  workspace.newPostOpen
                }

                onOpenNewPost={
                  workspace.openNewPost
                }

                newPost={
                  workspace.newPost
                }

                onNewPostChange={
                  workspace
                    .handleNewPostChange
                }

                availableLinkedContents={
                  workspace
                    .availableLinkedContents
                }

                onCreatePost={
                  workspace.createPost
                }

                onCancelPost={
                  workspace.cancelNewPost
                }
              />

            )
          }


          {/* =================================================
              MINHAS ATIVIDADES
          ================================================= */}

          {
            workspace.activeTab ===
            "my-activity" && (

              <MyActivitiesSection
                assignedPosts={
                  workspace
                    .assignedPosts
                }

                myPosts={
                  workspace
                    .myPosts
                }

                postTypes={
                  workspace
                    .postTypes
                }

                activeView={
                  workspace
                    .myActivitiesView
                }

                onViewChange={
                  workspace
                    .setMyActivitiesView
                }

                onLike={
                  workspace
                    .toggleLike
                }

                onOpenThread={
                  workspace
                    .openThread
                }

                onTogglePin={
                  workspace
                    .togglePin
                }

                onDelete={
                  workspace
                    .deletePost
                }
              />

            )
          }

        </div>

      </main>


      {/* =====================================================
          THREAD — MINHAS ATIVIDADES
      ====================================================== */}

      {
        workspace.activeTab ===
        "my-activity" &&
        workspace.selectedPost && (

          <ThreadDrawer
            post={
              workspace
                .selectedPost
            }

            type={
              workspace
                .postTypes[
              workspace
                .selectedPost
                .type
              ]
            }

            onClose={
              workspace
                .closeThread
            }

            onComment={
              workspace
                .addComment
            }

            onStatusChange={
              workspace
                .updatePostStatus
            }
          />

        )
      }


      {/* =====================================================
          MODAL DE CONVITE
      ====================================================== */}

      {
        inviteModalOpen &&
        currentWorkspace && (

          <WorkspaceInviteModal
            workspace={
              currentWorkspace
            }

            onClose={() =>
              setInviteModalOpen(
                false
              )
            }
          />

        )
      }

    </>
  );
}