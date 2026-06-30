import { useState } from "react";
import { X, Copy, Check, ChevronDown } from "lucide-react";
import { fillPilar2Prompt } from "@/lib/pilar2-fill";
import { IDEIAS_ROTINA, type IdeiaCard } from "@/data/ideias-rotina";

export default function IdeiasModal({ tipo, onClose }: { tipo: string; onClose: () => void }) {
  const grupo = IDEIAS_ROTINA[tipo];
  if (!grupo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45" onClick={onClose}>
      <div
        className="bg-cream w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cream/95 backdrop-blur px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">📱 {grupo.titulo}</h2>
          <button onClick={onClose} aria-label="Fechar" className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-ink/60 hover:bg-ink/5">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {grupo.cards.map((c) => (
            <Card key={c.nome} card={c} />
          ))}
          <p className="text-[11px] text-ink/50 leading-relaxed pt-1">
            O prompt já inclui o seu Documento Mestre. Basta copiar, colar no ChatGPT e responder às perguntas que ele vai fazer.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({ card }: { card: IdeiaCard }) {
  const [open, setOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard?.writeText(fillPilar2Prompt(card.prompt));
    } catch { /* fallback silencioso */ }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-terracotta bg-terracotta/10 rounded-full px-2.5 py-1">
        {card.categoria}
      </span>
      <p className="text-sm font-semibold text-ink mt-2.5">{card.nome}</p>
      <p className="text-sm text-ink/60 mt-1 leading-relaxed">{card.objetivo}</p>

      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={copiar}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-terracotta text-cream flex items-center gap-1.5"
        >
          {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado" : "Copiar prompt"}
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-border)] flex items-center gap-1.5 text-ink/70"
        >
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          {open ? "Ocultar" : "Ver prompt completo"}
        </button>
      </div>

      {open && (
        <pre className="text-[11px] bg-cream rounded-xl p-3 mt-3 whitespace-pre-wrap text-ink/70 max-h-[300px] overflow-y-auto">
          {fillPilar2Prompt(card.prompt)}
        </pre>
      )}
    </div>
  );
}
