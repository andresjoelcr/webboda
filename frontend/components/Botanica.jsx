function estandar({ clase, x, y, ancho, rotacion, duracion, retraso, espejo }) {
  return {
    className: `flor ${clase}`,
    style: {
      '--x': x,
      '--y': y,
      '--w': ancho,
      '--r': rotacion,
      '--dur': duracion,
      '--delay': retraso,
      '--flip': espejo ? -1 : 1,
    },
  };
}

export function Rama({ x, y, ancho, rotacion = '0deg', duracion = '9s', retraso = '0s', espejo }) {
  const { className, style } = estandar({
    clase: 'botanica__rama',
    x,
    y,
    ancho,
    rotacion,
    duracion,
    retraso,
    espejo,
  });

  return (
    <span className={className} style={style} aria-hidden="true">
      <svg>
        <use href="#rama-eucalipto" />
      </svg>
    </span>
  );
}

export function FlorBlanca({ x, y, ancho, rotacion = '0deg', duracion = '8s', retraso = '0s', tipo = 'blanca', espejo }) {
  const simbolo = tipo === 'peonia' ? 'flor-rosa' : 'flor-hortensia';
  const { className, style } = estandar({
    clase: `botanica__flor botanica__flor--${tipo}`,
    x,
    y,
    ancho,
    rotacion,
    duracion,
    retraso,
    espejo,
  });

  return (
    <span className={className} style={style} aria-hidden="true">
      <svg>
        <use href={`#${simbolo}`} />
      </svg>
    </span>
  );
}

export function Racimo({ x, y, ancho, rotacion = '0deg', duracion = '11s', retraso = '0s', espejo }) {
  const className = 'flor botanica__racimo';
  const style = {
    '--x': x,
    '--y': y,
    '--w': ancho,
    '--r': rotacion,
    '--dur': duracion,
    '--delay': retraso,
    '--flip': espejo ? -1 : 1,
  };

  return (
    <span className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 220 220">
        <use href="#rama-eucalipto" x="128" y="70" width="44" height="121" />
        <use href="#rama-eucalipto" x="46" y="96" width="34" height="94" />
        <use href="#flor-hortensia" x="6" y="18" width="104" height="104" />
        <use href="#flor-rosa" x="96" y="4" width="88" height="88" />
        <use href="#flor-rosa" x="24" y="96" width="76" height="76" />
        <use href="#floreto" x="146" y="150" width="30" height="30" />
        <use href="#floreto" x="16" y="164" width="26" height="26" />
        <use href="#floreto" x="104" y="184" width="22" height="22" />
      </svg>
    </span>
  );
}
