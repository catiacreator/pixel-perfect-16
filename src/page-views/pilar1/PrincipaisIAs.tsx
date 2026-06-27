import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link } from "@/lib/router-compat";
import { TOOLS } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { Check, ImagePlus, Sparkles } from "lucide-react";

const TOOL_PHOTOS: Record<string, string> = {};
// A Tella vive em "Ferramentas de produtividade".
const PRINCIPAIS = TOOLS.filter((t) => t.slug !== "tella");

export default function PrincipaisIAs() {
  const { countDone } = useAulaProgress();

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
        icon={<Sparkles size={18} />}
        pilarLabel="Academia de IA"
        titulo="Principais IAs"
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 pb-24">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          Escolha a IA que você quer aprender. Cada card abre uma jornada com aulas, prompts e
          exemplos práticos.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {PRINCIPAIS.map((tool) => {
            const ids = tool.aulas.map((a) => a.id);
            const done = countDone(tool.slug, ids);
            const total = ids.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const photo = TOOL_PHOTOS[tool.slug];

            return (
              <Link
                key={tool.slug}
                to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-ink shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={tool.nome}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.cor} flex items-center justify-center`}
                    aria-hidden
                  >
                    <div className="text-center px-3">
                      <ImagePlus size={28} className="mx-auto text-white/40 mb-1.5" />
                      <p className="text-[10px] tracking-[0.2em] uppercase text-white/55 font-medium">
                        Adiciona foto
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-3.5 md:p-4 text-white">
                  <h3 className="font-tool text-lg md:text-xl uppercase tracking-tight leading-none drop-shadow-md">
                    {tool.nome}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-medium">
                    <span className="text-white/85">
                      {pct === 100 ? (
                        <span className="inline-flex items-center gap-1 text-sage">
                          <Check size={11} /> 100% visto
                        </span>
                      ) : (
                        <>{pct}% visto</>
                      )}
                    </span>
                    <span className="text-white/75 tabular-nums">
                      {done}/{total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-cream/15 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-terracotta to-gold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
