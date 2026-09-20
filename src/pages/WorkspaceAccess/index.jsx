import {
  FiArrowLeft,
  FiArrowRight,
  FiGrid,
  FiHash,
  FiLogIn,
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import Navbar from "../../components/Navbar/Navbar";

import useWorkspaceAccess from "./hooks/useWorkspaceAccess";

import "./style.css";


export default function WorkspaceAccess() {
  const workspace =
    useWorkspaceAccess();


  return (
    <>
      <Navbar />


      <main className="workspace-access-page">

        <section className="workspace-access-container">


          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className="workspace-access-header">

            <span className="workspace-access-eyebrow">
              CENTRAL DA EQUIPE
            </span>


            <h1>
              WORKSPACE
            </h1>


            <p>
              Crie um novo ambiente colaborativo ou acesse
              os workspaces dos quais você já participa.
            </p>

          </header>


          {/* =====================================================
              TELA PRINCIPAL
          ====================================================== */}

          {
            !workspace.activeMode && (

              <section className="workspace-access-options">


                {/* ===============================================
                    CRIAR
                =============================================== */}

                <button
                  type="button"
                  className="
                    workspace-access-card
                    workspace-access-card-primary
                  "
                  onClick={
                    workspace.openCreate
                  }
                >

                  <div className="workspace-access-card-icon">
                    <FiPlus />
                  </div>


                  <div className="workspace-access-card-content">

                    <span>
                      NOVO AMBIENTE
                    </span>


                    <h2>
                      Criar um workspace
                    </h2>


                    <p>
                      Crie um espaço para sua equipe organizar
                      análises competitivas, decisões,
                      publicações e atividades.
                    </p>

                  </div>


                  <div className="workspace-access-card-action">

                    <span>
                      CRIAR WORKSPACE
                    </span>


                    <FiArrowRight />

                  </div>

                </button>


                {/* ===============================================
                    ENTRAR
                =============================================== */}

                <button
                  type="button"
                  className="workspace-access-card"
                  onClick={
                    workspace.openJoin
                  }
                >

                  <div className="workspace-access-card-icon">
                    <FiLogIn />
                  </div>


                  <div className="workspace-access-card-content">

                    <span>
                      ACESSAR UMA EQUIPE
                    </span>


                    <h2>
                      Entrar em um workspace
                    </h2>


                    <p>
                      Acesse um workspace do qual você já
                      participa ou utilize um novo código
                      de convite.
                    </p>

                  </div>


                  <div className="workspace-access-card-action">

                    <span>
                      ACESSAR WORKSPACES
                    </span>


                    <FiArrowRight />

                  </div>

                </button>

              </section>

            )
          }


          {/* =====================================================
              CRIAR WORKSPACE
          ====================================================== */}

          {
            workspace.activeMode ===
              "create" && (

              <section className="workspace-access-panel">

                <button
                  type="button"
                  className="workspace-access-back"
                  onClick={
                    workspace.closeMode
                  }
                >
                  <FiArrowLeft />

                  VOLTAR
                </button>


                <div className="workspace-access-panel-heading">

                  <div className="workspace-access-panel-icon">
                    <FiGrid />
                  </div>


                  <div>

                    <span>
                      NOVO WORKSPACE
                    </span>


                    <h2>
                      Crie o ambiente da sua equipe
                    </h2>


                    <p>
                      Você será responsável pelo workspace e
                      poderá convidar outros membros.
                    </p>

                  </div>

                </div>


                <form
                  className="workspace-access-form"
                  onSubmit={
                    workspace.createWorkspace
                  }
                >

                  <label>

                    <span>
                      NOME DO WORKSPACE
                    </span>


                    <input
                      type="text"
                      name="name"
                      value={
                        workspace
                          .createForm
                          .name
                      }
                      onChange={
                        workspace
                          .handleCreateChange
                      }
                      placeholder="Ex.: Equipe de Inteligência Competitiva"
                      autoComplete="off"
                    />

                  </label>


                  <label>

                    <span>
                      DESCRIÇÃO
                    </span>


                    <textarea
                      name="description"
                      value={
                        workspace
                          .createForm
                          .description
                      }
                      onChange={
                        workspace
                          .handleCreateChange
                      }
                      placeholder="Descreva brevemente o objetivo deste workspace..."
                      rows={4}
                    />

                  </label>


                  {
                    workspace.error && (

                      <p className="workspace-access-error">
                        {
                          workspace.error
                        }
                      </p>

                    )
                  }


                  <div className="workspace-access-form-actions">

                    <button
                      type="button"
                      className="workspace-access-secondary-button"
                      onClick={
                        workspace.closeMode
                      }
                    >
                      CANCELAR
                    </button>


                    <button
                      type="submit"
                      className="workspace-access-primary-button"
                    >
                      <FiPlus />

                      CRIAR WORKSPACE
                    </button>

                  </div>

                </form>

              </section>

            )
          }


          {/* =====================================================
              ENTRAR EM WORKSPACE
          ====================================================== */}

          {
            workspace.activeMode ===
              "join" && (

              <section className="workspace-access-panel">

                <button
                  type="button"
                  className="workspace-access-back"
                  onClick={
                    workspace.closeMode
                  }
                >
                  <FiArrowLeft />

                  VOLTAR
                </button>


                {/* ===============================================
                    HEADING
                =============================================== */}

                <div className="workspace-access-panel-heading">

                  <div className="workspace-access-panel-icon">
                    <FiUsers />
                  </div>


                  <div>

                    <span>
                      ACESSAR WORKSPACE
                    </span>


                    <h2>
                      Entre em um workspace
                    </h2>


                    <p>
                      Abra um ambiente do qual você já
                      participa ou utilize um novo código
                      de convite.
                    </p>

                  </div>

                </div>


                {/* ===============================================
                    TABS
                =============================================== */}

                <div className="workspace-entry-tabs">

                  <button
                    type="button"
                    className={
                      `workspace-entry-tab ${
                        workspace.joinView ===
                        "mine"
                          ? "is-active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      workspace.changeJoinView(
                        "mine"
                      )
                    }
                  >
                    <FiGrid />

                    MEUS WORKSPACES

                    {
                      workspace
                        .workspaces
                        .length > 0 && (

                        <span>
                          {
                            workspace
                              .workspaces
                              .length
                          }
                        </span>

                      )
                    }
                  </button>


                  <button
                    type="button"
                    className={
                      `workspace-entry-tab ${
                        workspace.joinView ===
                        "code"
                          ? "is-active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      workspace.changeJoinView(
                        "code"
                      )
                    }
                  >
                    <FiHash />

                    USAR CÓDIGO
                  </button>

                </div>


                {/* ===============================================
                    MEUS WORKSPACES
                =============================================== */}

                {
                  workspace.joinView ===
                    "mine" && (

                    <div className="workspace-mine-area">


                      {/* =========================================
                          SEARCH
                      ========================================= */}

                      {
                        workspace
                          .workspaces
                          .length > 0 && (

                          <div className="workspace-mine-search">

                            <FiSearch />


                            <input
                              type="text"
                              value={
                                workspace
                                  .workspaceSearch
                              }
                              onChange={
                                workspace
                                  .handleWorkspaceSearch
                              }
                              placeholder="Buscar workspace..."
                            />

                          </div>

                        )
                      }


                      {/* =========================================
                          LIST
                      ========================================= */}

                      {
                        workspace
                          .workspaces
                          .length > 0 ? (

                          <>
                            <div className="workspace-mine-list">

                              {
                                workspace
                                  .filteredWorkspaces
                                  .length > 0 ? (

                                  workspace
                                    .filteredWorkspaces
                                    .map(
                                      (item) => (

                                        <article
                                          key={
                                            item.id
                                          }
                                          className="workspace-mine-card"
                                        >

                                          <div className="workspace-mine-card-icon">
                                            <FiGrid />
                                          </div>


                                          <div className="workspace-mine-card-content">

                                            <span>
                                              {
                                                item.role ===
                                                "owner"
                                                  ? "PROPRIETÁRIO"
                                                  : "MEMBRO"
                                              }
                                            </span>


                                            <h3>
                                              {
                                                item.name
                                              }
                                            </h3>


                                            <p>
                                              {
                                                item.description ||
                                                "Workspace colaborativo do BCI."
                                              }
                                            </p>


                                            <div className="workspace-mine-members">

                                              <FiUsers />


                                              <span>
                                                {
                                                  item.members ??
                                                  1
                                                }

                                                {" "}

                                                {
                                                  (
                                                    item.members ??
                                                    1
                                                  ) === 1
                                                    ? "membro"
                                                    : "membros"
                                                }
                                              </span>

                                            </div>

                                          </div>


                                          <button
                                            type="button"
                                            className="workspace-mine-open"
                                            onClick={() =>
                                              workspace.openWorkspace(
                                                item
                                              )
                                            }
                                          >
                                            ABRIR

                                            <FiArrowRight />
                                          </button>

                                        </article>

                                      )
                                    )

                                ) : (

                                  <div className="workspace-mine-empty">

                                    <FiSearch />


                                    <strong>
                                      Nenhum workspace encontrado
                                    </strong>


                                    <p>
                                      Tente pesquisar por outro nome.
                                    </p>

                                  </div>

                                )
                              }

                            </div>


                            <p className="workspace-mine-helper">
                              Seus workspaces ficam salvos aqui para
                              que você não precise utilizar o código
                              novamente.
                            </p>
                          </>

                        ) : (

                          <div className="workspace-mine-empty">

                            <FiGrid />


                            <strong>
                              Você ainda não participa de nenhum workspace
                            </strong>


                            <p>
                              Utilize um código de convite para
                              entrar em uma equipe pela primeira vez.
                            </p>


                            <button
                              type="button"
                              onClick={() =>
                                workspace.changeJoinView(
                                  "code"
                                )
                              }
                            >
                              USAR CÓDIGO

                              <FiArrowRight />
                            </button>

                          </div>

                        )
                      }

                    </div>

                  )
                }


                {/* ===============================================
                    USAR CÓDIGO
                =============================================== */}

                {
                  workspace.joinView ===
                    "code" && (

                    <form
                      className="
                        workspace-access-form
                        workspace-access-code-form
                      "
                      onSubmit={
                        workspace.joinWorkspace
                      }
                    >

                      <label>

                        <span>
                          CÓDIGO DE CONVITE
                        </span>


                        <input
                          type="text"
                          value={
                            workspace.inviteCode
                          }
                          onChange={
                            workspace
                              .handleInviteCodeChange
                          }
                          placeholder="Ex.: LUMEN-2026"
                          autoComplete="off"
                        />

                      </label>


                      {/* =========================================
                          MOCK TIP
                      ========================================= */}

                      <div className="workspace-access-mock-tip">

                        <strong>
                          TESTE COM DADOS MOCKADOS
                        </strong>


                        <p>
                          Para testar a entrada no workspace
                          da Equipe Lumen, utilize:
                        </p>


                        <code>
                          LUMEN-2026
                        </code>

                      </div>


                      {
                        workspace.error && (

                          <p className="workspace-access-error">
                            {
                              workspace.error
                            }
                          </p>

                        )
                      }


                      <div className="workspace-access-form-actions">

                        <button
                          type="button"
                          className="workspace-access-secondary-button"
                          onClick={() =>
                            workspace.changeJoinView(
                              "mine"
                            )
                          }
                        >
                          MEUS WORKSPACES
                        </button>


                        <button
                          type="submit"
                          className="workspace-access-primary-button"
                        >
                          <FiLogIn />

                          ENTRAR NO WORKSPACE
                        </button>

                      </div>

                    </form>

                  )
                }

              </section>

            )
          }

        </section>

      </main>
    </>
  );
}