const API_URL = '/api/noticias';

export async function getNoticias() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al cargar noticias');
  return response.json();
}

export async function createNoticia(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al crear noticia');
  }
  return response.json();
}

export async function updateNoticia(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al actualizar noticia');
  }
  return response.json();
}

export async function deleteNoticia(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.mensaje || 'Error al eliminar noticia');
  }
  return response.json();
}
