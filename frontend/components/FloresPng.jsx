/* Imagenes publicas servidas por Django desde /static/ */
export const FLOR_SOLA = '/static/flor_sola.png';
export const FLORES_VARIAS = '/static/flores_varias.png';

export function FlorPng({
  tipo = 'sola',
  x,
  y,
  ancho,
  rotacion = '0deg',
  duracion = '9s',
  retraso = '0s',
  espejo,
  opacidad = 0.96,
}) {
  const fuente = tipo === 'varias' ? FLORES_VARIAS : FLOR_SOLA;

  return (
    <span
      className="flor-png"
      style={{
        '--x': x,
        '--y': y,
        '--w': ancho,
        '--r': rotacion,
        '--dur': duracion,
        '--delay': retraso,
        '--flip': espejo ? -1 : 1,
        '--op': opacidad,
      }}
      aria-hidden="true"
    >
      <img src={fuente} alt="" draggable="false" decoding="async" />
    </span>
  );
}
