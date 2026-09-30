import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useInvitacion } from '../../context/InvitacionContext';
import Contador from '../../components/inicio/Contador';
import Seccion from '../../components/inicio/Seccion';
import Marco from '../../components/navegacion/Marco';
import { BODA, GALERIA, HERO } from '../inicio/datos';

export default function Portada() {
  const { nombres, fecha, invitado, tokenInvitacion } = useInvitacion();
  const rutaRsvp = tokenInvitacion
    ? `/rsvp?token=${encodeURIComponent(tokenInvitacion)}`
    : HERO.ctaRuta;
  const objetivo = useMemo(() => new Date(BODA.fecha), []);

  useEffect(() => {
    const elementos = document.querySelectorAll('.hero__contenido, .inicio__cuenta .seccion__cabecera, .inicio__cuenta .contador, .inicio__frase-rosas, .inicio__frase-marco, .inicio__frase-texto, .inicio__galeria .seccion__cabecera, .galeria__item, .inicio__galeria-cierre');
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

  /* Los anillos llevan su propio observador: la entrada se dispara en cuanto el
     apartado entra en pantalla y se quita al salir, asi los dos anillos vuelven
     a armarse cada vez que el invitado baja hasta ese punto. */
  useEffect(() => {
    const anillos = document.querySelector('.inicio__frase-anillos');
    if (!anillos) return undefined;

    const observer = new IntersectionObserver(([entrada]) => {
      anillos.classList.toggle('is-visible', entrada.isIntersecting);
    }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });

    observer.observe(anillos);
    return () => observer.disconnect();
  }, []);

  return (
    <Marco>
      <section className="hero" id="bienvenida">
        <video className="hero__video" aria-hidden="true" autoPlay muted loop playsInline preload="auto">
          <source src={HERO.video} type="video/mp4" />
        </video>
        <div className="hero__velo" aria-hidden="true" />

        <div className="hero__contenido">
          <p className="hero__antetitulo"><span>{HERO.antetitulo}</span></p>
          <p className="hero__pre-titulo">{HERO.preTitulo}</p>
          <h1 className="hero__nombres">{nombres}</h1>
          <span className="hero__separador" aria-hidden="true"><span />{HERO.separador}<span /></span>
          <p className="hero__invitacion">
            {invitado
              ? <>
                  Queremos compartir contigo,<br />
                  <span className="hero__invitacion-destinatario">
                    {invitado.nombre} y familia {invitado.familia}
                  </span>
                  <br />el comienzo de nuestra historia para siempre.
                </>
              : HERO.invitacion}
          </p>
          <p className="hero__fecha">
            <span>{BODA.fechaTexto}</span>
            <span className="hero__fecha-completa">{fecha}</span>
          </p>
          <div className="hero__acciones">
            <Link className="hero__cta" to={rutaRsvp}>
              <span>{HERO.cta}</span><span className="hero__cta-icono" aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>

        <a className="hero__bajar" href={HERO.bajaDestino} aria-label={`${HERO.baja} a la cuenta regresiva`}>
          <span>{HERO.baja}</span><span className="hero__bajar-flecha" aria-hidden="true">&#8595;</span>
        </a>
      </section>

      <Seccion
        id="cuenta-regresiva"
        className="inicio__cuenta"
        icono="reloj"
        antetitulo="Cada instante nos acerca"
        titulo="La cuenta atrás"
        texto="Guardamos los días, las horas y los minutos para celebrarlo contigo."
      >
        <Contador objetivo={objetivo} />
        <p className="inicio__fecha-lugar"><span aria-hidden="true">✦</span>{BODA.fechaTexto}<span aria-hidden="true">✦</span></p>
      </Seccion>

      <section className="inicio__frase" aria-label="Una frase sobre el amor">
        <img className="inicio__frase-rosas inicio__frase-rosas--izq" src="/static/rosas_blancas.png" alt="" aria-hidden="true" />
        <img className="inicio__frase-rosas inicio__frase-rosas--der" src="/static/rosas_blancas.png" alt="" aria-hidden="true" />
        <div className="inicio__frase-pila">
          <span className="inicio__frase-anillos" role="img" aria-label="Los anillos de la boda">
            <img className="anillos__parte anillos__parte--1" src="/static/anillo_parte1.png" alt="" />
            <img className="anillos__parte anillos__parte--2" src="/static/anillo_parte2.png" alt="" />
          </span>
          <div className="inicio__frase-marco">
            <img className="inicio__frase-marco-foto" src="/static/marco_boda.png" alt="" aria-hidden="true" />
            <div className="inicio__frase-texto">
              <span className="inicio__frase-ornamento" aria-hidden="true">I <i>&amp;</i> G</span>
              <p>“El amor encontró su propio calendario,<br />y el nuestro es hoy.”</p>
              <span className="inicio__frase-firma">{nombres}</span>
            </div>
          </div>
        </div>
      </section>

      <Seccion
        id="galeria"
        className="inicio__galeria"
        icono="galeria"
        antetitulo="Pequeños momentos, una gran historia"
        titulo="Nosotros"
        texto="Unos instantes que guardamos con cariño y que ahora queremos compartir contigo."
      >
        <ul className="galeria">
          {GALERIA.map((foto, i) => (
            <li className={`galeria__item galeria__item--${i}`} key={`${foto.pie}-${i}`}>
              <span className="galeria__medallon">
                <img className="galeria__foto" src={foto.src} alt={foto.pie} loading="lazy" />
                <img className="galeria__marco" src="/static/marcos_fotos.png" alt="" aria-hidden="true" />
              </span>
              <span className="galeria__pie">{foto.pie}</span>
            </li>
          ))}
        </ul>
        <div className="inicio__galeria-cierre">
          <p>La mejor foto será la que nos tomemos contigo.</p>
        </div>
      </Seccion>
    </Marco>
  );
}
