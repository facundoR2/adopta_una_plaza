const express = require('express');
const router = express.Router();
const Actividad = require('../models/Actividad');
const { actualizarTareas, actualizarActividad, crearActividad} = require('../controllers/activityController');
const { obtenerActividadesCoord } = require('../controllers/CoordinadorController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

//registrar una nueva actividad.
router.post('/actividad', verificarToken,verificarRol('coordinador') , crearActividad );
//buscar actividades del coordinador.
router.get('/coordinador', verificarToken, obtenerActividadesCoord );

//buscar actividad.
//router.get('/:id', verificarRol("coordinador"));
//actualizar actividad.
router.put('/:id', verificarToken, verificarRol('coordinador'), actualizarActividad);

//actualizar estado de tarea de una actividad.
router.patch('/:id/tareas', verificarToken, verificarRol('coordinador'), actualizarTareas);
//borrar actividad.
//router.delete('/:id',verificarRol("coordinador"));

module.exports = router;