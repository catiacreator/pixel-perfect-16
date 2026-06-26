import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowUpRight,
  Sparkles,
  Compass,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

const CARDS = [
  {
    icon: Compass,
    titulo: "A sua jornada",
    desc: "Os 4 pilares do método, passo a passo — do tempo à venda.",
    to: "/metodo",
    cta: "Ver a jornada",
    tags: ["Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4"],
  },
  {
    icon: GraduationCap,
    titulo: "Academia de IA",
    desc: "Domine as principais IAs para o seu negócio — aulas práticas por ferramenta.",
    to: "/metodo/pilar-1/aprenda-ia",
    cta: "Entrar",
    tags: ["ChatGPT", "Claude", "Gemini", "Grok", "NotebookLM", "Lovable", "Tella"],
  },
  {
    icon: MessageSquare,
    titulo: "Criando para as Redes Sociais",
    desc: "Modelos de posts, linha editorial e calendário para publicar com método.",
    to: "/metodo/pilar-2/redes-sociais",
    cta: "Explorar",
    tags: ["Modelos", "Linha editorial", "Calendário", "Bio"],
  },
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
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 mb-5 md:mb-7">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cream animate-pulse" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-cream/70">
                Jornada · Edição 2026
              </span>
            </div>
            <div className="hidden md:block h-px bg-cream/20" />
          </div>

          <h1 className="font-editorial font-normal text-[28px] md:text-[42px] lg:text-[52px] leading-[1] tracking-[-0.02em] text-cream max-w-5xl">
            Crie no digital
            <br />
            com <span className="italic text-cream/95">leveza</span>
            <span className="text-gold">.</span>
            <br />
            <span className="text-cream/40">E com método.</span>
          </h1>

          <div className="mt-5 md:mt-6 grid grid-cols-1 md:grid-cols-[1.2fr_auto] items-end gap-4">
            <p className="font-editorial text-base md:text-lg text-cream/80 max-w-xl leading-snug">
              Uma jornada simples para transformar o que sabe em conteúdo,
              autoridade e liberdade — com recurso a Inteligência Artificial.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/metodo"
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

        <div className="h-6 md:h-10 bg-cream rounded-t-[40px] md:rounded-t-[60px] -mb-px" />
      </section>

      {/* HUB — 3 caminhos */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28">
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">/ Por onde começar</p>
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] text-ink max-w-3xl leading-[1.02]">
              Escolha o seu
              <br />
              <span className="text-ink/35">caminho.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.titulo}
                  to={c.to}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-7 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45"
                >
                  <div className="mb-6">
                    <span className="w-[52px] h-[52px] rounded-2xl bg-terracotta text-cream flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)] transition-transform group-hover:scale-105">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-[1.7rem] leading-[1.1] tracking-[-0.02em] text-ink">
                    {c.titulo}
                  </h3>
                  <p className="text-sm text-ink/55 mt-2.5 leading-relaxed flex-1">{c.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-terracotta/[0.08] text-terracotta"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2.5 text-sm font-semibold text-terracotta">
                    {c.cta}
                    <span className="w-9 h-9 rounded-full border border-terracotta/30 flex items-center justify-center transition-all duration-300 group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta group-hover:translate-x-0.5">
                      <ArrowUpRight size={15} strokeWidth={2.25} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
