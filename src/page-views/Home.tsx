import { useRef } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  ArrowUpRight,
  Sparkles,
  Compass,
  GraduationCap,
  MessageSquare,
  ImagePlus,
} from "lucide-react";

const CARDS = [
  {
    icon: Compass,
    titulo: "A sua jornada",
    desc: "Os 4 pilares do método, passo a passo — do tempo à venda.",
    to: "/metodo",
    cta: "Ver a jornada",
    tags: ["Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4"],
    cor: "#C0653A",
  },
  {
    icon: GraduationCap,
    titulo: "Academia de IA",
    desc: "Domine as principais IAs para o seu negócio — aulas práticas por ferramenta.",
    to: "/metodo/pilar-1/aprenda-ia",
    cta: "Entrar",
    tags: ["ChatGPT", "Claude", "Gemini", "Grok", "NotebookLM", "Lovable", "Tella"],
    cor: "#2E7CB8",
  },
  {
    icon: MessageSquare,
    titulo: "Criando para as Redes Sociais",
    desc: "Modelos de posts, linha editorial e calendário para publicar com método.",
    to: "/metodo/pilar-2/redes-sociais",
    cta: "Explorar",
    tags: ["Modelos", "Linha editorial", "Calendário", "Bio"],
    cor: "#C8487E",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const onMove = (e: { clientX: number; clientY: number }) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r || !orbRef.current) return;
    orbRef.current.style.transform = `translate(${e.clientX - r.left - 260}px, ${e.clientY - r.top - 260}px)`;
  };
  return (
    <Layout>
      {/* HERO — editorial moderno com fundo interativo */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        className="hero-grad relative overflow-hidden text-ink"
      >
        {/* orb que segue o cursor */}
        <div
          ref={orbRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-50 transition-transform duration-500 ease-out"
          style={{ background: "radial-gradient(circle at center, #F0A766 0%, transparent 60%)", transform: "translate(45%, 5%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)", backgroundSize: "22px 22px" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-14 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          {/* Texto */}
          <div className="fade-up">
            <div className="flex items-center gap-2 mb-7">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#C0653A" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2E7CB8" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#C8487E" }} />
              <span className="text-[11px] tracking-[0.3em] uppercase text-ink/50 ml-2">Jornada · 2026</span>
            </div>

            <h1 className="font-editorial font-normal uppercase text-[38px] md:text-[54px] lg:text-[66px] leading-[0.95] tracking-[-0.02em] text-ink">
              Crie no
              <br />
              digital{" "}
              <Sparkles className="inline-block align-middle text-gold" size={36} strokeWidth={1.5} />{" "}
              com
              <span className="normal-case italic text-gold"> leveza</span>
              <br />
              e método.
            </h1>

            <p className="text-base md:text-lg text-ink/60 max-w-md mt-6 leading-relaxed">
              Transforme o que sabe em conteúdo, autoridade e liberdade — com Inteligência Artificial.
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-8">
              <Link
                to="/metodo"
                className="group inline-flex items-center gap-2 bg-ink text-cream pl-6 pr-2 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(0,0,0,0.5)] active:scale-[0.97]"
              >
                Começar agora
                <span className="w-9 h-9 rounded-full bg-cream text-ink flex items-center justify-center">
                  <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
              <div className="text-sm">
                <p className="font-semibold text-ink">+220K seguidores</p>
                <p className="text-ink/50 text-xs">em 14 meses · método validado</p>
              </div>
            </div>
          </div>

          {/* Imagem + stats flutuantes */}
          <div className="relative fade-up" style={{ animationDelay: "140ms" }}>
            <div
              className="relative aspect-[4/5] max-w-[420px] mx-auto rounded-[32px] overflow-hidden border border-white/60 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.4)]"
              style={{ background: "linear-gradient(160deg, #F0A766 0%, #C8487E 55%, #2E7CB8 100%)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-center text-white/80">
                <div>
                  <ImagePlus size={30} className="mx-auto mb-2 opacity-80" />
                  <p className="text-[11px] tracking-[0.2em] uppercase">A tua foto aqui</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 md:-left-6 top-12 glass rounded-2xl px-4 py-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] animate-[float_7s_ease-in-out_infinite]">
              <p className="font-display text-2xl text-ink leading-none">220K<span className="text-gold">+</span></p>
              <p className="text-[11px] text-ink/55 mt-1">seguidores</p>
            </div>
            <div
              className="absolute -right-2 bottom-14 glass rounded-2xl px-4 py-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] animate-[float_8s_ease-in-out_infinite]"
              style={{ animationDelay: "1s" }}
            >
              <p className="font-display text-2xl text-ink leading-none">14<span className="text-gold"> m</span></p>
              <p className="text-[11px] text-ink/55 mt-1">do zero ao topo</p>
            </div>
          </div>
        </div>

        <div className="h-6 md:h-10 bg-cream rounded-t-[40px] md:rounded-t-[60px] -mb-px relative" />
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
            {CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.titulo}
                  to={c.to}
                  style={{ "--mc": c.cor, animationDelay: `${i * 90}ms` } as Record<string, string>}
                  className="fade-up group relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-xl p-6 md:p-7 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:bg-white/70"
                >
                  <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.cor }} />
                  <div className="mb-6">
                    <span
                      className="w-[52px] h-[52px] rounded-2xl text-cream flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-105"
                      style={{ background: c.cor }}
                    >
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
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                        style={{ color: c.cor, borderColor: c.cor + "55" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2.5 text-sm font-semibold" style={{ color: c.cor }}>
                    {c.cta}
                    <span
                      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:text-cream group-hover:translate-x-0.5 group-hover:bg-[var(--mc)] group-hover:border-[var(--mc)]"
                      style={{ borderColor: c.cor }}
                    >
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
