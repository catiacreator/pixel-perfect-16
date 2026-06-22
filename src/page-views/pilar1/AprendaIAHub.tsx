import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import ProgressBar from "../../components/ProgressBar";
import { Hourglass, ArrowRight } from "lucide-react";
import { TOOLS, flatAulas } from "../../lib/curriculum";

export default function AprendaIAHub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Domine as Principais IAs para seu Negócio"
        subtitulo="Escolha a IA que você quer aprender. Cada card abre uma trilha com aulas, prompts e exemplos práticos."
      />
      <div className="px-5 md:px-10 pb-10 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {TOOLS.map((tool) => {
            const total = flatAulas(tool).length;
            return (
              <Link
                key={tool.slug}
                to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                className="rounded-2xl border border-border bg-white p-5 hover:border-terracotta transition-colors"
              >
                <h3 className="font-serif text-lg text-ink mb-3">{tool.nome}</h3>
                <ProgressBar done={0} total={total} />
              </Link>
            );
          })}
        </div>
        <Link
          to="/metodo/pilar-1/detetive-do-tempo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
        >
          Próximo passo: Detetive do Tempo <ArrowRight size={15} />
        </Link>
      </div>
    </Layout>
  );
}
