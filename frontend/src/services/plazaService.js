export async function fetchPlazas() {
    const response = await fetch('/api/plazas/');

    if (!response.ok){
        throw new Error('No se pudo cargar la lista de plazas');
    }
    const data = await response.json();

    //separamos las 10 plazas.
    return data.slice(0, 10);
}

export async function fetchPlazaById(id) {
    const response = await fetch(`/api/plazas/${id}`);
    if (!response.ok) {
        throw new Error('No se pudo cargar la plaza');
    }
    return response.json();
}
