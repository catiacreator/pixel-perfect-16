import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Lightbulb, Search, Compass, Wrench, CircleDot, FileText, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { ETAPAS } from "@/data/pilar3";

const ICON: Record<string, ReactNode> = {
  descobrir: <Search size={18} />,
  "como-entregar": <Compass size={18} />,
  "criar-produto": <Wrench size={18} />,
  "validar-produto": <CircleDot size={18} />,
  "pagina-vendas": <FileText size={18} />,
  conclusao: <Trophy size={18} />,
};
const NUMERAL = ["I", "II", "III", "IV", "V", "VI"];

export default function Pilar3Hub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo" backLabel="Voltar para Jornada" />
      <PillarHeader
        numeral="03"
        icon={<Lightbulb size={18} />}
        pilarLabel="Pilar 3"
        titulo="Criar Soluções Digitais"
        tituloHighlight="que valem dinheiro"
        subtitulo="Transforme o seu método num produto digital real — pra si e pros outros."
      />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-24">
        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-5">
          As etapas do Pilar 3
        </p>
        <div className="space-y-4">
          {ETAPAS.map((e, i) => (
            <EtapaCard
              key={e.slug}
              numero={NUMERAL[i]}
              icon={ICON[e.slug]}
              label={`Etapa ${e.num} · ${e.tipo}`}
              titulo={e.titulo}
              descricao={e.sub}
              to={`/metodo/pilar-3/${e.slug}`}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
