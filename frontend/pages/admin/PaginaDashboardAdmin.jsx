import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icono from '../../components/Iconos';
import Modal from '../../components/Modal';
import { useInvitacion } from '../../context/InvitacionContext';
import { BODA } from '../inicio/datos';
import { salir, resumen, sesion, borrarInvitado, crearInvitado, invitados } from './api';

const VACIA = { resumen: {}, invitados: [], confirmaciones: [], felicitaciones: [] };

const RELLENO = { nombre: '', familia: '', correo: '', telefono: '' };

/* Estados de un invitado. 'pendiente' es tambien el estado con el que entra
   alguien que se agrega a mano desde el panel. */
const ESTADOS = {
  si: { texto: 'Confirmado', color: 'si' },
  no: { texto: 'No asistira', color: 'no' },
  pendiente: { texto: 'Sin responder', color: 'pendiente' },
};

const FILTROS = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'si', texto: 'Confirmados' },
  { valor: 'no', texto: 'No van' },
  { valor: 'pendiente', texto: 'Sin responder' },
];

const fecha = (iso) => {
  if (!iso) return '';
  const momento = new Date(iso);
  if (Number.isNaN(momento.getTime())) return '';

  return momento.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const iniciales = (nombre) =>
  String(nombre || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || '?';

/* Anillo de progreso: el mismo recurso del otro proyecto, con un svg puro y
   el trazo desplazado para que el arco tamper con la proporcion. */
function Anillo({ valor, total, color = 'oro', grande = false, sufijo = null }) {
  const RADIO = 42;
  const PERIMETRO = 2 * Math.PI * RADIO;
  const porcentaje = total > 0 ? (valor / total) * 100 : 0;
  const offset = PERIMETRO - (porcentaje / 100) * PERIMETRO;

  return (
    <div className="anillo" data-color={color} data-grande={grande}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="anillo__pista" cx="50" cy="50" r={RADIO} />
        <circle
          className="anillo__progreso"
          cx="50"
          cy="50"
          r={RADIO}
          strokeDasharray={PERIMETRO}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="anillo__cifra">
        {valor}
        {sufijo ? <small>{sufijo}</small> : null}
      </span>
    </div>
  );
}

export default function PaginaDashboardAdmin() {
  const navegar = useNavigate();
  const { limiteRsvp } = useInvitacion();
  const [datos, setDatos] = useState(VACIA);
  const [invitados, setInvitados] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('resumen');
  const [lateralAbierto, setLateralAbierto] = useState(false);
  const [avisoInvitado, setAvisoInvitado] = useState(null);

  /* La pagina es privada: sin sesion, de vuelta al acceso */
  useEffect(() => {
    sesion()
      .then((estado) => {
        if (!estado.autenticado) {
          navegar('/loginadmin', { replace: true });
          return null;
        }

        setUsuario(estado.usuario);
        return resumen().then((cifras) => {
          setDatos(cifras);
          setInvitados(cifras.invitados || []);
        });
      })
      .catch(() => navegar('/loginadmin', { replace: true }))
      .finally(() => setCargando(false));
  }, [navegar]);

  /* Tras alta o baja se relee la lista para que el Resumen tambien se entere. */
  const recargarInvitados = useCallback(async (invitadoNuevo = null, idEliminado = null) => {
    try {
      const resultado = await invitados();
      setInvitados(resultado.invitados);
    } catch {
      // Mantiene la vista coherente aunque falle la lectura posterior al cambio.
      if (invitadoNuevo) setInvitados((actuales) => [...actuales, invitadoNuevo]);
      if (idEliminado !== null) {
        setInvitados((actuales) => actuales.filter((fila) => fila.id !== idEliminado));
      }
    }
  }, []);

  const notificarInvitado = useCallback((aviso) => {
    setAvisoInvitado(aviso);
  }, []);

  /* En pantallas angostas la barra lateral se esconde detras del boton del
     menu: bloquea el scroll y se cierra con Escape, como la ventana emergente. */
  useEffect(() => {
    if (!lateralAbierto) return undefined;

    document.body.style.overflow = 'hidden';

    const alTeclear = (e) => {
      if (e.key === 'Escape') setLateralAbierto(false);
    };

    document.addEventListener('keydown', alTeclear);

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
    };
  }, [lateralAbierto]);

  /* Al volver a una pantalla ancha la barra lateral ya esta siempre a la vista. */
  useEffect(() => {
    const ancha = window.matchMedia('(min-width: 60rem)');
    const alCambiar = (evento) => {
      if (evento.matches) setLateralAbierto(false);
    };

    ancha.addEventListener('change', alCambiar);
    return () => ancha.removeEventListener('change', alCambiar);
  }, []);

  const cambiarVista = (clave) => {
    setVista(clave);
    setLateralAbierto(false);
  };

  const cerrar = async () => {
    try {
      await salir();
    } catch {
      /* la sesion caduca sola del lado del servidor */
    }
    navegar('/loginadmin', { replace: true });
  };

  return (
    <div className="panel" data-lateral={lateralAbierto}>
      <header className="panel__menu">
        <button
          type="button"
          className="panel__menu-boton"
          onClick={() => setLateralAbierto((abierto) => !abierto)}
          aria-expanded={lateralAbierto}
          aria-controls="panel-lateral"
          aria-label={lateralAbierto ? 'Cerrar el menu' : 'Abrir el menu'}
        >
          <span aria-hidden="true" />
        </button>

        <span className="panel__menu-texto">
          JYG <i>panel</i>
        </span>
      </header>

      {lateralAbierto ? (
        <button
          type="button"
          className="panel__telon"
          onClick={() => setLateralAbierto(false)}
          aria-label="Cerrar el menu"
        />
      ) : null}

      <aside className="panel__lateral" id="panel-lateral">
        <p className="panel__marca">
          <span className="panel__marca-icono">
            <Icono nombre="anillos" />
          </span>
          <span className="panel__marca-texto">
            JYG <i>panel</i>
          </span>
        </p>

        <nav className="panel__nav" aria-label="Secciones del panel">
          {[
            { clave: 'resumen', texto: 'Resumen', icono: 'galeria' },
            { clave: 'invitados', texto: 'Invitados', icono: 'usuario' },
            { clave: 'confirmaciones', texto: 'Confirmaciones', icono: 'libro' },
          ].map((item) => (
            <button
              key={item.clave}
              type="button"
              className="panel__nav-boton"
              data-activo={vista === item.clave}
              aria-current={vista === item.clave ? 'page' : undefined}
              onClick={() => cambiarVista(item.clave)}
            >
              <Icono nombre={item.icono} />
              <span>{item.texto}</span>
            </button>
          ))}
        </nav>

        <div className="panel__usuario">
          <span className="panel__usuario-avatar">{iniciales(usuario)}</span>
          <span className="panel__usuario-texto">{usuario || 'Administrador'}</span>
        </div>

        <button type="button" className="panel__salir" onClick={cerrar}>
          <Icono nombre="flecha" />
          <span>Cerrar sesion</span>
        </button>
      </aside>

      <main className="panel__principal">
        {cargando ? (
          <p className="panel__cargando">Cargando la informacion…</p>
        ) : (
          <>
            {vista === 'resumen' ? (
              <VistaResumen datos={datos} invitados={invitados} limiteRsvp={limiteRsvp} />
            ) : null}
            {vista === 'invitados' ? (
              <VistaInvitados
                invitados={invitados}
                recargar={recargarInvitados}
                notificar={notificarInvitado}
              />
            ) : null}
            {vista === 'confirmaciones' ? <VistaConfirmaciones datos={datos} /> : null}
          </>
        )}
      </main>

      <Modal
        abierto={Boolean(avisoInvitado)}
        titulo={avisoInvitado?.titulo || ''}
        mensaje={avisoInvitado?.mensaje || ''}
        icono={avisoInvitado?.tipo === 'error' ? 'alerta' : 'check'}
        alCerrar={() => setAvisoInvitado(null)}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- resumen */

function VistaResumen({ datos, invitados, limiteRsvp }) {
  /* Los cuatro numeros del panel salen de los invitados registrados: los
     anillos y la barra se llenan solos conforme responden. */
  const guests = invitados;

  const metricas = useMemo(() => {
    const confirmados = guests.filter((fila) => fila.estado === 'si').length;
    const noAsisten = guests.filter((fila) => fila.estado === 'no').length;
    const sinResponder = guests.filter((fila) => fila.estado === 'pendiente').length;
    const total = guests.length;

    return {
      total,
      confirmados,
      noAsisten,
      sinResponder,
      respondieron: confirmados + noAsisten,
      porcentajeRespondido: total > 0 ? Math.round(((confirmados + noAsisten) / total) * 100) : 0,
    };
  }, [guests]);

  const { total, confirmados, noAsisten, sinResponder, porcentajeRespondido } = metricas;
  const personasAsistiran = Number(datos.resumen?.asistentes || 0);

  const graficos = [
    { clave: 'confirmados', rotulo: 'Confirmados', cifra: confirmados, color: 'si', icono: 'check' },
    { clave: 'noAsisten', rotulo: 'No asistiran', cifra: noAsisten, color: 'no', icono: 'corazon' },
    { clave: 'sinResponder', rotulo: 'Sin responder', cifra: sinResponder, color: 'pendiente', icono: 'pregunta' },
  ];

  const distribucion = [
    { clave: 'confirmados', texto: 'Confirmados', cifra: confirmados, color: 'si' },
    { clave: 'noAsisten', texto: 'No asistiran', cifra: noAsisten, color: 'no' },
    { clave: 'sinResponder', texto: 'Sin responder', cifra: sinResponder, color: 'pendiente' },
  ].filter((barra) => barra.cifra > 0);

  return (
    <>
      <header className="panel__cabecera">
        <span className="panel__cabecera-icono">
          <Icono nombre="anillos" />
        </span>
        <div>
          <h1>Resumen de la boda</h1>
          <p>
            {BODA.lugar} · {BODA.fechaTexto} · confirmaciones hasta {limiteRsvp}
          </p>
        </div>
      </header>

      <section className="panel__resumen-destacados">
        <article className="panel__tarjeta panel__tarjeta--personas panel__personas-principal">
          <strong className="panel__personas-cifra">{personasAsistiran}</strong>
          <span className="panel__tarjeta-rotulo">Personas que asistirán</span>
          <span className="panel__tarjeta-nota">Incluye acompañantes confirmados</span>
        </article>

        <article className="panel__tarjeta panel__tarjeta--destacada panel__respondidos-principal">
          <Anillo valor={porcentajeRespondido} total={100} color="oro" grande sufijo="%" />
          <div className="panel__tarjeta-texto">
            <span className="panel__tarjeta-rotulo">
              <Icono nombre="check" />
              Han respondido
            </span>
            <span className="panel__tarjeta-nota">
              {total > 0
                ? `${confirmados + noAsisten} de ${total} invitados`
                : 'Aun no hay invitados'}
            </span>
          </div>
        </article>
      </section>

      <section className="panel__tarjetas">
        {graficos.map((tarjeta) => (
          <article className="panel__tarjeta" key={tarjeta.clave}>
            <Anillo valor={tarjeta.cifra} total={total} color={tarjeta.color} />
            <div className="panel__tarjeta-texto">
              <span className="panel__tarjeta-rotulo">
                <Icono nombre={tarjeta.icono} />
                {tarjeta.rotulo}
              </span>
              <span className="panel__tarjeta-nota">
                {total > 0 ? `${Math.round((tarjeta.cifra / total) * 100)}% del total` : 'Sin datos'}
              </span>
            </div>
          </article>
        ))}

      </section>

      <section className="panel__caja">
        <h2 className="panel__titulo">Como va la lista</h2>

        {total > 0 ? (
          <>
            <div
              className="panel__barra"
              role="img"
              aria-label={distribucion.map((barra) => `${barra.texto}: ${barra.cifra}`).join(', ')}
            >
              {distribucion.map((barra) => (
                <span
                  key={barra.clave}
                  className="panel__barra-trozo"
                  data-color={barra.color}
                  style={{ width: `${(barra.cifra / total) * 100}%` }}
                />
              ))}
            </div>

            <ul className="panel__leyenda">
              {distribucion.map((barra) => (
                <li key={barra.clave} data-color={barra.color}>
                  <span className="panel__leyenda-punto" />
                  {barra.texto}
                  <strong>{barra.cifra}</strong>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="panel__vacio">
            Todavia no hay invitados registrados. Agrega al primero desde la seccion Invitados.
          </p>
        )}
      </section>

      <section className="panel__caja">
        <h2 className="panel__titulo">Felicidades</h2>

        {datos.felicitaciones.length ? (
          <ul className="panel__mensajes">
            {datos.felicitaciones.map((mensaje) => (
              <li key={mensaje.id} className="panel__mensaje">
                <span className="panel__mensaje-avatar">{iniciales(mensaje.autor)}</span>
                <div>
                  <strong>{mensaje.autor}</strong>
                  <p>{mensaje.mensaje}</p>
                  <span className="panel__mensaje-fecha">{fecha(mensaje.fecha)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="panel__vacio">Todavia no hay mensajes en el libro de visitas.</p>
        )}
      </section>
    </>
  );
}

/* -------------------------------------------------------------- invitados */

/* Cada invitado viene de la base de datos con su enlace personal ya generado:
   el panel solo lo da de alta y despues comparte ese enlace. */
function VistaInvitados({ invitados, recargar, notificar }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [altaAbierta, setAltaAbierta] = useState(false);
  const [borrador, setBorrador] = useState(RELLENO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [borrando, setBorrando] = useState(null);
  const [invitadoPorBorrar, setInvitadoPorBorrar] = useState(null);
  const [copiado, setCopiado] = useState('');

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return invitados.filter((invitado) => {
      if (filtro !== 'todos' && invitado.estado !== filtro) return false;
      if (!texto) return true;

      return [invitado.nombre, invitado.familia, invitado.correo, invitado.telefono]
        .join(' ')
        .toLowerCase()
        .includes(texto);
    });
  }, [invitados, busqueda, filtro]);

  const escribir = (campo) => (e) => {
    setBorrador((actual) => ({ ...actual, [campo]: e.target.value }));
  };

  const cerrarAlta = useCallback(() => {
    setAltaAbierta(false);
    setBorrador(RELLENO);
    setError('');
  }, []);

  const agregar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');

    try {
      const resultado = await crearInvitado({
        nombre: borrador.nombre.trim(),
        familia: borrador.familia.trim(),
        correo: borrador.correo.trim(),
        telefono: borrador.telefono.trim(),
      });

      const nombreRegistrado = borrador.nombre.trim();
      const invitadoNuevo = resultado.invitado;
      setFiltro('todos');
      setBusqueda('');
      cerrarAlta();
      notificar({
        tipo: 'exito',
        titulo: 'Invitado registrado',
        mensaje: `${nombreRegistrado} quedó agregado a la lista de invitados.`,
      });
      await recargar(invitadoNuevo);
    } catch (problema) {
      setError(problema.message);
    } finally {
      setGuardando(false);
    }
  };

  const quitar = async () => {
    if (!invitadoPorBorrar) return;
    const invitado = invitadoPorBorrar;
    setBorrando(invitado.id);
    try {
      await borrarInvitado(invitado.id);
      setInvitadoPorBorrar(null);
      notificar({
        tipo: 'exito',
        titulo: 'Invitado eliminado',
        mensaje: `${invitado.nombre} fue eliminado de la lista de invitados.`,
      });
      await recargar(null, invitado.id);
    } catch (problema) {
      notificar({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: problema.message });
    } finally {
      setBorrando(null);
    }
  };

  /* Copia el enlace completo (con dominio) para pegarlo en WhatsApp o correo. */
  const copiarEnlace = async (invitado) => {
    const enlace = new URL('/', window.location.origin);
    enlace.searchParams.set('token', invitado.token);
    const enlaceCompleto = enlace.toString();

    try {
      await navigator.clipboard.writeText(enlaceCompleto);
    } catch {
      const campo = document.createElement('textarea');
      campo.value = enlaceCompleto;
      campo.style.position = 'fixed';
      campo.style.opacity = '0';
      document.body.appendChild(campo);
      campo.select();
      document.execCommand('copy');
      campo.remove();
    }

    setCopiado(invitado.token);
    window.setTimeout(() => setCopiado(''), 2200);
  };

  const compartirEnlace = async (invitado) => {
    const enlace = new URL('/', window.location.origin);
    enlace.searchParams.set('token', invitado.token);
    const enlaceCompleto = enlace.toString();
    const grupo = invitado.familia ? ` y familia ${invitado.familia}` : '';
    const mensaje = `Hola, ${invitado.nombre}${grupo}. Aquí está su invitación: ${enlaceCompleto}`;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Invitación a la boda',
          text: `Hola, ${invitado.nombre}${grupo}. Te invitamos a celebrar con nosotros.`,
          url: enlaceCompleto,
        });
        return;
      } catch (problema) {
        // Cerrar el selector del dispositivo es una acción voluntaria, no un error.
        if (problema.name === 'AbortError') return;
      }
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener,noreferrer');
  };

  const conteos = useMemo(
    () => ({
      todos: invitados.length,
      si: invitados.filter((fila) => fila.estado === 'si').length,
      no: invitados.filter((fila) => fila.estado === 'no').length,
      pendiente: invitados.filter((fila) => fila.estado === 'pendiente').length,
    }),
    [invitados]
  );

  return (
    <>
      <header className="panel__cabecera">
        <span className="panel__cabecera-icono">
          <Icono nombre="usuario" />
        </span>
        <div className="panel__cabecera-texto">
          <h1>Invitados</h1>
          <p>Registra a cada invitado y lleva el control de quienes ya respondieron.</p>
        </div>

        <div className="panel__cabecera-acciones">
          <button
            type="button"
            className="panel__boton panel__boton--primario"
            onClick={() => setAltaAbierta(true)}
          >
            <Icono nombre="usuario" />
            Agregar invitado
          </button>
        </div>
      </header>

      <section className="panel__caja">
        <div className="panel__controles">
          <label className="panel__buscador">
            <Icono nombre="lupa" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, familia, correo o telefono…"
              aria-label="Buscar invitados"
            />
            <span className="panel__buscador-conteo">{filtrados.length}</span>
          </label>

          <div className="panel__pestanas" role="group" aria-label="Filtrar invitados por respuesta">
            {FILTROS.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                className="panel__pestana"
                data-activo={filtro === opcion.valor}
                onClick={() => setFiltro(opcion.valor)}
              >
                {opcion.texto}
                <span className="panel__pestana-conteo">{conteos[opcion.valor] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {filtrados.length ? (
          <ul className="panel__invitados">
            {filtrados.map((invitado) => (
              <li key={invitado.id} className="panel__invitado">
                <span className="panel__invitado-avatar">{iniciales(invitado.nombre)}</span>

                <div className="panel__invitado-datos">
                  <strong>{invitado.nombre}</strong>
                  {invitado.familia ? <small>{invitado.familia}</small> : null}
                </div>

                <div className="panel__invitado-contacto">
                  {invitado.correo ? (
                    <a href={`mailto:${invitado.correo}`}>{invitado.correo}</a>
                  ) : null}
                  {invitado.telefono ? (
                    <a
                      href={`https://wa.me/${invitado.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {invitado.telefono}
                    </a>
                  ) : null}
                  {!invitado.correo && !invitado.telefono ? <small>Sin contacto</small> : null}
                </div>

                <span className="panel__pastilla" data-color={ESTADOS[invitado.estado]?.color}>
                  {ESTADOS[invitado.estado]?.texto ?? 'Sin responder'}
                </span>

                <div className="panel__invitado-acciones">
                  <button
                    type="button"
                    className="panel__enlace"
                    onClick={() => copiarEnlace(invitado)}
                    title={`Copiar el enlace de ${invitado.nombre}`}
                  >
                    <Icono nombre={copiado === invitado.token ? 'check' : 'sobre'} />
                    <span>{copiado === invitado.token ? 'Enlace copiado' : 'Copiar invitación'}</span>
                  </button>

                  <button
                    type="button"
                    className="panel__enlace"
                    onClick={() => compartirEnlace(invitado)}
                    title={`Compartir la invitación de ${invitado.nombre}`}
                  >
                    <Icono nombre="compartir" />
                    <span>Compartir</span>
                  </button>

                  <button
                    type="button"
                    className="panel__enlace panel__enlace--peligro"
                    onClick={() => setInvitadoPorBorrar(invitado)}
                    disabled={borrando === invitado.id}
                    title={`Dar de baja a ${invitado.nombre}`}
                  >
                    <Icono nombre="tijeras" />
                    <span>{borrando === invitado.id ? 'Borrando…' : 'Borrar'}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="panel__vacio">
            {invitados.length
              ? 'Ningun invitado coincide con ese filtro.'
              : 'Aun no hay invitados. Presiona “Agregar invitado” para registrar al primero.'}
          </p>
        )}
      </section>

      <Modal
        abierto={altaAbierta}
        titulo="Agregar invitado"
        mensaje="Los invitados nuevos empiezan como “sin responder”."
        imagen="/static/casados3.png"
        alCerrar={cerrarAlta}
      >
        <form className="panel__formulario" onSubmit={agregar} noValidate>
          <label className="panel__campo">
            <span>Nombres y apellidos *</span>
            <input
              type="text"
              value={borrador.nombre}
              onChange={escribir('nombre')}
              placeholder="Ej: Ana Maria Rojas Vera"
              autoComplete="off"
              required
            />
          </label>

          <label className="panel__campo">
            <span>Familia *</span>
            <input
              type="text"
              value={borrador.familia}
              onChange={escribir('familia')}
              placeholder="Ej: Familia Rojas"
              autoComplete="off"
              required
            />
          </label>

          <label className="panel__campo">
            <span>Correo electronico (opcional)</span>
            <input
              type="email"
              value={borrador.correo}
              onChange={escribir('correo')}
              placeholder="Ej: ana.rojas@correo.com"
              autoComplete="off"
            />
          </label>

          <label className="panel__campo">
            <span>Numero de telefono (opcional)</span>
            <input
              type="tel"
              value={borrador.telefono}
              onChange={escribir('telefono')}
              placeholder="Ej: 33 1234 5678"
              autoComplete="off"
            />
          </label>

          <p className="panel__nota-formulario">
            Con el alta se genera un enlace unico para que el invitado confirme su asistencia
            sin usuario ni contrasena.
          </p>

          {error ? (
            <p className="panel__error-formulario" role="alert">
              {error}
            </p>
          ) : null}

          <div className="panel__formulario-acciones">
            <button
              type="submit"
              className="panel__boton panel__boton--primario"
              disabled={guardando}
            >
              <Icono nombre="check" />
              {guardando ? 'Guardando…' : 'Agregar invitado'}
            </button>
            <button type="button" className="panel__boton panel__boton--suave" onClick={cerrarAlta}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        abierto={Boolean(invitadoPorBorrar)}
        titulo="¿Eliminar invitado?"
        mensaje={invitadoPorBorrar
          ? `¿Deseas eliminar a ${invitadoPorBorrar.nombre} de la lista de invitados?`
          : ''}
        icono="alerta"
        boton="Cancelar"
        alCerrar={() => {
          if (!borrando) setInvitadoPorBorrar(null);
        }}
      >
        <div className="panel__formulario-acciones">
          <button
            type="button"
            className="panel__boton panel__boton--primario"
            onClick={quitar}
            disabled={borrando !== null}
          >
            <Icono nombre="tijeras" />
            {borrando ? 'Eliminando…' : 'Sí, eliminar invitado'}
          </button>
          <button
            type="button"
            className="panel__boton panel__boton--suave"
            onClick={() => setInvitadoPorBorrar(null)}
            disabled={borrando !== null}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
}

/* --------------------------------------------------------- confirmaciones */
function VistaConfirmaciones({ datos }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const personasAsistiran = useMemo(
    () => datos.confirmaciones.reduce(
      (total, fila) => total + (fila.asistencia === 'si' ? Number(fila.asistentes_confirmados || 0) : 0),
      0,
    ),
    [datos.confirmaciones],
  );

  const filas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return datos.confirmaciones.filter((fila) => {
      if (filtro === 'si' && fila.asistencia !== 'si') return false;
      if (filtro === 'no' && fila.asistencia !== 'no') return false;
      if (!texto) return true;

      return [
        fila.nombre_completo,
        fila.cedula,
        fila.nombre_familia,
        fila.telefono,
        fila.email,
        fila.alergias_restricciones,
      ]
        .join(' ')
        .toLowerCase()
        .includes(texto);
    });
  }, [datos.confirmaciones, busqueda, filtro]);

  return (
    <>
      <header className="panel__cabecera">
        <span className="panel__cabecera-icono">
          <Icono nombre="libro" />
        </span>
        <div>
          <h1>Confirmaciones</h1>
          <p>Todo lo que nos llega por el formulario de asistencia.</p>
        </div>
      </header>

      <section className="panel__caja">
        <div className="panel__asistencia-resumen" role="status">
          <span className="panel__personas-icono"><Icono nombre="check" /></span>
          <div>
            <strong>{personasAsistiran}</strong>
            <span>personas asistirán en total</span>
          </div>
        </div>
        <div className="panel__controles">
          <label className="panel__buscador">
            <Icono nombre="lupa" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar nombre, cedula, telefono…"
              aria-label="Buscar confirmaciones"
            />
            <span className="panel__buscador-conteo">{filas.length}</span>
          </label>

          <div className="panel__pestanas" role="group" aria-label="Filtrar por asistencia">
            {[
              { valor: 'todas', texto: 'Todas' },
              { valor: 'si', texto: 'Si asisten' },
              { valor: 'no', texto: 'No asisten' },
            ].map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                className="panel__pestana"
                data-activo={filtro === opcion.valor}
                onClick={() => setFiltro(opcion.valor)}
              >
                {opcion.texto}
              </button>
            ))}
          </div>
        </div>

        {filas.length ? (
          <div className="panel__tabla-envoltura">
            <table className="panel__tabla">
              <thead>
                <tr>
                  <th>Nombres y apellidos</th>
                  <th>Cedula / Documento</th>
                  <th>Familia / Grupo</th>
                  <th>WhatsApp</th>
                  <th>Correo</th>
                  <th>Acompañantes</th>
                  <th>Alergias o restricciones</th>
                  <th>Recibida</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.id}>
                    <td data-etiqueta="Nombres y apellidos">{fila.nombre_completo}</td>
                    <td data-etiqueta="Cedula">{fila.cedula || '—'}</td>
                    <td data-etiqueta="Familia / Grupo">{fila.nombre_familia || '—'}</td>
                    <td data-etiqueta="WhatsApp">
                      {fila.telefono ? (
                        <a
                          href={`https://wa.me/${fila.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {fila.telefono}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td data-etiqueta="Correo">
                      {fila.email ? <a href={`mailto:${fila.email}`}>{fila.email}</a> : '—'}
                    </td>
                    <td data-etiqueta="Acompañantes">
                      <span className="panel__pastilla" data-color={fila.asistencia === 'si' ? 'si' : 'no'}>
                        {fila.asistencia === 'si' ? fila.asistentes_confirmados : 'No'}
                      </span>
                    </td>
                    <td data-etiqueta="Alergias">{fila.alergias_restricciones || '—'}</td>
                    <td data-etiqueta="Recibida">{fecha(fila.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="panel__vacio">Aun no hay confirmaciones que coincidan.</p>
        )}
      </section>
    </>
  );
}
