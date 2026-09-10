import {
  FiActivity,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";

import useWorkspace from "./hooks/useWorkspace";
import Navbar from "../../components/Navbar/Navbar";
import WorkspaceTabs from "./components/WorkspaceTabs";
import FeedSection from "./sections/FeedSection";

import "./style.css";

export default function Workspace() {
  const workspace =
    useWorkspace();

  return (
    <main className="workspace-page">

      <Navbar/>
      
      <div className="workspace-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="workspace-header">

          <div>
            <span className="workspace-eyebrow">
              CENTRAL DA EQUIPE
            </span>

            <h1>
              WORKSPACE
            </h1>

            <p>
              Compartilhe análises,
              registre decisões e
              acompanhe as atividades
              da equipe em um único
              ambiente colaborativo.
            </p>
          </div>

          {/* ===================================================
              ESTATÍSTICAS
          ==================================================== */}

          <div className="workspace-header-stats">

            <div>
              <FiMessageSquare />

              <strong>
                {
                  workspace
                    .summary.posts
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
                    .summary.insights
                }
              </strong>

              <span>
                Insights
              </span>
            </div>

            <div>
              <FiUsers />

              <strong>
                5
              </strong>

              <span>
                Membros
              </span>
            </div>
          </div>
        </header>

        {/* =====================================================
            TABS
        ====================================================== */}

        <WorkspaceTabs
          activeTab={
            workspace.activeTab
          }
          onChange={
            workspace.setActiveTab
          }
        />

        {/* =====================================================
            FEED
        ====================================================== */}

        {workspace.activeTab ===
          "feed" && (
            <FeedSection

              /* POSTS */

              posts={
                workspace.filteredPosts
              }

              postTypes={
                workspace.postTypes
              }


              /* BUSCA */

              search={
                workspace.search
              }

              onSearchChange={
                workspace.setSearch
              }


              /* FILTRO */

              selectedType={
                workspace.selectedType
              }

              onTypeChange={
                workspace.setSelectedType
              }


              /* INTERAÇÕES */

              onLike={
                workspace.toggleLike
              }

              onTogglePin={
                workspace.togglePin
              }

              onDelete={
                workspace.deletePost
              }


              /* THREAD */

              selectedPost={
                workspace.selectedPost
              }

              onOpenThread={
                workspace.openThread
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


              /* NOVA PUBLICAÇÃO */

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
                workspace.handleNewPostChange
              }

              onCreatePost={
                workspace.createPost
              }

              onCancelPost={
                workspace.cancelNewPost
              }
            />
          )}

        {/* =====================================================
            TAREFAS
        ====================================================== */}

        {workspace.activeTab ===
          "tasks" && (
            <section className="workspace-coming-soon">

              <span>
                EM DESENVOLVIMENTO
              </span>

              <h2>
                Gestão de tarefas
              </h2>

              <p>
                Aqui ficará o quadro
                Kanban com todas as
                atividades relacionadas
                às análises competitivas
                do BCI.
              </p>
            </section>
          )}

        {/* =====================================================
            MINHAS ATIVIDADES
        ====================================================== */}

        {workspace.activeTab ===
          "my-activity" && (
            <section className="workspace-coming-soon">

              <span>
                EM DESENVOLVIMENTO
              </span>

              <h2>
                Minhas atividades
              </h2>

              <p>
                Nesta área o usuário
                poderá acompanhar
                tarefas, comentários,
                menções e publicações
                relacionadas à sua
                conta.
              </p>
            </section>
          )}

        {/* =====================================================
            EQUIPE
        ====================================================== */}

        {workspace.activeTab ===
          "team" && (
            <section className="workspace-coming-soon">

              <span>
                EM DESENVOLVIMENTO
              </span>

              <h2>
                Equipe LUMEN
              </h2>

              <p>
                Aqui serão exibidos
                os membros do projeto,
                suas funções,
                disponibilidade e
                participação dentro
                do Workspace.
              </p>
            </section>
          )}
      </div>
    </main>
  );
}