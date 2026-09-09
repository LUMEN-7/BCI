import {
  FiActivity,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";

import useWorkspace from "./hooks/useWorkspace";

import WorkspaceTabs from "./components/WorkspaceTabs";
import FeedSection from "./sections/FeedSection";

import "./style.css";

export default function Workspace() {
  const workspace = useWorkspace();

  return (
    <main className="workspace-page">
      <div className="workspace-container">
        <header className="workspace-header">
          <div>
            <span className="workspace-eyebrow">
              CENTRAL DA EQUIPE
            </span>

            <h1>WORKSPACE</h1>

            <p>
              Compartilhe análises, registre
              decisões e acompanhe as
              atividades da sua equipe.
            </p>
          </div>

          <div className="workspace-header-stats">
            <div>
              <FiMessageSquare />

              <strong>
                {workspace.summary.posts}
              </strong>

              <span>
                Publicações
              </span>
            </div>

            <div>
              <FiActivity />

              <strong>
                {workspace.summary.insights}
              </strong>

              <span>
                Insights
              </span>
            </div>

            <div>
              <FiUsers />

              <strong>5</strong>

              <span>
                Membros
              </span>
            </div>
          </div>
        </header>

        <WorkspaceTabs
          activeTab={
            workspace.activeTab
          }
          onChange={
            workspace.setActiveTab
          }
        />

        {workspace.activeTab ===
          "feed" && (
          <FeedSection
            posts={
              workspace.filteredPosts
            }
            postTypes={
              workspace.postTypes
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
            onComment={
              workspace.addComment
            }

            newPostOpen={
              workspace.newPostOpen
            }
            onOpenNewPost={() =>
              workspace.setNewPostOpen(
                true
              )
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

        {workspace.activeTab !==
          "feed" && (
          <section className="workspace-coming-soon">
            <span>
              EM DESENVOLVIMENTO
            </span>

            <h2>
              Essa área será adicionada ao
              Workspace.
            </h2>

            <p>
              Vamos construir essa etapa
              depois de finalizar o feed.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}