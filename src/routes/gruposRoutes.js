const express = require('express');
const router = express.Router();
const Grupo = require('../models/Grupo'); //subimos un nivel para buscar el modelo de grupo.

//1) crear un grupo voluntario asignado a una plaza.
router.post('/', async (req, res) => {
    const { nombreGrupo, voluntarios, plazaId } = req.body;
    try {
        const nuevoGrupo = new Grupo({
            nombreGrupo,
            voluntarios, //array de nombres de los voluntario.
            plaza: plazaId // el id de la plaza a la que estan asignados.
        });
        const grupoGuardado = await nuevoGrupo.save();
        res.status(201).json({ mensaje: 'Grupo y voluntarios registrados con exito', grupo: grupoGuardado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar el grupo', error: error.message });
    }
});

//2) consultar grupos activos.
router.get('/plaza/:plazaId', async (req,res) => {
    try {
        const grupos = await Grupo.find({ plaza: req.params.plazaId});
        res.json(grupos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al consultar los grupos', error: error.message});
    }
});

module.exports = router;