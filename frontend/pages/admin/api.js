const CSRF = 'csrftoken';

export function leerCookie(nombre) {
  const encontrada = document.cookie
    .split('; ')
    .find((fila) => fila.startsWith(`${nombre}=`));

  return encontrada ? decodeURIComponent(encontrada.split('=').slice(1).join('=')) : '';
}

/* El panel usa la sesion de Django: por eso viaja con credenciales y
   siempre con el token CSRF que el servidor dejo en la cookie. */
async function peticion(ruta, { metodo = 'GET', datos = null } = {}) {
  const cabeceras = { 'X-CSRFToken': leerCookie(CSRF) };
  const opciones = { method: metodo, headers: cabeceras, credentials: 'same-origin' };

  if (datos !== null) {
    cabeceras['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(`/api${ruta}`, opciones);
  const json = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || json.ok === false) {
    const error = new Error(json.error || 'No pudimos completar la operacion');
    error.estado = respuesta.status;
    throw error;
  }

  return json;
}

export const sesion = () => peticion('/admin/sesion/');
export const entrar = (usuario, clave) => peticion('/admin/login/', { metodo: 'POST', datos: { usuario, clave } });
export const salir = () => peticion('/admin/logout/', { metodo: 'POST', datos: {} });
export const resumen = () => peticion('/admin/resumen/');
export const invitados = () => peticion('/admin/invitados/');
export const crearInvitado = (datos) => peticion('/admin/invitados/crear/', { metodo: 'POST', datos });
export const borrarInvitado = (id) => peticion(`/admin/invitados/${id}/`, { metodo: 'POST', datos: {} });
