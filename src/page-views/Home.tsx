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
    titulo: "Crie com Leveza sem roubar o seu tempo",
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
    titulo: "Crie o seu produto",
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
    to: "/metodo/pilar-4",
    status: "disponivel" as const,
    minutos: "9 etapas",
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
      {/* HERO — banda terracotta editorial */}
      <section className="relative overflow-hidden bg-terracotta text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-terracotta-dark)_0%,transparent_60%)] opacity-70 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_65%)] opacity-25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-8 md:pb-10">
          {/* Linha topo */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 mb-5 md:mb-7">


            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cream animate-pulse" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-cream/70">
                Jornada · Edição 2026
              </span>
            </div>
            <div className="hidden md:block h-px bg-cream/20" />
          </div>

          {/* Título editorial */}
          <h1 className="font-editorial font-normal text-[28px] md:text-[42px] lg:text-[52px] leading-[1] tracking-[-0.02em] text-cream max-w-5xl">
            Crie no digital
            <br />
            com{" "}
            <span className="italic text-cream/95">leveza</span>
            <span className="text-gold">.</span>
            <br />
            <span className="text-cream/40">E com método.</span>
          </h1>

          {/* Sub + CTAs */}
          <div className="mt-5 md:mt-6 grid grid-cols-1 md:grid-cols-[1.2fr_auto] items-end gap-4">


            <p className="font-editorial text-base md:text-lg text-cream/80 max-w-xl leading-snug">
              Uma jornada simples para transformar o que sabe em conteúdo,
              autoridade e liberdade — com recurso a Inteligência Artificial.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/metodo/pilar-1"
                className="group inline-flex items-center gap-2 bg-cream text-ink pl-5 pr-2 py-2 rounded-full text-sm font-medium hover:bg-white transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)]"
              >
                Começar agora
                <span className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center">
                  <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
              <Link
                to="/assistente"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-cream border border-cream/30 hover:border-cream/70 hover:bg-cream/5 transition-colors"
              >
                <Sparkles size={14} />
                Falar com o assistente
              </Link>
            </div>
          </div>
        </div>

        {/* recorte cream para transição */}
        <div className="h-6 md:h-10 bg-cream rounded-t-[40px] md:rounded-t-[60px] -mb-px" />

      </section>





      {/* PILARES — lista editorial */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-14">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-8">

            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">
                / Os 4 pilares
              </p>
              <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] text-ink max-w-3xl leading-[1.02]">
                A sua jornada,
                <br />
                <span className="text-ink/35">passo a passo.</span>
              </h2>
            </div>
            <p className="text-xs text-ink/40 shrink-0">
              3 disponíveis · 1 em breve
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {PILARES.map((p) => {
              const Icon = p.icon;
              const disponivel = p.status === "disponivel";
              const Wrapper: any = disponivel ? Link : "div";
              const props = disponivel ? { to: p.to } : {};
              return (
                <Wrapper
                  key={p.n}
                  {...props}
                  className={`group relative overflow-hidden rounded-3xl border p-6 md:p-7 transition-all duration-300 ease-out ${
                    disponivel
                      ? "bg-white border-[var(--color-border)] hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45 cursor-pointer"
                      : "bg-cream-warm/40 border-dashed border-[var(--color-border)]"
                  }`}
                >
                  {/* número gigante de fundo */}
                  <span
                    className={`pointer-events-none absolute -top-5 right-2 font-display font-bold text-[110px] leading-none tracking-tighter tabular-nums transition-colors ${
                      disponivel ? "text-terracotta/10 group-hover:text-terracotta/20" : "text-ink/[0.04]"
                    }`}
                  >
                    {p.n}
                  </span>

                  <div className="relative mb-6">
                    <span
                      className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        disponivel
                          ? "bg-terracotta text-cream shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)]"
                          : "bg-ink/5 text-ink/30"
                      }`}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                  </div>

                  <h3
                    className={`relative font-display text-2xl md:text-[1.7rem] leading-[1.1] tracking-[-0.02em] ${
                      disponivel ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {p.titulo}
                  </h3>
                  <p
                    className={`relative text-sm mt-2.5 leading-relaxed max-w-md ${
                      disponivel ? "text-ink/55" : "text-ink/40"
                    }`}
                  >
                    {p.sub}
                  </p>

                  <div className="relative mt-6 flex items-center justify-between gap-3">
                    {disponivel ? (
                      <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-terracotta">
                        Começar
                        <span className="w-9 h-9 rounded-full border border-terracotta/30 flex items-center justify-center transition-all duration-300 group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta group-hover:translate-x-0.5">
                          <ArrowUpRight size={15} strokeWidth={2.25} />
                        </span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <span
                      className={`text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full ${
                        disponivel ? "bg-terracotta/10 text-terracotta" : "bg-ink/5 text-ink/40"
                      }`}
                    >
                      {p.minutos}
                    </span>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMINHO PARALELO */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-20 md:pb-28">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-terracotta to-terracotta-dark border border-terracotta-dark/50 p-8 md:p-14">
            <div className="pointer-events-none absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-25 blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={14} className="text-gold" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-gold">
                    Caminho especial
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-6xl text-cream tracking-[-0.025em] max-w-xl leading-[1.02]">
                  Consultoria de
                  <br />
                  <span className="italic font-normal text-gold">
                    Inteligência Artificial
                  </span>
                </h3>
                <p className="text-sm md:text-base text-cream/70 mt-6 max-w-lg leading-relaxed">
                  Para quem quer transformar Inteligência Artificial em serviço
                  premium. Atenda clientes, cobre mais, entregue resultados.
                </p>
              </div>
              <Link
                to="/metodo/consultoria-ia"
                className="group inline-flex items-center gap-2.5 bg-cream text-ink pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all shrink-0"
              >
                <Briefcase size={14} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 rounded-full bg-ink text-cream flex items-center justify-center">
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
