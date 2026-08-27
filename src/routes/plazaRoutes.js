const express = require('express');
const router = express.Router();
const Plaza = require('../models/Plaza');
const {buscarPlaza} = require("../controllers/plazaController");


// rutas para el manejo de plazas (admins), consultas generales  y votaciones en tiempo real.

// 1. Endpoint para obtener todas las plazas (GET /api/plazas)
router.get('/', async (req, res) => {
    try {
        const plazas = await Plaza.find().sort({ votos: -1 }); // Trae todo ordenado por votos
        res.json(plazas);
    } catch (error) {
        console.error("Error al obtener las plazas:", error);
        res.status(500).json({ error: 'Error en el servidor de base de datos' });
    }
});
//buscar plaza por id.
router.get('/:id', buscarPlaza);

// 2. Endpoint para registrar un voto (POST /api/plazas/votar)
router.post('/votar', async (req, res) => {
    const { uid } = req.body;
    try {
        const plazaActualizada = await Plaza.findOneAndUpdate(
            { uid: uid },
            { $inc: { votos: 1 } },
            { new: true } // Para que devuelva la plaza con el voto ya sumado
        );

        if (!plazaActualizada) {
            return res.status(404).json({ error: 'Plaza no encontrada' });
        }

        // Opcional: Si usas WebSockets para tiempo real, puedes emitir el evento desde aquí:
        // req.app.get('io').emit('plaza-actualizada', plazaActualizada);

        res.json(plazaActualizada);
    } catch (error) {
        console.error("Error al registrar el voto:", error);
        res.status(500).json({ error: 'No se pudo procesar el voto' });
    }
});


// Exportamos el router para que app.js lo pueda usar
module.exports = router;