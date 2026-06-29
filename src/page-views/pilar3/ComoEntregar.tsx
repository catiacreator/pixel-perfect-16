import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Compass, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { FORMATOS_ENTREGA } from "@/data/pilar3";

const BREVE = ["Iscas Digitais", "Treinamento In Company", "Palestra Personalizada"];

export default function ComoEntregar() {
  const ativos = Object.values(FORMATOS_ENTREGA);
  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="02"
        icon={<Compass size={18} />}
        pilarLabel="Etapa 2 · Entrega"
        titulo="Como entregar"
        subtitulo="O formato em que a sua solução chega ao cliente — a entrega define o valor percebido."
      />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          Cada formato tem um prompt dedicado, já preenchido com os dados do seu Documento Mestre.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {ativos.map((f) => (
            <Link
              key={f.slug}
              to={`/metodo/pilar-3/como-entregar/${f.slug}`}
              className="group rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/50"
            >
              <h3 className="font-display text-lg text-ink leading-tight mb-2">{f.nome}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{f.intro}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
                Abrir prompt <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
          {BREVE.map((nome) => (
            <div key={nome} className="rounded-2xl border border-dashed border-border bg-cream-warm/40 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-ink/50 leading-tight">{nome}</h3>
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink/40 border border-border rounded-full px-2 py-0.5">
                  <Lock size={10} /> Em breve
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link to="/metodo/pilar-3/descobrir" className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta">
            <ArrowLeft size={14} /> Descobrir
          </Link>
          <Link to="/metodo/pilar-3/criar-produto" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Próximo: Criar o produto <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
