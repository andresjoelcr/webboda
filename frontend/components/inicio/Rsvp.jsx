import { useEffect, useState } from 'react';

import Icono from '../Iconos';
import Modal from '../Modal';
import Seccion from './Seccion';
import { useInvitacion } from '../../context/InvitacionContext';

const PERSONAS = Array.from({ length: 12 }, (_, indice) => indice + 1);

const VACIO = {
  nombre_completo: '',
  cedula: '',
  nombre_familia: '',
  telefono: '',
  email: '',
  asistentes_confirmados: '1',
  alergias_restricciones: '',
};

export default function Rsvp() {
  const { limiteRsvp, invitado, tokenInvitacion } = useInvitacion();
  const datosIniciales = invitado
    ? { ...VACIO, nombre_completo: invitado.nombre, nombre_familia: invitado.familia, email: invitado.correo || '', telefono: invitado.telefono || '' }
    : VACIO;
  const [datos, setDatos] = useState(datosIniciales);
  const [estado, setEstado] = useState('inactivo');
  const [aviso, setAviso] = useState('');
  const [avisoEmergente, setAvisoEmergente] = useState('');
  const [asistenciaGuardada, setAsistenciaGuardada] = useState(invitado?.estado || 'pendiente');
  const [accionPendiente, setAccionPendiente] = useState('');

  useEffect(() => {
    if (!invitado) return;
    setAsistenciaGuardada(invitado.estado || 'pendiente');
    setDatos((actuales) => ({
      ...actuales,
      nombre_completo: invitado.nombre,
      nombre_familia: invitado.familia,
      email: actuales.email || invitado.correo || '',
      telefono: actuales.telefono || invitado.telefono || '',
    }));
  }, [invitado]);

  const cambia = (e) => {
    const { name, value } = e.target;
    setDatos((previo) => ({ ...previo, [name]: value }));
  };

  const sinAsistentes = Number(datos.asistentes_confirmados) === 0;

  const enviar = (e) => {
    e.preventDefault();
    setAviso('');

    if (!invitado && !datos.nombre_completo.trim()) {
      setAvisoEmergente('Escribe tu nombre completo para continuar.');
      setEstado('error');
      return;
    }

    if (datos.asistentes_confirmados !== '0') {
      const faltanDatos = [
        ['cedula', 'Escribe tu número de cédula o documento.'],
        ['telefono', 'Escribe tu teléfono de contacto (WhatsApp).'],
        ['email', 'Escribe tu correo electrónico.'],
      ].find(([campo]) => !datos[campo].trim());
      if (faltanDatos) {
        setAvisoEmergente(`Completa los datos obligatorios. ${faltanDatos[1]}`);
        setEstado('error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
        setAvisoEmergente('Escribe un correo electrónico válido para continuar.');
        setEstado('error');
        return;
      }
    }

    setAccionPendiente(datos.asistentes_confirmados === '0' ? 'no' : 'si');
  };

  const cancelarConfirmacion = () => setAccionPendiente('cancelar');
  const cambiarOpinion = () => setAccionPendiente('cambiar');

  const confirmarAccion = async () => {
    if (!accionPendiente) return;
    setEstado('enviando');
    setAviso('');
    try {
      const cancelar = accionPendiente === 'cancelar' || accionPendiente === 'cambiar';
      const respuesta = await fetch(cancelar ? '/api/rsvp/cancelar/' : '/api/rsvp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(cancelar
          ? { token: tokenInvitacion || invitado?.token || '' }
          : {
              ...datos,
              token: tokenInvitacion || invitado?.token || '',
              asistencia: accionPendiente,
              asistentes_confirmados: accionPendiente === 'no' ? '0' : datos.asistentes_confirmados,
            }),
      });
      const json = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || !json.ok) {
        setEstado('error');
        setAviso(json.error || 'No pudimos guardar tu respuesta. Intentalo de nuevo.');
        return;
      }

      const estadoGuardado = cancelar ? 'pendiente' : json.asistencia;
      setAsistenciaGuardada(estadoGuardado);
      setEstado(cancelar ? 'inactivo' : 'listo');
      setAviso(json.mensaje);
      if (accionPendiente === 'cambiar') {
        setDatos((actuales) => ({ ...actuales, asistentes_confirmados: '1' }));
      }
      if (!invitado) setDatos(VACIO);
    } catch {
      setEstado('error');
      setAviso('Sin conexion con el servidor. Intentalo de nuevo en un momento.');
    } finally {
      setAccionPendiente('');
    }
  };

  return (
    <div className="rsvp-escena">
      <video className="rsvp-escena__video" aria-hidden="true" autoPlay muted loop playsInline preload="metadata">
        <source src="/static/video_anillo_poner.mp4" type="video/mp4" />
      </video>
      <div className="rsvp-escena__velo" aria-hidden="true" />

      <Seccion
        id="rsvp"
        className="rsvp-escena__contenido"
        flores={false}
        icono="usuario"
        antetitulo=""
        titulo="Confirma tu asistencia"
        texto={invitado
          ? `Hola, ${invitado.nombre}. Confirma tu asistencia a la gran ceremonia junto a tu familia ${invitado.familia}; completa solamente los datos adicionales.`
          : 'Cuentanos quienes vienen, como contactarte y todo lo que el chef necesita saber.'}
      >
        <p className="rsvp__limite">
          <Icono nombre="reloj" /> Fecha limite para confirmar: <b>{limiteRsvp}</b>
        </p>

        <form className="rsvp__form" onSubmit={enviar} noValidate>
        {invitado && asistenciaGuardada !== 'pendiente' ? (
          <div className="rsvp__respuesta" role="status" aria-live="polite">
            <p className="rsvp__respuesta-texto">
              {asistenciaGuardada === 'si'
                ? `Gracias, ${invitado.nombre}${invitado.familia ? ` y familia ${invitado.familia}` : ''}, por acompañarnos en este momento tan especial.`
                : `Gracias por avisarnos, ${invitado.nombre}${invitado.familia ? ` y familia ${invitado.familia}` : ''}. Lamentamos que no puedan acompañarnos.`}
            </p>
            {asistenciaGuardada === 'si' ? (
              <button type="button" className="boton boton--linea" onClick={cancelarConfirmacion} disabled={estado === 'enviando'}>
                Cancelar confirmación
              </button>
            ) : (
              <button type="button" className="boton boton--oro" onClick={cambiarOpinion} disabled={estado === 'enviando'}>
                Cambiar de opinión
              </button>
            )}
          </div>
        ) : <>
        <fieldset className="grupo">
          <legend className="grupo__titulo">
            <Icono nombre="usuario" /> Tus datos
          </legend>

          <div className="rejilla">
            {!invitado ? <label className="campo">
                <span className="campo__etiqueta">
                Nombres y Apellidos <i className="campo__obligatorio">*</i>
              </span>
              <input
                className="campo__control"
                type="text"
                name="nombre_completo"
                value={datos.nombre_completo}
                onChange={cambia}
                readOnly={Boolean(invitado)}
                placeholder="Como deben aparecer en la lista"
                autoComplete="name"
                maxLength="140"
              />
            </label> : null}

            <label className="campo">
              <span className="campo__etiqueta">Numero de Cedula / Documento <i className="campo__obligatorio">*</i></span>
              <input
                className="campo__control"
                type="text"
                name="cedula"
                value={datos.cedula}
                onChange={cambia}
                required={datos.asistentes_confirmados !== '0'}
                inputMode="numeric"
                maxLength="20"
              />
            </label>

            {!invitado ? <label className="campo campo--ancho">
              <span className="campo__etiqueta">Nombre de la Familia / Grupo</span>
              <input
                className="campo__control"
                type="text"
                name="nombre_familia"
                value={datos.nombre_familia}
                onChange={cambia}
                readOnly={Boolean(invitado)}
                placeholder="Fam. Perez o Amigos de la Universidad"
                maxLength="120"
              />
              <span className="campo__ayuda">Con este nombre te buscamos el dia de la boda.</span>
            </label> : null}

            <label className="campo">
              <span className="campo__etiqueta">Telefono de contacto (WhatsApp) <i className="campo__obligatorio">*</i></span>
              <input
                className="campo__control"
                type="tel"
                name="telefono"
                value={datos.telefono}
                onChange={cambia}
                required={datos.asistentes_confirmados !== '0'}
                autoComplete="tel"
                maxLength="40"
              />
            </label>

            <label className={`campo${invitado ? ' rsvp__correo-centrado' : ''}`}>
              <span className="campo__etiqueta">Correo electronico <i className="campo__obligatorio">*</i></span>
              <input
                className="campo__control"
                type="email"
                name="email"
                value={datos.email}
                onChange={cambia}
                required={datos.asistentes_confirmados !== '0'}
                autoComplete="email"
                maxLength="140"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="grupo">
          <legend className="grupo__titulo">
            <Icono nombre="check" /> Tu asistencia
          </legend>

          <div className="rejilla">
            {datos.asistentes_confirmados !== '0' ? (
              <label className="campo">
                <span className="campo__etiqueta">Numero de personas que asistiran</span>
                <select
                  className="campo__control"
                  name="asistentes_confirmados"
                  value={datos.asistentes_confirmados}
                  onChange={cambia}
                >
                {PERSONAS.map((persona) => (
                  <option key={persona} value={persona}>{persona} {persona === 1 ? 'persona' : 'personas'}</option>
                ))}
                {!invitado ? <option value="0">No podremos asistir</option> : null}
                </select>
              </label>
            ) : null}

            <label className="campo">
              <span className="campo__etiqueta">Alergias o restricciones alimentarias (Opcional)</span>
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
                <span className="campo__ayuda">Sin asistentes no necesitamos esta informacion.</span>
              ) : null}
            </label>
          </div>
        </fieldset>

        <div className="rsvp__acciones">
          <button type="submit" className="boton boton--oro" disabled={estado === 'enviando'}>
            <Icono nombre="corazon" />
            {estado === 'enviando' ? 'Enviando…' : datos.asistentes_confirmados === '0' ? 'Confirmar que no asistiremos' : 'Enviar confirmacion'}
          </button>
          {invitado && estado !== 'listo' ? (
            datos.asistentes_confirmados === '0' ? (
              <button type="button" className="boton boton--linea" onClick={() => setDatos((actuales) => ({ ...actuales, asistentes_confirmados: '1' }))}>
                Cambiar a sí asistiremos
              </button>
            ) : (
              <button
                type="button"
                className="boton boton--linea"
                disabled={estado === 'enviando'}
                onClick={() => {
                  setDatos((actuales) => ({ ...actuales, asistentes_confirmados: '0' }));
                  setAviso('');
                  setAccionPendiente('no');
                }}
              >
                No podremos asistir
              </button>
            )
          ) : null}
          {invitado && asistenciaGuardada !== 'pendiente' ? (
            <button
              type="button"
              className="boton boton--linea"
              disabled={estado === 'enviando'}
              onClick={cancelarConfirmacion}
            >
              Cancelar confirmación
            </button>
          ) : null}
        </div>

        {aviso ? (
          <p className={`aviso aviso--${estado}`} role="status">
            {aviso}
          </p>
        ) : null}
        </>}
        </form>
      </Seccion>

      <Modal
        abierto={Boolean(avisoEmergente)}
        titulo="Completa tus datos"
        mensaje={avisoEmergente}
        icono="alerta"
        boton="Entendido"
        alCerrar={() => setAvisoEmergente('')}
      />

      <Modal
        abierto={Boolean(accionPendiente)}
        titulo={
          accionPendiente === 'si'
            ? '¿Confirmas tu asistencia?'
            : accionPendiente === 'no'
              ? '¿Confirmas que no asistirás?'
              : accionPendiente === 'cambiar'
                ? '¿Quieres cambiar tu respuesta?'
                : '¿Cancelar la confirmación?'
        }
        mensaje={
          accionPendiente === 'si'
            ? `Confirma que ${invitado?.nombre || datos.nombre_completo} asistirá a la celebración.`
            : accionPendiente === 'no'
              ? `Registraremos que ${invitado?.nombre || datos.nombre_completo} no podrá asistir.`
              : accionPendiente === 'cambiar'
                ? `Se quitará la respuesta de ${invitado?.nombre || 'tu invitación'} para que puedas confirmar tu asistencia.`
                : `Se quitará la respuesta de ${invitado?.nombre || 'tu invitación'} y quedará como “Sin responder”.`
        }
        icono={accionPendiente === 'cancelar' || accionPendiente === 'cambiar' ? 'alerta' : 'check'}
        alCerrar={() => {
          if (estado !== 'enviando') setAccionPendiente('');
        }}
      >
        <div className="rsvp__modal-acciones">
          <button
            type="button"
            className="boton boton--oro"
            disabled={estado === 'enviando'}
            onClick={confirmarAccion}
          >
            {estado === 'enviando'
              ? 'Guardando…'
              : accionPendiente === 'si'
                ? 'Sí, confirmar asistencia'
                : accionPendiente === 'no'
                  ? 'Confirmar que no asistiré'
                  : accionPendiente === 'cambiar'
                    ? 'Sí, cambiar respuesta'
                    : 'Sí, cancelar respuesta'}
          </button>
          <button
            type="button"
            className="boton boton--linea"
            disabled={estado === 'enviando'}
            onClick={() => setAccionPendiente('')}
          >
            Volver
          </button>
        </div>
      </Modal>
    </div>
  );
}
