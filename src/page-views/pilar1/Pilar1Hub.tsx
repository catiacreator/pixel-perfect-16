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

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-24">
        {/* Passo 1 — destaque hero */}
        <Link
          to="/doc-mestre"
          className="group relative overflow-hidden bg-terracotta rounded-2xl border border-terracotta shadow-[0_14px_36px_-18px_rgba(180,90,40,0.55)] px-6 md:px-8 py-7 md:py-8 mb-8 grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] gap-5 md:gap-8 items-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_-18px_rgba(180,90,40,0.65)] hover:bg-terracotta/95"
        >
          {/* Shine sweep on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-cream/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-700 ease-out"
          />

          <div className="font-display text-4xl md:text-5xl text-cream/30 tabular-nums tracking-tight leading-none transition-transform duration-300 group-hover:scale-110 group-hover:text-cream/50">
            I
          </div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] uppercase text-cream/80 font-medium mb-1.5">
              Etapa 1 · Comece agora por aqui
            </p>
            <h3 className="font-display text-xl md:text-2xl tracking-tight text-cream leading-snug mb-1.5">
              Vamos começar pelo seu{" "}
              <span className="italic font-normal text-cream" style={{ fontFamily: "var(--font-editorial)" }}>
                Documento Mestre
              </span>
            </h3>
            <p className="text-sm md:text-[15px] text-cream/75 leading-relaxed max-w-2xl">
              É a base de tudo. Em 5 minutos, defines o que vais criar — e a IA passa a falar a tua língua.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 bg-cream text-ink pl-5 pr-4 py-2.5 rounded-full text-sm font-medium shadow-[0_2px_6px_-2px_rgba(40,30,20,0.3)] transition-all duration-300 group-hover:bg-ink group-hover:text-cream group-hover:shadow-[0_6px_14px_-4px_rgba(40,30,20,0.5)]">
            Começar
            <ArrowUpRight size={15} strokeWidth={2.25} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>

        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-5">
          As etapas do Pilar 1
        </p>

        <div className="space-y-4">
          <EtapaCard
            icon={<GraduationCap size={18} />}
            label="Etapa 2 · Aprender"
            titulo="Domine as principais IAs para o seu negócio"
            descricao="Agora que sabe o que pesa, domine as ferramentas — cada aula já traz ideias de como automatizar as tarefas que mapeou."
            to="/metodo/pilar-1/aprenda-ia"
          />
          <EtapaCard
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
