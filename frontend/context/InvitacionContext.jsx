import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const POR_DEFECTO = {
  nombres: 'Isabella & Gabriel',
  fecha: '18 de Julio',
  lugar: 'Jardín de los Rosales',
  horaCeremonia: '4:00 PM',
  horaRecepcion: '6:30 PM',
  limiteRsvp: '30 de Junio',
};

const Contexto = createContext(POR_DEFECTO);

export function ProveedorInvitacion({ children }) {
  const ubicacion = useLocation();
  const { token } = useParams();
  const [datos, setDatos] = useState(POR_DEFECTO);
  const [invitado, setInvitado] = useState(null);
  const [tokenActivo, setTokenActivo] = useState(() => (
    new URLSearchParams(ubicacion.search).get('token') || ''
  ));

  useEffect(() => {
    let vigente = true;

    fetch('/api/invitacion/')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (vigente && json) setDatos({ ...POR_DEFECTO, ...json });
      })
      .catch(() => {
        // si la API no responde se conservan los valores por defecto
      });

    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    const coincidencia = ubicacion.pathname.match(/^\/invitacion\/([^/]+)\/?$/);
    const tokenActual = token
      || coincidencia?.[1]
      || new URLSearchParams(ubicacion.search).get('token');

    let vigente = true;
    const ruta = tokenActual
      ? `/api/invitado/${encodeURIComponent(tokenActual)}/`
      : '/api/invitado/sesion/';

    fetch(ruta, { credentials: 'same-origin' })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((json) => {
        if (!vigente) return;
        const invitadoActual = json?.ok ? json.invitado : null;
        setInvitado(invitadoActual);
        setTokenActivo(invitadoActual?.token || tokenActual || '');
      })
      .catch(() => {
        if (vigente && tokenActual) {
          setInvitado(null);
          setTokenActivo('');
        }
      });

    return () => {
      vigente = false;
    };
  }, [token, ubicacion.pathname, ubicacion.search]);

  return (
    <Contexto.Provider value={{ ...datos, invitado, tokenInvitacion: tokenActivo }}>
      {children}
    </Contexto.Provider>
  );
}

export const useInvitacion = () => useContext(Contexto);
