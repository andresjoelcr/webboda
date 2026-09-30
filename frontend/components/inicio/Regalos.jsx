import { useState } from 'react';

import Icono from '../Iconos';
import Seccion from './Seccion';
import { REGALOS } from '../../pages/inicio/datos';

function Copiable({ valor }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
    } catch {
      const area = document.createElement('textarea');
      area.value = valor;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 1800);
  };

  return (
    <span className="copiable">
      <b>{valor}</b>
      <button type="button" className="copiable__boton" onClick={copiar}>
        <Icono nombre={copiado ? 'check' : 'anillos'} />
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </span>
  );
}

export default function Regalos() {
  return (
    <Seccion
      id="regalos"
      icono="regalo"
      antetitulo="Mesa de regalos"
      titulo={REGALOS.titulo}
      texto={REGALOS.texto}
    >
      <div className="regalos">
        <article className="tarjeta tarjeta--banco">
          <h3 className="tarjeta__titulo">
            <Icono nombre="casa" /> Transferencia
          </h3>

          {REGALOS.banco.map((cuenta) => (
            <dl className="datos" key={cuenta.cuenta}>
              <div className="datos__fila">
                <dt>Banco</dt>
                <dd>{cuenta.banco}</dd>
              </div>
              <div className="datos__fila">
                <dt>Titular</dt>
                <dd>{cuenta.titular}</dd>
              </div>
              <div className="datos__fila">
                <dt>Cuenta</dt>
                <dd>
                  <Copiable valor={cuenta.cuenta} />
                </dd>
              </div>
              <div className="datos__fila">
                <dt>CLABE</dt>
                <dd>
                  <Copiable valor={cuenta.clabe} />
                </dd>
              </div>
            </dl>
          ))}
        </article>

        <article className="tarjeta tarjeta--experiencias">
          <h3 className="tarjeta__titulo">
            <Icono nombre="globo" /> Fondo para la luna de miel
          </h3>

          <ul className="experiencias">
            {REGALOS.experiencias.map((item) => (
              <li className="experiencias__item" key={item.titulo}>
                <span className="experiencias__icono" aria-hidden="true">
                  <Icono nombre="corazon" />
                </span>
                <div>
                  <h4>{item.titulo}</h4>
                  <p>{item.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="botones">
            {REGALOS.enlaces.map((enlace) => (
              <a
                key={enlace.titulo}
                className="boton boton--linea"
                href={enlace.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icono nombre="regalo" />
                {enlace.titulo}
              </a>
            ))}
          </div>
        </article>
      </div>
    </Seccion>
  );
}
