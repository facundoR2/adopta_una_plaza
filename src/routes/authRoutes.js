const express = require('express');
const router = express.Router();
const  { registrarUsuarioYAdopcion, verificarEmail, validarLogin} = require("../controllers/authController");
const { obtenerActividadesCoord } = require('../controllers/CoordinadorController');
const {verificarToken} = require("../middlewares/authMiddleware");


// endpoint para funciones de auntenticacion.

// validar email. lo uso principalmente para registro en pasos y permisos para los dashboards.
router.post('/verificar-email', verificarEmail);
//post para registrar nuevo usuario.
router.post('/registro', async (req, res) => {
    try{
        //falaria un dto aca.
        console.log('Comienza el registro de usuario');
        await registrarUsuarioYAdopcion(req, res);
    } catch (error){
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message});
    }
});

// login de usuario //verificar.
router.post('/login', async (req, res) => {
    try {
        //llamamos controlador.
         await validarLogin(req, res);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ mensaje: 'Sesion cerrada exitosamente'});
});

module.exports = router;