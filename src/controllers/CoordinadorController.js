const Adopcion = require('../models/Adopcion');
const Actividad =require('../models/Actividad');

const obtenerActividadesCoord = async (req, res) => {
    try{
        const usuarioId = req.usuario._id;
        if(!usuarioId){
            res.status(403).json({ mensaje: 'Acceso denegado'});
            return;
        }
        //obtener las adopciones.
        const adopciones = await Adopcion.find({ usuario: usuarioId, estado: 'activa'})
            .populate('plaza', 'nombre barrio');
        //agregamos cada plaza del arreglo de adopciones a un arreglo de plazas.
        const plazas = adopciones.map(adopcion => adopcion.plaza);
        //buscamos cada actividad con sus tareas para cada actividad que tenga una plaza del arreglo de plazas
        const actividades = await Actividad.find({
            plaza: { $in: plazas }
        })
            .populate('plaza', 'nombre barrio')
            .sort({ fechaProgramada: 1 }); //ordenado por fecha.


        //enviamos la respuesta al front.
        res.json({
            actividades: actividades
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos de coordinador',
        error: error.message
        });
    }
};

module.exports = { obtenerActividadesCoord };