import { useState } from "react";
import { Copy, Check } from "lucide-react";

// Caixa de prompt do curso: cabeçalho com o agente + botão copiar, e o texto
// com os [marcadores] realçados a amarelo. Cores fixas (estilo do curso).
export default function PromptBox({ agente, nome, texto }: { agente: string; nome: string; texto: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard?.writeText(texto);
    } catch {
      /* ignora */
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };
  const partes = texto.split(/(\[[^\]]+\])/g);

  return (
    <div className="rounded-2xl overflow-hidden border border-[#322A42] bg-[#221D2E] my-4">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#2C2440] border-b border-[#392f4d]">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white min-w-0">
          <span className="bg-[#8A47B5] text-white text-[10px] px-2 py-0.5 rounded shrink-0">{agente}</span>
          <span className="truncate">{nome}</span>
        </span>
        <button
          onClick={copiar}
          className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${copiado ? "bg-emerald-600 text-white" : "bg-[#F2C14E] text-[#3a2a05] hover:brightness-105"}`}
        >
          {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="m-0 px-4 py-4 text-[13px] leading-relaxed text-[#EDE7F5] font-mono whitespace-pre-wrap break-words overflow-x-auto">
        {partes.map((p, i) =>
          /^\[[^\]]+\]$/.test(p) ? <span key={i} className="text-[#F2C14E]">{p}</span> : <span key={i}>{p}</span>,
        )}
      </pre>
    </div>
  );
}
