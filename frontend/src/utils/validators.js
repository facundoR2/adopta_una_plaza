// src/utils/validators.js

export function validateStep1(data) {
    const errors = {};

    if (!data.nombre || data.nombre.trim() === '') {
        errors.nombre = 'El nombre es obligatorio.';
    }

    if (!data.apellido || data.apellido.trim() === '') {
        errors.apellido = 'El apellido es obligatorio.';
    }

    if (!data.email || data.email.trim() === '') {
        errors.email = 'El correo electrónico es obligatorio.';
    } else {
        // Validación básica de formato de email con expresión regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'El formato del correo electrónico no es válido.';
        }
    }

    if (!data.password || data.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    return errors;
}