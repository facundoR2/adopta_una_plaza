const express = require('express');
const router = express.Router();
const Actividad = require('../models/Actividad');
const { registrarActividad } = require('../controllers/activityController');

//1) ver tdoas las jornadas /filtrar por mes.
router.get('/', async (req,res) =>{
    const { mes } = req.query; // captura si mandan por ejemplo ?mes=Octubre.
    try {
        let filtro = {};
        if (mes) {
            filtro.fechaProgramada = {$regex: mes, $options: 'i'}; // filtro flexible de texto.
        }
        // el .populate('plaza') rellena automaticamente los datos de la plaza en lugar de mostrar solo ID.
        const actividades = await Actividad.find(filtro).populate('plaza', 'nombre ubicacion');
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el calendario', error: error.message});
    }
});
//crear una nueva actividad.
router.post('/new', async (req, res) => {
    registrarActividad(req, res);
})

// crear nueva jornada de trabajo.
router.post('/', async (req,res) => {
    const { nombre, fechaProgramada, estado, plazaId, tareas } = req.body;

    try {
        const nuevaActividad = new Actividad({
            nombre,
            fechaProgramada,
            estado: estado || 'pendiente',
            plaza: plazaId,
            tareas: tareas || []
        });

        const actividadGuardada = await nuevaActividad.save();
        res.status(201).json({ mensaje: 'Actividad creada correctamente', actividad: actividadGuardada });
    } catch (error){
        res.status(400).json({ mensaje: 'Error al crear la actividad', error: error.message });
    }
});
//REVISAR:-------------------------------------------------
//3) actualizar checklist: marcar actividad como completada o pendiente.
//enviamos el id de la actividad y el id especifico de la tarea interna.
router.patch('/:actividadId/tareas/:tareaId', async (req,res) => {
    const { completada } = req.body; // se espera true o false.
    try {
        const actividadActualizada = await Actividad.findOneAndUpdate(
            { _id: req.params.actividadId, "tareas._id": req.params.tareaId },
            { $set: {"tareas.$.completada": completada }}, // el operador '$' apunta a la tarea que coincidio en el filtro.
            { new: true}
        );
        if (!actividadActualizada) return res.status(404).json({ mensaje: 'Actividad o Tarea no encontrada' });
        res.json({ mensaje: 'Estado de la tarea actualizado', actividad: actividadActualizada });
    }catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la tarea', error: error.message });
    }
});

module.exports = router;