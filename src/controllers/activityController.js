const mongoose = require('mongoose');
const Actividad = require('../models/Actividad');
//const Plaza = require('../models/Plaza');
const Jornada = require('../models/Jornada');

//funcionalidad para registrar actividades (ABM)


const registrarActividad = async (req, res) => {
    console.log('comienza registro actividad');
    let nuevaActividadGuardada = null;
    let jornadaActual = null;
    try {
        const { nombre, fechaProgramada, plazaId, tareas } = req.body;

        //1) validar si no estan vacios.
        if( nombre.length === 0){
            res.status(400).json({ mensaje: 'el nombre de la actividad esta vacio'});
        }
        if (plazaId.length === 0){
            res.status(400).json({ mensaje: 'No hay plaza seleccionada'});
        }
        if(tareas.length === 0){
            res.status(400).json({ mensaje: 'No hay tareas incluidas en la actividad.'});
        }
        //2) validar la fecha. ( tiene que ser dentro de la jornada)
        jornadaActual = await Jornada.findOne({ estado: 'en_curso'}).select('plazas fechaInicio fechaFin');
        if (!jornadaActual) {
            return res.status(400).json({ mensaje: 'No hay ninguna jornada en curso actualmente'});
        }
        const fechaActividad = new Date(fechaProgramada);
        const fechaInicioJornada = new Date(jornadaActual.fechaInicio);
        const fechaFinJornada = new Date(jornadaActual.fechaFin);
        if (fechaActividad < fechaInicioJornada || fechaActividad > fechaFinJornada) {
            return res.status(400).json({ error: `La fecha programada (${fechaProgramada}) está fuera del rango de la jornada Actual (${jornadaActual.fechaInicio.toISOString().split('T')[0]} al ${jornadaActual.fechaFin.toISOString().split('T')[0]}).`
            });
        }

        //3) buscar la plaza seleccionada.
        const idsPlazasPermitidas = jornadaActual.plazas;
        // los id en Mongose son objetos, se suelen convertir en string para compararlos.
        const plazaEsValida = jornadaActual.plazas.some(
            (idPlaza) => idPlaza.toString() === plazaId
        );
        if (!plazaEsValida) {
            return res.status(400).json({
                error: 'La plaza seleccionada no pertenece la jornada actual'
            });
        }
        //4) crear la actividad. y registrar cada tarea dentro.

         nuevaActividadGuardada = await Actividad.create ({
            nombre,
            fechaProgramada,
            plaza: plazaId,
            tareas
        });
        await nuevaActividadGuardada.save();
        res.status(200).json({
            mensaje: 'Actividad creada con éxito dentro de la jornada activa',
            actividad: nuevaActividad
        });

    } catch (e) {
        res.status(500).json({ mensaje: 'Surgio un error al registrar la Actividad', error: e.message });
    }
};

const buscarActividades = (req,res) =>{
    try {
        const {email, plazas} = req.body;
        // hacer busqueda de actividades en adopcion donde el usuario sea el que coincida con el mail y y la plaza.
        // const resultado = await   coordinatorService.buscarPlazas


    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar actividades', error: error.message });
    }
}
module.exports = { registrarActividad };