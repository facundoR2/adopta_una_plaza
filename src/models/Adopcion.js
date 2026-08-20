const mongoose = require('mongoose');

const adopcionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    plaza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plaza',
        required: true
    },
    fechaAdopcion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['activa', 'finalizada'],
        default: 'activa'
    }
});
module.exports = mongoose.model('Adopcion', adopcionSchema);