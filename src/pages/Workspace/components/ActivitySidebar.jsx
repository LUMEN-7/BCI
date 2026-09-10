import {
    FiActivity,
    FiChevronDown,
    FiUsers,
} from "react-icons/fi";

import { useState } from "react";

export default function ActivitySidebar({
    activities,
    members,
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

            {/* EQUIPE */}

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
                            (previous) =>
                                !previous
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
                        {members.map(
                            (member) => (
                                <div
                                    className="workspace-member"
                                    key={
                                        member.name
                                    }
                                >
                                    <div className="member-avatar">
                                        {
                                            member.initials
                                        }
                                    </div>

                                    <span>
                                        {member.name}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>


            {/* ATIVIDADES */}

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
                            (previous) =>
                                !previous
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
                                (
                                    activity
                                ) => (
                                    <div
                                        className="workspace-activity-item"
                                        key={
                                            activity.id
                                        }
                                    >
                                        <div className="activity-avatar">
                                            {
                                                activity.initials
                                            }
                                        </div>

                                        <div>
                                            <p>
                                                <strong>
                                                    {
                                                        activity.user
                                                    }
                                                </strong>{" "}
                                                {
                                                    activity.action
                                                }
                                            </p>

                                            <span>
                                                {
                                                    activity.time
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </section>

        </aside>
    );
}