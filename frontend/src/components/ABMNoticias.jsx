import React, { useState} from "react";
import { crearNoticia, actualizarNoticia, eliminarNoticia} from "../services/noticiaService.js";

export default function ABMNoticias({ noticias = [], onActualizarLista }) {
    const [noticiaEditar, setNoticiaEditar] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        subtitulo: '',
        descripcion: '',
        imagen: '',
        publicado: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleStartEdit = (noticia) => {
        setNoticiaEditar(noticia._id);
        setFormData({
            titulo: noticia.titulo || '',
            subtitulo: noticia.subtitulo || '',
            descripcion: noticia.descripcion || '',
            imagen: noticia.imagen || '',
            publicado: noticia.publicado ?? true
        });
    };

    const handleCancelEdit = () => {
        setNoticiaEditar(null);
        setFormData({ titulo: '', subtitulo: '', descripcion: '', imagen: '', publicado: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (noticiaEditar) {
                await actualizarNoticia(noticiaEditar, formData);
                alert(' Noticia actualizada con exito');
            } else {
                await crearNoticia(formData);
                alert(' noticia creada con exito');
            }
            handleCancelEdit();
            if (onActualizarLista) onActualizarLista();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };


    const handleTogglePublicado = async (noticia) => {
        try {
            await actualizarNoticia(noticia._id, {publicado: !noticia.publicado});
            if (onActualizarLista) onActualizarLista();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta noticia definitivamente? Esta accion no se puede deshacer.'))
            return;
        try {
            await eliminarNoticia(id);
            alert('Noticia eliminada correctamente');
            if (onActualizarLista) onActualizarLista();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="abm-container">
            <div className="abm-header">
                <h2>📰 Gestión de Noticias</h2>
                <p>Creá, editá, publicá/despublicá o eliminá las publicaciones del programa.</p>
            </div>

            {/* --- FORMULARIO --- */}
            <div className="abm-card-form">
                <h3>{noticiaEditar ? '✏️ Editar Noticia' : '➕ Nueva Noticia'}</h3>
                <form onSubmit={handleSubmit} className="abm-form">
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Nueva revista de plaza verde"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Subtítulo</label>
                        <input
                            type="text"
                            name="subtitulo"
                            value={formData.subtitulo}
                            onChange={handleChange}
                            placeholder="Ej: 20 asociados"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Contenido de la noticia..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>URL de la imagen</label>
                        <input
                            type="url"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group form-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="publicado"
                                checked={formData.publicado}
                                onChange={handleChange}
                            />
                            {' '}Publicada (visible para todos los usuarios)
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            {noticiaEditar ? 'Guardar Cambios' : 'Crear Noticia'}
                        </button>
                        {noticiaEditar && (
                            <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                                Cancelar Edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- TABLA --- */}
            <div className="abm-card-table">
                <h3>📋 Noticias Registradas</h3>
                {noticias.length === 0 ? (
                    <p className="no-data">No hay noticias registradas aún.</p>
                ) : (
                    <table className="abm-table">
                        <thead>
                        <tr>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {noticias.map((noticia) => (
                            <tr key={noticia._id}>
                                <td><strong>{noticia.titulo}</strong></td>
                                <td>
                    <span className={`badge-status status-${noticia.publicado ? 'publicada' : 'borrador'}`}>
                      {noticia.publicado ? 'Publicada' : 'Borrador / Baja'}
                    </span>
                                </td>
                                <td>{noticia.createdAt ? noticia.createdAt.split('T')[0] : 'Sin fecha'}</td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-action edit"
                                        title="Editar noticia"
                                        onClick={() => handleStartEdit(noticia)}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        className="btn-action toggle"
                                        title={noticia.publicado ? 'Despublicar' : 'Publicar'}
                                        onClick={() => handleTogglePublicado(noticia)}
                                    >
                                        {noticia.publicado ? '🙈 Despublicar' : '📣 Publicar'}
                                    </button>
                                    <button
                                        className="btn-action delete"
                                        title="Eliminar noticia"
                                        onClick={() => handleDelete(noticia._id)}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}