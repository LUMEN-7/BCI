import { IoPersonOutline } from "react-icons/io5";
import "./style.css";

export default function ProfileHero({ name, email, photo }) {
  return (
    <section className="profile-hero">
      <div className="profile-avatar">
        {photo ? <img src={photo} alt="Foto de perfil" /> : <IoPersonOutline />}
      </div>
      <div className="profile-info">
        <span className="profile-eyebrow">Minha conta</span>
        <h1>{name}</h1>
        <p>{email}</p>
      </div>
    </section>
  );
}
