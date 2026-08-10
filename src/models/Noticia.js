const mongoose = require('mongoose');

const NoticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
    },
    autor: {
        type: String,
        trim: true,
        default: 'Coordinador',
    },
    imagenUrl: {
        type: String,
        trim: true,
        default: '',
    },
    publicado: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Noticia', NoticiaSchema);
