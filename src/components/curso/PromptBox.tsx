import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

// Caixa de prompt do curso: cabeçalho com o agente + botão copiar, e o texto
// com os [marcadores] realçados a amarelo. Cores fixas (estilo do curso).
// Quando existe textoBr, mostra um seletor PT-PT / PT-BR; a escolha fica
// guardada (localStorage) e sincroniza todas as caixas da página.

const LINGUA_KEY = "leveza.prompt-lingua";
const LINGUA_EVENT = "leveza:prompt-lingua";
type Lingua = "pt" | "br";

function lerLingua(): Lingua {
  try {
    return localStorage.getItem(LINGUA_KEY) === "br" ? "br" : "pt";
  } catch {
    return "pt";
  }
}

function guardarLingua(l: Lingua) {
  try {
    localStorage.setItem(LINGUA_KEY, l);
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new Event(LINGUA_EVENT));
}

export default function PromptBox({ agente, nome, texto, textoBr }: { agente: string; nome: string; texto: string; textoBr?: string }) {
  const [copiado, setCopiado] = useState(false);
  // começa em "pt" (igual no servidor e no cliente) e sincroniza após montar
  const [lingua, setLingua] = useState<Lingua>("pt");
  useEffect(() => {
    setLingua(lerLingua());
    const on = () => setLingua(lerLingua());
    window.addEventListener(LINGUA_EVENT, on);
    return () => window.removeEventListener(LINGUA_EVENT, on);
  }, []);

  const ativo = lingua === "br" && textoBr ? textoBr : texto;

  const copiar = async () => {
    try {
      await navigator.clipboard?.writeText(ativo);
    } catch {
      /* ignora */
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };
  const partes = ativo.split(/(\[[^\]]+\])/g);

  return (
    <div className="rounded-2xl overflow-hidden border border-[#322A42] bg-[#221D2E] my-4">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#2C2440] border-b border-[#392f4d]">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white min-w-0">
          <span className="bg-[#8A47B5] text-white text-[10px] px-2 py-0.5 rounded shrink-0">{agente}</span>
          <span className="truncate">{nome}</span>
        </span>
        <span className="inline-flex items-center gap-2 shrink-0">
          {textoBr && (
            <span className="inline-flex rounded-lg overflow-hidden border border-[#4a3e63]">
              {(["pt", "br"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => guardarLingua(l)}
                  className={`text-[10px] font-bold px-2 py-1.5 uppercase tracking-wide transition-colors ${
                    lingua === l ? "bg-[#8A47B5] text-white" : "bg-transparent text-white/55 hover:text-white"
                  }`}
                  title={l === "pt" ? "Português de Portugal" : "Português do Brasil"}
                >
                  {l === "pt" ? "PT-PT" : "PT-BR"}
                </button>
              ))}
            </span>
          )}
          <button
            onClick={copiar}
            className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${copiado ? "bg-emerald-600 text-white" : "bg-[#F2C14E] text-[#3a2a05] hover:brightness-105"}`}
          >
            {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado!" : "Copiar"}
          </button>
        </span>
      </div>
      <pre className="m-0 px-4 py-4 text-[13px] leading-relaxed text-[#EDE7F5] font-mono whitespace-pre-wrap break-words overflow-x-auto">
        {partes.map((p, i) =>
          /^\[[^\]]+\]$/.test(p) ? <span key={i} className="text-[#F2C14E]">{p}</span> : <span key={i}>{p}</span>,
        )}
      </pre>
    </div>
  );
}
