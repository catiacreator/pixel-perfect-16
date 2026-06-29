import { Link, useParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import PromptCard from "../../components/PromptCard";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";
import { FORMATOS_ENTREGA } from "@/data/pilar3";

export default function FormatoEntrega() {
  const { formato } = useParams<{ formato: string }>();
  const f = formato ? FORMATOS_ENTREGA[formato] : undefined;

  if (!f) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl text-ink mb-3">Formato não encontrado</h1>
          <Link to="/metodo/pilar-3/como-entregar" className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold">
            <ArrowLeft size={14} /> Voltar a Como entregar
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3/como-entregar" backLabel="Voltar a Como entregar" />
      <PillarHeader numeral="02" icon={<Package size={18} />} pilarLabel="Etapa 2 · Entrega" titulo={f.nome} subtitulo={f.intro} />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <p className="text-xs tracking-[0.2em] uppercase text-muted mb-3">Aula em breve · prompt disponível</p>
        <PromptCard titulo={`Estruturar a sua ${f.nome}`} descricao={f.intro} prompt={f.prompt} rotuloBotao="Copiar prompt" />

        <div className="flex items-center justify-between gap-3 mt-8">
          {f.prev ? (
            <Link to={`/metodo/pilar-3/como-entregar/${f.prev}`} className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta">
              <ArrowLeft size={14} /> {FORMATOS_ENTREGA[f.prev].nome}
            </Link>
          ) : <span />}
          {f.next && (
            <Link to={`/metodo/pilar-3/como-entregar/${f.next}`} className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
              {FORMATOS_ENTREGA[f.next].nome} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
