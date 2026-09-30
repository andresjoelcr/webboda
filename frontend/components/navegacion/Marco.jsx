import Cabecera from './Cabecera';

export default function Marco({ children }) {
  return (
    <div className="boda">
      <Cabecera />

      <main className="boda__contenido" id="inicio">{children}</main>

      {/* El pie es solo un filo azul, sin textos ni navegacion. */}
      <footer className="boda__pie" />
    </div>
  );
}
