import {
  FiActivity,
  FiMessageSquare,
} from "react-icons/fi";


const tabs = [
  {
    id: "feed",
    label: "Feed",
    icon: FiMessageSquare,
  },

  {
    id: "my-activity",
    label: "Minhas atividades",
    icon: FiActivity,
  },
];


export default function WorkspaceTabs({
  activeTab,
  onChange,
}) {
  return (
    <nav className="workspace-tabs">

      {tabs.map(
        (tab) => {

          const Icon =
            tab.icon;

          const isActive =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={
                isActive
                  ? "workspace-tab workspace-tab-active"
                  : "workspace-tab"
              }
              onClick={() =>
                onChange(tab.id)
              }
            >
              <Icon />

              <span>
                {tab.label}
              </span>
            </button>
          );
        }
      )}

    </nav>
  );
}