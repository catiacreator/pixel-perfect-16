// Lê o Documento Mestre do localStorage e expande os placeholders dos prompts.

type Produto = { nome: string; descricao: string; ticketMedio: string };

type Doc = {
  nome?: string;
  profissao?: string;
  tempoAtuacao?: string;
  oQueFaz?: string;
  comoResolve?: string;
  publico?: string;
  dores?: string[];
  desejos?: string[];
  produtos?: Produto[];
  // campos do Pilar 2 (ainda não persistidos — ficam vazios)
  nomeMetodo?: string;
  promessa?: string;
  pilares?: string;
  tomDeVoz?: string;
  horasDia?: string;
  diasSemana?: string;
};

const VAZIO = "(não preenchido)";

function readDoc(): Doc {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

function listar(items: string[] | undefined): string {
  const list = (items || []).filter(Boolean);
  if (list.length === 0) return VAZIO;
  return list.map((s, i) => `${i + 1}. ${s}`).join("\n");
}

function produtos(items: Produto[] | undefined): string {
  if (!items || items.length === 0) return VAZIO;
  return items
    .map(
      (p) =>
        `- ${p.nome || "(sem nome)"}${p.descricao ? " — " + p.descricao : ""}${
          p.ticketMedio ? " (ticket: " + p.ticketMedio + ")" : ""
        }`,
    )
    .join("\n");
}

function ticketMedio(items: Produto[] | undefined): string {
  const tickets = (items || []).map((p) => p.ticketMedio).filter(Boolean);
  return tickets.length ? tickets.join(" / ") : VAZIO;
}

export type PromptFillResult = { text: string; missing: string[] };

export function fillPrompt(template: string): PromptFillResult {
  const d = readDoc();
  const missing: string[] = [];

  const tag = (label: string, value?: string) => {
    if (value && value.trim()) return value;
    missing.push(label);
    return VAZIO;
  };

  const map: Record<string, string> = {
    "[NOME]": tag("Nome", d.nome),
    "[PROFISSÃO]": tag("Profissão", d.profissao),
    "[O QUE FAZ]": tag("O que faz", d.oQueFaz),
    "[COMO RESOLVE]": tag("Como resolves", d.comoResolve),
    "[PÚBLICO]": tag("Público", d.publico),
    "[5 DORES]":
      d.dores && d.dores.filter(Boolean).length
        ? listar(d.dores)
        : (missing.push("5 Dores"), VAZIO),
    "[5 DESEJOS]":
      d.desejos && d.desejos.filter(Boolean).length
        ? listar(d.desejos)
        : (missing.push("5 Desejos"), VAZIO),
    "[PRODUTOS]":
      d.produtos && d.produtos.length
        ? produtos(d.produtos)
        : (missing.push("Produtos"), VAZIO),
    "[TICKET MÉDIO]":
      d.produtos && d.produtos.some((p) => p.ticketMedio)
        ? ticketMedio(d.produtos)
        : (missing.push("Ticket médio"), VAZIO),
    "[TOM DE VOZ]": tag("Tom de voz (Pilar 2)", d.tomDeVoz),
    "[NOME DO MÉTODO]": tag("Nome do método (Pilar 2)", d.nomeMetodo),
    "[PROMESSA]": tag("Promessa (Pilar 2)", d.promessa),
    "[PILARES]": tag("Pilares (Pilar 2)", d.pilares),
    "[HORAS/DIA]": tag("Horas/dia (Pilar 2)", d.horasDia),
    "[DIAS/SEMANA]": tag("Dias/semana (Pilar 2)", d.diasSemana),
  };

  let out = template;
  for (const [k, v] of Object.entries(map)) {
    out = out.split(k).join(v);
  }
  return { text: out, missing: Array.from(new Set(missing)) };
}
