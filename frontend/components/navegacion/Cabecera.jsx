import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Icono from '../Iconos';
import { PAGINAS } from '../../pages/inicio/datos';
import { useInvitacion } from '../../context/InvitacionContext';

export default function Cabecera() {
  const { pathname, hash, search } = useLocation();
  const tokenEnRuta = pathname.match(/^\/invitacion\/([^/]+)\/?$/)?.[1];
  const { tokenInvitacion } = useInvitacion();
  const token = new URLSearchParams(search).get('token') || tokenEnRuta || tokenInvitacion;
  const [desplazada, setDesplazada] = useState(false);

  /* Al bajar la barra se comprime y aparece una linea de avance */
  useEffect(() => {
    const raiz = document.documentElement;

    const alDesplazar = () => {
      setDesplazada(window.scrollY > 20);

      const recorrido = raiz.scrollHeight - window.innerHeight;
      const avance = recorrido > 0 ? Math.min(window.scrollY / recorrido, 1) : 0;
      raiz.style.setProperty('--avance', avance.toFixed(4));
    };

    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    window.addEventListener('resize', alDesplazar);

    return () => {
      window.removeEventListener('scroll', alDesplazar);
      window.removeEventListener('resize', alDesplazar);
    };
  }, []);

  useEffect(() => {
    if (!hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <header className="cabecera" data-desplazada={desplazada}>
      <nav className="cabecera__nav" aria-label="Secciones de la boda">
        {PAGINAS.filter((pagina) => pagina.navegacionLateral || pagina.destacado)
          .sort((a, b) => Number(Boolean(a.destacado)) - Number(Boolean(b.destacado)))
          .map((pagina) => (
          <Link
            key={pagina.ruta}
            className={`cabecera__enlace${pagina.destacado ? ' cabecera__enlace--cta' : ''}`}
            to={{
              pathname: pagina.ruta,
              search: token ? `?token=${encodeURIComponent(token)}` : '',
              hash: pagina.ancla || '',
            }}
            aria-current={pathname === pagina.ruta && (!pagina.ancla || !hash || hash === pagina.ancla) ? 'page' : undefined}
            aria-label={pagina.texto}
          >
            <span className="cabecera__icono"><Icono nombre={pagina.icono} /></span>
            <span className="cabecera__texto" aria-hidden="true">{pagina.texto}</span>
          </Link>
        ))}
      </nav>

      <span className="cabecera__avance" aria-hidden="true" />
    </header>
  );
}
