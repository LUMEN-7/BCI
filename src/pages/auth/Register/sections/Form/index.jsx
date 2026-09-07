import { IoArrowForward, IoCameraOutline, IoPersonOutline } from 'react-icons/io5';
import { logoUrl } from '../../data';
import Header from '../Header';
import './style.css';

export default function Form({ controller }) {
    const { photo, name, email, password, errors, authError, handleImage, handleRegister, updateField, goToLogin } = controller;
    return <form className="register-card" onSubmit={handleRegister}>
        <div className="register-brand"><img src={logoUrl} alt="Ford" /><span>BCI</span></div>
        <Header />
        <div className="register-content">
            <div className="photo-area"><label className="photo-wrapper"><input type="file" accept="image/*" onChange={handleImage} />{photo ? <img src={photo} alt="Foto de perfil" className="profile-photo" /> : <div className="photo-placeholder"><IoPersonOutline /></div>}<span className="camera-button"><IoCameraOutline /></span></label><span className="photo-text">Adicionar foto</span></div>
            <div className="form-fields">
                <div className="field"><label htmlFor="name">NOME</label><input id="name" type="text" value={name} onChange={(event) => updateField('name', event.target.value)} />{errors.name && <span className="field-error">{errors.name}</span>}</div>
                <div className="field"><label htmlFor="email">E-MAIL</label><input id="email" type="email" value={email} onChange={(event) => updateField('email', event.target.value)} />{errors.email && <span className="field-error">{errors.email}</span>}</div>
                <div className="field"><label htmlFor="password">SENHA</label><input id="password" type="password" value={password} onChange={(event) => updateField('password', event.target.value)} />{errors.password && <span className="field-error">{errors.password}</span>}</div>
                {authError && <p className="auth-error">{authError}</p>}
                <button type="submit" className="primary-button"><span>Cadastrar</span><IoArrowForward /></button>
                <button type="button" className="link-button" onClick={goToLogin}>Já possui uma conta?<strong>Entrar</strong></button>
            </div>
        </div>
    </form>;
}
