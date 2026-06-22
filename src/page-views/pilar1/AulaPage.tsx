import { Link, useParams, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getAula, flatAulas } from "../../lib/curriculum";

export default function AulaPage() {
  const { tool: toolSlug, lessonSlug } = useParams();
  const found = getAula(toolSlug || "", lessonSlug || "");
  if (!found) return <Navigate to="/metodo/pilar-1/aprenda-ia" replace />;

  const { tool, aula } = found;
  const all = flatAulas(tool);
  const idx = all.findIndex((a) => a.slug === aula.slug);
  const anterior = idx > 0 ? all[idx - 1] : null;
  const seguinte = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo={`/metodo/pilar-1/aprenda-ia/${tool.slug}`} backLabel={`Voltar para ${tool.nome}`} />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
          {tool.nome} · Aula {aula.numero}
        </p>
        <h1 className="font-serif text-3xl text-ink mb-3">{aula.titulo}</h1>
        <p className="text-muted leading-relaxed mb-6">{aula.resumo}</p>

        <VideoPlaceholder />

        <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-full bg-ink text-cream py-3 text-sm font-semibold">
          <Check size={15} /> Marcar como concluída
        </button>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          {anterior ? (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${tool.slug}/${anterior.slug}`}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft size={14} /> {anterior.titulo}
            </Link>
          ) : <span />}
          {seguinte ? (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${tool.slug}/${seguinte.slug}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-terracotta"
            >
              {seguinte.titulo} <ArrowRight size={14} />
            </Link>
          ) : <span />}
        </div>
      </div>
    </Layout>
  );
}
