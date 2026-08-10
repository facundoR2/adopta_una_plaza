const API_URL = '/api/usuarios';

export async function registerUser({ nombre, apellido, email, password }) {
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
