import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
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
      />
      <div className="px-5 md:px-10 pb-16 max-w-2xl mx-auto">
        <p className="text-sm text-muted mb-5">
          Escolha a IA que você quer aprender. Cada card abre uma trilha com aulas, prompts e exemplos práticos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {TOOLS.map((tool) => {
            const total = flatAulas(tool).length;
            return (
              <Link
                key={tool.slug}
                to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                className="rounded-2xl border border-border bg-white shadow-sm p-4 aspect-[3/4] flex flex-col justify-end hover:border-terracotta transition-colors"
              >
                <h3 className="font-serif text-lg text-ink mb-2">{tool.nome}</h3>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>0% visto</span>
                  <span>0/{total}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Link
            to="/metodo/pilar-1/detetive-do-tempo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-border text-terracotta text-sm font-semibold shadow-sm"
          >
            Próximo passo: Detetive do Tempo <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
