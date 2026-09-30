export default function Invitacion({ nombres, fecha, nota = 'Ceremonia y recepción', monograma }) {
  const iniciales = monograma ?? 'I G';

  return (
    <article className="invitacion__placa">
      <div className="encaje" />
      <div className="invitacion__contenido">
        <span className="monograma" aria-hidden="true">
          {iniciales}
        </span>
        <p className="invitacion__linea">Nos casamos</p>
        <h2 className="invitacion__nombres">{nombres}</h2>
        <svg className="ornamento" viewBox="0 0 160 24" aria-hidden="true">
          <path d="M2 12h52c8 0 12-8 20-8s12 8 20 8h62" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="80" cy="12" r="3" fill="currentColor" />
          <path d="M150 12c-6-6-12-4-12 0s6 6 12 0z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <p className="invitacion__fecha">{fecha}</p>
        <p className="invitacion__nota">{nota}</p>
      </div>
    </article>
  );
}
