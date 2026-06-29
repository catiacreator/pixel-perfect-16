import { useEffect, useRef } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import HeroRobot from "../components/HeroRobot";
import { useAccess } from "@/lib/use-access";
import { MODULES } from "@/lib/access";
import {
  ArrowUpRight,
  Sparkles,
  Compass,
  GraduationCap,
  MessageSquare,
  FileText,
  Lock,
} from "lucide-react";

const CARDS = [
  {
    modulo: "jornada" as const,
    icon: Compass,
    titulo: "A sua jornada",
    desc: "Os 4 pilares do método, passo a passo — do tempo à venda.",
    to: "/metodo",
    cta: "Ver a jornada",
    tags: ["Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4"],
    cor: "#C0653A",
  },
  {
    modulo: "academia" as const,
    icon: GraduationCap,
    titulo: "Academia de IA",
    desc: "Domine as principais IAs para o seu negócio — aulas práticas por ferramenta.",
    to: "/metodo/pilar-1/aprenda-ia",
    cta: "Entrar",
    tags: ["ChatGPT", "Claude", "Gemini", "Grok", "NotebookLM", "Lovable", "Tella"],
    cor: "#2E7CB8",
  },
  {
    modulo: "redes" as const,
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
  const { has, loading: accessLoading } = useAccess();
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let scale = 1;
    let target = 1;
    let raf = 0;
    let idle: ReturnType<typeof setTimeout>;

    const render = () => {
      // a bola persegue o cursor com inércia e "cresce" ao mover-se (empurra o fundo)
      scale += (target - scale) * 0.12;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${x - 320}px, ${y - 320}px) scale(${scale.toFixed(3)})`;
        orbRef.current.style.opacity = String(0.32 + (scale - 1) * 0.55);
      }
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      target = 1.45; // incha enquanto se move
      clearTimeout(idle);
      idle = setTimeout(() => { target = 1; }, 140); // relaxa quando para
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(idle);
    };
  }, []);

  return (
    <Layout>
      {/* bola de luz que segue o cursor e cresce — empurra o fundo */}
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 w-[640px] h-[640px] rounded-full blur-3xl opacity-40 will-change-transform"
        style={{ background: "radial-gradient(circle at center, #F0A766 0%, #C8487E 35%, transparent 62%)" }}
      />

      {/* HERO — faixa colorida (gradiente da marca) */}
      <section className="relative px-4 md:px-10 pt-5 md:pt-7 pb-2 md:pb-4">
        <div
          className="relative max-w-[1400px] mx-auto overflow-hidden rounded-[28px] md:rounded-[36px]"
          style={{ background: "radial-gradient(130% 130% at 82% 16%, #F0A766 0%, #C8487E 55%, #2E7CB8 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-10 items-center px-6 md:px-12 py-9 md:py-14">
            {/* Texto */}
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-white/90" />
                <span className="w-2 h-2 rounded-full bg-white/60" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-white/80 ml-1">Jornada · 2026</span>
              </div>

              <h1 className="font-editorial font-normal uppercase text-[34px] md:text-[50px] lg:text-[58px] leading-[0.98] tracking-[-0.02em] text-white">
                <span className="block">
                  Crie no digital{" "}
                  <Sparkles className="inline-block align-middle text-white/90" size={32} strokeWidth={1.5} />
                </span>
                <span className="block normal-case italic text-white/95">com leveza</span>
                <span className="block">e método</span>
              </h1>

              <p className="text-white/80 max-w-md mt-5 leading-relaxed">
                Transforme o que sabe em conteúdo, autoridade e liberdade — com Inteligência Artificial.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/doc-mestre"
                  className="group inline-flex items-center gap-2 bg-[#ffffff] text-[#141414] pl-6 pr-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(0,0,0,0.5)] active:scale-[0.97]"
                >
                  Começar agora
                  <span className="w-9 h-9 rounded-full bg-[#141414] text-white flex items-center justify-center">
                    <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
                <Link
                  to="/assistente"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white border border-white/40 hover:bg-white/10 transition-colors active:scale-[0.97]"
                >
                  <Sparkles size={14} />
                  Assistente
                </Link>
              </div>
            </div>

            {/* Robô animado */}
            <div className="relative fade-up flex justify-center items-center min-h-[400px] md:min-h-[440px]" style={{ animationDelay: "120ms" }}>
              <HeroRobot />
            </div>
          </div>
        </div>
      </section>

      {/* HUB — 3 caminhos */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-2 md:pt-4 pb-20 md:pb-28">
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">/ Por onde começar</p>
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] text-ink max-w-3xl leading-[1.05]">
              Escolha o seu <span className="text-ink/35">caminho.</span>
            </h2>
          </div>

          {/* Card horizontal — Documento Mestre */}
          <Link
            to="/doc-mestre"
            className="fade-up group relative overflow-hidden rounded-3xl mb-4 md:mb-5 flex flex-wrap items-center gap-4 md:gap-5 p-5 md:p-7 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-22px_rgba(0,0,0,0.55)]"
            style={{ background: "linear-gradient(120deg, #A9572E 0%, #C0653A 48%, #C98A50 100%)" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
            />
            <span className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
              <FileText size={26} strokeWidth={1.75} />
            </span>
            <div className="relative min-w-0 flex-1">
              <h3 className="font-display text-xl md:text-2xl tracking-[-0.01em] leading-tight">
                Cria o teu Documento Mestre
              </h3>
              <p className="text-white/70 text-sm mt-1 leading-relaxed">
                Este documento vai alimentar todo o teu sistema.
              </p>
            </div>
            <span className="relative ml-auto inline-flex items-center gap-2 bg-white text-ink pl-5 pr-2 py-2 rounded-full text-sm font-semibold shrink-0 transition-transform group-hover:translate-x-0.5">
              Começa aqui
              <span className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center">
                <ArrowUpRight size={15} strokeWidth={2.25} />
              </span>
            </span>
          </Link>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {CARDS.map((c, i) => {
              const Icon = c.icon;
              const locked = !accessLoading && !has(c.modulo);
              const checkout = MODULES[c.modulo].checkoutUrl;
              const cls = "fade-up group relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-xl p-6 md:p-7 flex flex-col aspect-[9/16] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:bg-white/70";
              const style = { "--mc": c.cor, animationDelay: `${i * 90}ms` } as Record<string, string>;

              const inner = (
                <>
                  <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.cor }} />
                  {locked && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink/55 bg-white/80 border border-[var(--color-border)] rounded-full px-2 py-1">
                      <Lock size={11} /> Bloqueado
                    </span>
                  )}
                  <div className="mb-6">
                    <span
                      className="w-[52px] h-[52px] rounded-2xl text-cream flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-105"
                      style={{ background: c.cor }}
                    >
                      {locked ? <Lock size={20} strokeWidth={2} /> : <Icon size={22} strokeWidth={1.75} />}
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
                    {locked ? "Desbloquear na Hotmart" : c.cta}
                    <span
                      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:text-cream group-hover:translate-x-0.5 group-hover:bg-[var(--mc)] group-hover:border-[var(--mc)]"
                      style={{ borderColor: c.cor }}
                    >
                      {locked ? <Lock size={14} strokeWidth={2.25} /> : <ArrowUpRight size={15} strokeWidth={2.25} />}
                    </span>
                  </span>
                </>
              );

              if (locked) {
                return checkout ? (
                  <a key={c.titulo} href={checkout} target="_blank" rel="noreferrer" className={cls} style={style}>
                    {inner}
                  </a>
                ) : (
                  <div key={c.titulo} className={`${cls} cursor-default`} style={style} title="Em breve na Hotmart">
                    {inner}
                  </div>
                );
              }

              return (
                <Link key={c.titulo} to={c.to} className={cls} style={style}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
