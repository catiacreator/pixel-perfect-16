import { useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  Sparkles,
  TrendingUp,
  Zap,
  MessageCircle,
  ArrowRight,
  Instagram,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";

/**
 * Vitrine — página-hub pública da Cátia Creator.
 * Dark com fundo em grelha (como pedido) + versão light a combinar (toggle no canto).
 * Fotos: coloque /catia-avatar.jpg e /catia-sobre.jpg em /public para substituir os
 * placeholders em gradiente.
 */

type Card = {
  n: number;
  title: string;
  sub: string;
  pill: string | null;
  accent: string;
  icon: typeof Sparkles;
  to: string;
};

const CARDS: Card[] = [
  { n: 1, title: "Workshop Conteúdo com IA", sub: "Em destaque", pill: "Mais recente", accent: "#ec4899", icon: Sparkles, to: "#" },
  { n: 2, title: "Destrava o teu perfil", sub: "30 dias", pill: "Diagnóstico completo", accent: "#f97316", icon: TrendingUp, to: "#" },
  { n: 3, title: "Mentoria Leveza no Digital", sub: "Quero ser avisado/a quando começar", pill: "Brevemente · Lista de espera", accent: "#eab308", icon: Zap, to: "/protocolo" },
  { n: 4, title: "Fala comigo!", sub: "Serviços", pill: null, accent: "#a855f7", icon: MessageCircle, to: "#" },
];

const GRAD = "linear-gradient(95deg, #ec4899 0%, #f97316 55%, #f59e0b 100%)";

export default function Vitrine() {
  const [dark, setDark] = useState(true);

  const c = dark
    ? {
        page: "#0b0716",
        glow: "radial-gradient(120% 75% at 50% -5%, rgba(138,58,138,0.38) 0%, rgba(80,30,90,0.12) 38%, transparent 62%)",
        grid: "rgba(255,255,255,0.045)",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.62)",
        cardBg: "#161027",
        cardBorder: "rgba(255,255,255,0.09)",
        cardBgHover: "#1d1533",
        divider: "rgba(255,255,255,0.08)",
        btnGhostBorder: "rgba(255,255,255,0.16)",
        btnGhostText: "#ffffff",
        placeholder: "linear-gradient(135deg, #2a1840, #3a1e46)",
      }
    : {
        page: "#f5f1fb",
        glow: "radial-gradient(120% 75% at 50% -5%, rgba(249,115,22,0.16) 0%, rgba(236,72,153,0.12) 34%, transparent 60%)",
        grid: "rgba(30,20,60,0.05)",
        text: "#1a1230",
        muted: "rgba(26,18,48,0.60)",
        cardBg: "#ffffff",
        cardBorder: "rgba(26,18,48,0.09)",
        cardBgHover: "#ffffff",
        divider: "rgba(26,18,48,0.08)",
        btnGhostBorder: "rgba(26,18,48,0.16)",
        btnGhostText: "#1a1230",
        placeholder: "linear-gradient(135deg, #f6d5e6, #fde3c8)",
      };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-display"
      style={{
        color: c.text,
        backgroundColor: c.page,
        backgroundImage: `linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px)`,
        backgroundSize: "46px 46px, 46px 46px",
      }}
    >
      {/* Brilho superior */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px]" style={{ background: c.glow }} />

      {/* Toggle dark/light */}
      <button
        onClick={() => setDark((v) => !v)}
        className="fixed top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        style={{ border: `1px solid ${c.btnGhostBorder}`, color: c.text, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)" }}
        aria-label={dark ? "Mudar para claro" : "Mudar para escuro"}
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <header className="max-w-[560px] mx-auto px-6 pt-20 md:pt-24 text-center">
          <div className="relative inline-block">
            <div
              className="w-[150px] h-[150px] rounded-full p-[3px] mx-auto"
              style={{ background: GRAD, boxShadow: dark ? "0 0 60px -12px rgba(236,72,153,0.5)" : "0 18px 50px -20px rgba(236,72,153,0.5)" }}
            >
              <div
                className="w-full h-full rounded-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url(/catia-avatar.jpg)", background: `url(/catia-avatar.jpg) center/cover, ${c.placeholder}` }}
              >
                <span className="font-serif text-4xl" style={{ color: dark ? "rgba(255,255,255,0.85)" : "#7a1e52" }}>C</span>
              </div>
            </div>
          </div>

          <h1
            className="mt-8 text-5xl md:text-6xl font-extrabold tracking-tight leading-none"
            style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
          >
            Cátia Creator
          </h1>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed" style={{ color: c.muted }}>
            Descomplico a IA para criadores e empreendedores crescerem no Instagram com estratégia — não com sorte.
          </p>
        </header>

        {/* ─── Cards ─── */}
        <section className="max-w-[560px] mx-auto px-6 mt-14 flex flex-col gap-5">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const Wrapper: any = card.to.startsWith("/") ? Link : "a";
            return (
              <Wrapper
                key={card.n}
                {...(card.to.startsWith("/") ? { to: card.to } : { href: card.to })}
                className="group block rounded-[26px] p-6 md:p-7 transition-all duration-300"
                style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
                onMouseEnter={(e: any) => (e.currentTarget.style.background = c.cardBgHover)}
                onMouseLeave={(e: any) => (e.currentTarget.style.background = c.cardBg)}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ background: card.n === 4 ? (dark ? "rgba(255,255,255,0.12)" : "rgba(26,18,48,0.85)") : card.accent, boxShadow: `0 10px 26px -10px ${card.accent}` }}
                  >
                    {card.n}
                  </span>
                  <Icon size={20} style={{ color: card.accent }} />
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-tight" style={{ color: c.text }}>
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm" style={{ color: c.muted }}>
                  {card.sub}
                </p>

                <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${c.divider}` }}>
                  {card.pill ? (
                    <span
                      className="text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                      style={{ color: card.accent, background: `${card.accent}1f`, border: `1px solid ${card.accent}55` }}
                    >
                      {card.pill}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                    style={{ color: c.muted }}
                  >
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Wrapper>
            );
          })}
        </section>

        {/* ─── Sobre ─── */}
        <section className="max-w-[1040px] mx-auto px-6 pt-28 md:pt-36">
          <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "#ec4899" }}>
            Sobre
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10" style={{ color: c.text }}>
            Sobre a{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Cátia</span>
          </h2>

          <div className="grid md:grid-cols-[1fr_360px] gap-10 md:gap-14 items-start">
            <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: c.muted }}>
              <p className="font-bold text-lg" style={{ color: c.text }}>
                Cátia Creator · Especialista em IA para Criadores
              </p>
              <p>
                A Cátia ensina empreendedores e criadores de conteúdo a dominarem as ferramentas de inteligência artificial
                e a transformá-las em <b style={{ color: c.text }}>resultados reais nas redes sociais</b>.
              </p>
              <p>
                UX/UI Designer com uma credencial do <b style={{ color: c.text }}>MIT em IA</b> e um percurso comprovado de
                crescimento orgânico, construiu uma comunidade sólida no Instagram em apenas 14 meses, sem publicidade paga,
                e ensina um método prático e acessível para quem quer criar mais, melhor e mais depressa.
              </p>
              <p>
                O seu foco é claro: <b style={{ color: c.text }}>descomplicar a IA</b>. Da pesquisa à publicação, mostra como
                usar ferramentas como Claude, ChatGPT, Grok, NotebookLM e outras para produzir conteúdo que se destaca,
                gera engagement e converte.
              </p>
              <p>
                Através dos seus produtos digitais, workshops e formações, a Cátia já ajudou centenas de criadores em
                Portugal e no Brasil a posicionarem-se com autoridade e a escalarem a sua presença online{" "}
                <b style={{ color: c.text }}>com estratégia, não com sorte</b>.
              </p>
            </div>

            <div
              className="rounded-[26px] p-[3px] w-full aspect-[3/4] md:sticky md:top-10"
              style={{ background: GRAD, boxShadow: dark ? "0 30px 80px -30px rgba(168,85,247,0.5)" : "0 30px 70px -30px rgba(236,72,153,0.35)" }}
            >
              <div
                className="w-full h-full rounded-[23px] bg-cover bg-center"
                style={{ background: `url(/catia-sobre.jpg) center/cover, ${c.placeholder}` }}
              />
            </div>
          </div>

          {/* Botões sociais */}
          <div className="flex flex-wrap justify-center gap-3 pt-16 pb-24">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: GRAD, boxShadow: "0 16px 40px -16px rgba(236,72,153,0.6)" }}
            >
              <Instagram size={17} /> Segue no Instagram
            </a>
            <a
              href="https://substack.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors"
              style={{ border: `1px solid ${c.btnGhostBorder}`, color: c.btnGhostText }}
            >
              <BookOpen size={17} /> Lê no Substack
            </a>
          </div>
        </section>

        {/* ─── Barra de suporte ─── */}
        <div className="w-full" style={{ background: GRAD }}>
          <div className="max-w-[1040px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-2xl md:text-3xl font-extrabold text-white">Precisa de ajuda?</p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#c2410c] font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              <MessageCircle size={17} /> Suporte WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
