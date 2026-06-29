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
    tags: [] as string[],
    cor: "#C0653A",
    img: "/card-jornada.jpg",
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
    img: "/academia-ia.png",
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
    img: "/redes-sociais.png?v=3",
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

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-10 items-center px-6 md:px-12 py-4 md:py-6">
            {/* Texto */}
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-4">
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

              <p className="text-white/80 max-w-md mt-4 leading-relaxed">
                Transforme o que sabe em conteúdo, autoridade e liberdade — com Inteligência Artificial.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
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
            <div className="relative fade-up flex justify-center items-center min-h-[240px] md:min-h-[280px]" style={{ animationDelay: "120ms" }}>
              <HeroRobot scale={0.78} />
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


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {CARDS.map((c, i) => {
              const Icon = c.icon;
              const locked = !accessLoading && !has(c.modulo);
              const checkout = MODULES[c.modulo].checkoutUrl;
              const cls = "fade-up group relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-xl p-5 md:p-6 flex flex-col aspect-[9/16] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:bg-white/70";
              const style = { "--mc": c.cor, animationDelay: `${i * 90}ms` } as Record<string, string>;

              const inner = c.img ? (
                /* Card com imagem (full-bleed) — a imagem já traz o título */
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${c.img})`, backgroundColor: c.cor }}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  {/* barrinha da cor do módulo no topo */}
                  <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: c.cor }} />
                  {locked && (
                    <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-white bg-black/50 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <Lock size={14} /> Bloqueado
                    </span>
                  )}
                  <span className="relative mt-auto inline-flex items-center gap-2.5 text-base font-semibold text-white">
                    {locked ? "Desbloquear acesso" : c.cta}
                    <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-ink group-hover:translate-x-0.5">
                      {locked ? <Lock size={14} strokeWidth={2.25} /> : <ArrowUpRight size={15} strokeWidth={2.25} />}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.cor }} />
                  {locked && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-ink/55 bg-white/80 border border-[var(--color-border)] rounded-full px-3 py-1.5">
                      <Lock size={14} /> Bloqueado
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

                  <span className="mt-6 inline-flex items-center gap-2.5 text-base font-semibold" style={{ color: c.cor }}>
                    {locked ? "Desbloquear acesso" : c.cta}
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

            {/* 4.º card — Em breve (placeholder, não clicável) */}
            <div
              className="fade-up relative overflow-hidden rounded-3xl border border-dashed border-ink/20 bg-white/30 p-5 md:p-6 flex flex-col items-center justify-center text-center aspect-[9/16]"
              style={{ animationDelay: `${CARDS.length * 90}ms` }}
            >
              <span className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center text-ink/35 mb-4">
                <Sparkles size={20} strokeWidth={1.75} />
              </span>
              <p className="text-[11px] uppercase tracking-[0.3em] text-ink/40">Em breve</p>
              <h3 className="font-display text-xl md:text-2xl text-ink/55 mt-2 leading-tight">
                Novo módulo<br />a chegar
              </h3>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
