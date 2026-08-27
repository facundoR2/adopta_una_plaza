import React, {useState} from 'react';
import '../styles/components/ABMactividades.css';

const ETIQUETAS_ESTADO = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

export default function ABMactividades({ actividades = [],plazas = [], onActualizarLista }) {
    const [ actividadEditar, setActividadEditar] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fechaProgramada: '',
        plaza: '',
        estado: 'pendiente'
    });


    //estado para gestionar modal checklist de tareas.
    const [actividadChecklist, setActividadChecklist] = useState(null);
    const [nuevaTarea, setNuevaTarea] = useState('');

    //manejador de cambios.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Prepara el formulario para editar una actividad existente
  const handleStartEdit = (actividad) => {
    setActividadEditar(actividad._id);
    setFormData({
      nombre: actividad.nombre || '',
      descripcion: actividad.descripcion || '',
      fechaProgramada: actividad.fechaProgramada ? actividad.fechaProgramada.split('T')[0] : '',
      plaza: actividad.plaza?._id || actividad.plaza || '',
      estado: actividad.estado || 'pendiente'
    });
  };

  // Cancela la edición y limpia el formulario
  const handleCancelEdit = () => {
    setActividadEditar(null);
    setFormData({ nombre: '', descripcion: '', fechaProgramada: '', plaza: '', estado: 'pendiente' });
  };

  // --- OPERACIÓN 1: CREAR (POST) / ACTUALIZAR (PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.plaza) {
      alert('por favor, selecciona una plaza.');
      return;
    }
    try {
      const url = actividadEditar
        ? `${import.meta.env.VITE_API_URL || '/api'}/actividades/${actividadEditar}`
        : `${import.meta.env.VITE_API_URL || '/api'}/actividades/actividad`;

      const method = actividadEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Para enviar la cookie del usuario auth
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Error al guardar la actividad');
      }

      alert(actividadEditar ? '¡Actividad actualizada con éxito!' : '¡Actividad creada con éxito!');
      handleCancelEdit();
      if (onActualizarLista) onActualizarLista(); // Refresca el estado en el Dashboard principal
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // --- OPERACIÓN 2: ELIMINAR (DELETE) // FALTA TERMINAR ENDPOINT ---
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar o cancelar esta actividad?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/actividades/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la actividad');
      }

      alert('Actividad eliminada correctamente');
      if (onActualizarLista) onActualizarLista();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // --- OPERACIÓN 3: PATCH PARA CHECKLIST DE TAREAS ---
  const handleToggleTarea = async (tareaId, completadaActual) => {
    if (!actividadChecklist) return;

    // Actualización local para la UI inmediata
    const tareasActualizadas = actividadChecklist.tareas.map((t) =>
      t._id === tareaId ? { ...t, completada: !completadaActual } : t
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/actividades/${actividadChecklist._id}/tareas`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tareas: tareasActualizadas })
        }
      );

      if (!response.ok) throw new Error('Error al actualizar checklist');
      
      const data = await response.json();
      setActividadChecklist(data); // Actualiza el modal
      if (onActualizarLista) onActualizarLista();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  //---OPERACION 4: AGREGAR UNA TAREA NUEVA AL LA ACTIVIDAD ---

  const handleAgregarTarea = async (e) => {
    e.preventDefault();
    const descripcion = nuevaTarea.trim();
    if (!descripcion || !actividadChecklist) return;

    const tareasActualizadas = [
      ...(actividadChecklist.tareas || []),
      { descripcion, completada: false }
    ];

    try {
      const response = await fetch(
        `${import.meta.VITE_API_URL || '/api'}/actividades/${actividadChecklist._id}/tareas`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tareas: tareasActualizadas})
        }
      );

      if (!response.ok) throw new Error('Error al agregar la tarea');

      const data = await response.json();
      setActividadChecklist(data);
      setNuevaTarea('');
      if (onActualizarLista) onActualizarLista();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };


  return (
    <div className="abm-container">
      <div className="abm-header">
        <h2>📌 Gestión de Actividades (ABM)</h2>
        <p>Crea, modifica o elimina las jornadas comunitarias para tus plazas asignadas.</p>
      </div>

      {/* --- SECCIÓN FORMULARIO --- */}
      <div className="abm-card-form">
        <h3>{actividadEditar ? '✏️ Editar Actividad' : '➕ Nueva Actividad'}</h3>
        <form onSubmit={handleSubmit} className="abm-form">
          <div className="form-group">
            <label>Nombre de la Actividad</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Jornada de Poda y Limpieza"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles sobre las herramientas necesarias o lugar de encuentro..."
              rows="3"
            />
          </div>

          
          <div className="form-group">
            <label>Fecha Programada</label>
            <input
              type="date"
              name="fechaProgramada"
              value={formData.fechaProgramada}
              onChange={handleChange}
              required
            />
          </div>

          {actividadEditar && (
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange}>
                {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>{etiqueta}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Plaza asignada</label>
              <select 
                name="plaza"
                value={formData.plaza}
                onChange={handleChange}
                required
              >
                <option value="">--Selecciona una plaza --</option>
                {plazas.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.nombre}
                  </option> 
                ))}
              </select>
              {plazas.length === 0 && (
                <p className='form-hint'>No tenes plazas adoptadas?</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {actividadEditar ? 'Guardar Cambios' : 'Crear Actividad'}
            </button>
            {actividadEditar && (
              <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- SECCIÓN TABLA DE ACTIVIDADES (LISTADO) --- */}
      <div className="abm-card-table">
        <h3>📋 Listado de Actividades Registradas</h3>
        {actividades.length === 0 ? (
          <p className="no-data">No hay actividades registradas aún.</p>
        ) : (
          <table className="abm-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Plaza</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((act) => (
                <tr key={act._id || act.id}>
                  <td><strong>{act.nombre}</strong></td>
                  <td>{act.plaza?.nombre || 'Plaza asignada'}</td>
                  <td>{act.fechaProgramada ? act.fechaProgramada.split('T')[0] : 'Sin fecha'}</td>
                  <td>
                    <span className={`badge-status status-${act.estado || 'pendiente'}`}>
                      {ETIQUETAS_ESTADO[act.estado] || 'Pendiente'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-action edit"
                      title="Editar datos de la jornada"
                      onClick={() => handleStartEdit(act)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-action checklist"
                      title="Gestionar checklist de tareas"
                      onClick={() => setActividadChecklist(act)}
                    >
                      ☑️ Checklist
                    </button>
                    <button
                      className="btn-action delete"
                      title="Eliminar actividad"
                      onClick={() => handleDelete(act._id)}
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

      {/* --- MODAL PARA CHECKLIST INTERACTIVO (PATCH /:id/tareas) --- */}
      {actividadChecklist && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>☑️ Checklist de Tareas: {actividadChecklist.nombre}</h3>
            <ul className="checklist-items">
              {actividadChecklist.tareas && actividadChecklist.tareas.length > 0 ? (
                actividadChecklist.tareas.map((t) => (
                  <li key={t._id || t.descripcion} className={t.completada ? 'completed' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={t.completada || false}
                        onChange={() => handleToggleTarea(t._id, t.completada)}
                      />
                      {t.descripcion}
                    </label>
                  </li>
                ))
              ) : (
                <p>No hay tareas agregadas a esta actividad.</p>
              )}
            </ul>
            <form onSubmit={handleAgregarTarea} className='form-agregar-tarea'>
              <input
                type='text'
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder='EJ: Podar sector norte'
              />
              <button type='submit' className='btn-save' disabled={!nuevaTarea.trim()}>
                Agregar Tarea
              </button>
            </form>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setActividadChecklist(null)}>
                Cerrar Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}