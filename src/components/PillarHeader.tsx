import type { ReactNode } from "react";

const ROMAN: Record<string, string> = {
  "1": "I",
  "01": "I",
  "2": "II",
  "02": "II",
  "3": "III",
  "03": "III",
  "4": "IV",
  "04": "IV",
};

function toRoman(n: string) {
  return ROMAN[n] ?? n;
}

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
  const roman = toRoman(numeral);
  const parts = titulo.split(/ — | – /);
  const titleLead = parts.length > 1 ? `${parts[0]} —` : null;
  const titleRest = parts.length > 1 ? parts.slice(1).join(" — ") : titulo;

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-cream-warm via-cream-warm to-terracotta/15 border-b border-terracotta/15">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-terracotta/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 w-[22rem] h-[22rem] rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      <div className="relative px-5 md:px-10 pt-10 md:pt-16 pb-8 md:pb-12 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-[4rem_1fr] md:grid-cols-[7rem_1fr] gap-5 md:gap-10 items-start">
        {/* Roman numeral */}
        <div
          className="font-display text-[3.5rem] md:text-[6rem] leading-[0.85] text-terracotta/80 tabular-nums select-none -mt-2"
          aria-hidden
        >
          {roman}
        </div>

        {/* Title block */}
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] uppercase text-terracotta font-medium mb-3 md:mb-4">
            {pilarLabel}
          </p>

          <h1 className="font-display uppercase text-[2rem] md:text-[3.5rem] lg:text-[4rem] leading-[0.95] tracking-[-0.015em]">
            {titleLead && (
              <>
                <span className="text-ink/35">{titleLead}</span>{" "}
              </>
            )}
            <span className="text-terracotta">{titleRest}</span>
            {tituloHighlight && (
              <>
                {" "}
                <span
                  className="italic font-normal text-terracotta normal-case"
                  style={{ fontFamily: "var(--font-editorial)" }}
                >
                  {tituloHighlight}
                </span>
                <span className="text-gold">.</span>
              </>
            )}
          </h1>

          {(subtitulo || icon) && (
            <div className="mt-6 md:mt-8 flex items-center gap-4">
              {icon && (
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center text-terracotta shrink-0">
                  {icon}
                </div>
              )}
              {subtitulo && (
                <p
                  className="text-ink/55 text-sm md:text-base italic leading-relaxed"
                  style={{ fontFamily: "var(--font-editorial)" }}
                >
                  {subtitulo}
                </p>
              )}
            </div>
          )}

          {/* Ornament divider */}
          <div className="mt-8 md:mt-10 flex items-center gap-3 max-w-md">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-terracotta/40 to-transparent" />
            <span className="text-terracotta/70 text-xs rotate-45 inline-block">
              ◆
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-terracotta/40 to-transparent" />
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
