import { Link } from "@/lib/router-compat";
import { useProgresso } from "@/lib/use-progresso";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Crown, Trophy, Check, ArrowUpRight, Search, Compass, Sparkles, Mic, Palette, PartyPopper, Instagram, Lightbulb } from "lucide-react";

const ITENS = [
  { icon: Search, label: "Fiz a pesquisa de mercado e mapeei as dores do público", to: "/metodo/pilar-2/pesquisa-mercado" },
  { icon: Compass, label: "Criei o meu método (nome, promessa e pilares)", to: "/metodo/pilar-2/metodo" },
  { icon: Sparkles, label: "Defini os meus arquétipos (marca e cliente)", to: "/metodo/pilar-2/identidade" },
  { icon: Mic, label: "Defini o meu tom de voz e linguagem", to: "/metodo/pilar-2/tom-de-voz" },
  { icon: Palette, label: "Defini a minha identidade visual", to: "/metodo/pilar-2/identidade-visual" },
];

export default function ConclusaoPilar2() {
  const { isFeita, marcar, carregado } = useProgresso();
  const idDe = (i: number) => `celebrar:p2:${i}`;
  const done = (i: number) => isFeita(idDe(i));
  const toggle = (i: number) => marcar(idDe(i), "celebrar", !done(i));

  const count = carregado ? ITENS.filter((_, i) => done(i)).length : 0;
  const pct = Math.round((count / ITENS.length) * 100);
  const completo = count === ITENS.length;

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <PillarHeader
        numeral="II"
        icon={<Crown size={18} />}
        pilarLabel="Pilar 2 · Fechar"
        titulo="Revise e celebre"
        subtitulo="A sua autoridade tem base: método, arquétipos, voz e identidade definidos."
      />

      <div className="px-5 md:px-10 pb-20 pt-8 max-w-3xl mx-auto">
        <p className="text-sm text-ink/60 leading-relaxed mb-5">
          Marque o que já concluiu. Feito é melhor que perfeito — pode sempre voltar para afinar.
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
            <p className="text-sm font-medium text-ink">Autoridade construída! Avance para o Pilar 3 — Criar Soluções Digitais. 🎉</p>
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

        <div className="mt-9">
          <p className="text-sm font-semibold text-ink mb-3">Para onde quer ir agora?</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/metodo/pilar-2/redes-sociais"
              className="group rounded-2xl border border-terracotta bg-terracotta text-cream p-5 flex flex-col gap-2 hover:bg-terracotta-dark transition-colors"
            >
              <span className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-cream/70">
                <Instagram size={14} /> Aplicar agora
              </span>
              <span className="font-serif text-lg leading-tight">Criar para o Instagram</span>
              <span className="text-sm text-cream/80 leading-relaxed">
                Gere Reels, Stories e carrosséis a partir do seu Documento Mestre.
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                Começar <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              to="/metodo/pilar-3"
              className="group rounded-2xl border border-border bg-white text-ink p-5 flex flex-col gap-2 hover:border-terracotta/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-ink/45">
                <Lightbulb size={14} /> Continuar a jornada
              </span>
              <span className="font-serif text-lg leading-tight">Pilar 3 · Criar Soluções Digitais</span>
              <span className="text-sm text-ink/60 leading-relaxed">
                Transforme o que sabe em produtos digitais que valem dinheiro.
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
                Avançar <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
