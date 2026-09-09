import {
  FiActivity,
  FiCheckSquare,
  FiUsers,
  FiUser,
} from "react-icons/fi";

export default function WorkspaceTabs({
  activeTab,
  onChange,
}) {
  const tabs = [
    {
      id: "feed",
      label: "Feed",
      icon: <FiActivity />,
    },
    {
      id: "tasks",
      label: "Tarefas",
      icon: <FiCheckSquare />,
    },
    {
      id: "my-activity",
      label: "Minhas atividades",
      icon: <FiUser />,
    },
    {
      id: "team",
      label: "Equipe",
      icon: <FiUsers />,
    },
  ];

  return (
    <nav className="workspace-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            activeTab === tab.id
              ? "workspace-tab workspace-tab-active"
              : "workspace-tab"
          }
          onClick={() => onChange(tab.id)}
        >
          {tab.icon}

          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}