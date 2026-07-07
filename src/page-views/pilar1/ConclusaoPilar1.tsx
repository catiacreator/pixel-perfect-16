import { Link } from "@/lib/router-compat";
import { useProgresso } from "@/lib/use-progresso";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import {
  Hourglass,
  Trophy,
  Check,
  ArrowUpRight,
  UserRound,
  Target,
  Users,
  MessageSquare,
  FileDown,
  PartyPopper,
} from "lucide-react";

const ITENS = [
  { icon: UserRound, label: "Preenchi quem sou — nome, profissão e há quanto tempo atuo", to: "/doc-mestre" },
  { icon: Target, label: "Defini o que entrego e como resolvo (em 1 frase)", to: "/doc-mestre" },
  { icon: Users, label: "Mapeei o meu público e as suas 5 maiores dores", to: "/doc-mestre" },
  { icon: MessageSquare, label: "Defini o meu tom de comunicação", to: "/doc-mestre" },
  { icon: FileDown, label: "Visualizei e guardei o meu Documento Mestre", to: "/doc-mestre" },
];

export default function ConclusaoPilar1() {
  const { isFeita, marcar, carregado } = useProgresso();
  const idDe = (i: number) => `celebrar:p1:${i}`;
  const done = (i: number) => isFeita(idDe(i));
  const toggle = (i: number) => marcar(idDe(i), "celebrar", !done(i));

  const count = carregado ? ITENS.filter((_, i) => done(i)).length : 0;
  const pct = Math.round((count / ITENS.length) * 100);
  const completo = count === ITENS.length;

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Crie com Leveza sem roubar o seu tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1 · Fechar"
        titulo="Revise e celebre"
        subtitulo="A base está pronta — o seu Documento Mestre alimenta tudo o que vem a seguir."
      />

      <div className="px-5 md:px-10 pb-20 pt-8 max-w-3xl mx-auto">
        <p className="text-sm text-ink/60 leading-relaxed mb-5">
          Marque o que já concluiu. Feito é melhor que perfeito — este checklist mostra-lhe a base que já construiu.
        </p>

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <Trophy size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{count} de {ITENS.length} concluídos</p>
            <div className="h-2 rounded-full bg-cream-warm/60 overflow-hidden mt-2">
              <div className="h-full bg-terracotta transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-ink tabular-nums">{pct}%</p>
        </div>

        {completo && (
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 mb-5 flex items-center gap-3">
            <PartyPopper size={20} className="text-terracotta shrink-0" />
            <p className="text-sm font-medium text-ink">Base concluída! Já pode avançar para o Pilar 2 — Criar Autoridade. 🎉</p>
          </div>
        )}

        <div className="space-y-2.5">
          {ITENS.map((item, i) => {
            const Icon = item.icon;
            const isDone = done(i);
            return (
              <div key={i} className="rounded-2xl border border-border bg-white shadow-sm p-3.5 flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? "bg-terracotta border-terracotta text-cream" : "border-border text-transparent"}`}
                  aria-label="marcar"
                >
                  <Check size={13} strokeWidth={3} />
                </button>
                <Icon size={16} className="text-ink/40 shrink-0" />
                <span className={`flex-1 text-sm ${isDone ? "text-ink/45 line-through" : "text-ink"}`}>{item.label}</span>
                <Link to={item.to} className="text-xs font-semibold text-terracotta whitespace-nowrap inline-flex items-center gap-0.5">
                  Abrir <ArrowUpRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            );
          })}
        </div>

        <Link
          to="/metodo/pilar-2"
          className="mt-8 inline-flex items-center gap-2 bg-terracotta text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-terracotta-dark transition-colors"
        >
          Próximo: Pilar 2 · Criar Autoridade <ArrowUpRight size={15} strokeWidth={2.25} />
        </Link>
      </div>
    </Layout>
  );
}
