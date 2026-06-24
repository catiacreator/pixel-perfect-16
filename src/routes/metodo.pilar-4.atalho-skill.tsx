import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { Download, Check, ArrowRight, Sparkles } from "lucide-react";

const ENTREGAVEIS = [
  "Oferta completa pronta para apresentar",
  "Estrutura do método em formato vendável",
  "Proposta de valor cristalizada em 1 frase",
  "Argumentos para as principais objeções",
];

const PASSOS = [
  "Baixe o arquivo da skill (.md)",
  "Abra o Claude e crie um novo Project",
  "Adicione o arquivo como instrução do project",
  "Inicie a conversa e siga a sessão guiada de 60 min",
];

function AtalhoSkill() {
  return (
    <Pilar4Page
      etapa="Etapa 1 · Caminho A"
      titulo="Atalho com Skill"
      subtitulo="Sessão guiada de 60 minutos no Claude — você sai com a estratégia de venda pronta."
    >
      <div className="rounded-2xl border border-terracotta/30 bg-white p-6 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-terracotta" />
          <p className="font-serif text-lg text-ink">Skill: Oferta + Método + Proposta</p>
        </div>
        <p className="text-sm text-ink/60 mb-4">
          Um ficheiro <code className="text-terracotta">.md</code> para importar no teu Claude Project.
          Em 60 minutos guiados, sais com a oferta, o método e a proposta prontos.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors">
          <Download size={15} /> Baixar a skill (.md)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-3">Como usar</p>
          <ol className="space-y-2.5">
            {PASSOS.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink/75">
                <span className="w-5 h-5 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-3">
            Ao final dos 60 min
          </p>
          <ul className="space-y-2.5">
            {ENTREGAVEIS.map((e, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink/75">
                <Check size={16} className="text-sage shrink-0 mt-0.5" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        to="/metodo/pilar-4/passo-a-passo"
        className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta"
      >
        Próximo: Caminho Passo a Passo <ArrowRight size={14} />
      </Link>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/atalho-skill")({
  component: AtalhoSkill,
});
