const express = require('express');
const router = express.Router();
const {
    obtenerTanda,
    crearNoticia,
    actualizarNoticia,
    bajarNoticia,
    buscarNoticia,
    obtenerNoticiasAdmin,
    eliminarNoticia,
    obtenerNoticiasPublicas
} = require("../controllers/noticiaController");
const { verificarRol, verificarToken } = require('../middlewares/authMiddleware');

// ruta: /api/noticias

// --- Rutas con path fijo PRIMERO (antes de cualquier /:id) ---

// Listado público, solo publicado: true — la ven todos, logueados o no
router.get('/', obtenerNoticiasPublicas);

// Tanda fija de 5 (con relleno), para carruseles tipo home
router.get('/top', obtenerTanda);

// Listado completo para el panel de admin (publicadas + borradores)
router.get('/admin', verificarToken, verificarRol("administrador"), obtenerNoticiasAdmin);

// Crear una noticia
router.post('/new', verificarToken, verificarRol("administrador"), crearNoticia);

// Dar de baja (soft-delete: publicado = false) sin borrar el documento
router.delete('/baja/:id', verificarToken, verificarRol("administrador"), bajarNoticia);

// --- Rutas dinámicas con :id, al final ---

router.get('/:id', buscarNoticia);
router.put('/:id', verificarToken, verificarRol("administrador"), actualizarNoticia);
router.delete('/:id', verificarToken, verificarRol("administrador"), eliminarNoticia);

module.exports = router;
