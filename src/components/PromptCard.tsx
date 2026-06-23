import { useState } from "react";
import { Copy, Eye, Check } from "lucide-react";
import { fillPilar2Prompt } from "@/lib/pilar2-fill";

export default function PromptCard({
  numero,
  titulo,
  descricao,
  prompt,
  rotuloBotao,
}: {
  numero?: number;
  titulo: string;
  descricao?: string;
  prompt: string;
  rotuloBotao?: string;
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
      <p className="text-sm font-semibold text-ink mb-1">{titulo}</p>
      {descricao && <p className="text-sm text-muted mb-3">{descricao}</p>}
      <div className="flex gap-2 mb-2 flex-wrap">
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
    </div>
  );
}
