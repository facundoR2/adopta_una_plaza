const express = require('express');
const router = express.Router();
const { crearAvance, obtenerAvancesPorActividad } = require('../controllers/AvanceController');
const { verificarToken } = require('../middlewares/authMiddleware');

//ruta: api/avances

// sin verificar rol para que tanto lo vecino como lo coordinadores suban imagenes.
router.post('/', verificarToken, crearAvance);
router.get('/actividad/:actividadId', verificarToken, obtenerAvancesPorActividad);

module.exports = router;