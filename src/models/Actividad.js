const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String
    },
    fechaJornada: {
        type: Date,
        required: true
    }, //dia y hora requerida.
    estado: {
        type: String,
        enum: ['Pendiente', 'Completada'],
        default: 'Pendiente'
    },
    plaza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plaza',
        required: true
    },
    grupoResponsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Actividad', ActividadSchema);