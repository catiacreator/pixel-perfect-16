import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Wrench, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { CRIAR_PRODUTO_AULAS } from "@/data/pilar3";

export default function CriarProduto() {
  const aulas = Object.values(CRIAR_PRODUTO_AULAS);
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="03"
        icon={<Wrench size={18} />}
        pilarLabel="Etapa 3 · Construção"
        titulo="Criar o produto"
        subtitulo="Escolha a plataforma e construa a sua solução."
      />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20 space-y-3">
        {aulas.map((a) => {
          const ativo = a.status === "ativo";
          const Wrapper: any = ativo ? Link : "div";
          const props = ativo ? { to: `/metodo/pilar-3/criar-produto/${a.slug}` } : {};
          return (
            <Wrapper
              key={a.slug}
              {...props}
              className={`group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                ativo ? "bg-white border-border hover:border-terracotta/50 hover:-translate-y-0.5" : "bg-cream-warm/40 border-dashed border-border"
              }`}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg shrink-0 ${ativo ? "bg-terracotta/10 text-terracotta" : "bg-ink/5 text-ink/40"}`}>{a.n}</span>
              <div className="flex-1 min-w-0">
                <h3 className={`font-display text-lg leading-tight ${ativo ? "text-ink" : "text-ink/50"}`}>{a.nome}</h3>
                <p className={`text-sm mt-0.5 ${ativo ? "text-ink/60" : "text-ink/40"}`}>{a.desc}</p>
              </div>
              {ativo ? <ArrowRight size={16} className="text-terracotta shrink-0" /> : (
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink/40 border border-border rounded-full px-2 py-0.5"><Lock size={10} /> Em breve</span>
              )}
            </Wrapper>
          );
        })}

        <div className="pt-6 flex items-center justify-between">
          <Link to="/metodo/pilar-3/como-entregar" className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta">
            <ArrowLeft size={14} /> Como entregar
          </Link>
          <Link to="/metodo/pilar-3/validar-produto" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Próximo: Validar o produto <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
