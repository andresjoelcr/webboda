const PETALO_ROSA = 'M60 64C22 56 16 20 60 6C104 20 98 56 60 64Z';
const PETALO_MEDIO = 'M60 63C34 56 30 28 60 16C90 28 86 56 60 63Z';
const PETALO_INTERNO = 'M60 62C45 57 43 40 60 32C77 40 75 57 60 62Z';

const Cliente = ({ children }) => (
  <defs>
    <linearGradient id="oro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f6e2ac" />
      <stop offset="0.28" stopColor="#d9b563" />
      <stop offset="0.55" stopColor="#a97f2c" />
      <stop offset="0.78" stopColor="#e7cd8a" />
      <stop offset="1" stopColor="#8f6a26" />
    </linearGradient>

    <linearGradient id="petalo-rosa" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor="#fff6f8" />
      <stop offset="0.45" stopColor="var(--c2)" />
      <stop offset="1" stopColor="var(--c1)" />
    </linearGradient>

    <radialGradient id="centro-rosa" cx="0.4" cy="0.35" r="0.75">
      <stop offset="0" stopColor="var(--c3)" />
      <stop offset="1" stopColor="var(--c1)" />
    </radialGradient>

    <radialGradient id="luz-rosa" cx="0.32" cy="0.28" r="0.8">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>

    <linearGradient id="seda-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff8f2" />
      <stop offset="0.35" stopColor="var(--c2, #f2d3d6)" />
      <stop offset="0.62" stopColor="var(--c1, #e5a9b0)" />
      <stop offset="1" stopColor="#c98b95" />
    </linearGradient>
  </defs>
);

const Rosa = () => (
  <symbol id="flor-rosa" viewBox="0 0 120 120">
    <g fill="var(--c2)" opacity="0.92">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((g) => (
        <path key={g} d={PETALO_ROSA} transform={`rotate(${g} 60 60)`} />
      ))}
    </g>
    <g fill="url(#petalo-rosa)">
      {[22, 90, 158, 226].map((g) => (
        <path key={g} d={PETALO_MEDIO} transform={`rotate(${g} 60 60)`} />
      ))}
    </g>
    <g fill="url(#centro-rosa)">
      {[15, 135].map((g) => (
        <path key={g} d={PETALO_INTERNO} transform={`rotate(${g} 60 60)`} />
      ))}
    </g>
    <circle cx="60" cy="60" r="7" fill="url(#centro-rosa)" />
    <circle cx="60" cy="60" r="60" fill="url(#luz-rosa)" />
  </symbol>
);

const Floreto = () => (
  <symbol id="floreto" viewBox="-20 -20 40 40">
    <g fill="var(--c2)">
      {[0, 90, 180, 270].map((g) => (
        <ellipse key={g} cx="0" cy="-9" rx="6" ry="10" transform={`rotate(${g})`} />
      ))}
    </g>
    <g fill="var(--c1)">
      {[0, 90, 180, 270].map((g) => (
        <ellipse key={g} cx="0" cy="-7" rx="4" ry="6" transform={`rotate(${g})`} />
      ))}
    </g>
    <circle r="2.8" fill="var(--c3)" />
  </symbol>
);

const Hortensia = () => (
  <symbol id="flor-hortensia" viewBox="0 0 160 160">
    <g>
      {[
        [18, 34, 40],
        [58, 22, 44],
        [102, 38, 38],
        [8, 72, 44],
        [50, 66, 48],
        [96, 74, 44],
        [26, 108, 40],
        [66, 106, 44],
        [104, 112, 34],
        [54, 140, 32],
      ].map(([x, y, size]) => (
        <use key={`${x}-${y}`} href="#floreto" x={x} y={y} width={size} height={size} />
      ))}
    </g>
  </symbol>
);

const Eucalipto = () => (
  <symbol id="rama-eucalipto" viewBox="0 0 80 220">
    <path d="M40 216C40 150 40 80 42 8" fill="none" stroke="var(--c3)" strokeWidth="2.6" strokeLinecap="round" />
    <g fill="var(--c2)">
      {[
        [28, 196, 12],
        [54, 182, 11],
        [26, 162, 13],
        [55, 148, 12],
        [25, 126, 12],
        [56, 112, 11],
        [27, 90, 10.5],
        [55, 78, 9.5],
        [30, 56, 9],
        [53, 46, 8],
        [36, 28, 7],
        [52, 16, 6],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
    <g fill="var(--c1)" opacity="0.55">
      {[
        [22, 190, 6],
        [49, 174, 5],
        [20, 154, 6],
        [50, 140, 5],
        [20, 118, 5.5],
        [51, 104, 5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  </symbol>
);

const Anillos = () => (
  <symbol id="anillos" viewBox="0 0 220 140">
    <ellipse cx="82" cy="86" rx="36" ry="31" fill="none" stroke="url(#oro)" strokeWidth="10" transform="rotate(-10 82 76)" />
    <ellipse cx="132" cy="86" rx="36" ry="31" fill="none" stroke="url(#oro)" strokeWidth="10" transform="rotate(9 132 76)" />
    <path d="M132 20l11-14 11 14-11 11z" fill="url(#oro)" />
    <path d="M132 20l11-14 11 14-11 11z" fill="#ffffff" opacity="0.35" />
  </symbol>
);

const Pajarita = () => (
  <symbol id="pajarita" viewBox="0 0 220 130">
    <path d="M104 65L24 18C14 12 8 22 8 34v62c0 12 6 22 16 16l80-47z" fill="url(#seda-grad)" />
    <path d="M116 65l80-47c10-6 16 4 16 16v62c0 12-6 22-16 16l-80-47z" fill="url(#seda-grad)" />
    <path d="M104 65L24 18C14 12 8 22 8 34v62c0 12 6 22 16 16l80-47z" fill="none" stroke="rgba(90,60,60,.28)" strokeWidth="1.5" />
    <path d="M116 65l80-47c10-6 16 4 16 16v62c0 12-6 22-16 16l-80-47z" fill="none" stroke="rgba(90,60,60,.28)" strokeWidth="1.5" />
    <path d="M46 34l52 31M40 96l58-31M174 34l-52 31M180 96l-58-31" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
    <ellipse cx="110" cy="65" rx="13" ry="19" fill="url(#seda-grad)" />
    <ellipse cx="110" cy="65" rx="13" ry="19" fill="none" stroke="rgba(90,60,60,.3)" strokeWidth="1.4" />
  </symbol>
);

const VestidoEncaje = () => (
  <symbol id="vestido-encaje" viewBox="0 0 200 340">
    <g fill="none" stroke="var(--c1)" strokeWidth="2.2" strokeLinecap="round">
      <path d="M100 18c-13 0-21 11-21 25 0 11 6 19 6 27 0 10-7 17-7 33 0 39-17 68-33 104-8 18-12 40-12 66h134c0-26-4-48-12-66-16-36-33-65-33-104 0-16-7-23-7-33 0-8 6-16 6-27 0-14-8-25-21-25z" />
      <path d="M85 44c5 6 25 6 30 0M86 62c4 5 24 5 28 0" />
    </g>
    <g fill="none" stroke="var(--c1)" strokeWidth="1.2" opacity="0.75">
      <path d="M62 176c8 10 20 14 38 14s30-4 38-14" />
      <path d="M54 214c10 12 26 18 46 18s36-6 46-18" />
      <path d="M46 252c12 14 32 22 54 22s42-8 54-22" />
      <path d="M40 288c14 16 36 24 60 24s46-8 60-24" />
    </g>
    <g fill="none" stroke="var(--c1)" strokeWidth="1" opacity="0.55">
      <path d="M78 196c-4 12-6 24-6 36M122 196c4 12 6 24 6 36M64 234c-4 14-6 28-6 42M136 234c4 14 6 28 6 42" />
    </g>
  </symbol>
);

export default function Sprites() {
  return (
    <svg className="sprites" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <Cliente />
      <Rosa />
      <Floreto />
      <Hortensia />
      <Eucalipto />
      <Anillos />
      <Pajarita />
      <VestidoEncaje />
    </svg>
  );
}
