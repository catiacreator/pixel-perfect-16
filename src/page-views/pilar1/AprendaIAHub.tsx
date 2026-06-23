import Layout from "../../components/Layout";
import { Link } from "@/lib/router-compat";
import { TOOLS } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

export default function AprendaIAHub() {
  const { countDone } = useAulaProgress();

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">Etapa 2 · Pilar 1</p>
        <h1 className="font-serif text-3xl md:text-5xl text-ink mb-3 leading-tight">
          Domina as principais <span className="text-terracotta">IAs</span>
        </h1>
        <p className="text-muted mb-8 max-w-2xl">
          Aulas curtas, prompts prontos e exemplos práticos. Cada IA tem o seu hub — escolhe por
          onde queres começar e marca cada aula à medida que avanças.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {TOOLS.map((tool, i) => {
            const ids = tool.aulas.map((a) => a.id);
            const done = countDone(tool.slug, ids);
            const total = ids.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={tool.slug}
                to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                className="group rounded-2xl border border-border bg-white p-5 hover:border-terracotta transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.cor} border border-border flex items-center justify-center font-serif text-xl text-ink`}
                  >
                    {tool.inicial}
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-ink mb-1">{tool.nome}</h3>
                <p className="text-sm text-muted mb-4 flex-1">{tool.descricao}</p>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted">
                    {pct}% visto · {done}/{total} {total === 1 ? "aula" : "aulas"}
                  </span>
                  {pct === 100 && (
                    <span className="inline-flex items-center gap-1 text-terracotta font-semibold">
                      <Check size={12} /> Completo
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-cream-warm/60 overflow-hidden">
                  <div
                    className="h-full bg-terracotta transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="mt-4 text-xs font-semibold text-terracotta inline-flex items-center gap-1 self-start group-hover:gap-2 transition-all">
                  Abrir hub <ArrowUpRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-terracotta bg-gradient-to-br from-white to-cream-warm/60 p-6 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Etapa seguinte</p>
          <p className="text-xl md:text-2xl font-semibold tracking-tight text-ink mb-4">
            Identifica os gargalos com o Detetive do Tempo
          </p>
          <Link
            to="/metodo/pilar-1/detetive-do-tempo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
          >
            Próximo passo: Detetive do Tempo <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
