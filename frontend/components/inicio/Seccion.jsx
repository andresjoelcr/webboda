import { useEffect, useRef } from 'react';

import Icono from '../Iconos';

export default function Seccion({ id, icono, antetitulo, titulo, texto, className = '', flores = true, children }) {
  const referencia = useRef(null);

  /* Las flores de los costados entran cuando la seccion llega a la pantalla. */
  useEffect(() => {
    const seccion = referencia.current;
    if (!seccion) return undefined;

    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        seccion.classList.add('is-flores-visibles');
        observer.unobserve(seccion);
      }
    }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });

    observer.observe(seccion);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={referencia} className={`seccion ${className}`.trim()}>
      {flores ? (
        <>
          <span className="seccion__flores seccion__flores--izq" aria-hidden="true">
            <img src="/static/flor_sola.png" alt="" />
          </span>
          <span className="seccion__flores seccion__flores--der" aria-hidden="true">
            <img src="/static/flores_varias.png" alt="" />
          </span>
        </>
      ) : null}

      <header className="seccion__cabecera">
        {antetitulo ? <p className="seccion__antetitulo">{antetitulo}</p> : null}

        {titulo ? (
          <h2 className="seccion__titulo">
            {icono ? (
              <span className="seccion__icono">
                <Icono nombre={icono} />
              </span>
            ) : null}
            {titulo}
          </h2>
        ) : null}

        {texto ? <p className="seccion__texto">{texto}</p> : null}
      </header>

      {children}
    </section>
  );
}
