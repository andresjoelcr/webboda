/* =============================================================
   Datos editables de la boda.
   Todo el contenido estatico de las secciones vive aqui para poder
   cambiarlo sin tocar los componentes.
   ============================================================= */

export const BODA = {
  lema: 'El amor encontro su propio calendario, y el nuestro es hoy.',

  /* --- Ceremonia y recepcion (formato local del navegador) --- */
  fecha: '2027-07-18T16:00:00',
  fechaCierre: '2027-07-19T02:00:00',
  fechaTexto: 'Domingo 18 de julio de 2027',

  lugar: 'Jardin de los Rosales',
  direccion: 'Calle Real 145, Col. Centro, Guadalajara, Jalisco',
  mapsQuery: 'Jardin de los Rosales, Calle Real 145, Guadalajara, Jalisco',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jardin+de+los+Rosales+Guadalajara',
  wazeUrl: 'https://waze.com/ul?q=Jardin%20de%20los%20Rosales%20Guadalajara',
  appleMapsUrl: 'https://maps.apple.com/?q=Jardin+de+los+Rosales%20Guadalajara',

  hashtag: '#BodaIsabellaYGabriel2027',
  albumUrl: 'https://photos.app.goo.gl/EJEMPLO-ALBUM',
  filtroUrl: 'https://www.instagram.com/ar/EJEMPLO-FILTRO/',
};

/* --- Portada: textos de la pantalla de bienvenida.
   Los nombres y la fecha corta vienen de la API (InvitacionContext). --- */
export const HERO = {
  video: '/static/video_boda.mp4',
  antetitulo: 'Con la bendición de nuestras familias',
  preTitulo: 'Tenemos el corazón lleno de alegría',
  separador: '&',
  invitacion: 'Y queremos compartir contigo el comienzo de nuestra historia para siempre.',
  cta: 'Confirmar invitación',
  ctaRuta: '/rsvp',
  baja: 'Nos vemos en',
  bajaDestino: '#cuenta-regresiva',
};

export const ITINERARIO = [
  {
    hora: '4:00 PM',
    icono: 'anillos',
    titulo: 'Ceremonia',
    texto:
      'Nos encontramos con Dios, con nuestras familias y con el amor que nos trae aqui. Llega quince minutos antes para estar comodos y entrar con calma.',
  },
  {
    hora: '5:30 PM',
    icono: 'bebida',
    titulo: 'Coctel de bienvenida',
    texto:
      'Brindis, fotos y primeras danzas con la familia. En el jardin hay refrescos, cafe y una seleccion de cocteles de la casa para todos.',
  },
  {
    hora: '7:00 PM',
    icono: 'camarero',
    titulo: 'Cena y brindis',
    texto:
      'Cena de tres tiempos y brindis de los novios. Mientras cenan, proyectamos las fotos de la historia que nos trajo hasta aqui.',
  },
  {
    hora: '9:00 PM',
    icono: 'corazon',
    titulo: 'Apertura del baile',
    texto:
      'Primer baile y pista abierta para todos. Despues, quien quiera puede subir a la pista que se abre de par en par.',
  },
  {
    hora: '11:00 PM',
    icono: 'musica',
    titulo: 'Hora loca',
    texto:
      'La pista se prende y se queda hasta el ultimo brindis. La ultima cancion siempre la elegimos los tres juntos.',
  },
];

export const PALETA = [
  { nombre: 'Marino profundo', hex: '#0f2a4e' },
  { nombre: 'Azul noche', hex: '#16355c' },
  { nombre: 'Dorado', hex: '#e6c276' },
  { nombre: 'Champan', hex: '#f2d89b' },
  { nombre: 'Marfil', hex: '#f6f6f4' },
  { nombre: 'Vino', hex: '#8f1523' },
];

export const VESTIMENTA = {
  estilo: 'Formal elegante',
  descripcion:
    'La celebracion es al aire libre y de noche, por eso elegimos algo formal pero comodo: asi se disfruta la fiesta y la pista de baile hasta el final.',
  detalles: [
    'Traje formal u opera rigurosa en su version mas comoda.',
    'Zapatos elegantes y comodos para bailar toda la noche.',
    'Los colores azul, vino y dorado son bienvenidos en tu outfit.',
  ],
  reservados: [
    'El blanco esta reservado para la novia.',
    'El vino y el burdeos quedan reservados para las damas de honor.',
  ],
};

export const REGALOS = {
  titulo: 'Lluvia de sobres',
  texto:
    'El mejor regalo es tu presencia. Pero si deseas darnos un detalle, te dejamos como hacerlo de forma facil y segura:',
  banco: [
    {
      banco: 'Banco Azteca',
      titular: 'Isabella & Gabriel',
      cuenta: '1234 5678 9012 3456',
      clabe: '123 456 789 012 345 678',
    },
  ],
  experiencias: [
    { titulo: 'Coctel en la playa', texto: 'Ayudanos a celebrar con los pies en la arena.' },
    { titulo: 'Cena romantica', texto: 'Una cena para dos en el restaurante que elijan.' },
    { titulo: 'Excursion', texto: 'Un viaje chiquito para dos durante la luna de miel.' },
  ],
  enlaces: [
    { titulo: 'Lista de regalos', url: 'https://www.amazon.com.mx/registry/wedding/EJEMPLO' },
    { titulo: 'Mesa de regalos', url: 'https://www.mesaderegalos.com/EJEMPLO' },
  ],
};

export const HISTORIA = [
  {
    anio: '2019',
    titulo: 'El primer encuentro',
    texto:
      'Nos conocimos en una cafeteria a las ocho de la noche, cuando ya habian cerrado y solo quedaba un latte tibio y mucho tiempo para conversar.',
    foto: '/static/flor_sola.png',
  },
  {
    anio: '2020',
    titulo: 'La primera cita',
    texto:
      'Cena, lluvia y una sombrilla prestada que termino siendo de los dos. Desde ese dia no nos soltamos mas.',
    foto: '/static/flores_varias.png',
  },
  {
    anio: '2022',
    titulo: 'Viajemos juntos',
    texto: 'Un viaje con tres vuelos de mas, una maleta perdida y las melhores fotos de nuestra vida.',
    foto: '/static/flor_sola.png',
  },
  {
    anio: '2024',
    titulo: 'La pedida',
    texto: 'Bajo las luces del Jardin de los Rosales, Gabriel le dio el anillo mientras todos aplaudian.',
    foto: '/static/flores_varias.png',
  },
];

export const GALERIA = [
  { src: '/static/img_juntos.jpeg', pie: 'Juntos, siempre' },
  { src: '/static/img_novia_sola.jpeg', pie: 'La novia' },
  { src: '/static/img_novio_solo.jpeg', pie: 'El novio' },
];

export const HOTELES = [
  {
    nombre: 'Hotel Casa Loire',
    estrellas: 5,
    distancia: '2.4 km del lugar',
    beneficio: '15% de descuento con el codigo BODA26',
    telefono: '+52 33 1234 5678',
    url: 'https://www.google.com/maps/search/?api=1&query=Hotel+Casa+Loire+Guadalajara',
  },
  {
    nombre: 'Boutique Alkzar',
    estrellas: 4,
    distancia: '1.8 km del lugar',
    beneficio: '10% mencionando la boda',
    telefono: '+52 33 2345 6789',
    url: 'https://www.google.com/maps/search/?api=1&query=Boutique+Alkzar+Guadalajara',
  },
  {
    nombre: 'Posada San Miguel',
    estrellas: 3,
    distancia: '4.1 km del lugar',
    beneficio: 'Tarifa especial para invitados',
    telefono: '+52 33 3456 7890',
    url: 'https://www.google.com/maps/search/?api=1&query=Posada+San+Miguel+Guadalajara',
  },
];

export const BELLEZA = [
  { nombre: 'Studio Aurora', servicio: 'Maquillaje y peinado nupcial', telefono: '+52 33 1111 2233' },
  { nombre: 'Salon Leonor', servicio: 'Peluqueria y peinado', telefono: '+52 33 2222 3344' },
  { nombre: 'Casa Blanche', servicio: 'Manicure, pedicure y spa', telefono: '+52 33 3333 4455' },
];

export const FAQ = [
  {
    pregunta: '¿Puedo llevar niños?',
    respuesta:
      'Si, nos encantaria ver a los pequenos. Solo pedimos que confirmen su asistencia en el formulario para tener lugares y atencion para ellos.',
  },
  {
    pregunta: '¿Hay estacionamiento en el lugar?',
    respuesta:
      'Si, el jardin cuenta con estacionamiento gratuito para los invitados. Tambien puedes llegar en Uber o taxi sin problema.',
  },
  {
    pregunta: '¿Hasta que fecha puedo confirmar asistencia?',
    respuesta:
      'La fecha limite es el 30 de junio. Despues de esa fecha ya no podremos sumar lugares a la mesa.',
  },
  {
    pregunta: '¿El evento es al aire libre?',
    respuesta:
      'La ceremonia, el coctel y la cena son al aire libre. El baile y la hora loca se celebraran bajo techo por si llueve.',
  },
  {
    pregunta: '¿Hay valet parking?',
    respuesta: 'Contamos con valet parking desde las 3:30 PM. El pago se hace directo al llegar.',
  },
  {
    pregunta: '¿Puedo asistir con mi mascota?',
    respuesta: 'Si, con gusto recibiramos a tu mascota. Avisanos en el formulario para tenerla en cuenta.',
  },
];

export const OPCIONES_MENU = ['Sin restriccion', 'Vegetariano', 'Vegano', 'Celiaco', 'Alergia grave'];

/* Las cuatro paginas de la invitacion. La cabecera, el pie y las rutas
   se construyen a partir de este arreglo: agregar una pagina aqui es
   suficiente para que aparezca en el menu. */
export const PAGINAS = [
  {
    ruta: '/inicio',
    texto: 'Bienvenida',
    icono: 'casa',
    navegacionLateral: true,
    resumen: 'Nombres, fecha y cuenta regresiva',
    ancla: '#inicio',
  },
  {
    ruta: '/programa',
    texto: 'Programa',
    icono: 'calendario',
    navegacionLateral: true,
    resumen: 'Lugar, ruta y cronograma del dia',
  },
  {
    ruta: '/vestimenta',
    texto: 'Vestimenta',
    icono: 'vestimenta',
    navegacionLateral: true,
    resumen: 'Dress code y paleta sugerida',
  },
  {
    ruta: '/rsvp',
    texto: 'Confirmar',
    icono: 'check',
    resumen: 'Asistencia, menu y tu cancion',
    destacado: true,
  },
  {
    ruta: '/inicio',
    texto: 'Galería',
    icono: 'galeria',
    resumen: 'Momentos de Isabella y Gabriel',
    ancla: '#galeria',
    soloEnPie: true,
  },
];
