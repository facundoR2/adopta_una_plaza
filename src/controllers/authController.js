const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Adopcion = require('../models/Adopcion');
const Plaza = require('../models/Plaza');

//funcionalidad para registrar el usuario.

const registrarUsuarioYAdopcion = async (req, res) => {
    //comienza transaccion.
    console.log('comienza authController');
    //variables locales para rollback.
    let nuevoUsuarioGuardado = null;
    let nuevaAdopcionGuardada = null;
    try {
        const { nombre, apellido, email, password, esGrupo, plazaId } = req.body;

        //validar si existe el usuario.
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado'});
        }
        //verificar si plaza existe.
        const plazaExiste = await Plaza.findById(plazaId);
        if(!plazaExiste) {
            return res.status(404).json({ mensaje: ' La plaza seleccionada no existe'});
        }else{
            console.log('id de plaza identificado.!');
        }
        const tipo = esGrupo ? 'grupo' : 'voluntario';
        //crear usuario.
        nuevoUsuarioGuardado = await Usuario.create({
            nombre,
            apellido,
            email,
            password,
            tipo
        });

        // crear adopcion vinculando usuario con plaza seleccionada.
        console.log("iniciando creacion de adopcion.");
        nuevaAdopcionGuardada = await Adopcion.create({
            usuario: nuevoUsuarioGuardado._id,
            plaza: plazaId,
            estado: 'activa'
        });

        // si pasa, muestro una respuesta exitosa.
        res.status(201).json({
            mensaje: 'Registro y adopcíon exitosos',
            usuario: {
                id: nuevoUsuarioGuardado._id,
                nombre: nuevoUsuarioGuardado.nombre,
                email: nuevoUsuarioGuardado.email,
                rol: nuevoUsuarioGuardado.rol,
                tipo: nuevoUsuarioGuardado.tipo
            }
        });
        console.log("iniciando cleaning.");
        //luego de generar el usuario limpiamos.
        nuevoUsuarioGuardado = null;
        nuevaAdopcionGuardada = null;
        console.log("registro Completado.");

    } catch (error) {
        //si surge error, se hace rollback de los cambios en BD.
        console.log("Error Detectado: iniciando rollBack manual.",error);
        if(nuevoUsuarioGuardado) {
            await Usuario.findByIdAndDelete(nuevoUsuarioGuardado._id);
            console.log("Rollback completado: usuario eliminado por error en adopcion");
            await Adopcion.findByIdAndDelete(nuevaAdopcionGuardada._id);
            console.log("Rollback completado: adopcion eliminada.");
        }
        res.status(500).json({ mensaje: 'Error en el servidor al registrar', error: error.message });
    }
};



const verificarEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const usuarioExiste = await Usuario.findOne({ email });

        if (usuarioExiste) {
            return res.status(400).json({ existe: true, mensaje: 'El correo ya está registrado'});
        }
        res.status(200).json({ existe: false});
    } catch (error) {
        res.status(500).json({mensaje: 'Error en el servidor'});
    }
};

const validarLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validar si existe y si son strings.
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({ mensaje: 'Ingrese un email y contraseña validos'});
        }
        //sanitizamos el email.
        const emailSano = email.trim().toLocaleLowerCase();
        console.log(emailSano);
        //buscamos una coincidencia
        const usuario = await Usuario.findOne({ email: emailSano });
        if(!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales invalidas' });
        }
        //comprobamos password.
        const passwordCorrecto = await usuario.comprobarPassword(password);
        if(!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales invalidas'});
        }


        //respuesta correcta.
        res.json({
            mensaje: 'LoginExitoso',
            usuario: {
                //agregar DTO para que solo envie nombre, email y rol.
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (errore) {
        res.status(500).json({ mensaje: 'Error en el servidor durante el login', error: errore.message });
    }
};

module.exports = { registrarUsuarioYAdopcion, verificarEmail, validarLogin };