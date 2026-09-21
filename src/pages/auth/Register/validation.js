export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validarSenha(password) {
    const erros = [];

    if (password.length < 6)
        erros.push('A senha deve ter pelo menos 6 caracteres.');
    if (!/[0-9]/.test(password))
        erros.push('A senha deve conter ao menos um número.');
    if (!/[a-z]/.test(password))
        erros.push('A senha deve conter ao menos uma letra minúscula.');
    if (!/[A-Z]/.test(password))
        erros.push('A senha deve conter ao menos uma letra maiúscula.');
    if (!/[^a-zA-Z0-9]/.test(password))
        erros.push('A senha deve conter ao menos um caractere especial (ex: !@#$%).');

    return erros;
}