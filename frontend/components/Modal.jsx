import { useEffect, useId, useRef } from 'react';

import Icono from './Iconos';

/* Ventana emergente de la boda: se cierra con el boton, con Escape o haciendo
   clic fuera de la carta, y al cerrarla devuelve el foco al sitio.
   Sin `children` muestra un aviso (boton de accion); con `children` se convierte
   en una ventana de formulario y el contenido va dentro de la carta.
   `imagen` reemplaza el icono de arriba por una foto. */
export default function Modal({
  abierto,
  titulo,
  mensaje,
  icono = 'alerta',
  imagen,
  boton = 'Entendido',
  alCerrar,
  children,
}) {
  const id = useId();
  const accion = useRef(null);
  const cuerpo = useRef(null);
  const devolverFoco = useRef(null);
  const conFormulario = Boolean(children);

  useEffect(() => {
    if (!abierto) return undefined;

    devolverFoco.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    if (conFormulario) cuerpo.current?.querySelector('input, textarea, select, button')?.focus();
    else accion.current?.focus();

    const alTeclear = (e) => {
      if (e.key === 'Escape') alCerrar();
    };

    document.addEventListener('keydown', alTeclear);

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
      devolverFoco.current?.focus?.();
    };
  }, [abierto, alCerrar, conFormulario]);

  if (!abierto) return null;

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) alCerrar();
      }}
    >
      <div
        className="modal__carta"
        data-variante={conFormulario ? 'formulario' : undefined}
        role={conFormulario ? 'dialog' : 'alertdialog'}
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        aria-describedby={mensaje ? `${id}-mensaje` : undefined}
      >
        <button type="button" className="modal__cerrar" onClick={alCerrar} aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>

        {imagen ? (
          <span className="modal__marca" aria-hidden="true">
            <img src={imagen} alt="" />
          </span>
        ) : (
          <span className="modal__icono" data-icono={icono} aria-hidden="true">
            <Icono nombre={icono} />
          </span>
        )}

        <h2 className="modal__titulo" id={`${id}-titulo`}>
          {titulo}
        </h2>
        {mensaje ? (
          <p className="modal__mensaje" id={`${id}-mensaje`}>
            {mensaje}
          </p>
        ) : null}

        {conFormulario ? (
          <div className="modal__formulario" ref={cuerpo}>{children}</div>
        ) : (
          <button
            type="button"
            className="boton boton--oro modal__accion"
            onClick={alCerrar}
            ref={accion}
          >
            {boton}
          </button>
        )}
      </div>
    </div>
  );
}
