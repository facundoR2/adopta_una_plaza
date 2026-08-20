const API_URL = '/api/auth';

export async function checkEmailExists(email) {
  const response = await fetch(`${API_URL}/verificar-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ email }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error al verificar el email');
  }

  return data.existe; // devuelve un boolean, false si esta libre.
}

export async function registerUser({ nombre, apellido, email, password, esGrupo, plazaId }) {
  try {
    
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        apellido,
        email,
        password,
        esGrupo,
        plazaId,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || errorData?.mensaje || 'Error en el registro';
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error?.message || 'No se pudo conectar con el backend');
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || errorData?.mensaje || 'Error en el login';
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error?.message || 'No se pudo conectar con el backend');
  }
}
