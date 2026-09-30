import { useEffect, useState } from 'react';

import Icono from '../Iconos';
import Seccion from './Seccion';
import { BODA } from '../../pages/inicio/datos';

const QR = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
  BODA.albumUrl,
)}`;

function LibroVisitas() {
  const [autor, setAutor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState('inactivo');
  const [aviso, setAviso] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    let vigente = true;

    fetch('/api/felicitaciones/')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (vigente && json?.mensajes) setMensajes(json.mensajes);
      })
      .catch(() => {});

    return () => {
      vigente = false;
    };
  }, []);

  const enviar = async (e) => {
    e.preventDefault();

    if (!autor.trim() || !mensaje.trim()) {
      setAviso('Escribe tu nombre y tu mensaje.');
      setEstado('error');
      return;
    }

    setEstado('enviando');
    setAviso('');

    try {
      const respuesta = await fetch('/api/felicitacion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autor, mensaje }),
      });
      const json = await respuesta.json();

      if (!respuesta.ok || !json.ok) {
        setAviso(json.error || 'No pudimos guardar tu mensaje.');
        setEstado('error');
        return;
      }

      setMensajes((previos) => [json.mensaje, ...previos]);
      setAutor('');
      setMensaje('');
      setEstado('listo');
      setAviso('¡Gracias por tus palabras!');
    } catch {
      setAviso('Sin conexion con el servidor. Intentalo de nuevo en un momento.');
      setEstado('error');
    }
  };

  return (
    <div className="libro">
      <h3 className="bloque__titulo">
        <Icono nombre="libro" /> Libro de visitas digital
      </h3>

      <form className="libro__form" onSubmit={enviar}>
        <label className="campo">
          <span className="campo__etiqueta">Tu nombre</span>
          <input
            className="campo__control"
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Como te firmamos"
          />
        </label>

        <label className="campo">
          <span className="campo__etiqueta">Tu mensaje</span>
          <textarea
            className="campo__control campo__control--area"
            rows="3"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribenos unas palabras de cariño"
          />
        </label>

        <button type="submit" className="boton boton--oro" disabled={estado === 'enviando'}>
          <Icono nombre="corazon" />
          {estado === 'enviando' ? 'Enviando…' : 'Dejar mensaje'}
        </button>

        {aviso ? (
          <p className={`aviso aviso--${estado}`} role="status">
            {aviso}
          </p>
        ) : null}
      </form>

      {mensajes.length ? (
        <ul className="libro__muro">
          {mensajes.map((item, i) => (
            <li className="libro__nota" key={`${item.fecha}-${i}`}>
              <p>{item.mensaje}</p>
              <span>{item.autor}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="libro__vacio">Aqui apareceran los mensajes que nos dejen los invitados.</p>
      )}
    </div>
  );
}

export default function Extras() {
  const [qrVisible, setQrVisible] = useState(true);

  return (
    <Seccion
      id="extras"
      icono="qr"
      antetitulo="El dia de la boda"
      titulo="Fotos, filtro y pendientes"
      texto="Sube tus fotos, usa el filtro oficial y deja tu mensaje en el libro de visitas."
    >
      <div className="extras">
        <article className="tarjeta tarjeta--qr">
          <h3 className="tarjeta__titulo">
            <Icono nombre="qr" /> Sube tus fotos
          </h3>

          {qrVisible ? (
            <a className="qr" href={BODA.albumUrl} target="_blank" rel="noreferrer noopener">
              <img
                src={QR}
                alt="Codigo QR para subir fotos al album de la boda"
                onError={() => setQrVisible(false)}
              />
            </a>
          ) : (
            <div className="qr qr--fallback" aria-hidden="true">
              <Icono nombre="qr" />
            </div>
          )}

          <p className="tarjeta__texto">
            Escanea el codigo con la camara del celular (o usa el QR de las mesas el dia de la boda) y sube
            tus fotos al album de la boda.
          </p>

          <div className="botones">
            <a className="boton boton--oro" href={BODA.albumUrl} target="_blank" rel="noreferrer noopener">
              <Icono nombre="camara" /> Abrir album
            </a>
          </div>
        </article>

        <div className="extras__columna">
          <article className="tarjeta tarjeta--hashtag">
            <h3 className="tarjeta__titulo">
              <Icono nombre="hashtag" /> Hashtag oficial
            </h3>
            <p className="hashtag">{BODA.hashtag}</p>
            <p className="tarjeta__texto">
              Usa el hashtag en todas tus fotos para que aparezcan en el muro de la boda.
            </p>
          </article>

          <article className="tarjeta tarjeta--filtro">
            <h3 className="tarjeta__titulo">
              <Icono nombre="filtro" /> Filtro oficial
            </h3>
            <p className="tarjeta__texto">
              Descarga el filtro de la boda para tus historias y fotos con el marco y los colores de la
              celebracion.
            </p>
            <div className="botones">
              <a className="boton boton--linea" href={BODA.filtroUrl} target="_blank" rel="noreferrer noopener">
                <Icono nombre="camara" /> Ver el filtro
              </a>
            </div>
          </article>
        </div>
      </div>

      <LibroVisitas />
    </Seccion>
  );
}
