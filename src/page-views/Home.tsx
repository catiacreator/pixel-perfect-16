import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowUpRight,
  Hourglass,
  Crown,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Sparkles,
  Star,
} from "lucide-react";

const PILARES = [
  {
    n: "01",
    icon: Hourglass,
    titulo: "Recuperar o seu tempo",
    sub: "Organize a sua rotina para criar com calma, não em pânico.",
    to: "/metodo/pilar-1",
    status: "disponivel" as const,
    minutos: "6 etapas",
  },
  {
    n: "02",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "Mostre o que sabe às pessoas certas.",
    to: "/metodo/pilar-2",
    status: "disponivel" as const,
    minutos: "9 etapas",
  },
  {
    n: "03",
    icon: Lightbulb,
    titulo: "Soluções com o seu conhecimento",
    sub: "Transforme o que sabe em produtos digitais.",
    to: "#",
    status: "embreve" as const,
    minutos: "Em breve",
  },
  {
    n: "04",
    icon: TrendingUp,
    titulo: "Aprender a vender",
    sub: "Venda no digital com método, sem forçar.",
    to: "#",
    status: "embreve" as const,
    minutos: "Em breve",
  },
];

const MARQUEE = [
  "Conteúdo com método",
  "Inteligência Artificial",
  "Tempo recuperado",
  "Autoridade silenciosa",
  "Vendas sem pressa",
  "Leveza diária",
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_55%)] opacity-30 blur-3xl" />
          <div className="absolute top-60 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-cream-warm)_0%,transparent_60%)] opacity-70 blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
          {/* Linha topo */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 mb-14 md:mb-20">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-ink/50">
                Trilha · Edição 2026
              </span>
            </div>
            <div className="hidden md:block h-px bg-[var(--color-border)]" />
            <Link
              to="/metodo"
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] tracking-wide text-ink/60 hover:text-ink transition-colors"
            >
              Ver o método completo
              <ArrowUpRight size={13} strokeWidth={2} />
            </Link>
          </div>

          {/* Título editorial */}
          <h1 className="font-display font-medium text-[44px] md:text-[88px] lg:text-[120px] leading-[0.92] tracking-[-0.035em] text-ink">
            Crie no digital
            <br />
            com{" "}
            <span className="italic font-normal text-terracotta">leveza</span>
            <span className="text-gold">.</span>
            <br />
            <span className="text-ink/30">E com método.</span>
          </h1>

          {/* Sub + CTAs */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-[1.2fr_auto] items-end gap-8">
            <p className="text-base md:text-lg text-ink/60 max-w-xl leading-relaxed">
              Uma trilha simples para transformar o que sabe em conteúdo,
              autoridade e liberdade — com recurso a Inteligência Artificial.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/metodo/pilar-1"
                className="group inline-flex items-center gap-2 bg-ink text-cream pl-5 pr-2 py-2 rounded-full text-sm font-medium hover:bg-forest transition-all"
              >
                Começar agora
                <span className="w-8 h-8 rounded-full bg-cream text-ink flex items-center justify-center">
                  <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
              <Link
                to="/assistente"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-ink border border-[var(--color-border)] hover:border-ink/40 transition-colors"
              >
                <Sparkles size={14} />
                Falar com o assistente
              </Link>
            </div>
          </div>
        </div>
      </section>




      {/* COMECE POR AQUI */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-16 md:pt-24">
          <Link
            to="/metodo/pilar-1"
            className="group relative block overflow-hidden rounded-[28px] bg-forest text-cream p-8 md:p-14 transition-all hover:-translate-y-0.5"
          >
            <div className="pointer-events-none absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-25 blur-3xl group-hover:opacity-40 transition-opacity" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />

            <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-10">
              <div className="font-display text-[88px] md:text-[140px] leading-none text-gold/40 tracking-tighter select-none">
                01
              </div>
              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
                  Por onde começar
                </p>
                <h3 className="font-display text-3xl md:text-5xl tracking-tight leading-[1.05] mb-4">
                  Recuperar o seu{" "}
                  <span className="italic font-normal text-gold">tempo</span>
                </h3>
                <p className="text-sm md:text-base text-cream/60 max-w-lg leading-relaxed">
                  Porque uma especialista exausta não cria futuro, só apaga incêndios.
                </p>
              </div>
              <span className="inline-flex items-center gap-2.5 bg-gold text-forest px-6 py-3 rounded-full text-sm font-semibold group-hover:bg-cream transition-colors shrink-0">
                Entrar no Pilar 1
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* PILARES — lista editorial */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-14">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">
                / Os 4 pilares
              </p>
              <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] text-ink max-w-3xl leading-[1.02]">
                A sua trilha,
                <br />
                <span className="text-ink/35">passo a passo.</span>
              </h2>
            </div>
            <p className="text-xs text-ink/40 shrink-0">
              2 disponíveis · 2 em breve
            </p>
          </div>

          <div className="border-t border-[var(--color-border)]">
            {PILARES.map((p) => {
              const Icon = p.icon;
              const disponivel = p.status === "disponivel";
              const Wrapper: any = disponivel ? Link : "div";
              const props = disponivel ? { to: p.to } : {};
              return (
                <Wrapper
                  key={p.n}
                  {...props}
                  className={`group relative grid grid-cols-[60px_1fr_auto] md:grid-cols-[100px_auto_1fr_auto_auto] items-center gap-4 md:gap-8 border-b border-[var(--color-border)] py-7 md:py-10 transition-colors ${
                    disponivel
                      ? "hover:bg-cream-warm/40 cursor-pointer"
                      : "opacity-50"
                  }`}
                >
                  <div className="font-display text-3xl md:text-5xl text-ink/20 tracking-tight">
                    {p.n}
                  </div>
                  <div
                    className={`hidden md:flex w-14 h-14 rounded-2xl items-center justify-center shrink-0 transition-colors ${
                      disponivel
                        ? "bg-ink/5 text-ink/70 group-hover:bg-terracotta group-hover:text-cream"
                        : "bg-ink/5 text-ink/30"
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-3xl text-ink leading-tight tracking-[-0.015em]">
                      {p.titulo}
                    </h3>
                    <p className="text-[13px] md:text-sm text-ink/55 mt-1.5 leading-relaxed max-w-xl">
                      {p.sub}
                    </p>
                  </div>
                  <span
                    className={`hidden md:inline-flex items-center text-[11px] tracking-[0.2em] uppercase ${
                      disponivel ? "text-terracotta" : "text-ink/30"
                    }`}
                  >
                    {p.minutos}
                  </span>
                  <span
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      disponivel
                        ? "border-ink/15 text-ink group-hover:bg-ink group-hover:text-cream group-hover:border-ink group-hover:rotate-45"
                        : "border-ink/10 text-ink/30"
                    }`}
                  >
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </span>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMINHO PARALELO */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-20 md:pb-28">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-cream-warm via-[#EFE4CE] to-gold/40 border border-terracotta/20 p-8 md:p-14">
            <div className="pointer-events-none absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-terracotta)_0%,transparent_60%)] opacity-20 blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={14} className="text-terracotta" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta">
                    Caminho especial
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-6xl text-ink tracking-[-0.025em] max-w-xl leading-[1.02]">
                  Consultoria de
                  <br />
                  <span className="italic font-normal text-terracotta">
                    Inteligência Artificial
                  </span>
                </h3>
                <p className="text-sm md:text-base text-ink/60 mt-6 max-w-lg leading-relaxed">
                  Para quem quer transformar Inteligência Artificial em serviço
                  premium. Atenda clientes, cobre mais, entregue resultados.
                </p>
              </div>
              <Link
                to="/metodo/consultoria-ia"
                className="group inline-flex items-center gap-2.5 bg-ink text-cream pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-terracotta transition-all shrink-0"
              >
                <Briefcase size={14} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 rounded-full bg-cream text-ink flex items-center justify-center">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
