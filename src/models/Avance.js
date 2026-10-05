const mongoose = require('mongoose');

const AvanceSchema = new mongoose.Schema({
    actividad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actividad',
        required: [true, 'El avance debe estar vinculado a una actividad']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    texto: {
        type: String,
        trim: true
    },
    fotos: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('Avance', AvanceSchema);