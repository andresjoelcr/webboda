import useParallax from '../hooks/useParallax';
import Sprites from './Sprites';

export default function Escena({ variante, capas = [], registrar, children }) {
  const propio = useParallax();
  const ref = registrar ?? propio;

  return (
    <div className={`escena ${variante}`.trim()}>
      <Sprites />

      {capas.map((capa) => (
        <div
          key={capa.clave}
          className={`capa ${capa.clase}`.trim()}
          data-depth={capa.profundidad}
          ref={ref}
          aria-hidden="true"
        >
          {capa.children}
        </div>
      ))}

      {children}
    </div>
  );
}
