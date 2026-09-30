export function Flor({ simbolo, tipo = 'rosa', x, y, ancho, rotacion = '0deg', duracion, retraso }) {
  return (
    <span
      className={`flor flor--${tipo}`}
      style={{
        '--x': x,
        '--y': y,
        '--w': ancho,
        '--r': rotacion,
        '--dur': duracion,
        '--delay': retraso,
      }}
    >
      <svg>
        <use href={`#${simbolo}`} />
      </svg>
    </span>
  );
}

export function Objeto({ simbolo, x, y, ancho, rotacion = '0deg', duracion, retraso }) {
  return (
    <span
      className="objeto"
      style={{
        '--x': x,
        '--y': y,
        '--w': ancho,
        '--r': rotacion,
        '--dur': duracion,
        '--delay': retraso,
      }}
    >
      <svg>
        <use href={`#${simbolo}`} />
      </svg>
    </span>
  );
}

export function Seda({ x, y, ancho, rotacion = '0deg', variante = 'una' }) {
  return (
    <span
      className={`seda seda--${variante}`}
      style={{ '--x': x, '--y': y, '--w': ancho, '--r': rotacion }}
    />
  );
}
