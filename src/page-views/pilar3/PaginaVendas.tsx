import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { PAGINA_VENDAS_AULAS } from "@/data/pilar3";

export default function PaginaVendas() {
  const aulas = Object.values(PAGINA_VENDAS_AULAS);
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="05"
        icon={<FileText size={18} />}
        pilarLabel="Etapa 5 · Venda"
        titulo="Página de vendas"
        subtitulo="Prompt orquestrador + modelo no Lovable para a sua página converter."
      />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20 space-y-3">
        {aulas.map((a) => (
          <Link
            key={a.slug}
            to={`/metodo/pilar-3/pagina-vendas/${a.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:border-terracotta/50 hover:-translate-y-0.5"
          >
            <span className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-display text-lg shrink-0">{a.n}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg text-ink leading-tight">{a.nome}</h3>
              <p className="text-sm text-ink/60 mt-0.5">{a.desc}</p>
            </div>
            <ArrowRight size={16} className="text-terracotta shrink-0" />
          </Link>
        ))}

        <div className="pt-6 flex items-center justify-between">
          <Link to="/metodo/pilar-3/validar-produto" className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta"><ArrowLeft size={14} /> Validar o produto</Link>
          <Link to="/metodo/pilar-3/conclusao" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">Próximo: Conclusão <ArrowRight size={15} /></Link>
        </div>
      </div>
    </Layout>
  );
}
