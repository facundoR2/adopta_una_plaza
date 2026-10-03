const Noticia = require('../models/Noticia');
//const Usuario = require('../models/Usuario');

const obtenerNoticiasPublicas = async (req, res) => {
    try {
        const noticias = await Noticia.find({publicado: true})
            .sort({ createdAt: -1});
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las noticias', error: error.message});

    }
};

const obtenerNoticiasAdmin = async (req, res) => {
    try {
        const noticias = await Noticia.find().sort({ createdAt: -1});
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las ad-Noticias', error: error.message});

    }
};


const buscarNoticia = async (req, res)  => {
   try {
       // buscamos la noticia por su id.
       let noticiaId = req.params.id;
       const noticiaBuscada = await Noticia.findById( noticiaId, 'titulo subtitulo descripcion imagen');
       if (!noticiaBuscada){
           console.log('no se encontro la noticia');
       } else {
           console.log('noticia encontrada:', noticiaBuscada.titulo);
       }
       res.json(noticiaBuscada);
   } catch (error) {
       res.status(500).json({ mensaje: 'Error al buscar noticia', error: error.message });
   }
}
const obtenerTanda = async (req, res) => {
    try{
        //obtener un grupo de noticias.( como predeterminado 5 )
        const noticias = await Noticia.find({ publicado: true}, null, null).sort({ createdAt: -1}).limit(5);
        // rellenar con espacios vacios hasta completar 5.
        const noticiasResultado = Array.from({ length: 5}, (_, index) => {
            return noticias[index] || {id: `empty-${index}`, titulo: '', subtitulo: '',descripcion: '', imagen: ''};
        });
        res.json(noticiasResultado);
        
    }catch (e) {
        res.status(500).json({ mensaje: 'Error al obtener noticias', error: e.message });
    }

}
const crearNoticia = async (req, res) =>{
    try {
        const { titulo, subtitulo, descripcion, imagen, publicado, usuario } = req.body;

        if (!titulo || titulo.trim().length === 0){
            return res.status(400).json({ mensaje: 'El titulo es obligatorio'});
        }
        if (!descripcion || descripcion.trim().length === 0) {
            return res.status(400).json({ mensaje: 'La descripcion es es obligatoria'});
        }
        //let autor = Usuario.findById(usuario._id);
        //faltan validacion para la imagenURl. hay que verificar que no sea malicioso.

        const noticia = await Noticia.create({
            titulo,
            subtitulo,
            descripcion,
            imagen,
            publicado,
            autor: req.usuario._id
        });

        res.status(201).json(noticia);
    } catch (error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos invalidos', error: error.message});
        }
        res.status(500).json({mensaje: 'Error al crear noticia:', error: error.message});
    }
}
const actualizarNoticia = async (req, res) =>{
    try{
        const {id} = req.params;
        const { titulo, subtitulo, descripcion, imagen, publicado } = req.body;

        const noticia = await Noticia.findById(id);
        if (!noticia){
            return res.status(404).json({ mensaje: 'Noticia no encontrada'});
        }
        noticia.titulo = titulo ?? noticia.titulo;
        noticia.subtitulo = subtitulo ?? noticia.subtitulo;
        noticia.descripcion = descripcion ?? noticia.descripcion;
        noticia.imagen = imagen ?? noticia.imagen;
        noticia.publicado = publicado ?? noticia.publicado;
        await noticia.save();
        res.json(noticia);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Datos invalidos', error: error.message});
        }
        res.status(500).json({ mensaje: 'Error al actualizar noticia', error: error.message });
    }
};
const eliminarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const noticia = await Noticia.findByIdAndDelete(id);
        if (!noticia) {
            return res.status(404).json({ mensaje: 'Noticia no encontrada'});
        }
        res.json({ mensaje: 'Noticia eliminada correctamente'});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la noticia', error: error.message});
    }
};
const bajarNoticia = async (req, res) => {
    try{
        const noticiaEliminada = await Noticia.findByIdAndUpdate(req.params.id,{ publicado: false });
        if (!noticiaEliminada) return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        res.json({ mensaje: 'Noticia eliminada' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al Borrar noticia', error: error.message });

    }
}
module.exports = { obtenerTanda, crearNoticia, actualizarNoticia, bajarNoticia, buscarNoticia, eliminarNoticia, obtenerNoticiasPublicas,obtenerNoticiasAdmin };