const Adopcion = require('../models/Adopcion');

const obtenerPlazasAsociadas = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;

        const adopciones = await Adopcion.find({ usuario: usuarioId, estado: 'activa'})
            .populate('plaza', 'nombre barrio');

        const plazas = adopciones.map(adopcion => adopcion.plaza);

        res.json({ plazas});
    } catch (error) {
        res.status(500).json({
            mensaje: 'error al obtener plazas asociadas',
            error: error.message
        });
    }
};

module.exports = {obtenerPlazasAsociadas}