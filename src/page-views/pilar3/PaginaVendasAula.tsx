import { Link, useParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { FileText, Bot, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PAGINA_VENDAS_AULAS } from "@/data/pilar3";

export default function PaginaVendasAula() {
  const { aula } = useParams<{ aula: string }>();
  const a = aula ? PAGINA_VENDAS_AULAS[aula] : undefined;

  if (!a) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl text-ink mb-3">Aula não encontrada</h1>
          <Link to="/metodo/pilar-3/pagina-vendas" className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold">
            <ArrowLeft size={14} /> Voltar a Página de vendas
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3/pagina-vendas" backLabel="Voltar a Página de vendas" />
      <PillarHeader numeral="05" icon={<FileText size={18} />} pilarLabel={`Aula ${a.n} de 3`} titulo={a.nome} subtitulo={a.desc} />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <VideoPlaceholder />

        {(a.agente || a.cta) && (
          <div className="rounded-2xl border border-terracotta bg-white p-5 md:p-6 mt-6">
            {a.agente && (
              <div className="flex items-start gap-3 mb-4">
                <Bot size={18} className="text-terracotta shrink-0 mt-0.5" />
                <p className="text-sm text-ink/75 leading-relaxed"><strong className="text-ink">{a.agente}</strong></p>
              </div>
            )}
            {a.cta && (
              <a href={a.cta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
                {a.cta.label} <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-8">
          {a.prev ? (
            <Link to={`/metodo/pilar-3/pagina-vendas/${a.prev}`} className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta">
              <ArrowLeft size={14} /> {PAGINA_VENDAS_AULAS[a.prev].nome}
            </Link>
          ) : <span />}
          {a.next && (
            <Link to={`/metodo/pilar-3/pagina-vendas/${a.next}`} className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
              {PAGINA_VENDAS_AULAS[a.next].nome} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
