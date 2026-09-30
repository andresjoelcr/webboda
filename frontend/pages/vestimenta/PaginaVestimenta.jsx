import VestimentaSeccion from '../../components/inicio/Vestimenta';
import Marco from '../../components/navegacion/Marco';

export default function PaginaVestimenta() {
  return (
    <Marco>
      <div className="vestimenta-escena">
        <video className="vestimenta-escena__video" aria-hidden="true" autoPlay muted loop playsInline preload="metadata">
          <source src="/static/video_vestimenta.mp4" type="video/mp4" />
        </video>
        <div className="vestimenta-escena__velo" aria-hidden="true" />
        <VestimentaSeccion />
      </div>
    </Marco>
  );
}
