const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion de la tarea es obligatoria.'],
        trim: true
    },
    completada: {
        type: Boolean,
        default: false // al crear una tarea, se inicia sin completar,
    }
});

const ActividadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la actividad es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaProgramada: {
        type: String,
        required: [true, 'La fecha programada es obligatoria.']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_proceso', 'completada', 'cancelada'],
        default: 'pendiente'
    },
    plaza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plaza',
        required: [true, 'La actividad debe estar asociada a una plaza.']
    },
    tareas: [TareaSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Actividad', ActividadSchema);