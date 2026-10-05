const express = require('express');
const router = express.Router();
const Plaza = require('../models/Plaza');
const {buscarPlaza} = require("../controllers/plazaController");


//ruta 'api/plazas'.
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

// Exportamos el router para que app.js lo pueda usar
module.exports = router;