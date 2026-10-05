export function getApiBaseUrl() {
    //consigo el host y el puerto de la url del navegador y lo uso para armar la url de la api.
    //para que funcione tanto en un cell como en mi pc. 
  const host = window.location.hostname;
  const port = import.meta.env.VITE_API_PORT || 3000;
  return `http://${host}:${port}/api`;
}
 