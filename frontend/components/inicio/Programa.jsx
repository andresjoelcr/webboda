import { useEffect, useState } from 'react';

import Icono from '../Iconos';
import Seccion from './Seccion';
import { useInvitacion } from '../../context/InvitacionContext';
import { BODA, ITINERARIO } from '../../pages/inicio/datos';

const TOTAL = ITINERARIO.length;

/* Una sola lluvia de petalos sobre el cronograma: cada hoja tiene su tamano,
   su punto de partida, su velocidad y su deriva. */
const PETALOS = [
  { x: '3%', w: '1.5rem', d: '5.4s', t: '0s', deriva: '2.4rem', giro: '160deg' },
  { x: '9%', w: '.85rem', d: '6.2s', t: '.35s', deriva: '-2rem', giro: '260deg' },
  { x: '15%', w: '2rem', d: '4.9s', t: '.1s', deriva: '3rem', giro: '120deg' },
  { x: '22%', w: '1.1rem', d: '5.8s', t: '.6s', deriva: '-2.6rem', giro: '300deg' },
  { x: '28%', w: '1.7rem', d: '5.1s', t: '.2s', deriva: '1.8rem', giro: '200deg' },
  { x: '34%', w: '.75rem', d: '6.6s', t: '.85s', deriva: '-3rem', giro: '140deg' },
  { x: '41%', w: '1.35rem', d: '5.6s', t: '.45s', deriva: '2.2rem', giro: '340deg' },
  { x: '47%', w: '1.9rem', d: '4.7s', t: '.05s', deriva: '-1.6rem', giro: '220deg' },
  { x: '53%', w: '.95rem', d: '6s', t: '.7s', deriva: '2.8rem', giro: '180deg' },
  { x: '59%', w: '1.6rem', d: '5.3s', t: '.3s', deriva: '-2.2rem', giro: '280deg' },
  { x: '64%', w: '.8rem', d: '6.4s', t: '1s', deriva: '2.6rem', giro: '120deg' },
  { x: '70%', w: '1.25rem', d: '5.75s', t: '.5s', deriva: '-2.8rem', giro: '230deg' },
  { x: '76%', w: '1.8rem', d: '4.85s', t: '.15s', deriva: '1.9rem', giro: '310deg' },
  { x: '82%', w: '.9rem', d: '6.1s', t: '.75s', deriva: '-2.1rem', giro: '170deg' },
  { x: '88%', w: '1.45rem', d: '5.45s', t: '.4s', deriva: '2.5rem', giro: '250deg' },
  { x: '94%', w: '1.05rem', d: '5.95s', t: '.95s', deriva: '-1.8rem', giro: '200deg' },
];

export default function Programa() {
  const { horaCeremonia, horaRecepcion, fecha, invitado } = useInvitacion();
  const [indice, setIndice] = useState(0);
  const [sentido, setSentido] = useState('der');

  /* Se reemplaza la actividad en una sola hoja para evitar duplicados. */
  const voltear = (siguiente, direccion) => {
    setSentido(direccion);
    setIndice(siguiente);
  };

  const mover = (paso) => {
    voltear((indice + paso + TOTAL) % TOTAL, paso < 0 ? 'izq' : 'der');
  };

  const irA = (nuevo) => {
    if (nuevo === indice) return;
    voltear(nuevo, nuevo > indice ? 'der' : 'izq');
  };

  useEffect(() => {
    const elementos = document.querySelectorAll(
      '.hero--programa .hero__contenido, .programa__cronograma .seccion__cabecera, .cuaderno, .programa__ubicacion .seccion__cabecera, .ubicacion__rosa, .ubicacion__marco',
    );
    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -35px 0px' });

    elementos.forEach((elemento) => observer.observe(elemento));
    return () => observer.disconnect();
  }, []);

  const momento = ITINERARIO[indice];

  return (
    <>
      <section className="hero hero--programa" id="programa-bienvenida">
        <video className="hero__video" aria-hidden="true" autoPlay muted loop playsInline preload="metadata">
          <source src="/static/video_programa.mp4" type="video/mp4" />
        </video>
        <div className="hero__velo" aria-hidden="true" />

        <div className="hero__contenido">
          <p className="hero__antetitulo"><span>{BODA.fechaTexto}</span></p>
          <h1 className="hero__nombres">Programa</h1>
          {invitado ? (
            <p className="hero__invitacion programa__destinatario">
              {invitado.nombre} y familia {invitado.familia}
            </p>
          ) : null}
          <p className="hero__invitacion">El cronograma de la jornada y todos los datos del lugar para que llegues con tiempo y sepas que esperar.</p>
          <p className="hero__fecha">
            <span>{BODA.lugar}</span>
            <span className="hero__fecha-completa">{fecha}</span>
          </p>
        </div>

        <a className="hero__bajar" href="#cronograma" aria-label="Ir al cronograma de actividades">
          <span>Ver el cronograma</span><span className="hero__bajar-flecha" aria-hidden="true">&#8595;</span>
        </a>
      </section>

      <Seccion
        id="cronograma"
        className="programa__cronograma"
        icono="reloj"
        antetitulo="La jornada paso a paso"
        titulo="Cronograma de actividades"
        texto="Recorre las flechas del cuaderno para ver cada momento del dia, desde la ceremonia hasta el ultimo brindis."
      >
        <span className="cronograma__petalos" aria-hidden="true">
          {PETALOS.map((petalo, i) => (
            <img
              key={i}
              className="cronograma__petalo"
              src="/static/petalo1.png"
              alt=""
              style={{
                '--x': petalo.x,
                '--w': petalo.w,
                '--d': petalo.d,
                '--t': petalo.t,
                '--deriva': petalo.deriva,
                '--giro': petalo.giro,
              }}
            />
          ))}
        </span>
        <div className="cuaderno" id="cuaderno-pagina">
          <span className="cuaderno__espiral" aria-hidden="true" />

          <div className="cuaderno__hojas">
            <article className={`cuaderno__pagina cuaderno__pagina--${sentido}`} key={indice}>
              <span className={`cuaderno__numero cuaderno__numero--${sentido}`} aria-hidden="true">
                {indice + 1}
              </span>
              <p className="cuaderno__hora">{momento.hora}</p>
              <h3 className="cuaderno__titulo">{momento.titulo}</h3>
              <p className="cuaderno__texto">{momento.texto}</p>
              <span className="cuaderno__sello" aria-hidden="true">
                <Icono nombre={momento.icono} />
              </span>
            </article>

          </div>

          <div className="cuaderno__controles">
            <button type="button" className="cuaderno__flecha" onClick={() => mover(-1)} aria-controls="cuaderno-pagina" aria-label="Actividad anterior">
              <span aria-hidden="true">&#8249;</span>
            </button>

            <ol className="cuaderno__pasos">
              {ITINERARIO.map((paso, i) => (
                <li key={paso.hora}>
                  <button
                    type="button"
                    className={`cuaderno__paso${i === indice ? ' es-activo' : ''}`}
                    aria-current={i === indice ? 'step' : undefined}
                    aria-label={`${paso.hora} ${paso.titulo}`}
                    onClick={() => irA(i)}
                  />
                </li>
              ))}
            </ol>

            <button type="button" className="cuaderno__flecha" onClick={() => mover(1)} aria-controls="cuaderno-pagina" aria-label="Actividad siguiente">
              <span aria-hidden="true">&#8250;</span>
            </button>
          </div>

          <p className="cuaderno__conteo"><span>{indice + 1}</span> / {TOTAL}</p>
        </div>
      </Seccion>

      <Seccion
        id="ubicacion"
        className="programa__ubicacion"
        icono="mapa"
        antetitulo="Donde y cuando"
        titulo="Ubicacion"
        texto="Aqui esta el lugar, la hora de cada momento y como llegar sin perdida."
        flores={false}
      >
        <span className="ubicacion__rosas" aria-hidden="true">
          <img className="ubicacion__rosa ubicacion__rosa--izq" src="/static/rosas_blancas.png" alt="" />
          <img className="ubicacion__rosa ubicacion__rosa--der" src="/static/rosas_blancas.png" alt="" />
        </span>

        <div className="ubicacion__marco-envoltura">
          <article className="ubicacion__marco">
            <img className="ubicacion__marco-flor" src="/static/marcos_fotos.png" alt="" aria-hidden="true" />

            <div className="ubicacion__contenido">
              <h3 className="ubicacion__lugar">
                <Icono nombre="mapa" /> {BODA.lugar}
              </h3>
              <p className="ubicacion__direccion">{BODA.direccion}</p>

              <dl className="ubicacion__datos">
                <div className="ubicacion__fila">
                  <dt>
                    <Icono nombre="calendario" /> Dia
                  </dt>
                  <dd>{BODA.fechaTexto}</dd>
                </div>
                <div className="ubicacion__fila">
                  <dt>
                    <Icono nombre="anillos" /> Ceremonia
                  </dt>
                  <dd>{horaCeremonia}</dd>
                </div>
                <div className="ubicacion__fila">
                  <dt>
                    <Icono nombre="festejo" /> Recepcion
                  </dt>
                  <dd>{horaRecepcion}</dd>
                </div>
                <div className="ubicacion__fila">
                  <dt>
                    <Icono nombre="carro" /> Estacionamiento
                  </dt>
                  <dd>Gratuito y valet parking desde las 3:30 PM</dd>
                </div>
              </dl>

              <a
                className="boton boton--oro ubicacion__boton-enlace"
                href={BODA.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icono nombre="mapaGoogle" />
                Como llegar
              </a>
            </div>
          </article>
        </div>
      </Seccion>
    </>
  );
}
