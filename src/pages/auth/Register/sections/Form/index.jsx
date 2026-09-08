import { useState } from "react";
import {
  IoArrowForward,
  IoCameraOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { logoUrl } from "../../data";
import "./style.css";

export default function Form({ controller }) {
  const {
    photo,
    name,
    email,
    password,
    errors,
    authError,
    handleImage,
    handleRegister,
    updateField,
    goToLogin,
  } = controller;

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    handleRegister(event);
  };

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <form className="register-card" onSubmit={handleSubmit}>

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="register-brand">
        <img src={logoUrl} alt="Ford" />

        <span>BCI</span>
      </div>


      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="register-heading">

        <span className="eyebrow">
          CADASTRO
        </span>

        <h1>
          Criar conta.
        </h1>

        <p>
          Crie seu acesso para começar a explorar análises
          de inteligência competitiva.
        </p>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="register-content">

        {/* FOTO */}

        <div className="photo-area">

          <label className="photo-wrapper">

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {photo ? (
              <img
                src={photo}
                alt="Foto de perfil"
                className="profile-photo"
              />
            ) : (
              <div className="photo-placeholder">
                <IoPersonOutline />
              </div>
            )}

            <span className="camera-button">
              <IoCameraOutline />
            </span>

          </label>

          <div className="photo-info">
            <span className="photo-title">
              Foto de perfil
            </span>

            <span className="photo-description">
              Opcional · PNG ou JPG
            </span>
          </div>

        </div>


        {/* FORM */}

        <div className="form-fields">

          {/* NOME */}

          <div className="field">

            <label htmlFor="name">
              NOME
            </label>

            <input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
              </span>
            )}

          </div>


          {/* EMAIL */}

          <div className="field">

            <label htmlFor="email">
              E-MAIL
            </label>

            <input
              id="email"
              type="email"
              placeholder="nome@ford.com"
              value={email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}

          </div>


          {/* SENHAS */}

          <div className="password-row">

            {/* SENHA */}

            <div className="field">

              <label htmlFor="password">
                SENHA
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
              />

              {errors.password && (
                <span className="field-error">
                  {errors.password}
                </span>
              )}

            </div>


            {/* CONFIRMAR SENHA */}

            <div className="field">

              <label htmlFor="confirmPassword">
                CONFIRMAR SENHA
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />

              {passwordMismatch && (
                <span className="field-error">
                  As senhas não coincidem.
                </span>
              )}

            </div>

          </div>


          {/* ERRO DE AUTENTICAÇÃO */}

          {authError && (
            <p className="auth-error">
              {authError}
            </p>
          )}


          {/* BOTÃO */}

          <button
            type="submit"
            className="primary-button"
            disabled={passwordMismatch}
          >
            <span>Cadastrar</span>

            <IoArrowForward />
          </button>


          {/* LOGIN */}

          <button
            type="button"
            className="link-button"
            onClick={goToLogin}
          >
            <span>
              Já possui uma conta?
            </span>

            <strong>
              Entrar
            </strong>
          </button>

        </div>

      </div>

    </form>
  );
}