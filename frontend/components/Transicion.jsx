export default function Transicion({ marca = 'Nuestra Boda' }) {
  return (
    <div className="transicion" role="status" aria-live="polite">
      <span className="transicion__marca">{marca}</span>
    </div>
  );
}
