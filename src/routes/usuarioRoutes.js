const express = require('express');
const {verificarToken} = require("../middlewares/authMiddleware");
const { obtenerPlazasAsociadas } = require('../controllers/usuarioController');
const router = express.Router();

//rutas para funcionalidades de usuario.

router.get('/mis-plazas', verificarToken, obtenerPlazasAsociadas );

//ruta para agregar avances (PROX).

//ruta para modificar avances(PROX).

module.exports = router;