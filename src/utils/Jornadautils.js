const Jornada = require('../models/Jornada');

/*
* determina si hay jornada activa en el momento.
* */

async function hayJornadaActiva() {
    const ahora = new Date();
    const jornada = await Jornada.findOne({
        estado: 'en_curso',
        fechaInicio: { $lte: ahora },
        fechaFin: { $gte: ahora }
    });
    return !!jornada;
}

module.exports = { hayJornadaActiva };