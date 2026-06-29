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
    <div className="px-4 md:px-10 pt-5 md:pt-7">
      <header className="relative overflow-hidden rounded-[28px] md:rounded-[34px] text-white bg-gradient-to-br from-terracotta to-terracotta-dark max-w-[1280px] mx-auto">
        {/* padrão de pontos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />

        <div className="relative px-6 md:px-12 py-9 md:py-12 grid grid-cols-[3.2rem_1fr] md:grid-cols-[5.5rem_1fr] gap-5 md:gap-9 items-start">
          {/* Numeral */}
          <div className="font-editorial text-[3.2rem] md:text-[5.5rem] leading-[0.85] text-white/25 tabular-nums select-none -mt-1" aria-hidden>
            {roman}
          </div>

          {/* Bloco de título */}
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/80 font-medium mb-3 md:mb-4">
              {pilarLabel}
            </p>

            <h1 className="font-editorial uppercase text-[2.2rem] md:text-[3.75rem] lg:text-[4.4rem] leading-[0.92] tracking-[-0.02em] text-white">
              {titleLead && <><span className="text-white/55">{titleLead}</span>{" "}</>}
              <span>{titleRest}</span>
              {tituloHighlight && (
                <>
                  {" "}
                  <span className="italic font-normal normal-case text-white/95" style={{ fontFamily: "var(--font-editorial)" }}>
                    {tituloHighlight}
                  </span>
                  <span className="text-white/70">.</span>
                </>
              )}
            </h1>

            {(subtitulo || icon) && (
              <div className="mt-6 md:mt-8 flex items-center gap-4">
                {icon && (
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                    {icon}
                  </div>
                )}
                {subtitulo && (
                  <p className="text-white/85 text-sm md:text-base italic leading-relaxed" style={{ fontFamily: "var(--font-editorial)" }}>
                    {subtitulo}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
