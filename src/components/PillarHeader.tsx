import type { ReactNode } from "react";

export default function PillarHeader({
  numeral,
  icon,
  pilarLabel,
  titulo,
  subtitulo,
}: {
  numeral: string; // "I" ou "2"
  icon: ReactNode;
  pilarLabel: string;
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="px-5 md:px-10 pt-10 pb-6 max-w-3xl">
      <div className="flex items-start gap-4 mb-3">
        <span className="font-serif text-4xl text-terracotta leading-none">{numeral}</span>
        <div className="w-10 h-10 mt-1 rounded-xl border border-terracotta flex items-center justify-center text-terracotta">
          {icon}
        </div>
      </div>
      <p className="text-xs tracking-[0.2em] uppercase text-muted mb-1">{pilarLabel}</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">{titulo}</h1>
      {subtitulo && <p className="italic text-muted">{subtitulo}</p>}
      <div className="mt-4 text-terracotta">✦</div>
    </div>
  );
}
