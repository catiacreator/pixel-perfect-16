import { useEffect, useRef } from "react";
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
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      orbRef.current.style.transform = `translate(${e.clientX - 280}px, ${e.clientY - 280}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Layout>
      {/* orb de luz que segue o cursor — em toda a página */}
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 w-[560px] h-[560px] rounded-full blur-3xl opacity-40 transition-transform duration-500 ease-out"
        style={{ background: "radial-gradient(circle at center, #F0A766 0%, transparent 60%)" }}
      />

      {/* HERO — mesmo fundo da página */}
      <section className="relative overflow-hidden text-ink">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)", backgroundSize: "22px 22px" }}
        />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-2 md:pb-4 grid lg:grid-cols-[1.05fr_0.95fr] gap-4 lg:gap-12 items-center">
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

            <div className="mt-8">
              <Link
                to="/metodo"
                className="group inline-flex items-center gap-2 bg-ink text-cream pl-6 pr-2 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(0,0,0,0.5)] active:scale-[0.97]"
              >
                Começar agora
                <span className="w-9 h-9 rounded-full bg-cream text-ink flex items-center justify-center">
                  <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Robot IA */}
          <div className="relative fade-up flex justify-center" style={{ animationDelay: "140ms" }}>
            <img
              src="/robot.png"
              alt="Assistente de IA"
              className="w-[300px] md:w-[380px] max-w-full drop-shadow-[0_30px_55px_-25px_rgba(0,0,0,0.35)] animate-[float_7s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </section>

      {/* HUB — 3 caminhos */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-2 md:pt-4 pb-20 md:pb-28">
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
