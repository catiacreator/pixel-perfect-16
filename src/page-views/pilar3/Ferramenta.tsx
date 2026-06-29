import { Link, useParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Bot, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { FERRAMENTAS } from "@/data/pilar3";

export default function Ferramenta() {
  const { slug } = useParams<{ slug: string }>();
  const f = slug ? FERRAMENTAS[slug] : undefined;

  if (!f) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl text-ink mb-3">Ferramenta não encontrada</h1>
          <Link to="/metodo/pilar-3/descobrir" className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold">
            <ArrowLeft size={14} /> Voltar a Descobrir
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3/descobrir" backLabel="Voltar a Descobrir" />
      <PillarHeader numeral="01" icon={<Bot size={18} />} pilarLabel={f.agente} titulo={f.nome} subtitulo={f.descricao} />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-4 font-semibold">O que vais aprender</p>
          <ul className="space-y-3">
            {f.conteudo.map((c, i) => (
              <li key={i} className="flex gap-3 items-start text-sm md:text-base text-ink/80">
                <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 mt-8">
          {f.prev ? (
            <Link to={`/metodo/pilar-3/ferramentas/${f.prev}`} className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta transition-colors">
              <ArrowLeft size={14} /> {FERRAMENTAS[f.prev].nome}
            </Link>
          ) : <span />}
          {f.next && (
            <Link to={`/metodo/pilar-3/ferramentas/${f.next}`} className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
              {FERRAMENTAS[f.next].nome} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
