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
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20 md:pb-28">
        {/* Fluxo horizontal da jornada de conteúdo */}
        <FluxoJornada />

        {/* Secções "Consultoria de IA" e "Área da Saúde" removidas temporariamente
            (a pedido) — repor a partir do histórico git quando voltarmos a elas. */}
      </div>
    </Layout>
  );
}
