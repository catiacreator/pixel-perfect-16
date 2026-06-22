import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Hourglass, FileText, GraduationCap, Search, Trophy } from "lucide-react";

export default function Pilar1Hub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo" backLabel="Voltar para Trilha" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Pilar 1 — Recuperar seu Tempo"
        subtitulo="porque sem tempo, não tem nada"
      />
      <div className="px-5 md:px-10 pb-16 max-w-2xl space-y-4">
        <EtapaCard
          icon={<FileText size={18} />}
          label="Passo 1 · Comece agora por aqui"
          titulo="Vamos começar por seu Documento Mestre"
          descricao="Começa pelo Documento Mestre."
          to="/doc-mestre"
        />
        <EtapaCard
          icon={<GraduationCap size={18} />}
          label="Etapa 2 · Aprender"
          titulo="Domine as Principais IAs para seu Negócio"
          descricao="Agora que você sabe o que pesa, domine as ferramentas — cada aula já traz ideias de como automatizar as tarefas que você mapeou."
          to="/metodo/pilar-1/aprenda-ia"
        />
        <EtapaCard
          icon={<Search size={18} />}
          label="Etapa 3 · Descobrir"
          titulo="Detetive do Tempo"
          descricao="Mapeie suas tarefas e veja em reais quanto cada uma está custando — antes de automatizar qualquer coisa."
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
          descricao="Veja tudo que você construiu."
          to="/metodo/pilar-1/conclusao"
          subLinks={[
            { label: "Revisar Documento Mestre", to: "/doc-mestre" },
            { label: "Checklist Pilar 1", to: "/metodo/pilar-1/conclusao" },
          ]}
        />
      </div>
    </Layout>
  );
}
