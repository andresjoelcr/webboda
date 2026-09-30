import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Icono from '../../components/Iconos';
import Seccion from '../../components/inicio/Seccion';
import Marco from '../../components/navegacion/Marco';
import { useInvitacion } from '../../context/InvitacionContext';

const PERSONAS = Array.from({ length: 12 }, (_, indice) => indice + 1);

const VACIO = {
  cedula: '',
  telefono: '',
  email: '',
  asistentes_confirmados: '1',
  alergias_restricciones: '',
  mensaje: '',
};

/* Page publica que se abre con el enlace personal del invitado: no pide usuario
   ni contrasena porque el token del enlace ya lo identifica. */
export default function PaginaInvitado() {
  const { token: tokenRuta } = useParams();
  const ubicacion = useLocation();
  const token = tokenRuta || new URLSearchParams(ubicacion.search).get('token');
  const { limiteRsvp } = useInvitacion();
  const formulario = useRef(null);

  const [cargando, setCargando] = useState(true);
  const [invitado, setInvitado] = useState(null);
  const [boda, setBoda] = useState(null);
  const [fallo, setFallo] = useState('');
  const [datos, setDatos] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState('inactivo');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let vigente = true;

    setCargando(true);
    setInvitado(null);
    setFallo('');
    setEstado('inactivo');
    setAviso('');
    setDatos(VACIO);

    fetch(`/api/invitado/${token}/`)
      .then(async (respuesta) => {
        const json = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok || !json.ok) {
          throw new Error(json.error || 'Este enlace de invitacion no es valido');
        }

        if (!vigente) return;

        setInvitado(json.invitado);
        setBoda(json.boda);
        setDatos({
          ...VACIO,
          telefono: json.invitado.telefono || '',
          email: json.invitado.correo || '',
        });
      })
      .catch((problema) => {
        if (vigente) setFallo(problema.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [token]);

  const cambia = (e) => {
    const { name, value } = e.target;
    setDatos((previo) => ({ ...previo, [name]: value }));
  };

  const sinAsistentes = Number(datos.asistentes_confirmados) === 0;

  /* 'si' confirma la invitacion; 'no' la deja registrada como no asistencia. */
  const enviar = async (decision) => {
    if (!invitado) return;
    if (!formulario.current?.reportValidity()) return;

    setEnviando(true);
    setAviso('');

    const cuerpo = {
      token,
      nombre_completo: invitado.nombre,
      nombre_familia: invitado.familia,
      asistencia: decision,
      asistentes_confirmados: decision === 'no' ? 0 : datos.asistentes_confirmados,
      ...datos,
    };

    try {
      const respuesta = await fetch('/api/rsvp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      const json = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok || !json.ok) {
        setAviso(json.error || 'No pudimos guardar tu confirmacion. Intentalo de nuevo.');
        setEstado('error');
        return;
      }

      setEstado(decision === 'no' ? 'rechazo' : 'listo');
      setAviso(json.mensaje);
    } catch {
      setAviso('Sin conexion con el servidor. Intentalo de nuevo en un momento.');
      setEstado('error');
    } finally {
      setEnviando(false);
    }
  };

  const cierra = () => {
    setEstado('inactivo');
    setAviso('');
  };

  if (cargando) {
    return (
      <Marco>
        <p className="invitado__espera">Abriendo tu invitacion…</p>
      </Marco>
    );
  }

  if (fallo) {
    return (
      <Marco>
        <Seccion
          id="invitado"
          icono="pregunta"
          antetitulo="Invitacion no encontrada"
          titulo="Este enlace no existe"
          texto={fallo}
        />
      </Marco>
    );
  }

  /* Si el invitado ya habia respondido antes (o acaba de responder aqui) se
     muestra el agradecimiento; si no, el formulario. */
  const yaRespondio = invitado.estado !== 'pendiente';
  const enviadoAqui = estado === 'listo' || estado === 'rechazo';
  const responder = yaRespondio || enviadoAqui;

  return (
    <Marco>
      {ubicacion.pathname === '/invitacion/' ? (
        <Seccion
          id="sobre-invitacion"
          icono="sobre"
          antetitulo="Invitación personal"
          titulo={`${invitado.nombre} y familia ${invitado.familia}`}
          texto="Esta invitación está preparada especialmente para ustedes."
        >
          <button type="button" className="boton boton--oro" onClick={() => navegar(`/inicio?token=${encodeURIComponent(token)}`)}>
            Abrir invitación
          </button>
        </Seccion>
      ) : null}
      <Seccion
        id="invitado"
        icono="anillos"
        antetitulo="Nuestra invitacion para ti"
        titulo={`Hola, ${invitado.nombre}`}
        texto={
          boda
            ? `${invitado.familia} · ${boda.fecha} en ${boda.lugar}. Nos encantaria contar contigo.`
            : `${invitado.familia}. Nos encantaria contar contigo.`
        }
      >
        {!responder ? (
          <div className="invitado__saludo">
            <img className="invitado__foto" src="/static/casados3.png" alt="" />
            <div className="invitado__saludo-texto">
              <h3 className="invitado__familia">Familia {invitado.familia}</h3>
              <p className="invitado__nota">
                Hola <b>{invitado.nombre}</b>, tu lugar esta reservado. Completa los datos que te
                faltan y confirmanos si nos acompanas.
              </p>
              <p className="invitado__limite">
                <Icono nombre="reloj" /> Fecha limite para confirmar: <b>{limiteRsvp}</b>
              </p>
            </div>
          </div>
        ) : null}

        {responder ? (
          <div className="invitado__gracias">
            <span className="invitado__gracias-icono">
              <Icono nombre={invitado.estado === 'no' ? 'sobre' : 'corazon'} />
            </span>
            <h3 className="invitado__gracias-titulo">
              {invitado.estado === 'no'
                ? 'Lamentamos que no puedas acompañarnos'
                : '¡Tu lugar esta confirmado!'}
            </h3>
            <p className="invitado__gracias-texto">
              {aviso ||
                (invitado.estado === 'no'
                  ? 'Registramos que no podras acompañarnos. Gracias por avisarnos.'
                  : 'Ya nos habias confirmado. Gracias por avisarnos.')}
            </p>
            {invitado.telefono ? (
              <a
                className="boton boton--oro"
                href={`https://wa.me/${invitado.telefono.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icono nombre="sobre" />
                Mandar un mensaje
              </a>
            ) : null}
          </div>
        ) : (
          <form className="rsvp__form" onSubmit={(e) => e.preventDefault()} noValidate ref={formulario}>
            <fieldset className="grupo">
              <legend className="grupo__titulo">
                <Icono nombre="usuario" /> Tus datos
              </legend>

              <div className="rejilla">
                <label className="campo">
                  <span className="campo__etiqueta">Nombres y apellidos</span>
                  <input
                    className="campo__control"
                    type="text"
                    value={invitado.nombre}
                    readOnly
                    aria-label="Nombres y apellidos"
                  />
                  <span className="campo__ayuda">Vienen de tu invitacion, no hace falta cambiarlos.</span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Familia / Grupo</span>
                  <input
                    className="campo__control"
                    type="text"
                    value={invitado.familia}
                    readOnly
                    aria-label="Familia"
                  />
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Telefono de contacto (WhatsApp)</span>
                  <input
                    className="campo__control"
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={cambia}
                    placeholder="+52 33 0000 0000"
                    autoComplete="tel"
                    maxLength="40"
                  />
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Correo electronico</span>
                  <input
                    className="campo__control"
                    type="email"
                    name="email"
                    value={datos.email}
                    onChange={cambia}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    maxLength="140"
                  />
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Numero de Cedula / Documento (opcional)</span>
                  <input
                    className="campo__control"
                    type="text"
                    name="cedula"
                    value={datos.cedula}
                    onChange={cambia}
                    placeholder="Numero a 18 digitos"
                    inputMode="numeric"
                    maxLength="20"
                  />
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Numero de personas que asistiran</span>
                  <select
                    className="campo__control"
                    name="asistentes_confirmados"
                    value={datos.asistentes_confirmados}
                    onChange={cambia}
                  >
                    {PERSONAS.map((persona) => (
                      <option key={persona} value={persona}>
                        {persona} {persona === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">Alergias o restricciones (opcional)</span>
                  <textarea
                    className="campo__control campo__control--area"
                    name="alergias_restricciones"
                    rows="3"
                    value={datos.alergias_restricciones}
                    onChange={cambia}
                    placeholder="Ej: alergia a los mariscos, vegetariano, sin gluten"
                    maxLength="400"
                  />
                  {sinAsistentes ? (
                    <span className="campo__ayuda">Con mas de un asistente si necesitamos esta informacion.</span>
                  ) : null}
                </label>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">Mensaje para los novios (opcional)</span>
                  <textarea
                    className="campo__control campo__control--area"
                    name="mensaje"
                    rows="3"
                    value={datos.mensaje}
                    onChange={cambia}
                    placeholder="Escribeles unas palabras…"
                    maxLength="1200"
                  />
                </label>
              </div>
            </fieldset>

            <div className="invitado__decidir">
              <button
                type="button"
                className="boton boton--oro boton--ancho"
                onClick={() => enviar('si')}
                disabled={enviando}
              >
                <Icono nombre="corazon" />
                {enviando ? 'Enviando…' : 'Confirmar mi invitación'}
              </button>

              <button
                type="button"
                className="boton boton--linea boton--ancho invitado__no"
                onClick={() => enviar('no')}
                disabled={enviando}
              >
                <Icono nombre="pregunta" />
                No podré asistir
              </button>
            </div>

            {aviso ? (
              <p className={`aviso aviso--${estado}`} role="status">
                {aviso}
              </p>
            ) : null}
          </form>
        )}

        {yaRespondio && !enviadoAqui ? (
          <p className="invitado__pie">
            <button type="button" className="invitado__reabrir" onClick={cerra}>
              Quiero corregir mi respuesta
            </button>
          </p>
        ) : null}
      </Seccion>
    </Marco>
  );
}
