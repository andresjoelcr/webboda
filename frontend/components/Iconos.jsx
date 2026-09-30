/* Set de iconos en linea (stroke) para todas las secciones de la boda */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

function Crear({ children, ...props }) {
  return (
    <svg {...base} {...props}>
      {children}
    </svg>
  );
}

export function IconoCalendario(props) {
  return (
    <Crear {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </Crear>
  );
}

export function IconoReloj(props) {
  return (
    <Crear {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </Crear>
  );
}

export function IconoUbicacion(props) {
  return (
    <Crear {...props}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Crear>
  );
}

export function IconoRuta(props) {
  return (
    <Crear {...props}>
      <path d="M6 20V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
      <path d="M6 14h12" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </Crear>
  );
}

export function IconoWaze(props) {
  return (
    <Crear {...props}>
      <path d="M3 15c0-4 3-6 5.5-6S11 10 11 12s1.5 3.5 3 3.5S17 14 17 15s1.5 2.5 4 1" />
      <path d="M12 5.5 9 8m3-2.5L15 8" />
      <path d="M6 19.5c3 1 9 1 12 0" />
    </Crear>
  );
}

export function IconoCorazon(props) {
  return (
    <Crear {...props}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
    </Crear>
  );
}

export function IconoMusica(props) {
  return (
    <Crear {...props}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </Crear>
  );
}

export function IconoRegalo(props) {
  return (
    <Crear {...props}>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 13h18M12 9v11" />
      <path d="M12 9c-3.5 0-5-1.2-5-3s2.2-2.4 5 3c2.8-5.4 5-4.5 5-3s-1.5 3-5 3Z" />
    </Crear>
  );
}

export function IconoCamara(props) {
  return (
    <Crear {...props}>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.3-2h8l1.3 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </Crear>
  );
}

export function IconoQr(props) {
  return (
    <Crear {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4h-3" />
    </Crear>
  );
}

export function IconoHotel(props) {
  return (
    <Crear {...props}>
      <path d="M4 20V6" />
      <path d="M4 11h11a4 4 0 0 1 4 4v5" />
      <path d="M4 20h16" />
      <circle cx="7.5" cy="9" r="1.6" />
    </Crear>
  );
}

export function IconoTijeras(props) {
  return (
    <Crear {...props}>
      <circle cx="6" cy="6.5" r="2.4" />
      <circle cx="6" cy="17.5" r="2.4" />
      <path d="M8 8.2 19 18M8 15.8 19 6" />
    </Crear>
  );
}

export function IconoPregunta(props) {
  return (
    <Crear {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.4" />
      <path d="M12 17h.01" />
    </Crear>
  );
}

export function IconoUsuario(props) {
  return (
    <Crear {...props}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </Crear>
  );
}

export function IconoCheck(props) {
  return (
    <Crear {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </Crear>
  );
}

export function IconoTaco(props) {
  return (
    <Crear {...props}>
      <path d="M3 11a9 9 0 0 1 18 0Z" />
      <path d="M4 11a8 8 0 0 1 16 0" />
      <circle cx="9" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="13" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8.6" r="0.9" fill="currentColor" stroke="none" />
    </Crear>
  );
}

export function IconoVehiculo(props) {
  return (
    <Crear {...props}>
      <path d="M3 16v-3.2L5 8h14l2 4.8V16" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="16.5" r="1.7" />
      <circle cx="16.5" cy="16.5" r="1.7" />
    </Crear>
  );
}

export function IconoGlobo(props) {
  return (
    <Crear {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
    </Crear>
  );
}

export function IconoHashtag(props) {
  return (
    <Crear {...props}>
      <path d="M9 4 7 20M17 4l-2 16M4 9h16M3.5 15h16" />
    </Crear>
  );
}

export function IconoFiltro(props) {
  return (
    <Crear {...props}>
      <path d="M12 3.5c4 0 7 2.7 7 6.1 0 3.3-3 6-7 6-1 0-2-.2-2.9-.5" />
      <circle cx="9.4" cy="9.6" r="2.4" />
      <path d="M3.5 20.5c1.8-1 3.7-1.4 5.8-1.4 2.4 0 4.6.6 6.4 1.9" />
    </Crear>
  );
}

export function IconoLibro(props) {
  return (
    <Crear {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </Crear>
  );
}

export function IconoBebida(props) {
  return (
    <Crear {...props}>
      <path d="M6.5 4h11l-1 5.5H7.5Z" />
      <path d="M7.5 9.5 8.5 21h7l1-11.5" />
      <path d="M6 12h12" />
    </Crear>
  );
}

export function IconoCamarero(props) {
  return (
    <Crear {...props}>
      <circle cx="8" cy="5" r="1.8" />
      <path d="M8 8v6M5 11h6" />
      <path d="M8 14c-1.5 1.5-2 3-2 4.5V20h4v-1.5c0-1.5-.5-3-2-4.5Z" />
      <path d="M15 4h4l-.8 6h-2.4Z" />
      <path d="M15.8 10h2.4V20H15.8Z" />
    </Crear>
  );
}

export function IconoCasa(props) {
  return (
    <Crear {...props}>
      <path d="M2.8 11.2 12 3.8l9.2 7.4-1.4 1.7L18.5 12v8h-5v-5h-3v5h-5v-8l-1.3.9z" fill="currentColor" stroke="none" />
    </Crear>
  );
}

export function IconoVestimenta(props) {
  return (
    <Crear {...props}>
      <path d="m8 4 4 2 4-2 4 3-2.2 4-2-1V21H8.2V10l-2 1L4 7z" />
      <path d="M9 5.2c.6 1.7 1.6 2.6 3 2.6s2.4-.9 3-2.6" />
    </Crear>
  );
}

export function IconoGaleria(props) {
  return (
    <Crear {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17 4.5-4.5 3 3L15 11l5 5" />
    </Crear>
  );
}

export function IconoAnillos(props) {
  return (
    <Crear {...props}>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
    </Crear>
  );
}

export function IconoSobre(props) {
  return (
    <Crear {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
      <path d="m4 17 5-4m11 4-5-4" />
    </Crear>
  );
}

export function IconoFlecha(props) {
  return (
    <Crear {...props}>
      <path d="M12 5v14M6.5 13.5 12 19l5.5-5.5" />
    </Crear>
  );
}

export function IconoMapaGoogle(props) {
  return (
    <Crear {...props}>
      <path d="M9 4.2 3.5 6.3v13.4L9 17.6l6 2.1 5.5-2.1V4.2L15 6.3 9 4.2Z" />
      <path d="M9 4.2v13.4M15 6.3v13.4" />
      <circle cx="12" cy="10.6" r="2.1" />
    </Crear>
  );
}

export function IconoLupa(props) {
  return (
    <Crear {...props}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m15.6 15.6 4.2 4.2" />
    </Crear>
  );
}

export function IconoOjo(props) {
  return (
    <Crear {...props}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.1" />
    </Crear>
  );
}

export function IconoOjoTachado(props) {
  return (
    <Crear {...props}>
      <path d="M9.6 6.2A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.8" />
      <path d="M6.1 8A17 17 0 0 0 2.5 12S6 18.2 12 18.2a9.3 9.3 0 0 0 3.4-.6" />
      <path d="M4 4l16 16" />
    </Crear>
  );
}

export function IconoAlerta(props) {
  return (
    <Crear {...props}>
      <path d="M12 3.8 21 19.6H3Z" />
      <path d="M12 10v4.1" />
      <path d="M12 17h.01" />
    </Crear>
  );
}

const ICONOS = {
  alerta: IconoAlerta,
  anillos: IconoAnillos,
  sobre: IconoSobre,
  bebida: IconoBebida,
  calendario: IconoCalendario,
  camarero: IconoCamarero,
  camara: IconoCamara,
  carro: IconoVehiculo,
  casa: IconoCasa,
  corazon: IconoCorazon,
  festejo: IconoBebida,
  filtro: IconoFiltro,
  galeria: IconoGaleria,
  globo: IconoGlobo,
  hashtag: IconoHashtag,
  hotel: IconoHotel,
  libro: IconoLibro,
  mapa: IconoUbicacion,
  mapaGoogle: IconoMapaGoogle,
  musica: IconoMusica,
  pregunta: IconoPregunta,
  qr: IconoQr,
  reloj: IconoReloj,
  regalo: IconoRegalo,
  ruta: IconoRuta,
  taco: IconoTaco,
  tijeras: IconoTijeras,
  usuario: IconoUsuario,
  vestimenta: IconoVestimenta,
  check: IconoCheck,
  waze: IconoWaze,
  flecha: IconoFlecha,
  ojo: IconoOjo,
  ojoTachado: IconoOjoTachado,
  lupa: IconoLupa,
};

/* Uso: <Icono nombre="reloj" /> */
export default function Icono({ nombre, className = '' }) {
  const Componente = ICONOS[nombre];
  if (!Componente) return null;
  return <Componente className={`icono ${className}`.trim()} />;
}
