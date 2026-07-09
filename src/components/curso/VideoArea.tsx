import { useEffect, useRef, useState } from "react";
import { Expand, X } from "lucide-react";

// Player de vídeo do curso. Para ficheiros (.mp4) usa o player nativo mas
// SEM o botão de ecrã inteiro (que estica o 1280x720 e perde nitidez):
// em vez disso, um botão "expandir" abre o vídeo num overlay a ~60% do ecrã,
// perto do tamanho nativo. Para embeds (YouTube/Vimeo) mantém o iframe.

function VideoFicheiro({ videoUrl, titulo }: { videoUrl: string; titulo: string }) {
  const [expandido, setExpandido] = useState(false);
  const inline = useRef<HTMLVideoElement>(null);
  const modal = useRef<HTMLVideoElement>(null);

  const abrir = () => {
    const t = inline.current?.currentTime ?? 0;
    inline.current?.pause();
    setExpandido(true);
    // sincroniza o tempo e arranca no overlay
    requestAnimationFrame(() => {
      if (modal.current) {
        modal.current.currentTime = t;
        void modal.current.play().catch(() => {});
      }
    });
  };
  const fechar = () => {
    const t = modal.current?.currentTime ?? 0;
    if (inline.current) inline.current.currentTime = t;
    setExpandido(false);
  };

  useEffect(() => {
    if (!expandido) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") fechar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandido]);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video mb-6">
        <video
          ref={inline}
          src={videoUrl}
          title={titulo}
          className="w-full h-full"
          controls
          controlsList="nofullscreen noremoteplayback"
          disablePictureInPicture
          playsInline
          preload="metadata"
        />
        <button
          onClick={abrir}
          title="Expandir"
          aria-label="Expandir vídeo"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/55 text-white flex items-center justify-center hover:bg-black/75 transition-colors backdrop-blur-sm"
        >
          <Expand size={15} />
        </button>
      </div>

      {expandido && (
        <div
          className="fixed inset-0 z-[90] bg-black/85 flex items-center justify-center p-4"
          onClick={fechar}
        >
          <button
            onClick={fechar}
            aria-label="Fechar"
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
          <div
            className="w-[92vw] md:w-[80vw] max-w-[1600px] max-h-[88vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={modal}
              src={videoUrl}
              title={titulo}
              className="w-full h-full rounded-xl bg-black"
              controls
              controlsList="nofullscreen noremoteplayback"
              disablePictureInPicture
              playsInline
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function VideoArea({ videoUrl, titulo }: { videoUrl?: string; titulo: string }) {
  // Sem vídeo → não mostra nada (sem placeholder "em breve").
  if (!videoUrl) return null;
  const isFicheiro = /\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(videoUrl);
  if (isFicheiro) return <VideoFicheiro videoUrl={videoUrl} titulo={titulo} />;
  // Embed (YouTube/Vimeo/Tella) — mantém o iframe com ecrã inteiro nativo.
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video mb-6">
      <iframe src={videoUrl} title={titulo} className="w-full h-full" allowFullScreen />
    </div>
  );
}
