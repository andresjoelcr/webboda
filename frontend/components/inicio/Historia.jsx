import Icono from '../Iconos';
import Seccion from './Seccion';
import { GALERIA, HISTORIA } from '../../pages/inicio/datos';

export default function Historia() {
  return (
    <Seccion
      id="historia"
      icono="corazon"
      antetitulo="Nuestra historia"
      titulo="Como llegamos hasta aqui"
      texto="Cuatro Moments que nos trajeron al dia de hoy."
    >
      <ol className="historia">
        {HISTORIA.map((momento) => (
          <li className="historia__momento" key={momento.anio}>
            <div className="historia__marca" aria-hidden="true">
              <Icono nombre="corazon" />
            </div>

            <article className="historia__tarjeta">
              <div className="historia__foto">
                <img src={momento.foto} alt="" loading="lazy" />
              </div>
              <div className="historia__texto">
                <span className="historia__anio">{momento.anio}</span>
                <h3>{momento.titulo}</h3>
                <p>{momento.texto}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <h3 className="bloque__titulo">
        <Icono nombre="galeria" /> Galeria pre-boda
      </h3>

      <ul className="galeria">
        {GALERIA.map((foto, i) => (
          <li className="galeria__item" key={`${foto.pie}-${i}`}>
            <img src={foto.src} alt={foto.pie} loading="lazy" />
            <span className="galeria__pie">{foto.pie}</span>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
