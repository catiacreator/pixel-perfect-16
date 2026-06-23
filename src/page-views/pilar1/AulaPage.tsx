import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Link, useParams } from "@/lib/router-compat";
import { getTool, TOOLS, type Aula } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { fillPrompt } from "@/lib/fill-prompt";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Copy,
  ExternalLink,
  Play,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

// Encontra próxima aula seguindo: aulas dentro da IA → primeira aula da próxima IA
function neighbours(slug: string, aulaId: string) {
  const toolIdx = TOOLS.findIndex((t) => t.slug === slug);
  if (toolIdx === -1) return { prev: null, next: null };
  const tool = TOOLS[toolIdx];
  const idx = tool.aulas.findIndex((a) => a.id === aulaId);
  if (idx === -1) return { prev: null, next: null };

  let prev: { tool: string; aula: Aula } | null = null;
  let next: { tool: string; aula: Aula } | null = null;

  if (idx > 0) {
    prev = { tool: tool.slug, aula: tool.aulas[idx - 1] };
  } else if (toolIdx > 0) {
    const t = TOOLS[toolIdx - 1];
    prev = { tool: t.slug, aula: t.aulas[t.aulas.length - 1] };
  }

  if (idx < tool.aulas.length - 1) {
    next = { tool: tool.slug, aula: tool.aulas[idx + 1] };
  } else {
    const t = TOOLS[(toolIdx + 1) % TOOLS.length];
    next = { tool: t.slug, aula: t.aulas[0] };
  }

  return { prev, next };
}

function PromptBlock({ template, label }: { template: string; label?: string }) {
  const filled = useMemo(() => fillPrompt(template), [template]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(filled.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden mb-6">
      <div className="p-4 border-b border-border flex items-center gap-2 flex-wrap bg-cream-warm/30">
        <Sparkles size={14} className="text-terracotta" />
        <p className="text-sm font-semibold text-ink">Prompt personalizado</p>
        <span className="text-xs text-muted">— já preenchido com o teu Documento Mestre</span>
        <button
          onClick={copy}
          className="ml-auto text-xs px-3 py-1.5 rounded-full bg-ink text-cream flex items-center gap-1.5"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>
      {filled.missing.length > 0 && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-xs">
          <AlertTriangle size={13} className="text-amber-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-900 font-semibold mb-0.5">
              Campos em falta no Documento Mestre
            </p>
            <p className="text-amber-800">
              {filled.missing.join(", ")}.{" "}
              <Link to="/doc-mestre" className="underline font-semibold">
                Completa o Documento Mestre
              </Link>{" "}
              para personalizar este prompt.
            </p>
          </div>
        </div>
      )}
      <pre className="text-xs p-4 max-h-72 overflow-auto whitespace-pre-wrap font-sans bg-white">
        {filled.text}
      </pre>
      {label && (
        <p className="text-xs text-muted px-4 py-2 border-t border-border bg-cream-warm/30">
          {label}
        </p>
      )}
    </div>
  );
}

export default function AulaPage() {
  const { tool: slug, lessonSlug } = useParams<{ tool: string; lessonSlug: string }>();
  const tool = slug ? getTool(slug) : undefined;
  const aula = tool?.aulas.find((a) => a.id === lessonSlug);
  const { isDone, toggle } = useAulaProgress();

  if (!tool || !aula) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl text-ink mb-3">Aula não encontrada</h1>
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

  const { prev, next } = neighbours(tool.slug, aula.id);
  const done = isDone(tool.slug, aula.id);

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-muted mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/metodo/pilar-1/aprenda-ia" className="hover:text-terracotta">
            Aprenda IA
          </Link>
          <span>›</span>
          <Link
            to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
            className="hover:text-terracotta"
          >
            {tool.nome}
          </Link>
          <span>›</span>
          <span className="text-ink">Aula {aula.id}</span>
        </div>

        {/* Título */}
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">{aula.modulo}</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3 leading-tight">
          {aula.titulo}
        </h1>
        {aula.resumo && <p className="text-muted mb-6">{aula.resumo}</p>}

        {/* Vídeo */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream">
          {aula.videoUrl ? (
            <iframe
              src={aula.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-cream/15 flex items-center justify-center mx-auto mb-2">
                <Play size={20} className="ml-0.5" />
              </div>
              <p className="text-sm opacity-80">Vídeo em breve</p>
            </div>
          )}
        </div>

        {/* Tópicos */}
        {aula.topicos && aula.topicos.length > 0 && (
          <div className="rounded-2xl border border-border bg-white p-5 mb-6">
            <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-3 font-semibold">
              Tópicos de referência
            </p>
            <ul className="space-y-2">
              {aula.topicos.map((t, i) => (
                <li key={i} className="text-sm text-ink flex gap-2.5 items-start">
                  <span className="text-terracotta mt-2 shrink-0">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        {aula.links && aula.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {aula.links.map((l, i) => {
              const isInternal = l.href.startsWith("/");
              if (isInternal) {
                return (
                  <Link
                    key={i}
                    to={l.href}
                    className="text-sm px-4 py-2 rounded-full border border-terracotta bg-white text-terracotta font-semibold inline-flex items-center gap-1.5 hover:bg-terracotta hover:text-cream transition-colors"
                  >
                    {l.label} <ArrowRight size={13} />
                  </Link>
                );
              }
              return (
                <a
                  key={i}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 rounded-full border border-ink bg-ink text-cream font-semibold inline-flex items-center gap-1.5 hover:bg-terracotta hover:border-terracotta transition-colors"
                >
                  {l.label} <ExternalLink size={13} />
                </a>
              );
            })}
          </div>
        )}

        {/* Prompt personalizado */}
        {aula.promptPersonalizado && (
          <PromptBlock
            template={aula.promptPersonalizado.template}
            label={aula.promptPersonalizado.label}
          />
        )}

        {/* Concluir */}
        <button
          onClick={() => toggle(tool.slug, aula.id)}
          className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-colors mb-8 ${
            done
              ? "bg-terracotta text-cream border-terracotta"
              : "bg-white text-ink border-border hover:border-terracotta"
          }`}
        >
          {done ? <Check size={15} /> : <Circle size={15} />}
          {done ? "Aula concluída" : "Marcar como concluída"}
        </button>

        {/* Navegação */}
        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${prev.tool}/${prev.aula.id}`}
              className="flex-1 rounded-2xl border border-border bg-white p-3 hover:border-terracotta transition-colors"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase text-muted flex items-center gap-1">
                <ArrowLeft size={11} /> Anterior
              </span>
              <span className="block text-sm font-semibold text-ink truncate">
                {prev.aula.titulo}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next && (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${next.tool}/${next.aula.id}`}
              className="flex-1 rounded-2xl border border-terracotta bg-white p-3 hover:bg-cream-warm/40 transition-colors text-right"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase text-terracotta flex items-center gap-1 justify-end">
                Próxima <ArrowRight size={11} />
              </span>
              <span className="block text-sm font-semibold text-ink truncate">
                {next.aula.titulo}
              </span>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
