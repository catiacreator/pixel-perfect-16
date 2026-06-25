import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import {
  FORMATOS_OFERTA,
  buildOfertaPrompt,
  readDocMestre,
  type DocMestre,
} from "@/lib/pilar4-prompts";

function CopyVenda() {
  const { state } = usePilar2();
  const [sel, setSel] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [verPrompt, setVerPrompt] = useState(false);
  const [doc, setDoc] = useState<DocMestre>({});

  useEffect(() => {
    setDoc(readDocMestre());
    const onChange = () => setDoc(readDocMestre());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);

  const formato = FORMATOS_OFERTA.find((f) => f.id === sel) || null;
  const prompt = formato ? buildOfertaPrompt(doc, state, formato) : "";

  function copiar() {
    if (!prompt) return;
    navigator.clipboard?.writeText(prompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <Pilar4Page
      etapa="Etapa 7 · Texto"
      titulo="Crie sua Oferta"
      subtitulo="Escolhe o formato e gera a tua proposta personalizada — com o contexto do teu Documento Mestre."
    >
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {FORMATOS_OFERTA.map((f) => {
          const ativo = sel === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setSel(f.id);
                setVerPrompt(false);
              }}
              className={`relative text-left rounded-2xl border p-4 transition-colors ${
                ativo
                  ? "border-terracotta bg-terracotta/5"
                  : "border-[var(--color-border)] bg-white hover:border-terracotta/50"
              }`}
            >
              <p className={`text-sm font-semibold ${ativo ? "text-terracotta" : "text-ink"}`}>
                {f.nome}
              </p>
              <p className="text-xs text-ink/55 mt-0.5">{f.faixa}</p>
              {ativo && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-terracotta text-cream flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-terracotta/30 bg-white p-5">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <p className="font-serif text-lg text-ink">
              {formato ? `Prompt — ${formato.nome}` : "Escolhe um formato acima"}
            </p>
            <p className="text-sm text-ink/60 mt-1">
              O prompt usa o teu método, público, tom e posicionamento (do Documento Mestre) e gera uma
              oferta completa: nome, entregáveis, formato, preço, proposta de valor e CTA.
            </p>
          </div>
          <button
            onClick={copiar}
            disabled={!formato}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-40"
          >
            {copiado ? <Check size={15} /> : <Copy size={15} />}
            {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>

        {formato && (
          <>
            <button
              onClick={() => setVerPrompt((v) => !v)}
              className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-ink hover:border-terracotta transition-colors"
            >
              {verPrompt ? <EyeOff size={15} /> : <Eye size={15} />}
              {verPrompt ? "Ocultar prompt" : "Mostrar prompt"}
            </button>
            {verPrompt && (
              <pre className="mt-3 text-xs bg-[#F5EFE6] rounded-xl p-4 whitespace-pre-wrap text-ink/60 leading-relaxed max-h-[28rem] overflow-auto">
                {prompt}
              </pre>
            )}
          </>
        )}
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/copy")({
  component: CopyVenda,
});
