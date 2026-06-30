const mongoose = require('mongoose');

const GrupoSchema = new mongoose.Schema({
    nombreGrupo: {
        type: String,
        required: true,
        trim: true
    },
    lider: {
        type: String,
        required: true
    },
    voluntarios: [{type: String}], //array simple de nombres para los participantes.
    plazaAsignada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plaza', //referencia al modelo de plaza.
        required: true
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Grupo', GrupoSchema);