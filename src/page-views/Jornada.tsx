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
  LayoutGrid,
  Wrench,
} from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";
import FluxoJornada from "@/components/FluxoJornada";

export default function Jornada() {
  const bloqueado = useBloqueadoParaAlunos();
  const { isBloqueado } = useBloqueios();
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-terracotta transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
      </div>

      <PillarHeader
        numeral="✦"
        icon={<Compass size={18} />}
        pilarLabel="A tua jornada"
        titulo="A tua jornada"
        tituloHighlight="passo a passo"
        subtitulo="Segue o fluxo — cada etapa alimenta a seguinte, até publicares."
        bg="linear-gradient(115deg, #405DE6 0%, #5851DB 20%, #833AB4 40%, #C13584 60%, #E1306C 75%, #F56040 88%, #FCAF45 100%)"
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-12">
        {/* Fluxo horizontal da jornada de conteúdo */}
        <FluxoJornada />

        {/* Secções "Consultoria de IA" e "Área da Saúde" removidas temporariamente
            (a pedido) — repor a partir do histórico git quando voltarmos a elas. */}
      </div>

      {/* Banner roxo · Criar com os Agentes */}
      <PillarHeader
        numeral="✦"
        icon={<Sparkles size={18} />}
        pilarLabel="Bónus"
        titulo="Criar com os"
        tituloHighlight="Agentes"
        subtitulo="Uma coleção de agentes de IA prontos a criar conteúdo por ti — bio, ganchos, carrosséis e muito mais."
        bg="linear-gradient(115deg, #4C1D95 0%, #6D28D9 40%, #833AB4 72%, #9E7FEC 100%)"
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20 md:pb-28">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Agentes Creator", sub: "Agentes de IA prontos a criar por ti.", to: "/agentes-creator", Icon: Sparkles },
            { label: "Formatos de Conteúdo", sub: "Séries, Reels, carrosséis e stories.", to: "/criacao-livre", Icon: LayoutGrid },
            { label: "Ferramentas Essenciais", sub: "Automação, Carousel Snap e Assistente.", to: "/ferramentas", Icon: Wrench },
          ].map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[#833AB4]"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg,#7C3AED,#C13584)" }}
              >
                <c.Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-lg text-ink">{c.label}</span>
                <span className="block text-sm text-ink/55">{c.sub}</span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-ink/30 transition-colors group-hover:text-[#833AB4]" />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
