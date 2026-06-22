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
    titulo: "Recuperar seu tempo",
    sub: "Organize sua rotina para criar com calma, não em pânico.",
    to: "/metodo/pilar-1",
    status: "disponivel" as const,
  },
  {
    n: "02",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "Mostre o que você sabe para as pessoas certas.",
    to: "/metodo/pilar-2",
    status: "disponivel" as const,
  },
  {
    n: "03",
    icon: Lightbulb,
    titulo: "Soluções com seu conhecimento",
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
        {/* Ember radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-ember)_0%,transparent_55%)] opacity-25 blur-3xl" />
          <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-cocoa-2)_0%,transparent_60%)] opacity-50 blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-20 md:pb-32">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/50">
              Trilha · 2026
            </span>
          </div>

          <h1 className="font-display font-medium text-5xl md:text-7xl lg:text-[112px] leading-[0.95] tracking-[-0.03em] text-white max-w-[1100px]">
            Crie no digital
            <br />
            com{" "}
            <span className="italic font-normal bg-gradient-to-r from-ember-soft via-ember to-[#FF4E0A] bg-clip-text text-transparent">
              leveza
            </span>{" "}
            <span className="text-white/40">e método.</span>
          </h1>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-end gap-6">
            <p className="text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              Uma trilha simples para transformar o que você sabe em conteúdo,
              autoridade e liberdade — usando Inteligência Artificial.
            </p>
            <Link
              to="/metodo/pilar-1"
              className="group inline-flex items-center gap-2.5 bg-ember text-coal pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-ember-soft transition-all hover:gap-3.5"
            >
              Começar pelo Pilar 1
              <span className="w-9 h-9 rounded-full bg-coal text-ember flex items-center justify-center">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              to="/metodo/consultoria-ia"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-all"
            >
              Falar com o Assistente
            </Link>
          </div>

        </div>
      </section>

      {/* PILARES */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-12">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.3em] uppercase text-ember mb-3">
                / Os 4 pilares
              </p>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white max-w-2xl">
                Sua trilha completa,
                <br />
                <span className="text-white/40">passo a passo.</span>
              </h2>
            </div>
            <p className="text-xs text-white/40 shrink-0">
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
                      ? "bg-coal-2 border border-white/5 hover:border-ember/40 cursor-pointer"
                      : "bg-coal-2/50 border border-white/5 opacity-60"
                  }`}
                >
                  {/* Hover glow */}
                  {disponivel && (
                    <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-ember/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-5">
                    <div
                      className={`text-sm font-mono tracking-tight ${
                        disponivel ? "text-ember" : "text-white/30"
                      }`}
                    >
                      {p.n}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        {disponivel ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-ember">
                            <CheckCircle2 size={11} /> Disponível
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white/30">
                            <Lock size={11} /> Em breve
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-white leading-tight tracking-tight mb-3">
                        {p.titulo}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed max-w-md">
                        {p.sub}
                      </p>
                      {disponivel && (
                        <span className="inline-flex items-center gap-1.5 mt-6 text-[13px] font-medium text-white group-hover:text-ember transition-colors">
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
                          ? "bg-white/5 text-white/70 group-hover:bg-ember group-hover:text-coal"
                          : "bg-white/5 text-white/30"
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cocoa-2 via-cocoa to-coal-2 border border-ember/20 p-8 md:p-12">
            <div className="pointer-events-none absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-ember)_0%,transparent_60%)] opacity-30 blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-ember" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-ember">
                    Caminho especial
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-5xl text-white tracking-tight max-w-xl leading-[1.05]">
                  Consultoria de
                  <br />
                  <span className="italic font-normal text-ember">Inteligência Artificial</span>
                </h3>
                <p className="text-sm md:text-base text-white/60 mt-5 max-w-lg leading-relaxed">
                  Para quem quer transformar Inteligência Artificial em serviço premium.
                  Atenda clientes, cobre mais, entregue resultado.
                </p>
              </div>
              <Link
                to="/metodo/consultoria-ia"
                className="group inline-flex items-center gap-2.5 bg-white text-coal pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-ember hover:text-coal transition-all shrink-0"
              >
                <Briefcase size={14} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 rounded-full bg-coal text-white flex items-center justify-center">
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
