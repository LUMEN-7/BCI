import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUserCheck,
} from "react-icons/fi";

import PostCard from "../components/PostCard";

export default function MyActivitiesSection({
  assignedPosts,
  myPosts,
  postTypes,

  activeView,
  onViewChange,

  onLike,
  onOpenThread,
  onTogglePin,
  onDelete,
}) {
  const pendingCount =
    assignedPosts.filter(
      (post) =>
        post.status === "pending"
    ).length;

  const progressCount =
    assignedPosts.filter(
      (post) =>
        post.status === "progress"
    ).length;

  const resolvedCount =
    assignedPosts.filter(
      (post) =>
        post.status === "resolved"
    ).length;

  return (
    <section className="my-activities-section">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="my-activities-header">

        <div>
          <span className="my-activities-eyebrow">
            VISÃO PESSOAL
          </span>

          <h2>
            Minhas atividades
          </h2>

          <p>
            Acompanhe publicações criadas por você
            e revisões que foram atribuídas à sua conta.
          </p>
        </div>

      </header>


      {/* =====================================================
          RESUMO
      ====================================================== */}

      <div className="my-activities-summary">

        <div className="my-activity-summary-card">

          <div className="my-activity-summary-icon">
            <FiUserCheck />
          </div>

          <div>
            <span>
              ATRIBUÍDOS
            </span>

            <strong>
              {assignedPosts.length}
            </strong>
          </div>

        </div>


        <div className="my-activity-summary-card">

          <div className="my-activity-summary-icon">
            <FiClock />
          </div>

          <div>
            <span>
              PENDENTES
            </span>

            <strong>
              {pendingCount + progressCount}
            </strong>
          </div>

        </div>


        <div className="my-activity-summary-card">

          <div className="my-activity-summary-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>
              RESOLVIDOS
            </span>

            <strong>
              {resolvedCount}
            </strong>
          </div>

        </div>


        <div className="my-activity-summary-card">

          <div className="my-activity-summary-icon">
            <FiFileText />
          </div>

          <div>
            <span>
              PUBLICAÇÕES
            </span>

            <strong>
              {myPosts.length}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          TABS INTERNAS
      ====================================================== */}

      <div className="my-activities-tabs">

        <button
          type="button"
          className={
            activeView === "assigned"
              ? "my-activities-tab my-activities-tab-active"
              : "my-activities-tab"
          }
          onClick={() =>
            onViewChange("assigned")
          }
        >
          ATRIBUÍDOS A MIM

          <span>
            {assignedPosts.length}
          </span>
        </button>


        <button
          type="button"
          className={
            activeView === "posts"
              ? "my-activities-tab my-activities-tab-active"
              : "my-activities-tab"
          }
          onClick={() =>
            onViewChange("posts")
          }
        >
          MINHAS PUBLICAÇÕES

          <span>
            {myPosts.length}
          </span>
        </button>

      </div>


      {/* =====================================================
          ATRIBUÍDOS A MIM
      ====================================================== */}

      {activeView === "assigned" && (
        <div className="my-activities-content">

          {assignedPosts.length > 0 ? (

            assignedPosts.map(
              (post) => (
                <PostCard
                  key={post.id}

                  post={post}

                  type={
                    postTypes[
                      post.type
                    ]
                  }

                  onLike={
                    onLike
                  }

                  onOpenThread={
                    onOpenThread
                  }

                  onTogglePin={
                    onTogglePin
                  }

                  onDelete={
                    onDelete
                  }
                />
              )
            )

          ) : (

            <div className="my-activities-empty">

              <FiUserCheck />

              <strong>
                Nenhuma atividade atribuída
              </strong>

              <span>
                Quando alguma revisão for atribuída a você,
                ela aparecerá aqui.
              </span>

            </div>
          )}

        </div>
      )}


      {/* =====================================================
          MINHAS PUBLICAÇÕES
      ====================================================== */}

      {activeView === "posts" && (
        <div className="my-activities-content">

          {myPosts.length > 0 ? (

            myPosts.map(
              (post) => (
                <PostCard
                  key={post.id}

                  post={post}

                  type={
                    postTypes[
                      post.type
                    ]
                  }

                  onLike={
                    onLike
                  }

                  onOpenThread={
                    onOpenThread
                  }

                  onTogglePin={
                    onTogglePin
                  }

                  onDelete={
                    onDelete
                  }
                />
              )
            )

          ) : (

            <div className="my-activities-empty">

              <FiFileText />

              <strong>
                Nenhuma publicação criada
              </strong>

              <span>
                Suas publicações aparecerão aqui
                assim que forem criadas.
              </span>

            </div>
          )}

        </div>
      )}

    </section>
  );
}