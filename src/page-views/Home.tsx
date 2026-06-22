import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowUpRight,
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
    n: "01",
    icon: Hourglass,
    titulo: "Recuperar o seu tempo",
    sub: "Organize a sua rotina para criar com calma, não em pânico.",
    to: "/metodo/pilar-1",
    status: "disponivel" as const,
  },
  {
    n: "02",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "Mostre o que sabe às pessoas certas.",
    to: "/metodo/pilar-2",
    status: "disponivel" as const,
  },
  {
    n: "03",
    icon: Lightbulb,
    titulo: "Soluções com o seu conhecimento",
    sub: "Transforme o que sabe em produtos digitais.",
    to: "#",
    status: "embreve" as const,
  },
  {
    n: "04",
    icon: TrendingUp,
    titulo: "Aprender a vender",
    sub: "Venda no digital com método, sem forçar.",
    to: "#",
    status: "embreve" as const,
  },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Brilho radial terracota */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_55%)] opacity-40 blur-3xl" />
          <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-cream-warm)_0%,transparent_60%)] opacity-70 blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-20 md:pb-32">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-ink/50">
              Trilha · 2026
            </span>
          </div>

          <h1 className="font-display font-medium text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-ink max-w-[900px]">
            Crie no digital
            <br />
            com{" "}
            <span className="italic font-normal bg-gradient-to-r from-terracotta via-terracotta-dark to-[#6B4525] bg-clip-text text-transparent">
              leveza
            </span>{" "}
            <span className="text-ink/40">e método.</span>
          </h1>

          <p className="mt-12 text-base md:text-lg text-ink/60 max-w-xl leading-relaxed">
            Uma trilha simples para transformar o que sabe em conteúdo,
            autoridade e liberdade — com recurso a Inteligência Artificial.
          </p>

        </div>
      </section>

      {/* COMECE POR AQUI — Pilar 1 em destaque */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-8 md:pb-12">
          <Link
            to="/metodo/pilar-1"
            className="group relative block overflow-hidden rounded-3xl bg-forest border border-gold/30 p-8 md:p-10 transition-all hover:shadow-2xl hover:shadow-forest/20 hover:-translate-y-0.5"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
                  Por onde começar
                </p>
                <h3 className="font-serif text-2xl md:text-4xl text-cream tracking-tight leading-tight mb-3">
                  Comece por aqui —{" "}
                  <span className="italic font-normal text-gold">Pilar 1: Recuperar o seu tempo</span>
                </h3>
                <p className="text-sm md:text-base text-cream/60 max-w-lg leading-relaxed">
                  Porque uma especialista exausta não cria futuro, só apaga incêndios.
                </p>
              </div>
              <span className="inline-flex items-center gap-2.5 bg-gold text-forest px-6 py-3 rounded-full text-sm font-semibold group-hover:bg-cream transition-colors shrink-0">
                Entrar
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

      {/* PILARES */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-12">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">
                / Os 4 pilares
              </p>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-ink max-w-2xl">
                A sua trilha completa,
                <br />
                <span className="text-ink/40">passo a passo.</span>
              </h2>
            </div>
            <p className="text-xs text-ink/40 shrink-0">
              2 disponíveis · 2 em breve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PILARES.map((p) => {
              const Icon = p.icon;
              const disponivel = p.status === "disponivel";
              const Wrapper: any = disponivel ? Link : "div";
              const props = disponivel ? { to: p.to } : {};
              return (
                <Wrapper
                  key={p.n}
                  {...props}
                  className={`group relative block rounded-3xl p-7 md:p-9 transition-all overflow-hidden ${
                    disponivel
                      ? "bg-cream-warm border border-[var(--color-border)] hover:border-terracotta/50 cursor-pointer"
                      : "bg-cream-warm/50 border border-[var(--color-border)] opacity-70"
                  }`}
                >
                  {/* Brilho hover */}
                  {disponivel && (
                    <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-gold/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-5">
                    <div
                      className={`text-sm font-mono tracking-tight ${
                        disponivel ? "text-terracotta" : "text-ink/30"
                      }`}
                    >
                      {p.n}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        {disponivel ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-terracotta">
                            <CheckCircle2 size={11} /> Disponível
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-ink/30">
                            <Lock size={11} /> Em breve
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight tracking-tight mb-3">
                        {p.titulo}
                      </h3>
                      <p className="text-sm text-ink/60 leading-relaxed max-w-md">
                        {p.sub}
                      </p>
                      {disponivel && (
                        <span className="inline-flex items-center gap-1.5 mt-6 text-[13px] font-medium text-ink group-hover:text-terracotta transition-colors">
                          Entrar no pilar
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        disponivel
                          ? "bg-ink/5 text-ink/70 group-hover:bg-terracotta group-hover:text-cream"
                          : "bg-ink/5 text-ink/30"
                      } transition-colors`}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream-warm via-[#EFE4CE] to-gold/40 border border-terracotta/30 p-8 md:p-12">
            <div className="pointer-events-none absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-terracotta)_0%,transparent_60%)] opacity-25 blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-terracotta" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta">
                    Caminho especial
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-5xl text-ink tracking-tight max-w-xl leading-[1.05]">
                  Consultoria de
                  <br />
                  <span className="italic font-normal text-terracotta">Inteligência Artificial</span>
                </h3>
                <p className="text-sm md:text-base text-ink/60 mt-5 max-w-lg leading-relaxed">
                  Para quem quer transformar Inteligência Artificial em serviço premium.
                  Atenda clientes, cobre mais, entregue resultados.
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
