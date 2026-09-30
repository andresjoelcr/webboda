import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Escena from '../../components/Escena';
import { Racimo, Rama, FlorBlanca } from '../../components/Botanica';
import { FlorPng } from '../../components/FloresPng';
import useTilt from '../../hooks/useTilt';
import { useInvitacion } from '../../context/InvitacionContext';
import './sobre.css';

/* Flores PNG que entran desde los bordes de la pantalla.
   x/y se miden en % de la pantalla y se centran sobre el borde (o un poco
   fuera), asi que quedan recortadas por el overflow de la escena: el efecto
   es que asoman desde fuera. Los anchos en vmin van de 19 a 66 para que
   ninguna se vea igual que otra, y la capa vive detras del texto y del
   sobre (z-index 3) para no tapar nada. */
const FLORES_BORDES = [
  /* borde izquierdo */
  { tipo: 'varias', x: '-5%', y: '14%', ancho: '46vmin', rotacion: '10deg', duracion: '12s', retraso: '-1s' },
  { x: '2%', y: '40%', ancho: '22vmin', rotacion: '-12deg', duracion: '9s', retraso: '-4s', opacidad: 0.9 },
  { tipo: 'varias', x: '-6%', y: '74%', ancho: '54vmin', rotacion: '-8deg', duracion: '14s', retraso: '-6s' },
  { x: '1%', y: '96%', ancho: '28vmin', rotacion: '16deg', duracion: '10s', retraso: '-2s' },
  { x: '-1%', y: '62%', ancho: '24vmin', rotacion: '-6deg', duracion: '12s', retraso: '-9s', opacidad: 0.92 },

  /* borde derecho */
  { tipo: 'varias', x: '105%', y: '10%', ancho: '40vmin', rotacion: '-10deg', espejo: true, duracion: '13s', retraso: '-3s' },
  { x: '98%', y: '36%', ancho: '25vmin', rotacion: '14deg', espejo: true, duracion: '9s', retraso: '-7s', opacidad: 0.9 },
  { tipo: 'varias', x: '106%', y: '68%', ancho: '66vmin', rotacion: '8deg', espejo: true, duracion: '15s', retraso: '-5s' },
  { x: '97%', y: '92%', ancho: '20vmin', rotacion: '-14deg', espejo: true, duracion: '11s', retraso: '-9s' },
  { x: '101%', y: '52%', ancho: '19vmin', rotacion: '6deg', espejo: true, duracion: '13s', retraso: '-11s', opacidad: 0.92 },

  /* esquinas superiores */
  { x: '-2%', y: '-3%', ancho: '34vmin', rotacion: '140deg', duracion: '13s', retraso: '-5s' },
  { x: '14%', y: '-4%', ancho: '31vmin', rotacion: '168deg', duracion: '12s', retraso: '-2s' },
  { tipo: 'varias', x: '36%', y: '-9%', ancho: '26vmin', rotacion: '196deg', duracion: '14s', retraso: '-8s' },
  { x: '66%', y: '-3%', ancho: '20vmin', rotacion: '158deg', duracion: '10s', retraso: '-5s' },
  { tipo: 'varias', x: '87%', y: '-7%', ancho: '38vmin', rotacion: '204deg', duracion: '13s', retraso: '-11s' },
  { tipo: 'varias', x: '103%', y: '-4%', ancho: '32vmin', rotacion: '210deg', espejo: true, duracion: '16s', retraso: '-13s' },

  /* borde inferior (mismos tamanos que las de arriba) */
  { tipo: 'varias', x: '-5%', y: '103%', ancho: '34vmin', rotacion: '-18deg', duracion: '15s', retraso: '-4s' },
  { x: '8%', y: '106%', ancho: '31vmin', rotacion: '-12deg', duracion: '11s', retraso: '-4s' },
  { tipo: 'varias', x: '32%', y: '103%', ancho: '26vmin', rotacion: '10deg', duracion: '16s', retraso: '-10s' },
  { x: '58%', y: '107%', ancho: '20vmin', rotacion: '8deg', duracion: '9s', retraso: '-1s' },
  { tipo: 'varias', x: '84%', y: '105%', ancho: '38vmin', rotacion: '-8deg', duracion: '14s', retraso: '-6s' },
  { x: '104%', y: '103%', ancho: '32vmin', rotacion: '160deg', espejo: true, duracion: '12s', retraso:'-12s' },
];

const CAPAS = [
  {
    clave: 'lejana',
    clase: 'capa--lejana',
    profundidad: 0.05,
    children: (
      <>
        <Rama x="8%" y="14%" ancho="14vmin" rotacion="-20deg" duracion="9s" retraso="0s" />
        <Rama x="93%" y="12%" ancho="13vmin" rotacion="18deg" espejo duracion="11s" retraso="-2s" />
        <FlorBlanca x="16%" y="80%" ancho="12vmin" rotacion="12deg" duracion="8s" retraso="-1s" />
        <FlorBlanca x="84%" y="76%" ancho="14vmin" rotacion="-10deg" tipo="peonia" duracion="10s" retraso="-4s" />
      </>
    ),
  },
  {
    clave: 'flores',
    clase: 'capa--flores',
    profundidad: 0.08,
    children: (
      <>
        {FLORES_BORDES.map((flor, i) => (
          <FlorPng key={i} {...flor} />
        ))}
      </>
    ),
  },
  {
    clave: 'cercana',
    clase: 'capa--cercana',
    profundidad: 0.2,
    children: (
      <>
        <Racimo x="-1%" y="58%" ancho="34vmin" rotacion="-6deg" duracion="11s" retraso="-1s" />
        <Racimo x="101%" y="46%" ancho="36vmin" rotacion="6deg" espejo duracion="12s" retraso="-5s" />
        <Racimo x="6%" y="104%" ancho="26vmin" rotacion="22deg" duracion="10s" retraso="-3s" />
      </>
    ),
  },
];

/* Trazos finos y sutiles unicamente en las esquinas superiores de la tarjeta */
function MarqueriaBotanicaFina() {
  return (
    <svg className="sobre__carta-botanica" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none" aria-hidden="true">
      {/* Esquina Superior Izquierda */}
      <g transform="translate(10, 10)">
        <path d="M 0 25 C 0 8, 8 0, 25 0" stroke="rgba(122, 84, 20, 0.45)" strokeWidth="0.6" />
        <path d="M 4 14 C 9 9, 14 9, 18 4" stroke="rgba(122, 84, 20, 0.55)" strokeWidth="0.5" />
        <path d="M 10 10 C 13 6, 17 7, 20 3 C 16 7, 14 11, 10 10 Z" fill="rgba(122, 84, 20, 0.3)" />
      </g>

      {/* Esquina Superior Derecha */}
      <g transform="translate(290, 10) scale(-1, 1)">
        <path d="M 0 25 C 0 8, 8 0, 25 0" stroke="rgba(122, 84, 20, 0.45)" strokeWidth="0.6" />
        <path d="M 4 14 C 9 9, 14 9, 18 4" stroke="rgba(122, 84, 20, 0.55)" strokeWidth="0.5" />
        <path d="M 10 10 C 13 6, 17 7, 20 3 C 16 7, 14 11, 10 10 Z" fill="rgba(122, 84, 20, 0.3)" />
      </g>
    </svg>
  );
}

/* Bolsillo frontal limpio con trazos sutiles en la parte superior */
function Bolsillo() {
  return (
    <svg className="sobre__bolsillo" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="bo-i" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#ecd090" />
          <stop offset="1" stopColor="#dcb572" />
        </linearGradient>
        <linearGradient id="bo-d" x1="1" y1="0" x2="0" y2="0.4">
          <stop offset="0" stopColor="#d3ab63" />
          <stop offset="1" stopColor="#dfba76" />
        </linearGradient>
        <linearGradient id="bo-b" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e6c583" />
          <stop offset="1" stopColor="#ddb86f" />
        </linearGradient>
      </defs>
      {/* Pliegues limpios sin cortes diagonales pronunciados abajo */}
      <polygon points="0,0 80,50 0,100" fill="url(#bo-i)" />
      <polygon points="160,0 80,50 160,100" fill="url(#bo-d)" />
      <polygon points="0,100 80,50 160,100" fill="url(#bo-b)" />
      {/* Trazos sutiles superiores */}
      <path
        d="M0 0 L80 50 L160 0"
        fill="none"
        stroke="rgba(140, 98, 38, 0.3)"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* Forro interior de la solapa */
function Forro() {
  const hojas = [
    [50, 46, -150, 1.2],
    [40, 34, -120, 1.0],
    [110, 46, -30, 1.2],
    [120, 34, -60, 1.0],
    [70, 26, -100, 0.9],
    [92, 24, -80, 0.9],
  ];
  return (
    <svg className="sobre__forro" viewBox="0 0 160 58" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="8,58 152,58 80,9" fill="#fbfcfb" />
      {hojas.map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d="M0 0C3-7 13-8 20 0 13 8 3 7 0 0Z" fill={i % 2 ? '#dcb572' : '#e6c583'} />
        </g>
      ))}
      <ellipse cx="80" cy="34" rx="14" ry="11" fill="#ececea" stroke="#dcdbd9" strokeWidth="0.6" />
      <ellipse cx="77" cy="35" rx="9" ry="7" fill="#e1e1df" />
      {[[72, 26], [78, 24], [84, 26]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.9" fill="#d9b06a" />
      ))}
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="56" cy="47" rx="3.6" ry="6" fill="#f2f2f0" stroke="#dcdbd9" strokeWidth="0.4" transform={`rotate(${a} 56 52)`} />
      ))}
      <circle cx="56" cy="52" r="1.8" fill="#d9b06a" />
    </svg>
  );
}

export default function Sobre() {
  const navegar = useNavigate();
  const { nombres, fecha, invitado, tokenInvitacion } = useInvitacion();
  const [estado, setEstado] = useState('cerrado');
  const referencia = useTilt({ maxX: 3.5, maxY: 2.5 });
  const tiempos = useRef([]);
  const animando = useRef(false);

  useEffect(
    () => () => {
      tiempos.current.forEach((t) => window.clearTimeout(t));
      tiempos.current = [];
    },
    [],
  );

  const abrir = () => {
    if (animando.current) return;
    animando.current = true;
    setEstado('abriendo');

    tiempos.current = [
      window.setTimeout(() => setEstado('abierto'), 650),
      window.setTimeout(() => setEstado('saliendo'), 1850),
      window.setTimeout(() => navegar(tokenInvitacion ? `/inicio?token=${encodeURIComponent(tokenInvitacion)}` : '/inicio', { state: { velo: true } }), 2600),
    ];
  };

  const alMover = (e) => {
    const caja = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - caja.left) / caja.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - caja.top) / caja.height) * 100}%`);
  };

  return (
    <Escena variante="variante--azul" capas={CAPAS}>
      <main className="contenido contenido--sobre">
        <p className="antetitulo">Nuestra Boda</p>
        <h1 className="titulo">Invitación</h1>
        {invitado ? (
          <p className="sobre__destinatario">{invitado.nombre} y familia {invitado.familia}</p>
        ) : null}

        <div
          className="sobre"
          ref={referencia}
          data-estado={estado}
          role="button"
          tabIndex={0}
          aria-disabled={animando.current}
          aria-label={`Abrir la invitación de ${nombres}`}
          onClick={abrir}
          onPointerMove={alMover}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              abrir();
            }
          }}
        >
          <span className="sobre__resplandor" aria-hidden="true" />
          <span className="sobre__cuerpo" aria-hidden="true" />

          {/* Carta de invitación en papel */}
          <span className="sobre__carta" aria-hidden="true">
            <MarqueriaBotanicaFina />
            <span className="sobre__carta-marco" />

            {/* Texto interior sin obstrucciones */}
            <span className="sobre__carta-texto">
              <span className="sobre__carta-linea">Nos casamos</span>
              <span className="sobre__carta-nombres">{nombres}</span>
              <span className="sobre__carta-fecha">{fecha}</span>
              <span className="sobre__carta-nota">Te esperamos</span>
            </span>
          </span>

          <Bolsillo />
          <span className="sobre__icono" aria-hidden="true">
            <img src="/static/casados.png" alt="" />
          </span>
          {/* Solapa con dos caras */}
          <span className="sobre__solapa" aria-hidden="true">
            <span className="sobre__solapa-fuera" />
            <span className="sobre__solapa-dentro">
              <Forro />
            </span>
          </span>

          <span className="sobre__brillo" aria-hidden="true" />

          <span className="sobre__sello" aria-hidden="true">
            <span className="sobre__sello-mono">I&nbsp;G</span>
          </span>
        </div>
      </main>
    </Escena>
  );
}
