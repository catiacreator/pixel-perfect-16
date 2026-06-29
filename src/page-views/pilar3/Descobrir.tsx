import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Lightbulb, ArrowRight, Lock } from "lucide-react";
import { FORMATOS_SOLUCAO } from "@/data/pilar3";

export default function Descobrir() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="01"
        icon={<Lightbulb size={18} />}
        pilarLabel="Etapa 1 · Descoberta"
        titulo="Descobrir soluções"
        subtitulo="Escolha que solução digital vai criar para o seu público."
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          São 8 formatos possíveis. Comece pelos que já estão disponíveis — cada um abre uma aula e um prompt que o ajuda a montar a solução.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FORMATOS_SOLUCAO.map((f) => {
            const ativo = f.status === "ativo" && f.slug;
            const Wrapper: any = ativo ? Link : "div";
            const props = ativo ? { to: `/metodo/pilar-3/ferramentas/${f.slug}` } : {};
            return (
              <Wrapper
                key={f.nome}
                {...props}
                className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
                  ativo
                    ? "bg-white border-border hover:-translate-y-1 hover:shadow-[0_20px_44px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/50 cursor-pointer"
                    : "bg-cream-warm/40 border-dashed border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-display text-lg leading-tight ${ativo ? "text-ink" : "text-ink/50"}`}>{f.nome}</h3>
                  {!ativo && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink/40 border border-border rounded-full px-2 py-0.5">
                      <Lock size={10} /> Em breve
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${ativo ? "text-ink/60" : "text-ink/40"}`}>{f.desc}</p>
                {ativo && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
                    Abrir <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <Link to="/metodo/pilar-3/como-entregar" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Próximo: Como entregar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
