import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { Lock, Download, Sparkles } from "lucide-react";

const COMO_FUNCIONA = [
  "Anuncia a sala como espaço limitado e exclusivo (vagas e tempo definidos)",
  "Durante 3 a 7 dias: conteúdo de alto valor",
  "Cria conexão real: responde, interage, convida",
  "No último dia: abre a oferta dentro da sala primeiro",
];

function Lancamentos() {
  return (
    <Pilar4Page
      etapa="Etapa 4 · Lançamento"
      titulo="Esquentar Público no Digital"
      subtitulo="Estratégias para preparar a sua audiência antes da venda."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Lock size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">Estratégia: Sala Secreta</p>
          </div>
          <p className="text-sm text-ink/60 mb-4">
            Um espaço fechado (WhatsApp, Telegram ou comunidade privada) durante alguns dias antes da
            abertura da venda — conteúdo exclusivo, conexão, desejo ativado e preparação para a oferta.
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-2">Como funciona</p>
          <ol className="space-y-2">
            {COMO_FUNCIONA.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink/75">
                <span className="w-5 h-5 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-terracotta/30 bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">Skill: Monte sua versão da Sala Secreta</p>
          </div>
          <p className="text-sm text-ink/60 mb-4">
            Sessão guiada que leva do zero ao mecanismo completo: nome, tema, captação, cadência de
            aquecimento, roteiro de 7 blocos e pitch.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors">
            <Download size={15} /> Baixar a skill (.md)
          </button>
        </div>
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/lancamentos")({
  component: Lancamentos,
});
