import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link, useParams } from "@/lib/router-compat";
import { getTool, TOOLS, type Aula } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { fillPrompt } from "@/lib/fill-prompt";
import { getAulaOverride } from "./aulas/registry";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Copy,
  ExternalLink,
  Hourglass,
  Play,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

// Encontra próxima/anterior aula seguindo: aulas dentro da IA → primeira aula da próxima IA
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

// "1 · Começando com o ChatGPT" -> { numero: "1", nome: "Começando com o ChatGPT" }
function parseModulo(modulo: string) {
  const m = modulo.match(/^\s*(\d+)\s*[·\.\-:]\s*(.+)$/);
  if (m) return { numero: m[1], nome: m[2].trim() };
  return { numero: "", nome: modulo };
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
          <h1 className="font-display text-3xl text-ink mb-3">Aula não encontrada</h1>
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
  const mod = parseModulo(aula.modulo);
  const [, aulaNum] = aula.id.split("-");
  const override = getAulaOverride(tool.slug, aula.id);
  const CustomContent = override?.default;
  const effectiveVideoUrl = override?.videoUrl || aula.videoUrl;

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={1}
        pilarLabel="Recuperar seu Tempo"
        backTo="/metodo/pilar-1"
        backLabel="Voltar para o Pilar 1"
      />

      <PillarHeader
        numeral={mod.numero || "01"}
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo={aula.titulo}
      />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-24">
        <Link
          to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
          className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Voltar para a trilha
        </Link>

        {/* Cabeçalho da aula */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta font-semibold mb-2">
              Aula {aula.id.replace("-", ".")} · Módulo {mod.numero || "—"}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-ink leading-[1.05] tracking-tight">
              {aula.titulo}
            </h2>
            {mod.nome && (
              <p className="text-sm text-ink/55 mt-2 italic" style={{ fontFamily: "var(--font-editorial)" }}>
                {mod.nome}
              </p>
            )}
          </div>

          <button
            onClick={() => toggle(tool.slug, aula.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
              done
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white text-ink border-border hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {done ? <Check size={15} /> : <Circle size={15} />}
            {done ? "Aula concluída" : "Marcar como concluída"}
          </button>
        </div>

        {aula.resumo && (
          <p className="text-ink/70 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
            {aula.resumo}
          </p>
        )}

        {/* Vídeo */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-cream-warm/50 to-cream-warm/20 aspect-video flex items-center justify-center">
          <span className="absolute top-4 left-4 z-10 text-xs font-semibold tracking-tight text-ink/45 bg-cream-warm/80 px-2.5 py-1 rounded-md backdrop-blur">
            {aula.id.replace("-", ".")}.00
          </span>
          {effectiveVideoUrl ? (
            <iframe
              src={effectiveVideoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center text-ink/55">
              <div className="w-14 h-14 rounded-full bg-cream border border-border flex items-center justify-center mx-auto mb-2">
                <Play size={20} className="ml-0.5 text-terracotta" />
              </div>
              <p className="text-sm">Vídeo em breve</p>
            </div>
          )}
        </div>

        {/* Conteúdo customizado por aula (src/page-views/pilar1/aulas/<tool>/<id>.tsx) */}
        {CustomContent && (
          <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-6">
            <CustomContent />
          </div>
        )}

        {/* Tópicos */}
        {aula.topicos && aula.topicos.length > 0 && (
          <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-6">
            <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-4 font-semibold">
              {aula.titulo}
            </p>
            <ol className="space-y-3 text-ink">
              {aula.topicos.map((t, i) => (
                <li key={i} className="text-sm md:text-base flex gap-3 items-start">
                  <span className="text-terracotta font-semibold shrink-0 tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
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

        {/* Navegação prev/next */}
        <div className="flex items-center justify-between gap-3 mt-10">
          {prev ? (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${prev.tool}/${prev.aula.id}`}
              className="flex-1 rounded-2xl border border-border bg-white p-4 hover:border-terracotta transition-colors"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted flex items-center gap-1">
                <ArrowLeft size={11} /> Aula anterior
              </span>
              <span className="block text-sm font-semibold text-ink truncate mt-1">
                {prev.aula.titulo}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next && (
            <Link
              to={`/metodo/pilar-1/aprenda-ia/${next.tool}/${next.aula.id}`}
              className="flex-1 rounded-2xl border border-terracotta bg-white p-4 hover:bg-cream-warm/40 transition-colors text-right"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-terracotta flex items-center gap-1 justify-end">
                Próxima aula <ArrowRight size={11} />
              </span>
              <span className="block text-sm font-semibold text-ink truncate mt-1">
                {next.aula.titulo}
              </span>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
