import {
  FiActivity,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";

import useWorkspace from "./hooks/useWorkspace";

import Navbar from "../../components/Navbar/Navbar";
import WorkspaceTabs from "./components/WorkspaceTabs";
import FeedSection from "./sections/FeedSection";
import MyActivitiesSection from "./sections/MyActivitiesSection";
import ThreadDrawer from "./components/ThreadDrawer";

import "./style.css";


export default function Workspace() {

  const workspace = useWorkspace();


  return (
    <>
      <Navbar />

      <main className="workspace-page">

        <div className="workspace-container">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className="workspace-header">

            <div className="workspace-header-content">

              <span className="workspace-eyebrow">
                CENTRAL DA EQUIPE
              </span>

              <h1>
                WORKSPACE
              </h1>

              <p>
                Compartilhe análises, registre decisões e acompanhe
                as atividades da equipe em um único ambiente colaborativo.
              </p>

            </div>


            {/* ===================================================
                ESTATÍSTICAS
            ==================================================== */}

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
              TABS PRINCIPAIS
          ====================================================== */}

          <WorkspaceTabs
            activeTab={workspace.activeTab}
            onChange={workspace.setActiveTab}
          />


          {/* =====================================================
              FEED
          ====================================================== */}

          {workspace.activeTab === "feed" && (

            <FeedSection

              posts={workspace.filteredPosts}

              postTypes={workspace.postTypes}


              search={workspace.search}

              onSearchChange={workspace.setSearch}


              selectedType={workspace.selectedType}

              onTypeChange={workspace.setSelectedType}


              onLike={workspace.toggleLike}

              onTogglePin={workspace.togglePin}

              onDelete={workspace.deletePost}


              selectedPost={workspace.selectedPost}

              onOpenThread={workspace.openThread}

              onActivityClick={workspace.openThreadById}

              onCloseThread={workspace.closeThread}

              onComment={workspace.addComment}

              onStatusChange={workspace.updatePostStatus}

              posting = {workspace.posting}
              newPostOpen={workspace.newPostOpen}

              onOpenNewPost={workspace.openNewPost}

              newPost={workspace.newPost}

              onNewPostChange={workspace.handleNewPostChange}

              availableLinkedContents={
                workspace.availableLinkedContents
              }

              onCreatePost={workspace.createPost}

              onCancelPost={workspace.cancelNewPost}

            />

          )}


          {/* =====================================================
              MINHAS ATIVIDADES
          ====================================================== */}

          {workspace.activeTab === "my-activity" && (

            <MyActivitiesSection

              assignedPosts={workspace.assignedPosts}

              myPosts={workspace.myPosts}

              postTypes={workspace.postTypes}


              activeView={workspace.myActivitiesView}

              onViewChange={workspace.setMyActivitiesView}


              onLike={workspace.toggleLike}

              onOpenThread={workspace.openThread}

              onTogglePin={workspace.togglePin}

              onDelete={workspace.deletePost}

            />

          )}

        </div>

      </main>


      {/* =====================================================
          THREAD GLOBAL
      ====================================================== */}

      {workspace.activeTab === "my-activity" &&
        workspace.selectedPost && (

          <ThreadDrawer

            post={workspace.selectedPost}

            type={
              workspace.postTypes[
                workspace.selectedPost.type
              ]
            }

            onClose={workspace.closeThread}

            onComment={workspace.addComment}

            onStatusChange={workspace.updatePostStatus}

          />

        )}

    </>
  );
}