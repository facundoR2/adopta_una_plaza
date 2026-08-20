const mongoose = require('mongoose');

const JornadaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'necesario codigo para reconocimiento y documentacion'],
        trim: true
    },

    fechaInicio: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    fechaFin: {
        type: Date,
        required: [true, 'La fecha de finalizacion es obligatoria']
    },
    estado: {
        type: String,
        enum: ['pendiente','en_curso', 'completada'],
        default: 'pendiente'
    },
    plazas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plaza',
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Jornada', JornadaSchema);