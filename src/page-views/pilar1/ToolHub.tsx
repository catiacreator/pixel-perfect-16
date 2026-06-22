import { Link, useParams, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import ProgressBar from "../../components/ProgressBar";
import { Hourglass, ArrowLeft, PlayCircle, ChevronRight } from "lucide-react";
import { getTool, flatAulas } from "../../lib/curriculum";

export default function ToolHub() {
  const { tool: toolSlug } = useParams();
  const tool = getTool(toolSlug || "");
  if (!tool) return <Navigate to="/metodo/pilar-1/aprenda-ia" replace />;

  const total = flatAulas(tool).length;

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1/aprenda-ia" backLabel="Voltar para Domine as IAs" />
      <PillarHeader numeral="I" icon={<Hourglass size={18} />} pilarLabel="Pilar 1" titulo={tool.nome} />
      <div className="px-5 md:px-10 pb-16 max-w-2xl">
        <div className="mb-6">
          <ProgressBar done={0} total={total} />
        </div>
        {tool.modulos.map((modulo, mi) => (
          <div key={modulo.titulo} className="mb-6">
            <h2 className="font-serif text-lg text-ink mb-1">
              Módulo {mi + 1}: {modulo.titulo}
            </h2>
            <p className="text-xs text-muted mb-3">{modulo.aulas.length} aula{modulo.aulas.length > 1 ? "s" : ""}</p>
            <div className="rounded-2xl border border-border bg-white divide-y divide-border">
              {modulo.aulas.map((aula) => (
                <Link
                  key={aula.slug}
                  to={`/metodo/pilar-1/aprenda-ia/${tool.slug}/${aula.slug}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-cream"
                >
                  <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <PlayCircle size={15} className="text-terracotta" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted">Aula {aula.numero}</p>
                    <p className="text-sm text-ink">{aula.titulo}</p>
                  </div>
                  <ChevronRight size={15} className="text-muted flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link to="/metodo/pilar-1/aprenda-ia" className="inline-flex items-center gap-1.5 text-sm text-muted mt-4">
          <ArrowLeft size={14} /> Voltar para Domine as IAs
        </Link>
      </div>
    </Layout>
  );
}
