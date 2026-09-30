import Seccion from './Seccion';
import { useInvitacion } from '../../context/InvitacionContext';

export default function Vestimenta() {
  const { invitado } = useInvitacion();
  return (
    <Seccion
      id="vestimenta"
      className="vestimenta-escena__contenido"
      icono="galeria"
      antetitulo="Como vestirse"
      titulo="Codigo de vestimenta"
      texto={invitado
        ? `${invitado.nombre} y familia ${invitado.familia}, nos encantará compartir esta celebración con ustedes.`
        : 'Una guía para acompañarnos con elegancia en este día tan especial.'}
      flores={false}
    >
      <div className="vestimenta">
        <article className="vestimenta__opcion">
          <img className="vestimenta__imagen" src="/static/traje_hombre.png" alt="Sugerencia de vestimenta formal para hombre" />
          <div className="vestimenta__descripcion">
            <h3>Para ellos</h3>
            <p>Recuerda asistir con vestimenta adecuada para la ocasión. Te sugerimos usar un terno de etiqueta, de preferencia en un color oscuro, con camisa y zapatos elegantes para disfrutar cómodamente de la celebración.</p>
          </div>
        </article>

        <article className="vestimenta__opcion vestimenta__opcion--mujer">
          <img className="vestimenta__imagen" src="/static/traje_mujer.png" alt="Sugerencia de vestido elegante para mujer" />
          <div className="vestimenta__descripcion">
            <h3>Para ellas</h3>
            <p>Te recomendamos un vestido elegante, largo o de cóctel, que te permita sentirte cómoda y disfrutar de toda la celebración. Elige el estilo con el que te sientas más hermosa para acompañarnos.</p>
          </div>
        </article>
      </div>
    </Seccion>
  );
}
