import { Link, useParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { Wrench, ArrowLeft, ArrowRight } from "lucide-react";
import { CRIAR_PRODUTO_AULAS } from "@/data/pilar3";

export default function CriarProdutoAula() {
  const { aula } = useParams<{ aula: string }>();
  const a = aula ? CRIAR_PRODUTO_AULAS[aula] : undefined;

  if (!a) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl text-ink mb-3">Aula não encontrada</h1>
          <Link to="/metodo/pilar-3/criar-produto" className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold">
            <ArrowLeft size={14} /> Voltar a Criar o produto
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3/criar-produto" backLabel="Voltar a Criar o produto" />
      <PillarHeader numeral="03" icon={<Wrench size={18} />} pilarLabel={`Aula ${a.n} de 3`} titulo={a.nome} subtitulo={a.desc} />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        {a.status === "breve" ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted">Aula em breve.</div>
        ) : (
          <VideoPlaceholder />
        )}

        <div className="flex items-center justify-between gap-3 mt-8">
          {a.prev ? (
            <Link to={`/metodo/pilar-3/criar-produto/${a.prev}`} className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta">
              <ArrowLeft size={14} /> {CRIAR_PRODUTO_AULAS[a.prev].nome}
            </Link>
          ) : <span />}
          {a.next && (
            <Link to={`/metodo/pilar-3/criar-produto/${a.next}`} className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
              {CRIAR_PRODUTO_AULAS[a.next].nome} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
