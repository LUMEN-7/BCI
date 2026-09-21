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

    return errors;
}
