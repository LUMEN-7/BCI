import { logoUrl } from '../auth/Register/data';
import useWelcomeController from './hooks/useWelcomeController';
import './style.css';

export default function Welcome() {
    const { name, setName, error, saving, handleSubmit } = useWelcomeController();

    return (
        <main className="welcome-page">
            <section className="welcome-container">
                <form className="welcome-card" onSubmit={handleSubmit}>

                    <div className="welcome-brand">
                        <img src={logoUrl} alt="Ford" />
                        <span>BCI</span>
                    </div>

                    <div className="welcome-heading">
                        <span className="eyebrow">BEM-VINDO</span>
                        <h1>Como você quer ser chamado?</h1>
                        <p>
                            Esse será o nome exibido na sua home e no seu perfil.
                        </p>
                    </div>

                    <div className="field">
                        <label htmlFor="displayName">NOME DE EXIBIÇÃO</label>

                        <input
                            id="displayName"
                            type="text"
                            placeholder="Digite como quer ser chamado"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoFocus
                        />

                        {error && <span className="field-error">{error}</span>}
                    </div>

                    <button type="submit" className="primary-button" disabled={saving}>
                        {saving ? 'Salvando...' : 'Continuar'}
                    </button>

                </form>
            </section>
        </main>
    );
}
