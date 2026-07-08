import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

// Renderiza o conteúdo textual dos agentes (formato com ━━━ separadores,
// TÍTULOS EM MAIÚSCULAS, subtítulos, bullets, destaques com emoji e blocos
// de template) com o visual do curso "Conteúdo com IA" (tema roxo/terracotta).

/* ─── helpers ──────────────────────────────────────────────── */

const isDivider = (line: string) => /^[━─═\-]{6,}$/.test(line.trim());

const isMainTitle = (line: string) => {
  const t = line.trim();
  if (t.length < 4 || t.length > 120) return false;
  const stripped = t.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  if (!stripped) return false;
  return (
    stripped === stripped.toUpperCase() &&
    /[A-ZÀ-ÚÇ]{2,}/.test(stripped) &&
    !/^[•\-✅❌☐✨🔥🔑🎯📢❤️💎📚]/.test(t)
  );
};

const isSubTitle = (line: string) => {
  const t = line.trim();
  return /^(Passo|SLIDE|POST|FASE|MÓDULO|TIPO|DESTAQUE|VERSÃO|ESTRATÉGIA|TÉCNICA|PROBLEMA|ELEMENTO|OPÇÃO|Story|Case|Exercício)\s*\d*/i.test(t);
};

const isBullet = (line: string) => /^\s*[•\-]\s/.test(line);
const isCheckbox = (line: string) => /^\s*☐/.test(line);
const isEmojiBullet = (line: string) =>
  /^\s*[❌✅✨🔥🔑🎯📢❤️💎📚🤖⚠️‼️💡]\s*/.test(line.trim()) && line.trim().length > 3;

const isTemplateBlock = (lines: string[], startIdx: number): number => {
  let count = 0;
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === "") {
      if (count >= 2) return count;
      break;
    }
    if (/\[.*\]/.test(l) || /^[A-Za-zÀ-úÇç\s]+:\s*\[/.test(l)) {
      count++;
    } else if (count > 0 && /^[A-Za-zÀ-úÇç\s\-]+:/.test(l)) {
      count++;
    } else if (count === 0) {
      break;
    } else {
      count++;
    }
  }
  return count >= 2 ? count : 0;
};

/* ─── copiar ───────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${copied ? "bg-emerald-600 text-white" : "bg-[#F2C14E] text-[#3a2a05] hover:brightness-105"}`}
      title="Copiar"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

/* ─── bloco de template (estilo prompt do curso) ───────────── */

function CodeBlock({ lines }: { lines: string[] }) {
  const text = lines.join("\n");
  const partes = text.split(/(\[[^\]]+\])/g);
  return (
    <div className="rounded-2xl overflow-hidden border border-[#322A42] bg-[#221D2E] my-4">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#2C2440] border-b border-[#392f4d]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Template</span>
        <CopyButton text={text} />
      </div>
      <pre className="m-0 px-4 py-4 text-[13px] leading-relaxed text-[#EDE7F5] font-mono whitespace-pre-wrap break-words overflow-x-auto">
        {partes.map((p, i) =>
          /^\[[^\]]+\]$/.test(p) ? <span key={i} className="text-[#F2C14E]">{p}</span> : <span key={i}>{p}</span>,
        )}
      </pre>
    </div>
  );
}

/* ─── renderer ─────────────────────────────────────────────── */

export default function ContentRenderer({ content }: { content: string }) {
  const rawLines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const k = () => key++;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Separador
    if (isDivider(trimmed)) {
      elements.push(
        <div key={k()} className="my-7 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent" />,
      );
      i++;
      continue;
    }

    // Bloco de template / prompt
    const templateLen = isTemplateBlock(rawLines, i);
    if (templateLen > 0) {
      const blockLines = rawLines.slice(i, i + templateLen).map((l) => l.trimStart());
      elements.push(<CodeBlock key={k()} lines={blockLines} />);
      i += templateLen;
      continue;
    }

    // Título principal (MAIÚSCULAS)
    if (isMainTitle(trimmed)) {
      elements.push(
        <h2 key={k()} className="font-serif text-xl md:text-2xl text-terracotta font-bold mt-9 mb-3 leading-snug">
          {trimmed}
        </h2>,
      );
      i++;
      continue;
    }

    // Subtítulo (Passo X, SLIDE X…)
    if (isSubTitle(trimmed)) {
      elements.push(
        <h3 key={k()} className="text-[15px] font-semibold text-terracotta/90 mt-6 mb-1.5">
          {trimmed}
        </h3>,
      );
      i++;
      continue;
    }

    // Listas
    if (isBullet(trimmed) || isCheckbox(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && (isBullet(rawLines[i].trim()) || isCheckbox(rawLines[i].trim()))) {
        listItems.push(rawLines[i].trim());
        i++;
      }
      elements.push(
        <ul key={k()} className="my-3 space-y-1.5">
          {listItems.map((item, idx) => {
            const isCheck = isCheckbox(item);
            const cleaned = item.replace(/^[•\-☐]\s*/, "");
            return (
              <li key={idx} className="flex items-start gap-2.5 text-[14.5px] text-ink/75 leading-relaxed">
                {isCheck ? (
                  <span className="mt-0.5 w-4 h-4 rounded border-2 border-terracotta/50 shrink-0" />
                ) : (
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-terracotta/60 shrink-0" />
                )}
                <span>{cleaned}</span>
              </li>
            );
          })}
        </ul>,
      );
      continue;
    }

    // Destaque com emoji
    if (isEmojiBullet(trimmed) && trimmed.length > 10) {
      elements.push(
        <div key={k()} className="my-2.5 px-4 py-3 rounded-xl border border-terracotta/15 bg-terracotta/5 text-[14.5px] text-ink/85 leading-relaxed font-medium">
          {trimmed}
        </div>,
      );
      i++;
      continue;
    }

    // Linhas de score/pontuação
    if (/^(Score|SCORE|GANCHO|RETENÇÃO|VALOR|CLAREZA|CONEXÃO|CTA|RESULTADO)/i.test(trimmed) && trimmed.includes(":")) {
      elements.push(
        <div key={k()} className="my-1 px-3 py-1.5 rounded-lg bg-ink/5 text-[13.5px] text-ink/80 font-medium border-l-2 border-terracotta/40">
          {trimmed}
        </div>,
      );
      i++;
      continue;
    }

    // Antes/Depois, Sim/Não…
    if (/^(Não|Sim|Antes|Depois|Vago|Específico|Fraco|Forte)\s*:/i.test(trimmed)) {
      const isNegative = /^(Não|Antes|Vago|Fraco)/i.test(trimmed);
      elements.push(
        <div
          key={k()}
          className={`my-1 px-3 py-1.5 rounded-lg text-[13.5px] border-l-2 ${
            isNegative ? "bg-rose-500/10 border-rose-400/50 text-ink/75" : "bg-emerald-500/10 border-emerald-500/50 text-ink/75"
          }`}
        >
          {trimmed}
        </div>,
      );
      i++;
      continue;
    }

    // Linha curta ❌/✅
    if (/^(❌|✅)/.test(trimmed) && trimmed.length < 80) {
      elements.push(
        <p key={k()} className="my-1 text-[14.5px] text-ink/75 leading-relaxed">
          {trimmed}
        </p>,
      );
      i++;
      continue;
    }

    // Parágrafo normal
    elements.push(
      <p key={k()} className="my-2 text-[14.5px] text-ink/75 leading-relaxed">
        {trimmed}
      </p>,
    );
    i++;
  }

  return <div className="content-renderer">{elements}</div>;
}
