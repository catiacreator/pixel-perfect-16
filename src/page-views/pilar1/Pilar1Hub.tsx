import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Hourglass, GraduationCap, Search, Trophy, ArrowUpRight } from "lucide-react";

export default function Pilar1Hub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo" backLabel="Voltar para Trilha" />
      <PillarHeader
        numeral="01"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Recuperar"
        tituloHighlight="o seu tempo"
        subtitulo="Porque sem tempo, não tem nada. Comece por organizar a sua rotina para criar com calma — não em pânico."
      />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pb-24">
        {/* Passo 1 — destaque hero */}
        <div className="border-t border-[var(--color-border)] py-10 md:py-14 grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
          <div className="font-display text-4xl md:text-5xl text-ink/20 tabular-nums tracking-tight leading-none pt-1 w-12 md:w-16">
            00
          </div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta font-medium mb-2">
              / Passo 1 · Comece agora por aqui
            </p>
            <h3 className="font-display text-3xl md:text-4xl tracking-tight text-ink leading-tight mb-3">
              Vamos começar pelo seu{" "}
              <span className="italic font-normal text-terracotta" style={{ fontFamily: "var(--font-editorial)" }}>
                Documento Mestre
              </span>
            </h3>
            <p className="text-sm md:text-[15px] text-ink/55 leading-relaxed max-w-xl mb-5">
              É a base de tudo. Em 5 minutos, defines o que vais criar — e a IA passa a falar a tua língua.
            </p>
            <Link
              to="/doc-mestre"
              className="group inline-flex items-center gap-2 bg-ink text-cream pl-5 pr-2 py-2 rounded-full text-sm font-medium hover:bg-forest transition-all"
            >
              Começar Documento Mestre
              <span className="w-8 h-8 rounded-full bg-cream text-ink flex items-center justify-center">
                <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>
          <div className="hidden md:block pt-2 text-[11px] tracking-[0.2em] uppercase text-ink/35">
            5 min
          </div>
        </div>

        {/* Etapas */}
        <div className="mt-4">
          <EtapaCard
            numero="02"
            icon={<GraduationCap size={18} />}
            label="Etapa 2 · Aprender"
            titulo="Domine as principais IAs para o seu negócio"
            descricao="Agora que sabe o que pesa, domine as ferramentas — cada aula já traz ideias de como automatizar as tarefas que mapeou."
            to="/metodo/pilar-1/aprenda-ia"
          />
          <EtapaCard
            numero="03"
            icon={<Search size={18} />}
            label="Etapa 3 · Descobrir"
            titulo="Detetive do Tempo"
            descricao="Mapeie as suas tarefas e veja, em euros, quanto cada uma está a custar — antes de automatizar seja o que for."
            to="/metodo/pilar-1/detetive-do-tempo"
            subLinks={[
              { label: "Mapeamento de Tarefas", to: "/metodo/pilar-1/detetive-do-tempo" },
              { label: "Relatório", to: "/metodo/pilar-1/detetive-do-tempo/relatorio" },
            ]}
          />
          <EtapaCard
            numero="04"
            icon={<Trophy size={18} />}
            label="Etapa 4 · Fechar"
            titulo="Revise e celebre"
            descricao="Veja tudo o que construiu neste Pilar — e o que segue a seguir."
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
