import useContador from '../../hooks/useContador';
import Icono from '../Iconos';

const UNIDADES = [
  { clave: 'dias', etiqueta: 'Días', icono: 'calendario' },
  { clave: 'horas', etiqueta: 'Horas', icono: 'reloj' },
  { clave: 'minutos', etiqueta: 'Minutos', icono: 'reloj' },
  { clave: 'segundos', etiqueta: 'Segundos', icono: 'reloj' },
];

const dosDigitos = (n) => String(n).padStart(2, '0');

export default function Contador({ objetivo }) {
  const { dias, horas, minutos, segundos, terminado } = useContador(objetivo);

  if (terminado) {
    return (
      <p className="contador contador--fin">
        <Icono nombre="corazon" />
        ¡Hoy es el gran dia! Gracias por acompañarnos.
      </p>
    );
  }

  return (
    <div className="contador" role="timer" aria-label="Cuenta regresiva para la boda">
      {UNIDADES.map(({ clave, etiqueta, icono }) => (
        <div className="contador__celda" key={clave}>
          <span className="contador__icono" aria-hidden="true">
            <Icono nombre={icono} />
          </span>
          <span className="contador__valor">
            {clave === 'dias'
              ? dias
              : dosDigitos(
                  clave === 'horas' ? horas : clave === 'minutos' ? minutos : segundos,
                )}
          </span>
          <span className="contador__etiqueta">{etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
