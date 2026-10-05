//aqui se aplica  la logica para el procesamiento de imagenes.
//debe recibir la imagen y revisar que el archivo sea una imagen.
//hay que enviarlo a la api de imagenes para guardarlo, una vez dado el okey
//y devolvernos la URL a la imagen, guardar ese avance anexado a la actividad correspondiente.

const Avance = require('../models/Avance');
const Actividad = require('../models/Actividad');
const Adopcion = require('../models/Adopcion');

const crearAvance = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;
        const { actividad: actividadId, texto, fotos } = req.body;

        if (!actividadId) {
            return res.status(400).json({ mensaje: 'Falta indicar actividad'});
        }
        if ((!texto || texto.trim().length === 0) && (!Array.isArray(fotos) || fotos.length === 0)) {
            return res.status(400).json({ mensaje: 'El avance necesita texto o al menos una foto'});
        }

        const actividad = await Actividad.findById(actividadId);
        if (!actividad) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada'});
        }
        const adopcion = await Adopcion.findOne({
            usuario: usuarioId,
            plaza: actividad.plaza,
            estado: 'activa'
        });
        if (!adopcion) {
            return res.status(403).json({ mensaje: 'No tenes permisos para subir avances en esta activiadad'});
        }
        const avance = await Avance.create({
            actividad: actividadId,
            usuario: usuarioId,
            texto,
            fotos: Array.isArray(fotos) ? fotos : []
        });

        const avancePoblado = await Avance.findById(avance._id)
            .populate('usuario', 'nombre')
            .populate('actividad', 'nombre');

        res.status(201).json(avancePoblado);

    } catch (error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos inválidos ', error: error.message});
        }
        res.status(500).json({ mensaje: 'Error al crear el avance', error: error.message});
    }
};

//obtener avances de una actividad especifica.
const obtenerAvancesPorActividad = async (req, res) =>{
    try {
        const { actividadId } = req.params;

        const avances = await Avance.find({ actividad: actividadId })
            .populate('usuario', 'nombre')
            .sort({ createdAt: -1 });

        res.json(avances);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los avances', error: error.message});
    }
};

module.exports = { crearAvance, obtenerAvancesPorActividad };