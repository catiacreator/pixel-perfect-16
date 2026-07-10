// Documento Mestre — tipos, estado e geradores (lógica pura, sem React).
// Usado pela página DocMestre e reutilizável noutros sítios/scripts.

export type Produto = { nome: string; descricao: string; ticketMedio: string };

export type DocState = {
  nome: string;
  profissao: string;
  tempoAtuacao: string;
  localizacao: string;
  oQueFaz: string;
  comoResolve: string;
  publico: string;
  dores: string[];
  desejos: string[];
  produtos: Produto[];
  horasDia: string;
  diasSemana: string;
  faturamentoMensal: string;
  tomDeVoz: string;
};

export const EMPTY: DocState = {
  nome: "",
  profissao: "",
  tempoAtuacao: "",
  localizacao: "",
  oQueFaz: "",
  comoResolve: "",
  publico: "",
  dores: ["", "", "", "", ""],
  desejos: ["", "", "", "", ""],
  produtos: [],
  horasDia: "",
  diasSemana: "",
  faturamentoMensal: "",
  tomDeVoz: "",
};

export const STORAGE_KEY = "leveza.doc-mestre.v1";

export function padArray(arr: string[], n: number): string[] {
  const out = [...arr];
  while (out.length < n) out.push("");
  return out;
}

// Lê o Documento Mestre do localStorage (browser). No servidor devolve EMPTY.
export function loadInitial(): DocState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DocState>;
    return {
      ...EMPTY,
      ...parsed,
      dores: padArray((parsed.dores ?? []).slice(0, 5), 5),
      desejos: padArray((parsed.desejos ?? []).slice(0, 5), 5),
      produtos: Array.isArray(parsed.produtos) ? parsed.produtos : [],
    };
  } catch {
    return EMPTY;
  }
}

// Funde os campos extraídos (ex.: import de texto/IA) por cima do estado atual,
// sem apagar o que já existe quando o extraído vem vazio.
export function mergeExtracted(prev: DocState, extracted: Partial<DocState>): DocState {
  return {
    ...prev,
    nome: extracted.nome || prev.nome,
    profissao: extracted.profissao || prev.profissao,
    tempoAtuacao: extracted.tempoAtuacao || prev.tempoAtuacao,
    localizacao: extracted.localizacao || prev.localizacao,
    oQueFaz: extracted.oQueFaz || prev.oQueFaz,
    comoResolve: extracted.comoResolve || prev.comoResolve,
    publico: extracted.publico || prev.publico,
    dores:
      extracted.dores && extracted.dores.length
        ? padArray(extracted.dores.slice(0, 5), 5)
        : prev.dores,
    desejos:
      extracted.desejos && extracted.desejos.length
        ? padArray(extracted.desejos.slice(0, 5), 5)
        : prev.desejos,
    produtos:
      extracted.produtos && extracted.produtos.length ? extracted.produtos : prev.produtos,
    horasDia: extracted.horasDia || prev.horasDia,
    diasSemana: extracted.diasSemana || prev.diasSemana,
    faturamentoMensal: extracted.faturamentoMensal || prev.faturamentoMensal,
    tomDeVoz: extracted.tomDeVoz || prev.tomDeVoz,
  };
}

// Prompt para a IA refinar/preencher os campos do Documento Mestre.
export function buildRefinePrompt(d: DocState): string {
  const lines = (arr: string[]) =>
    arr.filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join("\n") || "(vazio)";
  const produtos =
    d.produtos.length === 0
      ? "(nenhum)"
      : d.produtos
          .map(
            (p) =>
              `- ${p.nome || "(sem nome)"}${p.descricao ? " — " + p.descricao : ""}${
                p.ticketMedio ? " (ticket: " + p.ticketMedio + ")" : ""
              }`,
          )
          .join("\n");

  return `Você é um especialista em posicionamento para experts e mentores digitais.
Revise e refine os dados abaixo do meu Documento Mestre, tornando cada resposta mais clara, específica e persuasiva. Mantenha minha voz real e não invente informações novas — apenas melhore o que já existe.

DOCUMENTO MESTRE ATUAL:

NOME: ${d.nome || "(vazio)"}
PROFISSÃO: ${d.profissao || "(vazio)"}
TEMPO DE ATUAÇÃO: ${d.tempoAtuacao || "(vazio)"}
LOCALIZAÇÃO: ${d.localizacao || "(vazio)"}
O QUE EU FAÇO: ${d.oQueFaz || "(vazio)"}
COMO RESOLVO: ${d.comoResolve || "(vazio)"}
PÚBLICO: ${d.publico || "(vazio)"}

DORES DO PÚBLICO:
${lines(d.dores)}

DESEJOS DO PÚBLICO:
${lines(d.desejos)}

PRODUTOS/SERVIÇOS ATUAIS:
${produtos}

ROTINA: ${d.horasDia || "(vazio)"} horas/dia · ${d.diasSemana || "(vazio)"} dias/semana
FATURAMENTO MENSAL: ${d.faturamentoMensal || "(vazio)"}
TOM DE COMUNICAÇÃO: ${d.tomDeVoz || "(vazio)"}

---

Retorne exatamente neste formato — mantenha os rótulos em MAIÚSCULAS seguidos de ":" para eu conseguir importar de volta:

NOME:
PROFISSÃO:
TEMPO DE ATUAÇÃO:
LOCALIZAÇÃO:
O QUE EU FAÇO:
COMO RESOLVO:
PÚBLICO:
DORES DO PÚBLICO: (uma por linha, numeradas de 1 a 5)
DESEJOS DO PÚBLICO: (um por linha, numerados de 1 a 5)
PRODUTOS/SERVIÇOS: (um por linha)
TOM DE COMUNICAÇÃO:`;
}

// Gera o ficheiro .md (skill/protocolo) calibrado com o Documento Mestre,
// pronto a instalar no Project Knowledge do Claude.
export function buildSkillPersonalizada(d: DocState): string {
  const nome = d.nome.trim() || "o meu negócio";
  const lista = (arr: string[]) => {
    const its = arr.map((s) => s.trim()).filter(Boolean);
    return its.length ? its.map((s) => `- ${s}`).join("\n") : "- (por preencher)";
  };
  const linha = (label: string, v: string) => (v.trim() ? `- **${label}:** ${v.trim()}` : "");
  const quemSou = [
    d.profissao.trim(),
    d.tempoAtuacao.trim() ? `há ${d.tempoAtuacao.trim()}` : "",
    d.localizacao.trim(),
  ].filter(Boolean).join(" · ");
  const produtos = d.produtos.filter((p) => p.nome.trim() || p.descricao.trim()).length
    ? d.produtos
        .filter((p) => p.nome.trim() || p.descricao.trim())
        .map((p) => `- **${p.nome.trim() || "(sem nome)"}**${p.descricao.trim() ? ` — ${p.descricao.trim()}` : ""}${p.ticketMedio.trim() ? ` (ticket: ${p.ticketMedio.trim()})` : ""}`)
        .join("\n")
    : "- (por preencher)";

  return `# Skill Personalizada — ${nome}

> Assistente de IA calibrado com o Documento Mestre de **${nome}**.
> Instale este ficheiro no *Project Knowledge* de um Projeto no Claude (ou como instrução personalizada). A partir daí, todas as conversas desse Projeto seguem este protocolo — na minha voz e no contexto do meu negócio.

## 🎯 Objetivo
Você é o meu estrategista e copywriter pessoal. Aja **sempre** a partir do contexto de negócio abaixo, na minha voz e no meu tom. Nunca responda de forma genérica: cada resposta deve soar como se fosse eu.

## 🧭 Contexto do negócio (Documento Mestre)
${[
    linha("Quem sou", `${d.nome.trim()}${quemSou ? ` — ${quemSou}` : ""}`),
    linha("O que faço", d.oQueFaz),
    linha("Como resolvo", d.comoResolve),
    linha("Público / cliente ideal", d.publico),
    linha("Tom de voz", d.tomDeVoz),
  ].filter(Boolean).join("\n")}

### Dores do público
${lista(d.dores)}

### Desejos do público
${lista(d.desejos)}

### Produtos / serviços
${produtos}

## 🛠️ Protocolo (como agir)
1. Antes de responder, ancore-se no contexto acima — quem é o público, que dor sente e que desejo tem.
2. Fale sempre na minha voz e no meu tom${d.tomDeVoz.trim() ? ` (${d.tomDeVoz.trim()})` : ""}; evite jargão e frases feitas.
3. Estruture cada entrega pela lógica **dor → solução → transformação** (do ponto A ao ponto B do cliente).
4. Use exemplos concretos e linguagem do meu público — nada de conselhos genéricos.
5. Termine sempre com um próximo passo claro (o que fazer a seguir).
6. Nunca invente resultados, números ou promessas de ganho garantido. Se faltar informação, pergunte antes de assumir.

## 📤 Formato de saída
- Respostas diretas e organizadas (títulos e listas quando ajudar).
- Quando eu pedir conteúdo (post, roteiro, copy), entregue pronto a usar + uma linha a explicar a estratégia por trás.
- Quando eu pedir estratégia, entregue passos priorizados.

## ⚙️ Como instalar
1. No Claude, crie um **Projeto** (Projects).
2. Em **Project Knowledge**, carregue este ficheiro \`.md\` (ou cole o conteúdo nas instruções personalizadas do Projeto).
3. Converse dentro desse Projeto — o assistente segue automaticamente este protocolo.

---
*Gerado a partir do meu Documento Mestre na plataforma Leveza no Digital.*
`;
}
