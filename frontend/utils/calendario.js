/* Calendario .ics generado en el navegador (sin dependencias) */

const sello = (fecha) => fecha.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

const escapar = (texto) =>
  String(texto)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

/**
 * Descarga un archivo .ics con el itinerario completo de la boda.
 * @param {object} evento  { titulo, descripcion, lugar, direccion, inicio, fin }
 */
export function descargarCalendario(evento) {
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion de Boda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@boda`,
    `DTSTAMP:${sello(new Date())}`,
    `DTSTART:${sello(evento.inicio)}`,
    `DTEND:${sello(evento.fin)}`,
    `SUMMARY:${escapar(evento.titulo)}`,
    `DESCRIPTION:${escapar(evento.descripcion)}`,
    `LOCATION:${escapar(`${evento.lugar}, ${evento.direccion}`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(evento.titulo)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(evento.titulo)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lineas.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = 'boda.ics';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
