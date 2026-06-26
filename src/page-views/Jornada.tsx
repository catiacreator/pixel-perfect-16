import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowUpRight,
  ArrowLeft,
  Hourglass,
  Crown,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Sparkles,
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

export default function Jornada() {
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-terracotta transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Início
        </Link>

        {/* Cabeçalho */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-8">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">/ Os 4 pilares</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-[-0.025em] text-ink max-w-3xl leading-[1.02]">
              A sua jornada,
              <br />
              <span className="text-ink/35">passo a passo.</span>
            </h1>
          </div>
          <p className="text-xs text-ink/40 shrink-0">3 disponíveis · 1 em breve</p>
        </div>

        {/* Pilares */}
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

        {/* Caminho especial — Consultoria */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-terracotta to-terracotta-dark border border-terracotta-dark/50 p-8 md:p-14 mt-5 md:mt-6">
          <div className="pointer-events-none absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-25 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={14} className="text-gold" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Caminho especial</p>
              </div>
              <h3 className="font-display text-3xl md:text-6xl text-cream tracking-[-0.025em] max-w-xl leading-[1.02]">
                Consultoria de
                <br />
                <span className="italic font-normal text-gold">Inteligência Artificial</span>
              </h3>
              <p className="text-sm md:text-base text-cream/70 mt-6 max-w-lg leading-relaxed">
                Para quem quer transformar Inteligência Artificial em serviço premium. Atenda clientes,
                cobre mais, entregue resultados.
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
    </Layout>
  );
}
