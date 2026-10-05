import { getApiBaseUrl } from "./Apiconfig";
 //pasar estas funciones a authService.
export async function checkEmailExists(email) {
  const response = await fetch(`${getApiBaseUrl()}/verificar-email`, {
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
    
    const response = await fetch(`${getApiBaseUrl()}/registro`, {
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
    const response = await fetch(`${getApiBaseUrl()}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || errorData?.mensaje || 'Error en el login';
      throw new Error(message);
    }

    return data; 
  } catch (error) {
    throw new Error(error?.message || 'No se pudo conectar con el backend');
  }
}
export const logoutUser = async () => {
  const response = await fetch(`${getApiBaseUrl()}/logout`,{
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Error al cerrar sesion');
  }
  return await response.json();
}
