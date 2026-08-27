const mongoose = require('mongoose');
const Actividad = require('../models/Actividad');
const Adopcion = require('../models/Adopcion');
const Jornada = require('../models/Jornada');

//funcionalidad para registrar actividades (ABM)

//controlar registro de actividad.
const crearActividad = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;
        const { nombre, descripcion, fechaProgramada, plaza } = req.body;

        //validaciones de presencia.
        if(!nombre || nombre.trim().length === 0) {
            return res.status(400).json({mensaje: 'El nombre de la actividad esta vacio'});
        }
        if (!plaza) {
            return res.status(400).json({mensaje: 'No hay plaza seleccionada'});
        }
        if (!fechaProgramada) {
            return res.status(400).json({mensaje: 'No hay fecha programada'});
        }
        //validar si hay jornada en curso y si la fecha cae dentro del rango.
        const jornadaActual = await Jornada.findOne({ estado: 'en_curso'})
            .select('plazas fechaInicio fechaFin');
        if(!jornadaActual) {
            return res.status(400).json({ mensaje: 'No hay ninguna jornada en curso actualmente'});
        }

        const fechaActividad = new Date(fechaProgramada);
        const fechaInicioJornada = new Date(jornadaActual.fechaInicio);
        const fechaFinJornada = new Date(jornadaActual.fechaFin);
        if (fechaActividad < fechaInicioJornada || fechaActividad > fechaFinJornada) {
            return res.status(400).json({
                mensaje: `La fecha programada (${fechaProgramada}) esta fuera del rango de la jornada actual (${jornadaActual.fechaInicio.toISOString().split('T')[0]} al ${jornadaActual.fechaFin.toISOString().split('T')[0]}. `
            });
        }

        //la plaza tiene que pertenecer a la jornada activa.
        const plazaEnJornada = jornadaActual.plazas.some(
            (idPlaza) => idPlaza.toString() === plaza
        );
        if (!plazaEnJornada) {
            return res.status(400).json({ mensaje: 'La plaza seleccionada no pertenece a la jornada actual'});
        }

        //tiene que ser una plaza adoptada por el coordinador.
        const adopcion = await Adopcion.findOne({ usuario: usuarioId, plaza, estado: 'activa'});
        if (!adopcion) {
            return res.status(403).json({ mensaje: 'No podes crear actividades para una plaza que no adoptaste'});
        }

        //creamos una actividad vacia para agregar despues en el checklist)
        const nuevaActividad = await Actividad.create({
            nombre,
            descripcion,
            fechaProgramada,
            plaza
        });

        const actividadPoblada = await Actividad.findById(nuevaActividad._id).populate('plaza', 'nombre barrio');

        res.status(201).json({
            mensaje: 'Actividad creada con exito dentro de la jornada activa',
            actividad: actividadPoblada
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Surgio un error al registrar la actividad', error: error.message});
    }
}
//controlador para la modificacion de actividades.
const actualizarActividad = async (req, res) =>{
    try{
        const usuarioId = req.usuario._id;
        const { id } = req.params;
        const { nombre, descripcion, fechaProgramada, plaza, estado } = req.body;

        const actividad = await Actividad.findById(id);
        if (!actividad) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada' });
        }

        const adopcionActual = await Adopcion.findOne({
            usuario: usuarioId,
            plaza: actividad.plaza,
            estado: 'activa'
        });
        if (!adopcionActual) {
            return res.status(403).json({ mensaje: 'No tenes permisos sobre esta actividad'});
        }

        if (fechaProgramada || (plaza && plaza !== String(actividad.plaza))) {
            const jornadaActual = await Jornada.findOne({ estado: 'en_curso'})
                .select('plazas fechaInicio fechaFin');
            if (!jornadaActual) {
                return res.status(400).json({ mensaje: 'No hay ninguna jornada en curso actualmente'});
            }

            if (fechaProgramada) {
                const fechaActividad = new Date(fechaProgramada);
                const fechaInicioJornada = new Date(jornadaActual.fechaInicio);
                const fechaFinJornada = new Date(jornadaActual.fechaFin);
                if (fechaActividad < fechaInicioJornada || fechaActividad > fechaFinJornada) {
                    return res.status(400).json({
                        mensaje: `La fecha programada (${fechaProgramada}) esta fuera de rango de la jornada actual (${jornadaActual.fechaInicio.toISOString().split('T')[0]} al ${jornadaActual.fechaFin.toISOString().split('T')[0]}).`
                    });
                }
            }

            if (plaza && plaza !== String(actividad.plaza)) {
                const plazaEnJornada = jornadaActual.plazas.some(
                    (idPlaza) => idPlaza.toString() === plaza
                );
                if (!plazaEnJornada) {
                    return res.status(400).json({ mensaje: 'La plaza seleccionada no pertenece a la jornada actual'});
                }

                const adopcionNueva = await Adopcion.findOne({ usuario: usuarioId, plaza, estado: 'activa'});
                if (!adopcionNueva){
                    return res.status(403).json({ mensaje: 'No podes mover actividades a una plaza no anexada'});
                }
            }
        }

        actividad.nombre = nombre ?? actividad.nombre;
        actividad.descripcion = descripcion ?? actividad.descripcion;
        actividad.fechaProgramada = fechaProgramada ?? actividad.fechaProgramada;
        actividad.plaza = plaza ?? actividad.plaza;
        actividad.estado = estado ?? actividad.estado;

        await actividad.save();
        const actividadActualizada = await Actividad.findById(id).populate('plaza', 'nombre barrio');

        res.json(actividadActualizada);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos invalidos', error: error.message });
        }
        res.status(500).json({ mensaje: 'Error al actualizar la actividad', error: error.message });
    }

};
//controlador para la busqueda de actividades.

const actualizarTareas = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;
        const { id } = req.params;
        const { tareas } = req.body;

        if (!Array.isArray(tareas)) {
            return res.json({ mensaje: 'El cambo tareas debe ser un arreglo'});
        }
        //buscamos la actividad
        const actividad = await Actividad.findById(id);
        if (!actividad) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada'});
        }
        //verificamos que la plaza de la actividad este entre las adoptadas del coordinador.
        const adopcion = await Adopcion.findOne({
            usuario: usuarioId,
            plaza: actividad.plaza,
            estado: 'activa'
        });
        if (!adopcion) {
            return res.status(403).json({ mensaje: 'No tenes permisos sobre esta actividad'});
        }
        actividad.tareas = tareas;
        await actividad.save();

        //devolvemos actividad actualizada y poblada al front.
        const actividadActualizada = await Actividad.findById(id).populate('plaza','nombre barrio');

        res.json(actividadActualizada);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualr tareas', error: error.message});
    }
}

module.exports = { crearActividad, actualizarActividad, actualizarTareas };