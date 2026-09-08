import ProfileDanger from "./sections/Danger";
import ProfileHero from "./sections/Hero";
import ProfileSettings from "./sections/Settings";
import ProfileTopbar from "./sections/Topbar";
import useProfileController from "./hooks/useProfileController";
import "./style.css";

export default function Profile() {
  const controller = useProfileController();

  return (
    <main className="profile-page">
      <section className="profile-container">
        <ProfileTopbar onBack={controller.handleBack} />
        <ProfileHero
          name={controller.displayName}
          email={controller.displayEmail}
          photo={controller.profilePhoto}
        />
        <ProfileSettings
          items={controller.menuItems}
          onNavigate={controller.handleMenuNavigate}
        />
        <ProfileDanger onLogout={controller.handleLogout} />
      </section>
    </main>
  );
}
