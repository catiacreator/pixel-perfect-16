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
        <div className="relative overflow-hidden bg-gradient-to-br from-terracotta/15 via-cream-warm to-gold/15 rounded-2xl border border-terracotta/30 shadow-[0_10px_30px_-18px_rgba(180,90,40,0.35)] px-6 md:px-8 py-7 md:py-8 mb-8 grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] gap-5 md:gap-8 items-center">
          <div className="font-display text-4xl md:text-5xl text-terracotta/30 tabular-nums tracking-tight leading-none">
            I
          </div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta font-medium mb-1.5">
              Etapa 1 · Comece agora por aqui
            </p>
            <h3 className="font-display text-xl md:text-2xl tracking-tight text-ink leading-snug mb-1.5">
              Vamos começar pelo seu{" "}
              <span className="italic font-normal text-terracotta" style={{ fontFamily: "var(--font-editorial)" }}>
                Documento Mestre
              </span>
            </h3>
            <p className="text-sm md:text-[15px] text-ink/55 leading-relaxed max-w-2xl">
              É a base de tudo. Em 5 minutos, defines o que vais criar — e a IA passa a falar a tua língua.
            </p>
          </div>
          <Link
            to="/doc-mestre"
            className="group inline-flex items-center gap-2 bg-ink text-cream pl-5 pr-4 py-2.5 rounded-full text-sm font-medium hover:bg-forest transition-all shadow-[0_2px_6px_-2px_rgba(40,30,20,0.4)]"
          >
            Começar
            <ArrowUpRight size={15} strokeWidth={2.25} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

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
