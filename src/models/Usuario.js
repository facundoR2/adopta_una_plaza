// src/models/Usuario.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        apellido: {
            type: String,
            required: [true, 'El apellido es obligatorio'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true, // No permite dos usuarios con el mismo email
            lowercase: true, // Convierte EjEmpLO@Mail.com a ejemplo@mail.com
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        },
        tipo: {
            type: String,
            enum: ['voluntario','grupo'],
            default: 'voluntario',
            required: [true, 'Debe Indicar si se registra solo o como grupo'],
        },
        rol: {
            type: String,
            enum: ['vecino','coordinador','admin'],
            default: 'vecino',
        },
    },
    {
        timestamps: true, // Crea createdAt y updatedAt automáticamente
    }
);

// HOOK DE SEGURIDAD: Encriptar la contraseña antes de guardar en MongoDB
usuarioSchema.pre('save', async function (next) {
    // Solo encripta si la contraseña fue modificada o es nueva
    if (!this.isModified('password')) return;

    try {
        // Genera la sal y encripta
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});


usuarioSchema.methods.comprobarPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);