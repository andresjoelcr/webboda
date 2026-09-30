import { useCallback, useEffect, useRef } from 'react';

const SUAVE = 0.14;
const LIMITE = 0.005;

export default function useTilt({ maxX = 3.5, maxY = 2.5 } = {}) {
  const nodo = useRef(null);
  const estado = useRef({ x: 0, y: 0, ox: 0, oy: 0, rx: '0deg', ry: '0deg' });
  const caja = useRef(null);
  const animacion = useRef(0);

  const aplicar = useCallback(() => {
    const el = nodo.current;
    if (!el) {
      animacion.current = 0;
      return;
    }

    const e = estado.current;
    e.x += (e.ox - e.x) * SUAVE;
    e.y += (e.oy - e.y) * SUAVE;

    e.ry = `${e.x.toFixed(2)}deg`;
    e.rx = `${e.y.toFixed(2)}deg`;
    el.style.setProperty('--ry', e.ry);
    el.style.setProperty('--rx', e.rx);

    animacion.current =
      Math.abs(e.ox - e.x) > LIMITE || Math.abs(e.oy - e.y) > LIMITE
        ? window.requestAnimationFrame(aplicar)
        : 0;
  }, []);

  // Caja real, sin ninguna transformación aplicada. Se mide una sola vez por
  // entrada, así el zoom del hover nunca realimenta el cálculo del tilt.
  const medir = useCallback(() => {
    const el = nodo.current;
    if (!el) return;

    const e = estado.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.translate = 'none';
    el.style.scale = 'none';
    caja.current = el.getBoundingClientRect();
    el.style.translate = '';
    el.style.scale = '';
    el.style.setProperty('--rx', e.rx);
    el.style.setProperty('--ry', e.ry);
  }, []);

  const fijar = useCallback(
    (ev) => {
      const r = caja.current;
      if (!r || !r.width || !r.height) return;

      estado.current.ox = ((ev.clientX - (r.left + r.width / 2)) / (r.width / 2)) * maxX;
      estado.current.oy = -((ev.clientY - (r.top + r.height / 2)) / (r.height / 2)) * maxY;

      if (!animacion.current) animacion.current = window.requestAnimationFrame(aplicar);
    },
    [maxX, maxY, aplicar],
  );

  const soltar = useCallback(() => {
    estado.current.ox = 0;
    estado.current.oy = 0;
    if (!animacion.current) animacion.current = window.requestAnimationFrame(aplicar);
  }, [aplicar]);

  useEffect(() => {
    const el = nodo.current;
    if (!el) return undefined;

    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      return undefined;
    }

    const entrar = () => medir();

    medir();
    el.addEventListener('pointerenter', entrar);
    el.addEventListener('pointermove', fijar);
    el.addEventListener('pointerleave', soltar);
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', medir, true);

    return () => {
      el.removeEventListener('pointerenter', entrar);
      el.removeEventListener('pointermove', fijar);
      el.removeEventListener('pointerleave', soltar);
      window.removeEventListener('resize', medir);
      window.removeEventListener('scroll', medir, true);
      if (animacion.current) window.cancelAnimationFrame(animacion.current);
      animacion.current = 0;
    };
  }, [medir, fijar, soltar]);

  return nodo;
}
