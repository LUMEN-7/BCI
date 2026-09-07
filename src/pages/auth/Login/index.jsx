import './style.css';
import Visual from './sections/Visual';
import Form from './sections/Form';
import useLoginController from './hooks/useLoginController';

export default function Login() {
    const controller = useLoginController();

    return (
        <main className="login-page">
            <section className="login-shell">
                <Visual />
                <Form controller={controller} />
            </section>
        </main>
    );
}
