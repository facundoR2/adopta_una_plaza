const Usuario = require('../models/Usuario');
const Adopcion = require('../models/Adopcion');
const CoordinadorDTO = require('../DTOS/CoordinadorDTO');

const obtenerPerfilCoordinador = async (req, res) => {
    try{
        const usuarioId = req.usuario._id;

        const usuario = await Usuario.findById(usuarioId);
        if(!usuario){
            return res.status(404).json({ mensaje: 'Usuario no Encontrado'});
        }

        //obtener las adopciones.
        const adopciones = await Adopcion.find({
            usuario: usuarioId,
            estado: 'activa'
        });
        // transferimos al DTO.
        const coordinadorDTO = new CoordinadorDTO(usuario, adopciones);

        //enviamos la respuesta al front.
        res.json(coordinadorDTO);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos de coordinador',
        error: error.message
        });
    }
};

module.exports = {obtenerPerfilCoordinador};