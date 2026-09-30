import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Transicion from './components/Transicion';
import Sobre from './pages/sobre/Sobre';
import Portada from './pages/portada/Portada';
import PaginaPrograma from './pages/programa/PaginaPrograma';
import PaginaRsvp from './pages/rsvp/PaginaRsvp';
import PaginaVestimenta from './pages/vestimenta/PaginaVestimenta';
import PaginaLoginAdmin from './pages/admin/PaginaLoginAdmin';
import PaginaDashboardAdmin from './pages/admin/PaginaDashboardAdmin';
import PaginaInvitado from './pages/invitacion/PaginaInvitado';

export default function App() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const [velo, setVelo] = useState(false);

  /* Cada pagina arranca arriba y sin el scroll heredado de la anterior */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [ubicacion.pathname]);

  useEffect(() => {
    if (!ubicacion.state?.velo) return undefined;

    setVelo(true);
    const temporizador = window.setTimeout(() => {
      setVelo(false);
      navegar(`${ubicacion.pathname}${ubicacion.search}${ubicacion.hash}`, {
        replace: true,
        state: null,
      });
    }, 850);

    return () => window.clearTimeout(temporizador);
  }, [ubicacion.key, ubicacion.pathname, ubicacion.state, navegar]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Sobre />} />
        <Route path="/inicio" element={<Portada />} />
        <Route path="/programa" element={<PaginaPrograma />} />
        <Route path="/rsvp" element={<PaginaRsvp />} />
        <Route path="/vestimenta" element={<PaginaVestimenta />} />
        <Route path="/loginadmin" element={<PaginaLoginAdmin />} />
        <Route path="/dashboaradmin" element={<PaginaDashboardAdmin />} />
        {/* Enlace personal del invitado: no necesita iniciar sesion */}
        <Route path="/invitacion/:token" element={<PaginaInvitado />} />
        <Route path="*" element={<Portada />} />
      </Routes>

      {velo ? <Transicion /> : null}
    </>
  );
}
