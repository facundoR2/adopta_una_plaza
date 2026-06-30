const mongoose = require('mongoose');

//estructura de plaza.
const plazaSchema = new mongoose.Schema({
    uId:{
        type:Number, // id numerico para mantenerlo simple.
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre de la plaza es obligatorio'],
        trim: true
    },
    barrio: {
        type: String,
        required: [true, 'El barrio de Río Grande es obligatorio'],
        trim: true
    },
    votos: {
        type: Number,
        default: 0,
        min: [0, 'Los botos no pueden ser negativos']
    },
    avances: [
        {
            descripcion: String,
            fecha: { type: Date, default: Date.now()},
            autor: String
        }
    ],
    adoptada:{
        type: Boolean,
        default: false
    },
    historialVotos: [
        {
            fecha: {type: Date, default: Date.now()},
            vecinoId: String //identifica quien votó
        }
    ]
},{
    timestamps: true // cfea automaticamente los campos fechacreado y fechaactualizado
});

// exportamos el modelo para usar en los controladores.
module.exports = mongoose.model('Plaza', plazaSchema);