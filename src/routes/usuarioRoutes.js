const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const  { registrarUsuarioYAdopcion, verificarEmail, validarLogin} = require("../controllers/authController");
const { obtenerPerfilCoordinador } = require('../controllers/CoordinadorController');


// endpoint para funcionalidades basicas de Usuario.

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

// login de usuario
router.post('/login', async (req, res) => {
    try {
        //llamamos controlador.
         await validarLogin(req, res);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

//funcionalidades de Coordinador.
router.get('/coord', obtenerPerfilCoordinador);



module.exports = router;