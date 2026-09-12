import {
  FiActivity,
  FiChevronDown,
  FiUsers,
} from "react-icons/fi";

import { useState } from "react";

export default function ActivitySidebar({
  activities,
  members,
  onActivityClick,
}) {
  const [
    membersOpen,
    setMembersOpen,
  ] = useState(false);

  const [
    activitiesOpen,
    setActivitiesOpen,
  ] = useState(false);

  return (
    <aside className="workspace-sidebar">

      {/* =====================================================
          EQUIPE
      ====================================================== */}

      <section
        className={
          membersOpen
            ? "workspace-expand-card workspace-expand-card-open"
            : "workspace-expand-card"
        }
      >
        <button
          type="button"
          className="workspace-expand-header"
          onClick={() =>
            setMembersOpen(
              (previous) => !previous
            )
          }
        >
          <div className="expand-header-info">

            <div className="expand-header-icon">
              <FiUsers />
            </div>

            <div>
              <span>
                EQUIPE
              </span>

              <strong>
                {members.length} membros
              </strong>
            </div>
          </div>

          <FiChevronDown
            className="expand-chevron"
          />
        </button>

        {membersOpen && (
          <div className="workspace-expand-content">

            <div className="workspace-member-list">

              {members.map(
                (member) => (
                  <div
                    key={member.id}
                    className="workspace-member"
                  >
                    <div className="member-avatar">
                      {member.initials}
                    </div>

                    <div>
                      <span>
                        {member.name}
                      </span>

                      {member.role && (
                        <small>
                          {member.role}
                        </small>
                      )}
                    </div>
                  </div>
                )
              )}

            </div>
          </div>
        )}
      </section>


      {/* =====================================================
          ÚLTIMAS MOVIMENTAÇÕES
      ====================================================== */}

      <section
        className={
          activitiesOpen
            ? "workspace-expand-card workspace-expand-card-open"
            : "workspace-expand-card"
        }
      >
        <button
          type="button"
          className="workspace-expand-header"
          onClick={() =>
            setActivitiesOpen(
              (previous) => !previous
            )
          }
        >
          <div className="expand-header-info">

            <div className="expand-header-icon">
              <FiActivity />
            </div>

            <div>
              <span>
                ATIVIDADE
              </span>

              <strong>
                Últimas movimentações
              </strong>
            </div>
          </div>

          <FiChevronDown
            className="expand-chevron"
          />
        </button>

        {activitiesOpen && (
          <div className="workspace-expand-content">

            <div className="workspace-activity-list">

              {activities.map(
                (activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    className="workspace-activity-item"
                    onClick={() =>
                      onActivityClick?.(
                        activity.postId
                      )
                    }
                  >
                    <div className="activity-avatar">
                      {activity.initials}
                    </div>

                    <div className="activity-content">

                      <p>
                        <strong>
                          {activity.user}
                        </strong>{" "}

                        {activity.action}
                      </p>

                      <span>
                        {activity.time}
                      </span>

                    </div>
                  </button>
                )
              )}

            </div>
          </div>
        )}
      </section>

    </aside>
  );
}