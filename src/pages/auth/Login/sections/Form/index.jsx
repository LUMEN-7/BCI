import { IoArrowForward } from "react-icons/io5";
import { logoUrl } from "../../data";
import "./style.css";

export default function Form({ controller }) {
  const {
    email,
    password,
    showPassword,
    errors,
    authError,
    setShowPassword,
    updateField,
    handleLogin,
    goToRegister,
  } = controller;
  return (
    <form className="login-card" onSubmit={handleLogin}>
      <div className="login-brand">
        <img src={logoUrl} alt="Ford" />
        <span>BCI</span>
      </div>
      <div className="login-heading">
        <span className="eyebrow">ACESSO</span>
        <h1>
          Bem-vindo
          <br />
          de volta.
        </h1>
        <p>Entre para continuar suas análises de inteligência competitiva.</p>
      </div>
      <div className="form-fields">
        <div className="field">
          <label htmlFor="email">E-MAIL</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="password">SENHA</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => updateField("password", event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "◉" : "◌"}
            </button>
          </div>
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
          {authError && <span className="field-error">{authError}</span>}
        </div>
      </div>
      <button className="primary-button" type="submit">
        <span>Entrar</span>
        <IoArrowForward />
      </button>
      <button type="button" className="link-button" onClick={goToRegister}>
        <span>Ainda não possui uma conta?</span>
        <strong>Criar conta</strong>
      </button>
    </form>
  );
}
