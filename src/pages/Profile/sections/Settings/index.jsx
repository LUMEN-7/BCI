import {
  IoChevronForwardOutline,
  IoLockClosedOutline,
  IoPencilOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import useTheme from "@/context/useTheme";
import "./style.css";

const icons = {
  edit: <IoPencilOutline />,
  password: <IoLockClosedOutline />,
};

export default function ProfileSettings({ items, onNavigate }) {
  const { theme, setTheme } = useTheme();

  return (
    <section className="profile-settings">
      <div className="profile-section-heading">
        <div>
          <span className="section-eyebrow">Preferências</span>
          <h2 className="section-title">Configurações</h2>
        </div>
        <p>Gerencie seus dados e sua experiência no app.</p>
      </div>
      <div className="profile-menu">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            className="profile-menu-item"
            onClick={() => onNavigate(item.route)}
          >
            <span className="profile-menu-icon">{icons[item.icon]}</span>
            <span className="profile-menu-text">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
            <span className="profile-chevron">
              <IoChevronForwardOutline />
            </span>
          </button>
        ))}
      </div>

      <div className="profile-appearance">
        <div className="profile-appearance-copy">
          <span className="profile-appearance-icon"><IoSunnyOutline /></span>
          <div>
            <strong>Aparência</strong>
            <p>Personalize como o BCI será exibido.</p>
          </div>
        </div>

        <div className="profile-theme-control" role="group" aria-label="Escolha do tema">
          <button
            type="button"
            className={theme === "light" ? "is-selected" : ""}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            <IoSunnyOutline />
            Claro
          </button>
          <button
            type="button"
            className={theme === "dark" ? "is-selected" : ""}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            <IoMoonOutline />
            Escuro
          </button>
        </div>
      </div>
    </section>
  );
}
