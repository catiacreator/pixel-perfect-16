import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { Check, Copy } from "lucide-react";

const FORMATOS = [
  { id: "consultoria", nome: "Consultoria 1-a-1", faixa: "R$ 4k – 33k" },
  { id: "mentoria", nome: "Mentoria em Grupo", faixa: "R$ 2k – 50k / participante" },
  { id: "curso", nome: "Curso Online Gravado", faixa: "R$ 99 – 997" },
  { id: "workshop-online", nome: "Workshop Online", faixa: "R$ 9,90 – 99 + oferta" },
  { id: "workshop-presencial", nome: "Workshop Presencial", faixa: "R$ 150 – 650 + oferta" },
  { id: "produto", nome: "Produto Digital / GPT / Skill", faixa: "R$ 97 – 497" },
  { id: "incompany", nome: "In Company / Palestra", faixa: "R$ 5k – 50k+" },
];

function CopyVenda() {
  const [sel, setSel] = useState<string | null>(null);

  return (
    <Pilar4Page
      etapa="Etapa 7 · Texto"
      titulo="Crie sua Oferta"
      subtitulo="Escolha o formato e gera a sua proposta personalizada — com o contexto do teu Documento Mestre."
    >
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {FORMATOS.map((f) => {
          const ativo = sel === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSel(f.id)}
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
        <p className="font-serif text-lg text-ink mb-1">
          {sel ? "Prompt pronto para o teu formato" : "Escolhe um formato acima"}
        </p>
        <p className="text-sm text-ink/60 mb-4">
          O prompt usa o teu método, público, tom e posicionamento (do Documento Mestre) e gera uma
          oferta completa: nome, entregáveis, formato, preço, proposta de valor e CTA.
        </p>
        <button
          disabled={!sel}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-40"
        >
          <Copy size={15} /> Copiar prompt
        </button>
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/copy")({
  component: CopyVenda,
});
