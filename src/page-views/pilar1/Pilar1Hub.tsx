import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Hourglass, GraduationCap, Search, Trophy, ArrowRight } from "lucide-react";

export default function Pilar1Hub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo" backLabel="Voltar para Trilha" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="PILAR 1 —"
        tituloHighlight="RECUPERAR SEU TEMPO"
        subtitulo="porque sem tempo, não tem nada"
      />
      <div className="px-5 md:px-10 pb-16 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-terracotta bg-white p-5 mb-8">
          <p className="text-[11px] tracking-[0.22em] uppercase text-terracotta mb-2">Passo 1 · Comece agora por aqui</p>
          <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug mb-1">Vamos começar por seu</h3>
          <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug mb-4">Documento Mestre</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/doc-mestre"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-ink text-ink text-sm font-semibold shadow-sm"
            >
              Comece por aqui <ArrowRight size={14} />
            </Link>
            <span className="text-xs text-muted">Começa pelo Documento Mestre</span>
          </div>
        </div>

        <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-3">As etapas do Pilar 1</p>

        <div className="space-y-4">
          <EtapaCard
            icon={<GraduationCap size={18} />}
            label="Etapa 2 · Aprender"
            titulo="Domine as Principais IAs para seu Negócio"
            descricao="Agora que você sabe o que pesa, domine as ferramentas — cada aula já traz ideias de como automatizar as tarefas que você mapeou"
            to="/metodo/pilar-1/aprenda-ia"
          />
          <EtapaCard
            icon={<Search size={18} />}
            label="Etapa 3 · Descobrir"
            titulo="Detetive do Tempo"
            descricao="Mapeie suas tarefas e veja em reais quanto cada uma está custando — antes de automatizar qualquer coisa"
            to="/metodo/pilar-1/detetive-do-tempo"
            subLinks={[
              { label: "Mapeamento de Tarefas", to: "/metodo/pilar-1/detetive-do-tempo" },
              { label: "Relatório", to: "/metodo/pilar-1/detetive-do-tempo/relatorio" },
            ]}
          />
          <EtapaCard
            icon={<Trophy size={18} />}
            label="Etapa 4 · Fechar"
            titulo="Revise e celebre"
            descricao="Veja tudo que você construiu"
            to="/metodo/pilar-1/conclusao"
            subLinks={[
              { label: "Revisar Documento Mestre", to: "/doc-mestre" },
              { label: "Checklist Pilar 1", to: "/metodo/pilar-1/conclusao" },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}
