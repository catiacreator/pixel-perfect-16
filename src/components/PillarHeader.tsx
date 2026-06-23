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
    <div className="px-5 md:px-10 pt-8 md:pt-14 pb-10 md:pb-14 max-w-[1100px] mx-auto">
      {/* Meta top line */}
      <div className="flex items-center gap-3 mb-10 md:mb-14">
        <span className="text-[11px] tracking-[0.25em] uppercase text-terracotta font-medium">
          / {pilarLabel}
        </span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink/40">
          Edição 2026
        </span>
      </div>

      {/* Title row */}
      <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
        <div className="flex flex-col items-start gap-3">
          <span className="font-display text-5xl md:text-7xl text-ink/20 tracking-tight leading-none tabular-nums">
            {numeral}
          </span>
          <div className="w-10 h-10 rounded-xl bg-cream-warm border border-[var(--color-border)] flex items-center justify-center text-terracotta">
            {icon}
          </div>
        </div>

        <div className="min-w-0 pt-2">
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.025em] text-ink">
            {titulo}
            {tituloHighlight && (
              <>
                {" "}
                <span className="italic font-normal text-terracotta" style={{ fontFamily: "var(--font-editorial)" }}>
                  {tituloHighlight}
                </span>
                <span className="text-gold">.</span>
              </>
            )}
          </h1>
          {subtitulo && (
            <p className="mt-4 text-ink/55 text-base md:text-lg max-w-xl leading-relaxed">
              {subtitulo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
