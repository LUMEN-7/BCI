export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin(email, password) {
    const errors = {
        email: '',
        password: '',
    };

    if (!isValidEmail(email)) {
        errors.email = 'E-mail inválido.';
    }

    if (password.trim().length < 6) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    return errors;
}