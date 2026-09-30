import { useState } from 'react';

import Icono from '../Iconos';
import Seccion from './Seccion';
import { BELLEZA, FAQ, HOTELES } from '../../pages/inicio/datos';

const Estrellas = ({ cantidad }) => (
  <span className="estrellas" aria-label={`${cantidad} estrellas`}>
    {'★'.repeat(cantidad)}
  </span>
);

export default function Logistica() {
  const [abierta, setAbierta] = useState(null);

  return (
    <Seccion
      id="logistica"
      icono="hotel"
      antetitulo="Para los que viajan"
      titulo="Informacion logistica"
      texto="Hospedaje, belleza y todo lo que suelen preguntarnos."
    >
      <h3 className="bloque__titulo">
        <Icono nombre="hotel" /> Hospedaje recomendado
      </h3>

      <ul className="hoteles">
        {HOTELES.map((hotel) => (
          <li className="hoteles__item" key={hotel.nombre}>
            <div className="hoteles__datos">
              <h4>{hotel.nombre}</h4>
              <Estrellas cantidad={hotel.estrellas} />
              <p className="hoteles__distancia">
                <Icono nombre="mapa" /> {hotel.distancia}
              </p>
              <p className="hoteles__beneficio">
                <Icono nombre="check" /> {hotel.beneficio}
              </p>
            </div>

            <div className="botones">
              <a
                className="boton boton--linea"
                href={hotel.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icono nombre="ruta" /> Como llegar
              </a>
              <a className="boton boton--linea" href={`tel:${hotel.telefono.replace(/\s/g, '')}`}>
                <Icono nombre="casa" /> {hotel.telefono}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="bloque__titulo">
        <Icono nombre="tijeras" /> Salones de belleza
      </h3>

      <ul className="belleza">
        {BELLEZA.map((salon) => (
          <li className="belleza__item" key={salon.nombre}>
            <span className="belleza__icono" aria-hidden="true">
              <Icono nombre="tijeras" />
            </span>
            <div>
              <h4>{salon.nombre}</h4>
              <p>{salon.servicio}</p>
            </div>
            <a className="belleza__tel" href={`tel:${salon.telefono.replace(/\s/g, '')}`}>
              {salon.telefono}
            </a>
          </li>
        ))}
      </ul>

      <h3 className="bloque__titulo">
        <Icono nombre="pregunta" /> Preguntas frecuentes
      </h3>

      <ul className="faq">
        {FAQ.map((item) => {
          const id = `faq-${item.pregunta.slice(0, 12).replace(/\s/g, '')}`;
          const activo = abierta === id;

          return (
            <li className="faq__item" key={item.pregunta} data-abierto={activo}>
              <button
                type="button"
                className="faq__pregunta"
                aria-expanded={activo}
                aria-controls={id}
                onClick={() => setAbierta(activo ? null : id)}
              >
                <span>{item.pregunta}</span>
                <span className="faq__signo" aria-hidden="true" />
              </button>
              <div className="faq__respuesta" id={id} hidden={!activo}>
                <p>{item.respuesta}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}
