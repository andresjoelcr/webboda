import { useCallback, useEffect, useRef } from 'react';

const SUAVE = 0.08;
const LIMITE = 0.001;

export default function useParallax() {
  const capas = useRef(new Set());
  const estado = useRef(new Map());
  const aplicado = useRef(new Map());

  const registrar = useCallback((nodo) => {
    if (nodo) capas.current.add(nodo);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      capas.current.forEach((nodo) => {
        nodo.style.transform = '';
      });
      return undefined;
    }

    let animacion = 0;

    const asegurar = (nodo) => {
      if (!estado.current.has(nodo)) {
        estado.current.set(nodo, { x: 0, y: 0, ox: 0, oy: 0 });
      }
      return estado.current.get(nodo);
    };

    const pintar = () => {
      let pendiente = false;

      capas.current.forEach((nodo) => {
        if (!nodo.isConnected) {
          capas.current.delete(nodo);
          estado.current.delete(nodo);
          aplicado.current.delete(nodo);
          return;
        }

        const e = asegurar(nodo);
        e.x += (e.ox - e.x) * SUAVE;
        e.y += (e.oy - e.y) * SUAVE;

        const d = parseFloat(nodo.dataset.depth) || 0;
        const valor = `translate3d(${(e.x * d * 100).toFixed(2)}px, ${(e.y * d * 100).toFixed(2)}px, 0)`;

        // solo se escribe cuando el valor cambia: evita repintados de la sombra
        if (aplicado.current.get(nodo) !== valor) {
          aplicado.current.set(nodo, valor);
          nodo.style.transform = valor;
        }

        if (Math.abs(e.ox - e.x) > LIMITE || Math.abs(e.oy - e.y) > LIMITE) {
          pendiente = true;
        }
      });

      animacion = pendiente ? window.requestAnimationFrame(pintar) : 0;
    };

    const mover = () => {
      if (!animacion) animacion = window.requestAnimationFrame(pintar);
    };

    const alMover = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      capas.current.forEach((nodo) => {
        const s = asegurar(nodo);
        s.ox = x;
        s.oy = y;
      });
      mover();
    };

    const alInclinarse = (e) => {
      if (e.gamma == null || e.beta == null) return;
      const x = Math.max(-1, Math.min(1, e.gamma / 32));
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 32));
      capas.current.forEach((nodo) => {
        const s = asegurar(nodo);
        s.ox = x;
        s.oy = y;
      });
      mover();
    };

    window.addEventListener('pointermove', alMover, { passive: true });

    if (window.matchMedia('(pointer: coarse)').matches) {
      window.addEventListener('deviceorientation', alInclinarse);
    }

    return () => {
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('deviceorientation', alInclinarse);
      if (animacion) window.cancelAnimationFrame(animacion);
    };
  }, []);

  return registrar;
}
