const VIDEO = '/static/video_boda.mp4';

/* Video de fondo: arranca solo, sin sonido y en bucle infinito. */
export default function FondoVideo() {
  return (
    <>
      <video
        className="video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Video de la boda"
      >
        <source src={VIDEO} type="video/mp4" />
      </video>
      <div className="escena__velo" />
    </>
  );
}
