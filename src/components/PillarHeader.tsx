import type { ReactNode } from "react";

export default function PillarHeader({
  numeral,
  icon,
  pilarLabel,
  titulo,
  tituloHighlight,
  subtitulo,
}: {
  numeral: string;
  icon: ReactNode;
  pilarLabel: string;
  titulo: string;
  tituloHighlight?: string;
  subtitulo?: string;
}) {
  return (
    <div className="px-5 md:px-10 pt-2 pb-6 max-w-2xl mx-auto">
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <span className="font-serif text-4xl text-terracotta leading-none">{numeral}</span>
          <div className="w-10 h-10 rounded-xl border border-terracotta flex items-center justify-center text-terracotta">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-1.5">{pilarLabel}</p>
          <h1 className="font-serif text-2xl md:text-3xl leading-tight mb-2">
            <span className="text-ink">{titulo}</span>
            {tituloHighlight && (
              <>
                {" "}
                <span className="text-terracotta">{tituloHighlight}</span>
              </>
            )}
          </h1>
          {subtitulo && <p className="italic text-muted text-sm">{subtitulo}</p>}
          <div className="mt-3 text-terracotta text-sm">✦</div>
        </div>
      </div>
    </div>
  );
}
