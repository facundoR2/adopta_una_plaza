const API_URL = '/api/actividades';

export async function getActividades(mes) {
  const url = mes ? `${API_URL}?mes=${encodeURIComponent(mes)}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar actividades');
  return response.json();
}

//funcion de coordinador para buscar actividades anexadas a la plaza/s.
export async function getCoordActivitys() {
  const response = await fetch(`${API_URL}/coordinador`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json' },
    credentials: 'include'
  });
  if(!response.ok){
    throw new Error('Error al buscar actividades de plazas');
  }
  return response.json();
}

export async function getMisPlazas() {
  const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/usuarios/mis-plazas`,{
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Error al obtener tus plazas');
  const data = await response.json();
  return data.plazas || [];
};

export async function getActividad(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Actividad no encontrada');
  return response.json();
}

export async function createActividad(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al crear actividad');
  }
  return response.json();
}

export async function updateActividad(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al actualizar actividad');
  }
  return response.json();
}

export async function deleteActividad(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al eliminar actividad');
  }
  return response.json();
}

export async function updateTarea(actividadId, tareaId, completada) {
  const response = await fetch(`${API_URL}/${actividadId}/tareas/${tareaId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completada }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al actualizar tarea');
  }
  return response.json();
}
