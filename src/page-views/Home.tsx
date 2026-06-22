import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowRight,
  Hourglass,
  Crown,
  Lightbulb,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

const PILARES = [
  {
    n: "1",
    icon: Hourglass,
    titulo: "Recuperar seu tempo",
    sub: "Organize sua rotina para criar com calma, não em pânico.",
    to: "/metodo/pilar-1",
    status: "disponivel" as const,
  },
  {
    n: "2",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "Mostre o que você sabe para as pessoas certas.",
    to: "/metodo/pilar-2",
    status: "disponivel" as const,
  },
  {
    n: "3",
    icon: Lightbulb,
    titulo: "Soluções com seu conhecimento",
    sub: "Transforme o que sabe em produtos digitais.",
    to: "#",
    status: "embreve" as const,
  },
  {
    n: "4",
    icon: TrendingUp,
    titulo: "Aprender a vender",
    sub: "Venda no digital com método, sem forçar.",
    to: "#",
    status: "embreve" as const,
  },
];

const COMO_FUNCIONA = [
  {
    n: "1",
    icon: BookOpen,
    titulo: "Escolha um pilar",
    desc: "Comece pelo Pilar 1. Cada pilar tem aulas curtas e práticas.",
  },
  {
    n: "2",
    icon: PlayCircle,
    titulo: "Siga a trilha",
    desc: "Aulas, exercícios e modelos prontos. Vai no seu ritmo.",
  },
  {
    n: "3",
    icon: Sparkles,
    titulo: "Aplique com IA",
    desc: "Use o Assistente para criar conteúdo na hora, com clareza.",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-terracotta bg-cream-warm/60 px-3 py-1.5 rounded-full mb-5">
              <Sparkles size={12} /> Bem-vinda à sua trilha
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              Crie no digital<br />
              <span className="text-terracotta">com leveza</span> e método.
            </h1>
            <p className="text-base md:text-lg text-ink/70 mt-6 max-w-2xl leading-relaxed">
              Uma trilha simples para transformar o que você sabe em conteúdo,
              autoridade e liberdade — usando Inteligência Artificial.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/metodo/pilar-1"
                className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3.5 rounded-md text-sm font-medium hover:bg-forest transition-colors"
              >
                Começar pelo Pilar 1 <ArrowRight size={16} />
              </Link>
              <Link
                to="/metodo/consultoria-ia"
                className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3.5 rounded-md text-sm font-medium hover:bg-cream-warm/50 transition-colors"
              >
                Falar com o Assistente
              </Link>
            </div>
          </div>

          {/* Progress card */}
          <aside className="bg-cream-warm/40 border border-border rounded-xl p-6 w-full lg:w-[300px] shrink-0">
            <p className="text-xs tracking-wider uppercase text-muted mb-3">
              Seu progresso
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-serif text-4xl text-ink">0</span>
              <span className="text-sm text-muted">/ 4 pilares</span>
            </div>
            <div className="h-1.5 bg-cream rounded-full overflow-hidden mb-4">
              <div className="h-full w-0 bg-terracotta" />
            </div>
            <p className="text-sm text-ink/70">
              Comece pelo <strong className="text-ink">Pilar 1</strong> e siga
              a ordem.
            </p>
          </aside>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-b border-border bg-cream-warm/20">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-14 md:py-16">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] uppercase text-terracotta mb-2">
              Como funciona
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">
              Três passos. Sem complicação.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMO_FUNCIONA.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  className="bg-cream border border-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center font-serif text-lg shrink-0">
                      {step.n}
                    </div>
                    <Icon size={20} strokeWidth={1.75} className="text-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">
                    {step.titulo}
                  </h3>
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-8 pb-5 border-b border-border">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.25em] uppercase text-terracotta mb-2">
                Os 4 pilares
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">
                Sua trilha completa
              </h2>
            </div>
            <p className="text-sm text-muted shrink-0">
              2 disponíveis · 2 em breve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PILARES.map((p) => {
              const Icon = p.icon;
              const disponivel = p.status === "disponivel";
              const Wrapper: any = disponivel ? Link : "div";
              const props = disponivel ? { to: p.to } : {};
              return (
                <Wrapper
                  key={p.n}
                  {...props}
                  className={`group block bg-cream border rounded-xl p-6 md:p-7 transition-all ${
                    disponivel
                      ? "border-border hover:border-terracotta hover:shadow-[0_8px_24px_-12px_rgba(166,124,82,0.3)] cursor-pointer"
                      : "border-border/60 opacity-70"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-serif text-2xl ${
                        disponivel
                          ? "bg-terracotta text-cream"
                          : "bg-cream-warm/60 text-muted border border-border"
                      }`}
                    >
                      {p.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-xs tracking-wider uppercase text-muted">
                          Pilar {p.n}
                        </p>
                        {disponivel ? (
                          <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-sage bg-sage/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Disponível
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-muted bg-cream-warm/60 px-2 py-0.5 rounded-full">
                            <Lock size={10} /> Em breve
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-ink mb-2 leading-tight">
                        {p.titulo}
                      </h3>
                      <p className="text-sm text-ink/70 leading-relaxed mb-4">
                        {p.sub}
                      </p>
                      {disponivel && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta">
                          Entrar no pilar
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      )}
                    </div>
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className={`shrink-0 hidden sm:block ${
                        disponivel ? "text-ink/40" : "text-muted/40"
                      }`}
                    />
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMINHO PARALELO */}
      <section className="border-t border-border bg-forest text-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-14 md:py-16 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-gold/20 border border-gold/30 text-gold flex items-center justify-center shrink-0">
            <Briefcase size={22} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">
              Caminho especial
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-cream mb-1">
              Consultoria de IA
            </h3>
            <p className="text-sm text-cream/70">
              Para quem quer transformar Inteligência Artificial em serviço premium.
            </p>
          </div>
          <Link
            to="/metodo/consultoria-ia"
            className="inline-flex items-center gap-2 bg-gold text-ink px-5 py-3 rounded-md text-sm font-medium hover:bg-gold/90 transition-colors shrink-0"
          >
            Conhecer <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
