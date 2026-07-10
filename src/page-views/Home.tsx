import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import HeroRobot from "../components/HeroRobot";
import { ArrowUpRight, Instagram, GraduationCap, Sparkles, Lock, MessageCircle, X, Users } from "lucide-react";

const WHATSAPP_CATIA = "https://wa.link/jwr3yp";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";

// Porta de entrada: dois produtos independentes.
const PRODUTOS = [
  {
    key: "conteudo-ia",
    tag: "Mini-curso",
    titulo: "Conteúdo com IA",
    assinatura: "o teu primeiro mês de posts",
    desc: "Aprende a criar conteúdo com IA e a publicar com consistência. A porta de entrada para o método completo.",
    to: "/conteudo-ia",
    cta: "Começar o mini-curso",
    img: "/conteudo-com-ia.png?v=1",
    pos: "center 28%",
    cor: "#7C56C9",
    icon: Sparkles,
    estruturaId: "conteudo-ia",
  },
  {
    key: "protocolo",
    tag: "Mentoria · Instagram",
    titulo: "Protocolo Viral",
    assinatura: "não é sorte, é método",
    desc: "O método de IA para transformar o teu perfil numa máquina de crescimento.",
    to: "/protocolo",
    cta: "Entrar no Protocolo",
    img: "/protocolo-viral.png?v=1",
    pos: "center 30%",
    cor: "#C8487E",
    icon: Instagram,
    estruturaId: "jornada",
    sombraTitulo: true,
  },
  {
    key: "academia",
    tag: "Ferramentas",
    titulo: "Academia de IA",
    assinatura: "domina as IAs que interessam",
    desc: "Aulas práticas, ferramenta a ferramenta, para aplicar Inteligência Artificial no teu negócio.",
    to: "/metodo/pilar-1/aprenda-ia",
    cta: "Entrar na Academia",
    img: "/academia-de-ia.png?v=1",
    pos: "center 44%",
    zoom: "118%",
    cor: "#2E7CB8",
    icon: GraduationCap,
    estruturaId: "academia",
    sombraTitulo: true,
  },
  {
    key: "encontros",
    tag: "Mentoria",
    titulo: "Encontros",
    assinatura: "ao vivo, comigo",
    desc: "Sessões em direto para tirares dúvidas, receberes feedback e avançares com acompanhamento.",
    to: "/encontros",
    cta: "Ver os encontros",
    img: "/encontros.svg",
    pos: "center 30%",
    cor: "#D9553F",
    icon: Users,
    estruturaId: "encontros",
  },
];

// Cada secção agrupa os cards pela sua chave; o resto vai para os cursos principais.
const MINI_CURSOS = ["conteudo-ia"];
const MENTORIA = ["encontros"];

export default function Home() {
  const bloqueado = useBloqueadoParaAlunos();
  const { isBloqueado, modoBloqueio } = useBloqueios();
  const [desbloquearOpen, setDesbloquearOpen] = useState(false);
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

  const renderCard = (p: (typeof PRODUTOS)[number], i: number) => {
    const Icon = p.icon;
    const eid = (p as { estruturaId?: string }).estruturaId;
    const locked = !!eid && isBloqueado(eid) && bloqueado;
    const modo = locked && eid ? modoBloqueio(eid) : "em-breve";
    // "Oculto": o card não aparece de todo para esta turma.
    if (modo === "oculto") return null;
    // Módulo "bloqueado" → clicável, abre o contacto da Cátia.
    const modoDesbloquear = locked && modo === "bloqueado";
    const Wrapper: any = modoDesbloquear ? "button" : locked ? "div" : Link;
    const wrapperProps = modoDesbloquear
      ? { type: "button" as const, onClick: () => setDesbloquearOpen(true) }
      : locked
        ? { "aria-disabled": true }
        : { to: p.to };
    return (
      <Wrapper
        key={p.key}
        {...wrapperProps}
        className={`fade-up group relative overflow-hidden rounded-[24px] border border-white/60 flex flex-col justify-end aspect-[9/16] w-full sm:w-[330px] md:w-[360px] p-6 text-left transition-all duration-300 ${locked && !modoDesbloquear ? "cursor-not-allowed" : "hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-30px_rgba(40,20,15,0.55)]"}`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${p.img})`, backgroundColor: p.cor, backgroundPosition: p.pos, backgroundSize: (p as { zoom?: string }).zoom || undefined }}
        />
        <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: p.cor }} />

        <span className="absolute top-6 left-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 bg-white/12 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <Icon size={13} /> {p.tag}
        </span>
        {locked && (
          <span className={`absolute top-6 right-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full px-3 py-1.5 backdrop-blur-sm ${modoDesbloquear ? "text-ink bg-white/90 border border-white" : "text-white bg-white/15 border border-white/30"}`}>
            <Lock size={12} /> {modoDesbloquear ? "Bloqueado" : "Em breve"}
          </span>
        )}

        <div className="relative bg-black/80 rounded-2xl px-4 py-4">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/85 mb-1.5">{p.assinatura}</p>
          <h2 className="font-display text-2xl md:text-3xl leading-[1.05] tracking-[-0.02em] text-white">
            {p.titulo}
          </h2>
          <p className="text-[13px] md:text-sm text-white/90 mt-2.5 leading-relaxed">{p.desc}</p>

          {locked ? (
            modoDesbloquear ? (
              <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white">
                Desbloquear este curso
                <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-ink group-hover:translate-x-0.5">
                  <ArrowUpRight size={15} strokeWidth={2.25} />
                </span>
              </span>
            ) : (
              <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white/85">
                <Lock size={15} /> Disponível em breve
              </span>
            )
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
  };

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

      {/* Dois caminhos — mesmo contentor do hero (max-w-[1400px] + px-4/px-10) p/ alinhar à esquerda */}
      <section className="px-4 md:px-10 pt-8 md:pt-12 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          {/* Cursos principais */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
            {PRODUTOS.filter((p) => !MINI_CURSOS.includes(p.key) && !MENTORIA.includes(p.key)).map((p, i) => renderCard(p, i))}
          </div>

          {/* Mini-cursos */}
          <div className="mt-14 mb-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-ink/50">Mini-cursos</p>
            <div className="h-px bg-[var(--color-border)] mt-2.5" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 md:gap-5">
            {PRODUTOS.filter((p) => MINI_CURSOS.includes(p.key)).map((p, i) => renderCard(p, i))}
          </div>

          {/* Mentoria */}
          <div className="mt-14 mb-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-ink/50">Mentoria</p>
            <div className="h-px bg-[var(--color-border)] mt-2.5" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 md:gap-5">
            {PRODUTOS.filter((p) => MENTORIA.includes(p.key)).map((p, i) => renderCard(p, i))}
          </div>
        </div>
      </section>

      {desbloquearOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setDesbloquearOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl p-6 md:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDesbloquearOpen(false)}
              className="absolute top-4 right-4 text-ink/35 hover:text-ink transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-4">
              <Lock size={22} />
            </div>
            <h2 className="font-serif text-xl text-ink mb-2">Queres desbloquear este curso?</h2>
            <p className="text-sm text-ink/60 leading-relaxed mb-6">
              Este curso faz parte do método completo. Para teres acesso, entra em contacto com a
              <b> Cátia Creator</b> — ela ajuda-te a escolher o melhor caminho para ti.
            </p>
            <a
              href={WHATSAPP_CATIA}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1FB855] transition-colors"
            >
              <MessageCircle size={18} /> Falar com a Cátia no WhatsApp
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
}
