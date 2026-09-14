import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

import ProfileDanger from "./sections/Danger";
import ProfileHero from "./sections/Hero";
import ProfileSettings from "./sections/Settings";
import ProfileTopbar from "./sections/Topbar";

import useProfileController from "./hooks/useProfileController";

import "./style.css";

export default function Profile() {
  const controller = useProfileController();
  const location = useLocation();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    successMessage,
    navigate,
    location.pathname,
  ]);

  return (
    <main className="profile-page">
      {successMessage && (
        <div className="profile-toast-success">
          <div className="profile-toast-icon">
            <FiCheck />
          </div>

          <div className="profile-toast-content">
            <strong>Alterações salvas</strong>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <section className="profile-container">
        <ProfileTopbar
          onBack={controller.handleBack}
        />

        <ProfileHero
          name={controller.displayName}
          email={controller.displayEmail}
          photo={controller.profilePhoto}
        />

        <ProfileSettings
          items={controller.menuItems}
          onNavigate={controller.handleMenuNavigate}
        />

        <ProfileDanger
          onLogout={controller.handleLogout}
        />
      </section>
    </main>
  );
}