import { useState } from "react";
import Layout from "../../components/Layout";
import { Link, useParams } from "@/lib/router-compat";
import { getTool, TOOLS } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Play,
  Sparkles,
} from "lucide-react";

// Placeholder por ferramenta. Substitui a URL pela tua foto depois do upload.
const HERO_IMAGES: Record<string, string> = {
  // chatgpt: "/hero-chatgpt.jpg",
  // claude: "/hero-claude.jpg",
};

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

  // Agrupa por módulo, preservando ordem de aparição
  const grupos = new Map<string, typeof tool.aulas>();
  for (const a of tool.aulas) {
    const arr = grupos.get(a.modulo) ?? [];
    arr.push(a);
    grupos.set(a.modulo, arr);
  }

  const idx = TOOLS.findIndex((t) => t.slug === tool.slug);
  const proxima = TOOLS[(idx + 1) % TOOLS.length];
  const heroImg = HERO_IMAGES[tool.slug];

  return (
    <Layout>
      <div className="px-5 md:px-10 py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-muted mb-5 flex items-center gap-1 flex-wrap">
          <Link to="/metodo/pilar-1" className="hover:text-terracotta">Pilar 1</Link>
          <span>›</span>
          <Link to="/metodo/pilar-1/aprenda-ia" className="hover:text-terracotta">Aprenda IA</Link>
          <span>›</span>
          <span className="text-ink">{tool.nome}</span>
        </div>

        {/* HERO com imagem */}
        <div className="relative overflow-hidden rounded-3xl border border-border mb-6 aspect-[16/7] min-h-[240px]">
          {heroImg ? (
            <img
              src={heroImg}
              alt={tool.nome}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tool.cor}`}
              aria-hidden
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.0),rgba(0,0,0,0.35))]" />
              <p className="absolute bottom-3 right-4 text-[10px] tracking-[0.2em] uppercase text-cream/70">
                Faz upload da tua foto
              </p>
            </div>
          )}
          {/* Gradiente para legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-cream/75 mb-1">
              Aprenda
            </p>
            <h1 className="font-tool text-4xl md:text-6xl text-cream uppercase tracking-tight leading-none">
              {tool.nome}
            </h1>
            <p className="text-sm md:text-base text-cream/85 mt-2 max-w-xl">
              {tool.descricao}
            </p>
          </div>
        </div>

        {/* Card de progresso */}
        <div className="rounded-2xl border border-border bg-white p-5 mb-5">
          <div className="flex items-center justify-between text-sm mb-3 gap-3 flex-wrap">
            <span className="font-semibold text-ink">
              Seu progresso em {tool.nome}
            </span>
            <span className="text-terracotta font-semibold text-sm">
              {pct}% · {done}/{total} {total === 1 ? "aula" : "aulas"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-cream-warm/70 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-terracotta to-gold transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Módulos colapsáveis */}
        <div className="space-y-4 mb-10">
          {Array.from(grupos.entries()).map(([modulo, aulas], i) => (
            <ModuloCard
              key={modulo}
              modulo={modulo}
              aulas={aulas}
              toolSlug={tool.slug}
              isDone={isDone}
              defaultOpen={i === 0}
            />
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
            <p className="font-tool text-xl text-ink uppercase tracking-tight">{proxima.nome}</p>
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

function ModuloCard({
  modulo,
  aulas,
  toolSlug,
  isDone,
  defaultOpen,
}: {
  modulo: string;
  aulas: ReturnType<typeof getTool> extends infer T
    ? T extends { aulas: infer A }
      ? A
      : never
    : never;
  toolSlug: string;
  isDone: (slug: string, id: string) => boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const aulasList = aulas as Array<{
    id: string;
    titulo: string;
    resumo?: string;
    promptPersonalizado?: unknown;
  }>;
  const doneCount = aulasList.filter((a) => isDone(toolSlug, a.id)).length;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-cream-warm/30 transition-colors"
      >
        <div className="min-w-0">
          <h2 className="font-serif text-xl md:text-2xl text-ink leading-tight">
            Módulo {modulo}
          </h2>
          <p className="text-xs text-muted mt-1 font-semibold">
            {doneCount}/{aulasList.length} aulas concluídas
          </p>
        </div>
        <ChevronDown
          size={20}
          className={`text-ink/60 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border">
          {aulasList.map((a, i) => {
            const done = isDone(toolSlug, a.id);
            return (
              <Link
                key={a.id}
                to={`/metodo/pilar-1/aprenda-ia/${toolSlug}/${a.id}`}
                className={`flex items-center gap-4 p-4 group transition-colors ${
                  i % 2 === 1 ? "bg-cream-warm/30" : "bg-white"
                } hover:bg-cream-warm/60`}
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                    done
                      ? "bg-terracotta/10 border-terracotta text-terracotta"
                      : "bg-cream-warm/40 border-border text-muted group-hover:border-terracotta group-hover:text-terracotta"
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={2.5} /> : <Play size={14} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-0.5">
                    Aula {modulo}.{i + 1}
                  </p>
                  <p className="text-sm md:text-base text-ink truncate">
                    {a.titulo}
                  </p>
                </div>
                {a.promptPersonalizado ? (
                  <span title="Inclui prompt personalizado" className="text-terracotta opacity-70 shrink-0">
                    <Sparkles size={14} />
                  </span>
                ) : null}
                <span
                  className={`text-xs font-semibold shrink-0 ${
                    done ? "text-terracotta" : "text-muted group-hover:text-terracotta"
                  }`}
                >
                  {done ? "Concluída" : "Ver"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
