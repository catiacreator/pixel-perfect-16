import { useState } from "react";
import { Copy, Eye, Check } from "lucide-react";

export default function PromptStep({
  numero,
  titulo,
  descricao,
  prompt,
}: {
  numero: number;
  titulo: string;
  descricao: string;
  prompt: string;
}) {
  const [verPrompt, setVerPrompt] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard?.writeText(prompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 mb-4">
      <p className="text-sm font-semibold text-ink mb-1">{titulo}</p>
      <p className="text-sm text-muted mb-3">{descricao}</p>
      <div className="flex gap-2 mb-2">
        <button onClick={copiar} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream flex items-center gap-1.5">
          {copiado ? <Check size={13} /> : <Copy size={13} />} Copiar prompt {numero}
        </button>
        <button onClick={() => setVerPrompt((v) => !v)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
          <Eye size={13} /> Ver prompt
        </button>
      </div>
      {verPrompt && (
        <pre className="text-xs bg-cream rounded-xl p-3 mt-2 whitespace-pre-wrap text-muted">{prompt}</pre>
      )}
    </div>
  );
}
