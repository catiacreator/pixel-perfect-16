import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { CircleDot, ArrowLeft, ArrowRight, Sparkles, ExternalLink, Lock } from "lucide-react";

const AULAS = [
  "Validar Método de Aprendizado (Mentoria / Consultoria / Curso)",
  "Validar Sistemas, Apps e Robôs",
];

export default function ValidarProduto() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="04"
        icon={<CircleDot size={18} />}
        pilarLabel="Etapa 4 · Validação"
        titulo="Validar o produto"
        subtitulo="Teste com pessoas reais antes de lançar — e converta quem testou em cliente."
      />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        {/* Skill de validação */}
        <div className="rounded-2xl border border-terracotta bg-white p-5 md:p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles size={18} className="text-terracotta shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold">Skill · Claude</p>
              <h2 className="font-display text-xl text-ink leading-tight mt-1">Validação de Produto</h2>
              <p className="text-sm text-ink/65 mt-1.5">Uma Skill no Claude que conduz os <strong className="text-ink/80">8 passos da validação</strong> consigo, do teste à conversão.</p>
            </div>
          </div>
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            Abrir Skill no Claude <ExternalLink size={14} />
          </a>
        </div>

        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-4">Aulas</p>
        <div className="space-y-3">
          {AULAS.map((nome) => (
            <div key={nome} className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-cream-warm/40 p-5">
              <h3 className="font-display text-lg text-ink/50 leading-tight flex-1">{nome}</h3>
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink/40 border border-border rounded-full px-2 py-0.5"><Lock size={10} /> Em breve</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link to="/metodo/pilar-3/criar-produto" className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta"><ArrowLeft size={14} /> Criar o produto</Link>
          <Link to="/metodo/pilar-3/pagina-vendas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">Próximo: Página de vendas <ArrowRight size={15} /></Link>
        </div>
      </div>
    </Layout>
  );
}
