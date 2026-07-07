import { useEffect, useRef } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import HeroRobot from "../components/HeroRobot";
import { ArrowUpRight, Instagram, GraduationCap, Sparkles, Lock } from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";

// Porta de entrada: dois produtos independentes.
const PRODUTOS = [
  {
    key: "protocolo",
    tag: "Mentoria · Instagram",
    titulo: "Protocolo Viral",
    assinatura: "não é sorte, é método",
    desc: "O método de IA para transformar o teu perfil numa máquina de crescimento.",
    to: "/protocolo",
    cta: "Entrar no Protocolo",
    img: "/redes-sociais.png?v=3",
    pos: "center calc(42% - 10px)",
    cor: "#C8487E",
    icon: Instagram,
    estruturaId: "jornada",
  },
  {
    key: "academia",
    tag: "Ferramentas",
    titulo: "Academia de IA",
    assinatura: "domina as IAs que interessam",
    desc: "Aulas práticas, ferramenta a ferramenta, para aplicar Inteligência Artificial no teu negócio.",
    to: "/metodo/pilar-1/aprenda-ia",
    cta: "Entrar na Academia",
    img: "/academia-ia.png",
    pos: "center bottom",
    cor: "#2E7CB8",
    icon: GraduationCap,
    estruturaId: "academia",
  },
];

export default function Home() {
  const bloqueado = useBloqueadoParaAlunos();
  const { isBloqueado } = useBloqueios();
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

      {/* HERO — faixa colorida (gradiente da marca) + robô */}
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
            </div>

            {/* Robô animado */}
            <div className="relative fade-up flex justify-center items-center min-h-[240px] md:min-h-[280px]" style={{ animationDelay: "120ms" }}>
              <HeroRobot scale={0.78} />
            </div>
          </div>
        </div>
      </section>

      {/* Dois caminhos */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {PRODUTOS.map((p, i) => {
            const Icon = p.icon;
            const eid = (p as { estruturaId?: string }).estruturaId;
            const locked = !!eid && isBloqueado(eid) && bloqueado;
            const Wrapper: any = locked ? "div" : Link;
            const wrapperProps = locked ? { "aria-disabled": true } : { to: p.to };
            return (
              <Wrapper
                key={p.key}
                {...wrapperProps}
                className={`fade-up group relative overflow-hidden rounded-[28px] border border-white/60 flex flex-col justify-end min-h-[440px] md:min-h-[520px] p-7 md:p-9 transition-all duration-300 ${locked ? "cursor-not-allowed" : "hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-30px_rgba(40,20,15,0.55)]"}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${p.img})`, backgroundColor: p.cor, backgroundPosition: p.pos }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/92 via-black/62 to-transparent" />
                <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: p.cor }} />
                {locked && <div aria-hidden className="absolute inset-0 bg-black/35" />}

                <span className="absolute top-6 left-7 md:left-9 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 bg-white/12 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Icon size={13} /> {p.tag}
                </span>
                {locked && (
                  <span className="absolute top-6 right-7 md:right-9 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white bg-white/15 border border-white/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <Lock size={12} /> Em breve
                  </span>
                )}

                <div className="relative [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">
                  <p className="text-[12px] tracking-[0.24em] uppercase text-white/85 mb-2">{p.assinatura}</p>
                  <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.02] tracking-[-0.02em] text-white">
                    {p.titulo}
                  </h2>
                  <p className="text-sm md:text-[15px] text-white/90 mt-3 leading-relaxed max-w-md">{p.desc}</p>

                  {locked ? (
                    <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white/85">
                      <Lock size={15} /> Disponível em breve
                    </span>
                  ) : (
                    <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white">
                      {p.cta}
                      <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-ink group-hover:translate-x-0.5">
                        <ArrowUpRight size={15} strokeWidth={2.25} />
                      </span>
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
