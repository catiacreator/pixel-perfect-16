import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import {
  ArrowUpRight,
  ArrowLeft,
  Compass,
  Hourglass,
  Crown,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Sparkles,
  HeartPulse,
  Instagram,
  Lock,
} from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";

const PILARES = [
  {
    n: "01",
    icon: Hourglass,
    titulo: "Crie com Leveza sem roubar o seu tempo",
    sub: "Organize a sua rotina para criar com calma, não em pânico.",
    to: "/metodo/pilar-1",
    status: "disponivel" as const,
    minutos: "6 etapas",
    estruturaId: "pilar-1",
  },
  {
    n: "02",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "Mostre o que sabe às pessoas certas.",
    to: "/metodo/pilar-2",
    status: "disponivel" as const,
    minutos: "9 etapas",
    estruturaId: "pilar-2",
  },
  {
    n: "03",
    icon: Lightbulb,
    titulo: "Criar Soluções Digitais",
    sub: "Transforme o que sabe em produtos digitais que valem dinheiro.",
    to: "/metodo/pilar-3",
    status: "disponivel" as const,
    minutos: "6 etapas",
    estruturaId: "pilar-3",
  },
  {
    n: "04",
    icon: TrendingUp,
    titulo: "Aprender a vender",
    sub: "Venda no digital com método, sem forçar.",
    to: "/metodo/pilar-4",
    status: "disponivel" as const,
    minutos: "9 etapas",
    estruturaId: "pilar-4",
  },
];

export default function Jornada() {
  const bloqueado = useBloqueadoParaAlunos();
  const { isBloqueado } = useBloqueios();
  const pilarLocked = (p: { estruturaId?: string }) => !!p.estruturaId && isBloqueado(p.estruturaId) && bloqueado;
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-6 flex items-center justify-between gap-3">
        <Link
          to="/protocolo"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-terracotta transition-colors"
        >
          <ArrowLeft size={16} /> Voltar à Leveza no Digital
        </Link>
        {bloqueado && isBloqueado("redes") ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 text-ink/40 border border-border px-4 py-2 text-sm font-semibold cursor-not-allowed">
            <Lock size={14} /> Conteúdo Todo Dia · em breve
          </span>
        ) : (
          <Link
            to="/metodo/pilar-2/redes-sociais"
            className="group inline-flex items-center gap-2 rounded-full bg-terracotta text-cream pl-4 pr-1.5 py-1.5 text-sm font-semibold hover:bg-terracotta-dark transition-colors"
          >
            <Instagram size={15} /> Conteúdo Todo Dia
            <span className="w-7 h-7 rounded-full bg-cream/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        )}
      </div>

      <PillarHeader
        numeral="✦"
        icon={<Compass size={18} />}
        pilarLabel="O Teu Método"
        titulo="O Teu Método"
        tituloHighlight="passo a passo"
        subtitulo="Os 4 pilares do método — do tempo recuperado à venda."
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20 md:pb-28">
        <div className="flex justify-end mb-6">
          <p className="text-xs text-ink/40">
            {PILARES.filter((p) => p.status === "disponivel" && !pilarLocked(p)).length} de {PILARES.length} pilares disponíveis
          </p>
        </div>

        {/* Pilares */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {PILARES.map((p) => {
            const Icon = p.icon;
            const locked = pilarLocked(p);
            const disponivel = p.status === "disponivel" && !locked;
            const Wrapper: any = disponivel ? Link : "div";
            const props = disponivel ? { to: p.to } : {};
            return (
              <Wrapper
                key={p.n}
                {...props}
                className={`group relative overflow-hidden rounded-3xl border p-6 md:p-7 transition-all duration-300 ease-out ${
                  disponivel
                    ? "bg-white border-[var(--color-border)] hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45 cursor-pointer"
                    : "bg-cream-warm/40 border-dashed border-[var(--color-border)]"
                }`}
              >
                <span
                  className={`pointer-events-none absolute -top-5 right-2 font-display font-bold text-[110px] leading-none tracking-tighter tabular-nums transition-colors ${
                    disponivel ? "text-terracotta/10 group-hover:text-terracotta/20" : "text-ink/[0.04]"
                  }`}
                >
                  {p.n}
                </span>

                <div className="relative mb-6">
                  <span
                    className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      disponivel
                        ? "bg-terracotta text-cream shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)]"
                        : "bg-ink/5 text-ink/30"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                </div>

                <h3
                  className={`relative font-display text-2xl md:text-[1.7rem] leading-[1.1] tracking-[-0.02em] ${
                    disponivel ? "text-ink" : "text-ink/50"
                  }`}
                >
                  {p.titulo}
                </h3>
                <p
                  className={`relative text-sm mt-2.5 leading-relaxed max-w-md ${
                    disponivel ? "text-ink/55" : "text-ink/40"
                  }`}
                >
                  {p.sub}
                </p>

                <div className="relative mt-6 flex items-center justify-between gap-3">
                  {disponivel ? (
                    <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-terracotta">
                      Começar
                      <span className="w-9 h-9 rounded-full border border-terracotta/30 flex items-center justify-center transition-all duration-300 group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta group-hover:translate-x-0.5">
                        <ArrowUpRight size={15} strokeWidth={2.25} />
                      </span>
                    </span>
                  ) : locked ? (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink/45">
                      <Lock size={15} /> Em breve
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full ${
                      disponivel ? "bg-terracotta/10 text-terracotta" : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    {locked ? "Bloqueado" : p.minutos}
                  </span>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Caminho especial — Consultoria */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-ink to-terracotta-dark border border-white/10 p-8 md:p-14 mt-5 md:mt-6">
          <div className="pointer-events-none absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_60%)] opacity-25 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={14} className="text-gold" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Caminho especial</p>
              </div>
              <h3 className="font-display text-3xl md:text-6xl text-cream tracking-[-0.025em] max-w-xl leading-[1.02]">
                Consultoria de
                <br />
                <span className="italic font-normal text-gold">Inteligência Artificial</span>
              </h3>
              <p className="text-sm md:text-base text-cream/70 mt-6 max-w-lg leading-relaxed">
                Para quem quer transformar Inteligência Artificial em serviço premium. Atenda clientes,
                cobre mais, entregue resultados.
              </p>
            </div>
            {bloqueado && isBloqueado("consultoria") ? (
              <span className="inline-flex items-center gap-2 bg-white/10 text-cream/60 border border-white/25 px-5 py-2.5 rounded-full text-sm font-semibold cursor-not-allowed shrink-0">
                <Lock size={14} /> Em breve
              </span>
            ) : (
              <Link
                to="/metodo/consultoria-ia"
                className="group inline-flex items-center gap-2.5 bg-cream text-ink pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all shrink-0"
              >
                <Briefcase size={14} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 rounded-full bg-ink text-cream flex items-center justify-center">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Caminho por segmento — Saúde */}
        <div className="relative overflow-hidden rounded-[28px] bg-white border border-[var(--color-border)] p-8 md:p-12 mt-5 md:mt-6">
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse size={14} className="text-terracotta" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta">Caminho por segmento</p>
              </div>
              <h3 className="font-display text-3xl md:text-5xl text-ink tracking-[-0.025em] max-w-xl leading-[1.05]">
                Área da <span className="italic font-normal text-terracotta">Saúde</span>
              </h3>
              <p className="text-sm md:text-base text-ink/60 mt-5 max-w-lg leading-relaxed">
                Trilha pensada para médicas, dentistas, nutricionistas, fisioterapeutas e psicólogas —
                aplicar Inteligência Artificial com ética e resultado na sua prática.
              </p>
            </div>
            {bloqueado && isBloqueado("saude") ? (
              <span className="inline-flex items-center gap-2 bg-ink/5 text-ink/40 border border-border px-5 py-2.5 rounded-full text-sm font-semibold cursor-not-allowed shrink-0">
                <Lock size={14} /> Em breve
              </span>
            ) : (
              <Link
                to="/metodo/saude"
                className="group inline-flex items-center gap-2.5 bg-terracotta text-cream pl-6 pr-2 py-2 rounded-full text-sm font-semibold hover:bg-terracotta-dark transition-all shrink-0"
              >
                <HeartPulse size={14} strokeWidth={2.25} />
                Conhecer
                <span className="w-9 h-9 rounded-full bg-cream text-terracotta flex items-center justify-center">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
