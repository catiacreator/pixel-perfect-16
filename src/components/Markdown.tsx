import type { ReactNode } from "react";
import { Link } from "@/lib/router-compat";

// Renderizador de markdown leve para as respostas do assistente.
// Suporta: **negrito**, listas (- / *), links [texto](url), URLs e caminhos internos (/...).

const TOKEN_SRC =
  "\\*\\*(.+?)\\*\\*|\\[([^\\]]+)\\]\\(([^)]+)\\)|(https?:\\/\\/[^\\s)]+)|(\\/[A-Za-z0-9][A-Za-z0-9\\-_/]*)";

const linkCls = "underline underline-offset-2 font-medium text-terracotta hover:opacity-80";

function linkEl(href: string, label: string, key: string) {
  if (href.startsWith("/")) {
    return (
      <Link key={key} to={href} className={linkCls}>
        {label}
      </Link>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {label}
    </a>
  );
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(TOKEN_SRC, "g"); // regex local — evita corrupção do lastIndex na recursão
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key} className="font-semibold">{inline(m[1], key)}</strong>);
    } else if (m[2] !== undefined && m[3] !== undefined) {
      out.push(linkEl(m[3], m[2], key));
    } else if (m[4] !== undefined) {
      out.push(linkEl(m[4], m[4], key));
    } else if (m[5] !== undefined) {
      out.push(linkEl(m[5], m[5], key));
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let k = 0;

  const flushPara = () => {
    if (!para.length) return;
    const t = para.join(" ");
    blocks.push(
      <p key={`p${k}`} className="leading-relaxed">
        {inline(t, `p${k}`)}
      </p>,
    );
    k++;
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const items = list;
    const key = k;
    blocks.push(
      <ul key={`u${key}`} className="list-disc pl-5 space-y-1.5">
        {items.map((it, idx) => (
          <li key={idx} className="leading-relaxed">
            {inline(it, `u${key}-${idx}`)}
          </li>
        ))}
      </ul>,
    );
    k++;
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      flushPara();
      list.push(li[1]);
    } else if (line.trim() === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();

  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
}
