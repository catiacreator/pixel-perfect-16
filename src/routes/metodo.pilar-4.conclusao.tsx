import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { Check } from "lucide-react";

const ITENS = [
  "Escolhi minha estratégia de venda principal",
  "Estruturei a fundação da minha estratégia de venda",
  "Aprendi a posicionar e vender ofertas de alto ticket",
  "Aprendi a estruturar um lançamento",
  "Aprendi a escalar com produtos de entrada",
  "Aprendi a criar e monetizar eventos presenciais",
  "Criei minha oferta com copy e promessa clara",
  "Entendi como usar tráfego pago para vender",
  "Assisti às palestras de IA para negócios (bónus)",
];

function Conclusao() {
  const [feitos, setFeitos] = useState<boolean[]>(() => ITENS.map(() => false));
  const total = feitos.filter(Boolean).length;
  const pct = Math.round((total / ITENS.length) * 100);

  return (
    <Pilar4Page
      etapa="Etapa 9 · Fechar"
      titulo="Revise e celebre"
      subtitulo="Veja a sua jornada completa nos 4 pilares."
    >
      {/* Progresso */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-ink">Progresso do Pilar 4</p>
          <span className="text-sm font-semibold text-sage">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-cream-warm overflow-hidden">
          <div className="h-full bg-sage transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {ITENS.map((it, i) => {
          const on = feitos[i];
          return (
            <button
              key={i}
              onClick={() => setFeitos((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
              className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                on ? "border-sage/40 bg-sage/10" : "border-[var(--color-border)] bg-white hover:border-sage/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  on ? "bg-sage border-sage text-cream" : "border-[var(--color-border)] text-transparent"
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={`text-sm ${on ? "text-ink" : "text-ink/70"}`}>{it}</span>
            </button>
          );
        })}
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/conclusao")({
  component: Conclusao,
});
