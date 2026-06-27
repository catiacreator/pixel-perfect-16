import { useState, type ReactNode } from "react";
import { Info, X } from "lucide-react";

/**
 * Botão de informação (ⓘ) que abre um popover explicativo.
 * Uso: <InfoButton titulo="…" label="Para que serve?">…conteúdo…</InfoButton>
 * Se `label` for omitido, mostra apenas o ícone.
 */
export default function InfoButton({
  titulo,
  label,
  children,
}: {
  titulo: string;
  label?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex print:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label || "Para que serve"}
        aria-expanded={open}
        className={
          label
            ? "inline-flex items-center gap-1.5 rounded-full border border-terracotta/40 text-terracotta px-3 py-1.5 text-xs font-semibold hover:bg-terracotta hover:text-cream transition-colors"
            : "inline-flex items-center justify-center w-6 h-6 rounded-full border border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-cream transition-colors"
        }
      >
        <Info size={label ? 14 : 13} />
        {label && <span>{label}</span>}
      </button>

      {open && (
        <>
          {/* clicar fora fecha */}
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            className="absolute z-50 left-0 top-9 w-[min(92vw,380px)] rounded-2xl border border-border glass shadow-[0_24px_60px_-24px_rgba(90,40,25,0.35)] p-5 text-left"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-serif text-base text-ink leading-tight">{titulo}</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-muted hover:text-ink flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>
            <div className="text-sm text-ink/70 leading-relaxed space-y-2">{children}</div>
          </div>
        </>
      )}
    </span>
  );
}
