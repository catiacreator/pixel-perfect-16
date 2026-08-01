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
  bg,
}: {
  numeral: string;
  icon: ReactNode;
  pilarLabel: string;
  titulo: string;
  tituloHighlight?: string;
  subtitulo?: string;
  /** Fundo personalizado (CSS background). Se omitido, usa o gradiente terracotta. */
  bg?: string;
}) {
  const roman = toRoman(numeral);
  const parts = titulo.split(/ — | – /);
  const titleLead = parts.length > 1 ? `${parts[0]} —` : null;
  const titleRest = parts.length > 1 ? parts.slice(1).join(" — ") : titulo;

  return (
    <div className="px-4 md:px-10 pt-5 md:pt-7">
      <header
        className={`relative overflow-hidden rounded-[28px] md:rounded-[34px] text-white max-w-[1280px] mx-auto ${
          bg ? "" : "bg-gradient-to-br from-terracotta to-terracotta-dark"
        }`}
        style={bg ? { background: bg } : undefined}
      >
        {/* padrão de pontos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />

        <div className="relative px-6 md:px-10 py-5 md:py-7 grid grid-cols-[2.2rem_1fr] md:grid-cols-[3.5rem_1fr] gap-4 md:gap-6 items-start">
          {/* Numeral */}
          <div className="font-editorial text-[2.2rem] md:text-[3.5rem] leading-[0.85] text-white/25 tabular-nums select-none -mt-0.5" aria-hidden>
            {roman}
          </div>

          {/* Bloco de título */}
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/80 font-medium mb-1.5 md:mb-2">
              {pilarLabel}
            </p>

            <h1 className="font-editorial uppercase text-[1.6rem] md:text-[2.4rem] lg:text-[2.8rem] leading-[0.95] tracking-[-0.02em] text-white">
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
              <div className="mt-3 md:mt-4 flex items-center gap-3">
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
