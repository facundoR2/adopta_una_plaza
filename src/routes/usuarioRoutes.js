const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');


//post para registrar nuevo usuario.
router.post('/registro', async (req, res) => {
    try{
        console.log('se incio el registro de usuario');
        const {nombre, apellido, email, password } = req.body;

        //verifica si existe el email.
        const existeUsuario = await Usuario.findOne({ email});
        if (existeUsuario) {
            return res.status(400).json({mensaje: 'El email ya esta registrado'});
        }

        // crear usuario con password encriptada.
        const nuevoUsuario = await Usuario.create({
            nombre,apellido,email,password,
        });
        // respuesta.
        res.status(201).json({
            mensaje: 'Usuario registrado con éxito',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
            },
        });
    } catch (error){
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message});
    }
});

// login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const passwordCorrecta = await usuario.comprobarPassword(password);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        res.json({
            mensaje: 'Login exitoso',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

module.exports = router;