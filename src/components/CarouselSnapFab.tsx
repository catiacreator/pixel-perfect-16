import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

// Botão flutuante (canto inferior esquerdo) que abre uma pop-up a promover a
// app Carousel Snap. Ícone laranja estilo carrossel.
const LARANJA = "#EE4E23";

function CarouselIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="white" aria-hidden xmlns="http://www.w3.org/2000/svg">
      {/* finial */}
      <circle cx="24" cy="5" r="2.2" />
      <rect x="23" y="7" width="2" height="4" />
      {/* canopy */}
      <path d="M8 21 C8 13 40 13 40 21 L36 21 C36 20 34.5 19 33 19 C31.5 19 30 20 30 21 C30 20 28.5 19 27 19 C25.5 19 24 20 24 21 C24 20 22.5 19 21 19 C19.5 19 18 20 18 21 C18 20 16.5 19 15 19 C13.5 19 12 20 12 21 Z" />
      {/* poles */}
      <rect x="11.5" y="21" width="2" height="21" rx="1" />
      <rect x="34.5" y="21" width="2" height="21" rx="1" />
      {/* platform */}
      <rect x="9" y="40" width="30" height="3.4" rx="1.7" />
      {/* horse */}
      <path d="M31 39 h-4 c0 -2 -0.6 -3.4 -1.8 -4.6 c1.4 0.3 2.6 -0.2 3.2 -1.6 l1 -3.2 c0.6 -2 -0.4 -3.9 -2.4 -4.6 l-0.5 -2.2 l-2 1 c-2.6 0 -4.8 1.6 -5.6 4 l-1.8 2.2 c-0.7 0.9 -0.2 2.1 0.9 2.3 l1.2 -0.4 l0.7 1.1 l-0.6 1.6 c-0.5 1.4 -1.2 2.6 -2.3 3.6 h3.4 c0.6 -1.4 1.1 -2.6 1.3 -3.8 c0.9 0.6 2 1 3.1 1 l0.5 3.6 z" />
    </svg>
  );
}

export default function CarouselSnapFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Carousel Snap"
        title="Carousel Snap"
        className="fixed right-6 z-50 w-12 h-12 rounded-[16px] shadow-[0_12px_30px_-10px_rgba(238,78,35,0.75)] flex items-center justify-center hover:-translate-y-0.5 active:scale-95 transition-transform bottom-[calc(1.5rem+64px+56px+56px+env(safe-area-inset-bottom))] lg:bottom-[9.5rem]"
        style={{ background: LARANJA }}
      >
        <CarouselIcon size={26} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/45 flex items-end sm:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 md:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-ink/35 hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
            <div className="w-14 h-14 rounded-[20px] flex items-center justify-center mb-4" style={{ background: LARANJA }}>
              <CarouselIcon />
            </div>
            <h2 className="font-serif text-2xl text-ink mb-2">Carousel Snap</h2>
            <p className="text-[15px] text-ink/70 leading-relaxed mb-1.5">
              A app que cria dezenas de carrosséis em 3 minutos, roteiros de formatos virais e stories.
            </p>
            <p className="text-[15px] text-ink/70 leading-relaxed mb-6">
              Publica todos os dias, com o mínimo de esforço.
            </p>
            <a
              href="https://carouselsnap.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: LARANJA }}
            >
              Criar sem esforço <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
