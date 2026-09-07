import './style.css';
import Form from './sections/Form';
import useRegisterController from './hooks/useRegisterController';

export default function Register() {
    const controller = useRegisterController();

    return (
        <main className="register-page">
            <section className="register-container">
                <Form controller={controller} />
            </section>
        </main>
    );
}
