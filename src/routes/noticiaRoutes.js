const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');

// Obtener todas las noticias
router.get('/', async (req, res) => {
    try {
        const noticias = await Noticia.find().sort({ createdAt: -1 });
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener noticias', error: error.message });
    }
});

// Crear una noticia
router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, autor, imagenUrl, publicado } = req.body;
        const noticia = await Noticia.create({ titulo, descripcion, autor, imagenUrl, publicado });
        res.status(201).json({ mensaje: 'Noticia creada', noticia });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear noticia', error: error.message });
    }
});

// Modificar una noticia
router.put('/:id', async (req, res) => {
    try {
        const noticiaActualizada = await Noticia.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!noticiaActualizada) return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        res.json({ mensaje: 'Noticia actualizada', noticia: noticiaActualizada });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar noticia', error: error.message });
    }
});

// Eliminar una noticia
router.delete('/:id', async (req, res) => {
    try {
        const noticiaEliminada = await Noticia.findByIdAndDelete(req.params.id);
        if (!noticiaEliminada) return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        res.json({ mensaje: 'Noticia eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar noticia', error: error.message });
    }
});

module.exports = router;
