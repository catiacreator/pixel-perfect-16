import { useState } from "react";
import { Copy, Eye, Check, Bot, ArrowUpRight } from "lucide-react";
import { fillPilar2Prompt } from "@/lib/pilar2-fill";

export default function PromptCard({
  numero,
  titulo,
  descricao,
  prompt,
  rotuloBotao,
  icon,
  cor = "#C8487E",
  agente,
  agenteUrl,
}: {
  numero?: number;
  titulo: string;
  descricao?: string;
  prompt: string;
  rotuloBotao?: string;
  icon?: React.ReactNode;
  cor?: string;
  agente?: string;
  agenteUrl?: string;
}) {
  const [verPrompt, setVerPrompt] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    const expanded = fillPilar2Prompt(prompt);
    try {
      await navigator.clipboard?.writeText(expanded);
    } catch {
      // fallback silencioso
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };

  const expanded = verPrompt ? fillPilar2Prompt(prompt) : "";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${cor}1a`, color: cor }}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{titulo}</p>
          {descricao && <p className="text-sm text-muted mt-0.5">{descricao}</p>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={copiar}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream flex items-center gap-1.5"
        >
          {copiado ? <Check size={13} /> : <Copy size={13} />}{" "}
          {rotuloBotao || `Copiar prompt${numero ? ` ${numero}` : ""}`}
        </button>
        <button
          onClick={() => setVerPrompt((v) => !v)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5"
        >
          <Eye size={13} /> {verPrompt ? "Ocultar" : "Ver prompt"}
        </button>
      </div>

      {verPrompt && (
        <pre className="text-xs bg-cream rounded-xl p-3 mt-2 whitespace-pre-wrap text-muted max-h-[420px] overflow-y-auto">
          {expanded}
        </pre>
      )}

      {agente && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink/55">
            <Bot size={13} className="text-terracotta shrink-0" /> Agente: <b className="text-ink/75">{agente}</b>
          </span>
          {agenteUrl && (
            <a
              href={agenteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cream bg-ink hover:bg-terracotta rounded-full px-2.5 py-1 transition-colors ml-auto"
            >
              Abrir agente no ChatGPT <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
