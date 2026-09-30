import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Icono from '../../components/Iconos';
import Modal from '../../components/Modal';
import { entrar, sesion } from './api';

export default function PaginaLoginAdmin() {
  const navegar = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [estado, setEstado] = useState('inactivo');
  const [modal, setModal] = useState(null);

  const cerrarModal = useCallback(() => setModal(null), []);

  /* Si ya hay sesion abierta, se va directo al panel */
  useEffect(() => {
    sesion()
      .then((datos) => {
        if (datos.autenticado) navegar('/dashboaradmin', { replace: true });
      })
      .catch(() => null);
  }, [navegar]);

  const avisar = (titulo, mensaje) => {
    setEstado('error');
    setModal({ titulo, mensaje });
  };

  const enviar = async (e) => {
    e.preventDefault();
    setModal(null);

    if (!usuario.trim() && !clave) {
      avisar('No ingresaste los datos', 'Escribe tu usuario y tu contrasena para abrir el panel.');
      return;
    }

    if (!usuario.trim()) {
      avisar('Falta el usuario', 'Escribe el usuario con el que entraste la primera vez.');
      return;
    }

    if (!clave) {
      avisar('Falta la contrasena', 'Escribe tu contrasena para poder entrar al panel.');
      return;
    }

    setEstado('enviando');

    try {
      await entrar(usuario.trim(), clave);
      setClave('');
      navegar('/dashboaradmin', { replace: true });
    } catch (error) {
      avisar('No pudimos entrar', error.message);
    }
  };

  return (
    <div className="admin admin--login">
      <video
        className="admin__video"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/static/video_boda.mp4" type="video/mp4" />
      </video>
      <span className="admin__velo" aria-hidden="true" />

      <Link className="admin__volver" to="/inicio" aria-label="Volver al inicio">
        <span className="admin__volver-icono">
          <Icono nombre="casa" />
        </span>
        <span className="admin__volver-texto" aria-hidden="true">Volver al inicio</span>
      </Link>

      <div className="admin__carta">
        <img className="admin__marco-foto" src="/static/marco_boda.png" alt="" aria-hidden="true" />

        <div className="admin__carta-interior">
          <p className="admin__marca">
            <Icono nombre="anillos" /> JYG
          </p>

          <p className="admin__antetitulo">Acceso privado</p>
          <h1 className="admin__titulo">Panel de la boda</h1>
          <p className="admin__texto">Entra con tu usuario para ver las confirmaciones.</p>

          <form className="admin__formulario" onSubmit={enviar} noValidate>
            <label className="campo">
              <span className="campo__etiqueta">Usuario</span>
              <input
                className="campo__control"
                type="text"
                name="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </label>

            <label className="campo">
              <span className="campo__etiqueta">Contrasena</span>
              <span className="admin__clave">
                <input
                  className="campo__control"
                  type={verClave ? 'text' : 'password'}
                  name="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin__ojo"
                  onClick={() => setVerClave((visible) => !visible)}
                  aria-label={verClave ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  <Icono nombre={verClave ? 'ojoTachado' : 'ojo'} />
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="boton boton--oro admin__entrar"
              disabled={estado === 'enviando'}
            >
              <Icono nombre="anillos" />
              {estado === 'enviando' ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      <Modal
        abierto={Boolean(modal)}
        titulo={modal?.titulo}
        mensaje={modal?.mensaje}
        boton="Entendido"
        alCerrar={cerrarModal}
      />
    </div>
  );
}
