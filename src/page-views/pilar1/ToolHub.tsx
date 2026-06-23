import Layout from "../../components/Layout";
import { Link, useParams } from "@/lib/router-compat";
import { getTool, TOOLS } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { ArrowLeft, ArrowRight, Check, Play, Sparkles } from "lucide-react";

export default function ToolHub() {
  const { tool: slug } = useParams<{ tool: string }>();
  const tool = slug ? getTool(slug) : undefined;
  const { isDone, countDone } = useAulaProgress();

  if (!tool) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl text-ink mb-3">Ferramenta não encontrada</h1>
          <Link
            to="/metodo/pilar-1/aprenda-ia"
            className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold"
          >
            <ArrowLeft size={14} /> Voltar ao hub
          </Link>
        </div>
      </Layout>
    );
  }

  const ids = tool.aulas.map((a) => a.id);
  const done = countDone(tool.slug, ids);
  const total = ids.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Agrupa por módulo
  const grupos = new Map<string, typeof tool.aulas>();
  for (const a of tool.aulas) {
    const arr = grupos.get(a.modulo) ?? [];
    arr.push(a);
    grupos.set(a.modulo, arr);
  }

  // Próxima IA (para CTA)
  const idx = TOOLS.findIndex((t) => t.slug === tool.slug);
  const proxima = TOOLS[(idx + 1) % TOOLS.length];

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-muted mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/metodo/pilar-1" className="hover:text-terracotta">Pilar 1</Link>
          <span>›</span>
          <Link to="/metodo/pilar-1/aprenda-ia" className="hover:text-terracotta">Aprenda IA</Link>
          <span>›</span>
          <span className="text-ink">{tool.nome}</span>
        </div>

        {/* Cabeçalho */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.cor} border border-border flex items-center justify-center font-serif text-2xl text-ink shrink-0`}
          >
            {tool.inicial}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-tool text-3xl md:text-4xl text-ink mb-1 tracking-tight uppercase">{tool.nome}</h1>
            <p className="text-sm text-muted">{tool.descricao}</p>
          </div>
        </div>

        {/* Progresso */}
        <div className="rounded-2xl border border-border bg-white p-4 mb-6">
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
            <div className="h-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Aulas agrupadas por módulo */}
        <div className="space-y-7 mb-10">
          {Array.from(grupos.entries()).map(([modulo, aulas]) => (
            <div key={modulo}>
              <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-3 font-semibold">
                Módulo {modulo}
              </p>
              <div className="space-y-2">
                {aulas.map((a) => {
                  const done = isDone(tool.slug, a.id);
                  return (
                    <Link
                      key={a.id}
                      to={`/metodo/pilar-1/aprenda-ia/${tool.slug}/${a.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 hover:border-terracotta transition-colors group"
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border ${
                          done
                            ? "bg-terracotta text-cream border-terracotta"
                            : "bg-cream-warm/40 text-muted border-border"
                        }`}
                      >
                        {done ? <Check size={14} /> : a.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{a.titulo}</p>
                        {a.resumo && (
                          <p className="text-xs text-muted truncate">{a.resumo}</p>
                        )}
                      </div>
                      {a.promptPersonalizado && (
                        <span
                          title="Inclui prompt personalizado"
                          className="text-terracotta opacity-70"
                        >
                          <Sparkles size={14} />
                        </span>
                      )}
                      <Play size={13} className="text-muted group-hover:text-terracotta" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Extra para Claude */}
        {tool.slug === "claude" && (
          <div className="rounded-2xl border border-border bg-cream-warm/40 p-4 mb-8 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-ink">Skills da Mentoria</p>
              <p className="text-xs text-muted">Faz download e instala dentro dos teus Projetos.</p>
            </div>
            <Link
              to="/metodo/pilar-1/aprenda-ia/claude/instalar-skills"
              className="text-sm px-4 py-2 rounded-full bg-ink text-cream font-semibold"
            >
              Ver skills
            </Link>
          </div>
        )}

        {/* CTA próxima IA */}
        <div className="rounded-2xl border border-terracotta bg-white p-5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-1">Próxima IA</p>
            <p className="font-serif text-lg text-ink">{proxima.nome}</p>
          </div>
          <Link
            to={`/metodo/pilar-1/aprenda-ia/${proxima.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
          >
            Continuar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
