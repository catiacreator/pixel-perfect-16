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

const PALAVRAS = ["Ideias", "Estratégia", "Criatividade", "Método", "Conteúdo"];

export default function Home() {
  return (
    <Layout>
      {/* HERO — Editorial dramático */}
      <section className="relative overflow-hidden bg-ink">
        {/* Grão sobre fundo escuro */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        {/* Brilho dourado suave */}
        <div className="pointer-events-none absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-[0.08] blur-3xl" />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32 grid grid-cols-12 gap-6 md:gap-10 items-center">
          {/* Cartão de papel rasgado */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 z-10 order-2 md:order-1">
            <div
              className="bg-cream text-ink p-10 md:p-12 shadow-2xl relative -rotate-1"
              style={{
                clipPath:
                  "polygon(2% 1%, 98% 0%, 100% 12%, 97% 35%, 100% 65%, 96% 92%, 98% 100%, 0% 100%, 3% 72%, 0% 45%, 4% 15%)",
              }}
            >
              <div className="flex flex-col items-start gap-8">
                <div className="w-10 h-0.5 bg-terracotta/50" />
                <ul className="space-y-5 font-sans text-[11px] tracking-[0.4em] font-semibold uppercase">
                  {PALAVRAS.map((p) => (
                    <li
                      key={p}
                      className="hover:text-terracotta transition-colors cursor-default"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="pt-12 font-serif italic text-terracotta text-lg leading-relaxed">
                  o que te torna visível <br />
                  é o que entregas <br />
                  com valor.
                </p>
              </div>
            </div>
          </aside>

          {/* Manchete editorial */}
          <div className="col-span-12 md:col-span-8 z-20 order-1 md:order-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-cream/50">
                Trilha · 2026
              </span>
            </div>

            <h1 className="font-serif text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-[-0.01em]">
              Crie no digital <br />
              com <span className="italic font-normal text-gold">leveza</span> e{" "}
              <span className="relative inline-block">
                método.
                <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-gold/60 rounded-full" />
              </span>
            </h1>

            <div className="max-w-xl mt-10 space-y-10">
              <p className="font-sans text-cream-warm/85 text-base md:text-lg font-light leading-relaxed tracking-wide">
                Uma trilha simples para transformar o que sabe em conteúdo,
                autoridade e liberdade — com recurso a Inteligência Artificial.
              </p>

              <div className="flex flex-wrap items-center gap-8">
                <Link
                  to="/metodo/pilar-1"
                  className="px-10 py-5 bg-gold text-ink font-semibold text-[11px] uppercase tracking-[0.25em] border border-gold hover:bg-transparent hover:text-cream transition-all duration-500"
                >
                  Começar jornada
                </Link>
                <Link
                  to="/metodo"
                  className="flex items-center gap-4 group"
                >
                  <span className="h-px w-16 bg-cream/30 group-hover:w-24 group-hover:bg-gold transition-all duration-500" />
                  <span className="text-cream/60 text-[10px] uppercase tracking-[0.3em] font-semibold group-hover:text-cream">
                    Explorar método
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Selo dourado rotativo */}
        <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-30 hidden sm:block">
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-gold rounded-full shadow-[0_0_30px_rgba(203,176,138,0.25)] animate-[spin_18s_linear_infinite]">
              <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                <defs>
                  <path
                    id="sealCurve"
                    d="M 20,50 A 30,30 0 1,1 80,50 A 30,30 0 1,1 20,50"
                    fill="transparent"
                  />
                </defs>
                <text className="fill-ink" style={{ fontSize: "7.5px", letterSpacing: "0.25em", fontWeight: 700 }}>
                  <textPath href="#sealCurve">
                    • AUTENTICIDADE • VALOR • LIBERDADE • MÉTODO
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="z-10 bg-ink w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center text-gold border border-gold/30">
              <Sparkles size={18} strokeWidth={1.25} className="opacity-80 mb-1" />
              <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.25em]">
                Est. 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COMECE POR AQUI — Pilar 1 em destaque */}
      <section className="relative bg-ink">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-4 pb-12">
          <Link
            to="/metodo/pilar-1"
            className="group relative block overflow-hidden bg-forest border border-gold/30 p-8 md:p-10 transition-all hover:border-gold/60 hover:-translate-y-0.5"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-4">
                  Por onde começar
                </p>
                <h3 className="font-serif text-2xl md:text-4xl text-cream tracking-tight leading-tight mb-3">
                  Comece por aqui —{" "}
                  <span className="italic font-normal text-gold">
                    Pilar 1: Recuperar o seu tempo
                  </span>
                </h3>
                <p className="text-sm md:text-base text-cream/60 max-w-lg leading-relaxed">
                  Porque uma especialista exausta não cria futuro, só apaga incêndios.
                </p>
              </div>
              <span className="inline-flex items-center gap-2.5 bg-gold text-ink px-6 py-3 text-[11px] uppercase tracking-[0.25em] font-semibold group-hover:bg-cream transition-colors shrink-0">
                Entrar
                <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* PILARES */}
      <section className="relative bg-ink">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-12">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">
                / Os 4 pilares
              </p>
              <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-cream max-w-2xl leading-[1.05]">
                A sua trilha completa,
                <br />
                <span className="italic text-cream/50">passo a passo.</span>
              </h2>
            </div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-cream/40 shrink-0">
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
                  className={`group relative block p-7 md:p-9 transition-all overflow-hidden border ${
                    disponivel
                      ? "bg-forest-soft border-cream/10 hover:border-gold/50 cursor-pointer"
                      : "bg-forest-soft/40 border-cream/5 opacity-70"
                  }`}
                >
                  {disponivel && (
                    <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-5">
                    <div className={`font-serif text-sm tracking-tight ${disponivel ? "text-gold" : "text-cream/30"}`}>
                      {p.n}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        {disponivel ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-gold">
                            <CheckCircle2 size={11} /> Disponível
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-cream/40">
                            <Lock size={11} /> Em breve
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-cream leading-tight tracking-tight mb-3">
                        {p.titulo}
                      </h3>
                      <p className="text-sm text-cream/60 leading-relaxed max-w-md">
                        {p.sub}
                      </p>
                      {disponivel && (
                        <span className="inline-flex items-center gap-1.5 mt-6 text-[11px] tracking-[0.2em] uppercase font-semibold text-cream group-hover:text-gold transition-colors">
                          Entrar no pilar
                          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${disponivel ? "border-gold/30 text-gold group-hover:bg-gold group-hover:text-ink" : "border-cream/10 text-cream/30"} transition-colors`}>
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
      <section className="relative bg-ink">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-20 md:pb-28">
          <div className="relative overflow-hidden bg-cream text-ink border border-gold/30 p-8 md:p-12">
            <div className="pointer-events-none absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-terracotta)_0%,transparent_60%)] opacity-25 blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-terracotta" />
                  <p className="text-[11px] tracking-[0.35em] uppercase text-terracotta">
                    Caminho especial
                  </p>
                </div>
                <h3 className="font-serif text-3xl md:text-5xl tracking-tight max-w-xl leading-[1.05]">
                  Consultoria de
                  <br />
                  <span className="italic font-normal text-terracotta">
                    Inteligência Artificial
                  </span>
                </h3>
                <p className="text-sm md:text-base text-ink/65 mt-5 max-w-lg leading-relaxed">
                  Para quem quer transformar Inteligência Artificial em serviço premium.
                  Atenda clientes, cobre mais, entregue resultados.
                </p>
              </div>
              <Link
                to="/metodo/consultoria-ia"
                className="group inline-flex items-center gap-2.5 bg-ink text-cream pl-6 pr-2 py-2 text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-terracotta transition-all shrink-0"
              >
                <Briefcase size={13} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 bg-cream text-ink flex items-center justify-center">
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
