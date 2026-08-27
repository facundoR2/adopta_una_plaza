import React, { useState } from 'react';

export default function ABMtareas({ actividades = [], onActualizarLista }) {
  // Estado para saber qué tarea estamos editando
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [descripcionEdit, setDescripcionEdit] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Mapeamos todas las actividades para extraer una lista plana de tareas
  // Añadimos la referencia de la actividad a cada tarea para saber a dónde pertenece
  const todasLasTareas = actividades.flatMap(actividad =>
    (actividad.tareas || []).map(tarea => ({
      ...tarea,
      actividadId: actividad._id || actividad.id,
      nombreActividad: actividad.nombre
    }))
  );

  // El backend no tiene un endpoint propio por tarea: las tareas viven
  // adentro de cada Actividad, y se actualizan mandando el array completo
  // (mismo patrón que ya usa ABMactividades en su modal de checklist).
  const actualizarTareasDeActividad = async (actividadId, tareasActualizadas) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || '/api'}/actividades/${actividadId}/tareas`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tareas: tareasActualizadas })
      }
    );
    if (!response.ok) throw new Error('Error al actualizar la tarea');
    return response.json();
  };

  const handleCompletarToggle = async (tareaId, actividadId, completadaActual) => {
    const actividad = actividades.find(a => (a._id || a.id) === actividadId);
    if (!actividad) return;

    const tareasActualizadas = (actividad.tareas || []).map(t =>
      t._id === tareaId ? { ...t, completada: !completadaActual } : t
    );

    try {
      await actualizarTareasDeActividad(actividadId, tareasActualizadas);
      if (onActualizarLista) onActualizarLista();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEliminar = async (tareaId, actividadId) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;

    const actividad = actividades.find(a => (a._id || a.id) === actividadId);
    if (!actividad) return;

    const tareasActualizadas = (actividad.tareas || []).filter(t => t._id !== tareaId);

    try {
      await actualizarTareasDeActividad(actividadId, tareasActualizadas);
      if (onActualizarLista) onActualizarLista();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleStartEdit = (tarea) => {
    setTareaEnEdicion(tarea);
    setDescripcionEdit(tarea.descripcion || '');
  };

  const handleCancelEdit = () => {
    setTareaEnEdicion(null);
    setDescripcionEdit('');
  };

  const handleGuardarEdicion = async () => {
    if (!tareaEnEdicion) return;
    const { _id: tareaId, actividadId } = tareaEnEdicion;
    const actividad = actividades.find(a => (a._id || a.id) === actividadId);
    if (!actividad) return;

    const tareasActualizadas = (actividad.tareas || []).map(t =>
      t._id === tareaId ? { ...t, descripcion: descripcionEdit } : t
    );

    setGuardando(true);
    try {
      await actualizarTareasDeActividad(actividadId, tareasActualizadas);
      handleCancelEdit();
      if (onActualizarLista) onActualizarLista();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="abm-tareas-container" style={{ marginTop: '1rem' }}>
      <h3>Gestión Global de Tareas</h3>

      {todasLasTareas.length === 0 ? (
        <p>No hay tareas registradas en ninguna actividad activa.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th>Actividad</th>
              <th>Descripción de Tarea</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {todasLasTareas.map((tarea) => {
              const enEdicion = tareaEnEdicion?._id === tarea._id;
              return (
                <tr key={tarea._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem 0' }}>{tarea.nombreActividad}</td>
                  <td>
                    {enEdicion ? (
                      <input
                        type="text"
                        value={descripcionEdit}
                        onChange={(e) => setDescripcionEdit(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      tarea.descripcion
                    )}
                  </td>
                  <td>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      backgroundColor: tarea.completada ? '#c6f6d5' : '#fed7d7',
                      color: tarea.completada ? '#22543d' : '#9b2c2c'
                    }}>
                      {tarea.completada ? 'Completada' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {enEdicion ? (
                      <>
                        <button
                          onClick={handleGuardarEdicion}
                          disabled={guardando}
                          style={{ marginRight: '0.5rem' }}
                        >
                          💾 {guardando ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button onClick={handleCancelEdit}>✖️ Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCompletarToggle(tarea._id, tarea.actividadId, tarea.completada)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          ☑️ Estado
                        </button>
                        <button
                          onClick={() => handleStartEdit(tarea)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          ✏️ Editar
                        </button>
                        <button onClick={() => handleEliminar(tarea._id, tarea.actividadId)}>
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}