import { useMemo, type ReactNode } from "react";
import Layout from "../components/Layout";
import { useAccess } from "@/lib/use-access";
import { Lock, FlaskConical } from "lucide-react";
// Documento importado como texto cru (Vite ?raw) — não precisa de escapes.
import doc from "@/data/creator-lab.md?raw";

// ── Renderizador de markdown (títulos, tabelas, código, citações, listas) ──
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let n = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${n++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key} className="font-semibold text-ink">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      out.push(<code key={key} className="rounded bg-ink/[0.06] px-1.5 py-0.5 text-[0.85em] font-mono text-terracotta break-words">{m[2]}</code>);
    } else if (m[3] !== undefined && m[4] !== undefined) {
      out.push(<a key={key} href={m[4]} target="_blank" rel="noreferrer" className="text-terracotta underline break-all">{m[3]}</a>);
    } else if (m[5] !== undefined) {
      out.push(<a key={key} href={m[5]} target="_blank" rel="noreferrer" className="text-terracotta underline break-all">{m[5]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const especial = (l: string) =>
  /^```/.test(l.trim()) ||
  /^\s*\|.*\|\s*$/.test(l) ||
  /^#{1,6}\s+/.test(l) ||
  /^\s*---+\s*$/.test(l) ||
  /^\s*>\s?/.test(l) ||
  /^\s*[-*]\s+/.test(l) ||
  /^\s*\d+\.\s+/.test(l);

function renderDoc(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bloco de código ```
    if (/^```/.test(line.trim())) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(
        <pre key={`c${k++}`} className="my-3 overflow-x-auto rounded-xl bg-[#1C1830] p-4 text-[12.5px] leading-relaxed font-mono text-[#E9E5F5]">
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Tabela
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      blocks.push(
        <div key={`t${k++}`} className="my-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>{header.map((h, j) => <th key={j} className="bg-terracotta text-cream px-3 py-2 text-left font-semibold align-top">{inline(h, `th${k}-${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="even:bg-cream-warm/30 align-top">
                  {r.map((c, ci) => <td key={ci} className="border-t border-border px-3 py-2 text-ink/75">{inline(c, `td${k}-${ri}-${ci}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Títulos
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const cls =
        lvl === 1 ? "font-serif text-2xl md:text-3xl text-ink mt-6 mb-3"
        : lvl === 2 ? "font-serif text-xl md:text-2xl text-ink mt-8 mb-2"
        : "font-semibold text-[15px] text-ink mt-5 mb-1";
      const Tag = (`h${Math.min(lvl, 4)}`) as "h1" | "h2" | "h3" | "h4";
      blocks.push(<Tag key={`h${k++}`} className={cls}>{inline(h[2], `hh${k}`)}</Tag>);
      i++;
      continue;
    }

    // Linha horizontal
    if (/^\s*---+\s*$/.test(line)) { blocks.push(<hr key={`hr${k++}`} className="my-6 border-border" />); i++; continue; }

    // Citação
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      blocks.push(
        <blockquote key={`q${k++}`} className="my-3 border-l-4 border-terracotta bg-terracotta/5 px-4 py-2.5 text-ink/75 italic rounded-r-lg">
          {inline(buf.join(" "), `qq${k}`)}
        </blockquote>,
      );
      continue;
    }

    // Lista não ordenada
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      blocks.push(
        <ul key={`u${k++}`} className="my-2 list-disc pl-5 space-y-1">
          {items.map((it, j) => <li key={j} className="text-ink/75 leading-relaxed">{inline(it, `uu${k}-${j}`)}</li>)}
        </ul>,
      );
      continue;
    }

    // Lista ordenada
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      blocks.push(
        <ol key={`o${k++}`} className="my-2 list-decimal pl-5 space-y-1">
          {items.map((it, j) => <li key={j} className="text-ink/75 leading-relaxed">{inline(it, `oo${k}-${j}`)}</li>)}
        </ol>,
      );
      continue;
    }

    // Linha em branco
    if (line.trim() === "") { i++; continue; }

    // Parágrafo
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !especial(lines[i])) { buf.push(lines[i]); i++; }
    blocks.push(<p key={`p${k++}`} className="my-2 text-ink/75 leading-relaxed">{inline(buf.join(" "), `pp${k}`)}</p>);
  }

  return blocks;
}

export default function CreatorLab() {
  const { isAdmin, loading } = useAccess();
  const conteudo = useMemo(() => renderDoc(doc), []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(135deg,#7C3AED,#C13584)" }}
          >
            <FlaskConical size={22} />
          </span>
          <div>
            <p className="text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold">Interno · só admin</p>
            <h1 className="font-serif text-3xl text-ink leading-none">Creator LAB</h1>
          </div>
        </div>

        {loading ? (
          <p className="text-ink/50 mt-10">A verificar acesso…</p>
        ) : !isAdmin ? (
          <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center">
            <Lock size={28} className="mx-auto text-ink/30 mb-3" />
            <p className="text-ink/80 font-semibold">Página restrita</p>
            <p className="text-sm text-ink/50 mt-1">Só a administradora tem acesso a esta página.</p>
          </div>
        ) : (
          <div className="mt-6">{conteudo}</div>
        )}
      </div>
    </Layout>
  );
}
