import { useEffect, useState } from 'react';

const RESTA = 0;

function medir(objetivo) {
  const fin = objetivo.getTime() - Date.now();
  if (fin <= RESTA) return { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };

  const segundos = Math.floor(fin / 1000) % 60;
  const minutos = Math.floor(fin / 60000) % 60;
  const horas = Math.floor(fin / 3600000) % 24;
  const dias = Math.floor(fin / 86400000);

  return { dias, horas, minutos, segundos, terminado: false };
}

export default function useContador(objetivo) {
  const [tiempo, setTiempo] = useState(() => medir(objetivo));

  useEffect(() => {
    setTiempo(medir(objetivo));

    const tique = window.setInterval(() => {
      const actual = medir(objetivo);
      setTiempo(actual);
      if (actual.terminado) window.clearInterval(tique);
    }, 1000);

    return () => window.clearInterval(tique);
  }, [objetivo]);

  return tiempo;
}
