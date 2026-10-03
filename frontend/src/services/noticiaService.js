const API_URL = import.meta.env.BASE_URL;

export async function getNoticiasAdmin() {
  const response = await fetch(`${API_URL}/noticias/admin`,{
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Error al cargar noticias');
  return response.json();
}

export async function crearNoticia(data) {
  const response = await fetch(`${API_URL}/noticias/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al crear noticia');
  }
  return response.json();
}

export async function actualizarNoticia(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al actualizar noticia');
  }
  return response.json();
}

export async function eliminarNoticia(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al eliminar noticia');
  }
  return response.json();
}
