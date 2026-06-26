import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link } from "@/lib/router-compat";
import { Wrench, ImagePlus } from "lucide-react";

type Ferramenta = {
  nome: string;
  cor: string;
  to?: string;
  foto?: string;
  emBreve?: boolean;
};

// Substitui `foto` pelos URLs reais depois do upload (ex.: "/fotos/tella.jpg").
const FERRAMENTAS: Ferramenta[] = [
  { nome: "Tella", cor: "from-rose-500/20 to-red-700/10", to: "/metodo/pilar-1/aprenda-ia/tella" },
  { nome: "OBS", cor: "from-slate-500/20 to-slate-800/10", emBreve: true },
  { nome: "Notion", cor: "from-stone-500/20 to-neutral-800/10", emBreve: true },
];

export default function Produtividade() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="academia"
        pilarLabel="Academia de IA"
        backTo="/metodo/pilar-1/aprenda-ia"
        backLabel="Voltar para a Academia de IA"
      />
      <PillarHeader
        numeral="IA"
        icon={<Wrench size={18} />}
        pilarLabel="Academia de IA"
        titulo="Ferramentas de produtividade"
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 pb-24">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          As ferramentas que tornam a sua produção mais rápida e profissional.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {FERRAMENTAS.map((f) => {
            const disponivel = !f.emBreve && f.to;
            const Wrapper: any = disponivel ? Link : "div";
            const props = disponivel ? { to: f.to } : {};
            return (
              <Wrapper
                key={f.nome}
                {...props}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-ink shadow-sm transition-all duration-300 ${
                  disponivel ? "hover:shadow-xl hover:-translate-y-1" : ""
                }`}
              >
                {f.foto ? (
                  <img
                    src={f.foto}
                    alt={f.nome}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.cor} flex items-center justify-center`} aria-hidden>
                    <div className="text-center px-3">
                      <ImagePlus size={28} className="mx-auto text-cream/40 mb-1.5" />
                      <p className="text-[10px] tracking-[0.2em] uppercase text-cream/55 font-medium">Adiciona foto</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-3.5 md:p-4 text-cream">
                  <h3 className="font-tool text-lg md:text-xl uppercase tracking-tight leading-none drop-shadow-md">
                    {f.nome}
                  </h3>
                  <div className="mt-3 text-[11px] font-medium">
                    {f.emBreve ? (
                      <span className="text-cream/70">Em breve</span>
                    ) : (
                      <span className="text-cream/85">Ver aulas →</span>
                    )}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
