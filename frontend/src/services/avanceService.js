import { getApiBaseUrl } from "./Apiconfig";

export async function crearAvance(datos) {
    const response = await fetch(`${getApiBaseUrl()}/avances`, {
        method: 'POST',
        headers:  {'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos)
    });
    if ( !response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.mensaje || 'Error al subir avance');
    }
    return response.json();
};

export async function getAvancesPorActividad(actividadId) {
    const response = await fetch(`${getApiBaseUrl()}/avances/actividad/${actividadId}`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('No se pudieron cargar los avances');
    return response.json();
};