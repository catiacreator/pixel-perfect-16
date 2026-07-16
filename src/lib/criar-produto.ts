// "Criar Produto e Enriquecer" — reutiliza o Documento Mestre e monta uma
// ESTEIRA de produtos (low / médio / alto ticket). Para cada nível gera prompts
// (método Cat.IA) e guarda os resultados que a pessoa cola de volta: página de
// vendas, sequência de stories e posts de feed (topo/meio/fundo de funil).
// Lógica pura, sem React.

import { type DocState, EMPTY as DOC_EMPTY, padArray } from "@/lib/doc-mestre";

// Documento Mestre PRÓPRIO deste produto (separado do Documento Mestre principal),
// porque a página "Criar Produto" é vendida como produto individual.
export const PRODUTO_DOC_KEY = "leveza.criar-produto.doc.v1";

export function loadProdutoDocMestre(): DocState {
  if (typeof window === "undefined") return DOC_EMPTY;
  try {
    const raw = window.localStorage.getItem(PRODUTO_DOC_KEY);
    if (!raw) return DOC_EMPTY;
    const parsed = JSON.parse(raw) as Partial<DocState>;
    return {
      ...DOC_EMPTY,
      ...parsed,
      dores: padArray((parsed.dores ?? []).slice(0, 5), 5),
      desejos: padArray((parsed.desejos ?? []).slice(0, 5), 5),
    };
  } catch {
    return DOC_EMPTY;
  }
}

export type NivelKey = "low" | "medio" | "alto";

export const NIVEIS: { key: NivelKey; rotulo: string; etiqueta: string; dica: string; cor: string }[] = [
  { key: "low", rotulo: "Low ticket", etiqueta: "Porta de entrada", dica: "Barato e de decisão fácil — ebook, template, mini-aula (≈ 7€ a 47€).", cor: "#6FCB9F" },
  { key: "medio", rotulo: "Médio ticket", etiqueta: "Produto principal", dica: "O teu produto central — curso, comunidade, programa (≈ 97€ a 497€).", cor: "#2F9E6E" },
  { key: "alto", rotulo: "Alto ticket", etiqueta: "Premium", dica: "Acompanhamento próximo — mentoria, consultoria (≈ 800€+).", cor: "#1F6B4A" },
];

export type ProdutoNivel = {
  nome: string;
  formato: string;
  transformacao: string; // de X para Y
  preco: string;
  // resultados que a pessoa cola de volta depois de usar os prompts
  landing: string;
  stories: string;
  postsTopo: string;
  postsMeio: string;
  postsFundo: string;
};

const NIVEL_VAZIO: ProdutoNivel = {
  nome: "", formato: "", transformacao: "", preco: "",
  landing: "", stories: "", postsTopo: "", postsMeio: "", postsFundo: "",
};

export type Esteira = {
  ideias: string; // resultado colado do prompt de ideias da esteira
  niveis: Record<NivelKey, ProdutoNivel>;
};

export const ESTEIRA_EMPTY: Esteira = {
  ideias: "",
  niveis: { low: { ...NIVEL_VAZIO }, medio: { ...NIVEL_VAZIO }, alto: { ...NIVEL_VAZIO } },
};

export const ESTEIRA_KEY = "leveza.esteira.v1";
// chave antiga (produto único) — migrada para o nível "médio"
const LEGADO_KEY = "leveza.criar-produto.v1";

export function loadEsteira(): Esteira {
  if (typeof window === "undefined") return clonar(ESTEIRA_EMPTY);
  try {
    const raw = window.localStorage.getItem(ESTEIRA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Esteira>;
      return {
        ideias: parsed.ideias ?? "",
        niveis: {
          low: { ...NIVEL_VAZIO, ...(parsed.niveis?.low ?? {}) },
          medio: { ...NIVEL_VAZIO, ...(parsed.niveis?.medio ?? {}) },
          alto: { ...NIVEL_VAZIO, ...(parsed.niveis?.alto ?? {}) },
        },
      };
    }
    // migração do produto único antigo → nível médio
    const legado = window.localStorage.getItem(LEGADO_KEY);
    if (legado) {
      const p = JSON.parse(legado) as { nomeProduto?: string; formato?: string; transformacao?: string; preco?: string };
      const base = clonar(ESTEIRA_EMPTY);
      base.niveis.medio = { ...NIVEL_VAZIO, nome: p.nomeProduto ?? "", formato: p.formato ?? "", transformacao: p.transformacao ?? "", preco: p.preco ?? "" };
      return base;
    }
  } catch { /* ignora localStorage inválido */ }
  return clonar(ESTEIRA_EMPTY);
}

function clonar(e: Esteira): Esteira {
  return { ideias: e.ideias, niveis: { low: { ...e.niveis.low }, medio: { ...e.niveis.medio }, alto: { ...e.niveis.alto } } };
}

// ────────────────────────────── contexto ──────────────────────────────
function contextoDoc(d: DocState): string {
  const linhas = (arr: string[]) => arr.filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join("\n") || "(vazio)";
  const produtos = d.produtos.length
    ? d.produtos.map((p) => `- ${p.nome || "(sem nome)"}${p.descricao ? " — " + p.descricao : ""}${p.ticketMedio ? " (" + p.ticketMedio + ")" : ""}`).join("\n")
    : "(nenhum ainda)";
  return `SOBRE MIM (o meu Documento Mestre):
Nome: ${d.nome || "(vazio)"}
Profissão / especialidade: ${d.profissao || "(vazio)"}
O que faço (1 frase): ${d.oQueFaz || "(vazio)"}
Como resolvo: ${d.comoResolve || "(vazio)"}
O meu público: ${d.publico || "(vazio)"}
Dores do público:
${linhas(d.dores)}
Desejos do público:
${linhas(d.desejos)}
Produtos/serviços atuais:
${produtos}
Tom de voz da minha marca: ${d.tomDeVoz || "(vazio)"}`;
}

function contextoProduto(rotulo: string, p: ProdutoNivel): string {
  return `O PRODUTO (nível ${rotulo}):
Nome (se já tenho): ${p.nome || "(a definir)"}
Formato: ${p.formato || "(a definir)"}
Transformação que entrega (de X para Y): ${p.transformacao || "(a definir)"}
Preço / faixa: ${p.preco || "(a definir)"}`;
}

const REGRAS = `Regras: usa a minha voz e o meu tom de marca; português de Portugal; linguagem simples e específica; SEM clichês ("fórmula mágica", "segredo revelado", "guia definitivo"). Entrega tudo pronto a copiar.`;

// ────────────────────────────── prompts ──────────────────────────────
// Ajuda a DESCOBRIR o público/dores/desejos (para quem não sabe preencher).
export function promptDescobrirPublico(d: DocState): string {
  return `Age como estratega de posicionamento e ajuda-me a DESCOBRIR o meu público-alvo, as suas dores e os seus desejos — para eu preencher o meu Documento Mestre.

O que já sei sobre mim:
Nome: ${d.nome || "(vazio)"}
Profissão / especialidade: ${d.profissao || "(vazio)"}
O que faço: ${d.oQueFaz || "(vazio)"}
Como resolvo: ${d.comoResolve || "(vazio)"}

Trabalha num destes dois modos, à minha escolha:

MODO A — ENTREVISTA (se eu não souber responder sozinho):
Faz-me perguntas UMA DE CADA VEZ, curtas e simples, e espera pela minha resposta antes da próxima (no máximo 6 a 8 perguntas). O objetivo é perceber quem eu ajudo e o que essas pessoas sentem.

MODO B — ANÁLISE DO MEU INSTAGRAM (se eu anexar material):
Se eu te anexar screenshots ou colar informação, analisa e infere o público. Usa o que eu enviar: a minha BIO, os meus 6 a 9 POSTS com mais alcance/gravações, os COMENTÁRIOS e MENSAGENS (DMs) que mais se repetem, e os INSIGHTS → Público (idade, género, localização).

No FIM (em qualquer modo), entrega SÓ este bloco, EXATAMENTE neste formato — mantém as etiquetas em MAIÚSCULAS e cada item numerado numa linha própria, para eu colar de uma vez:

PÚBLICO: <2 a 3 frases sobre quem é o público>
DORES:
1. <dor>
2. <dor>
3. <dor>
4. <dor>
5. <dor>
DESEJOS:
1. <desejo>
2. <desejo>
3. <desejo>
4. <desejo>
5. <desejo>

Não acrescentes texto antes nem depois deste bloco.
Regras: português de Portugal, linguagem simples e específica, na perspetiva do público (as palavras que ELES usariam), sem clichés.`;
}

// Distribui o output do prompt "Descobrir público" pelos campos do Documento
// Mestre (público / 5 dores / 5 desejos). Tolerante a pequenas variações.
export function parsePublicoResult(texto: string): { publico: string; dores: string[]; desejos: string[] } {
  const t = (texto || "").replace(/\r/g, "");
  const idxPub = t.search(/p[úu]blico\s*[:\-]/i);
  const idxDor = t.search(/dores\s*[:\-]/i);
  const idxDes = t.search(/desejos\s*[:\-]/i);

  const semEtiqueta = (s: string) => s.replace(/^[^\n:]*[:\-]\s*/, "");

  let publico = "";
  if (idxPub >= 0) {
    const fim = idxDor >= 0 ? idxDor : idxDes >= 0 ? idxDes : t.length;
    publico = semEtiqueta(t.slice(idxPub, fim)).trim();
  }

  const itens = (bloco: string): string[] =>
    semEtiqueta(bloco)
      .replace(/\s+(\d+[.)])/g, "\n$1") // força uma linha por item mesmo em texto corrido
      .split("\n")
      .map((l) => l.trim().replace(/^\s*(?:\d+[.)]|[-•*])\s*/, "").trim())
      .filter(Boolean);

  let dores: string[] = [];
  if (idxDor >= 0) dores = itens(t.slice(idxDor, idxDes >= 0 ? idxDes : t.length));

  let desejos: string[] = [];
  if (idxDes >= 0) desejos = itens(t.slice(idxDes));

  return { publico, dores: dores.slice(0, 5), desejos: desejos.slice(0, 5) };
}

export function promptIdeiasEsteira(d: DocState): string {
  return `Age como estratega de produtos digitais para experts e mentores. Com base no meu Documento Mestre, desenha-me uma ESTEIRA DE PRODUTOS completa (uma "escada de valor") com 3 níveis para o meu público.

${contextoDoc(d)}

Entrega EXATAMENTE 3 produtos (low, médio e alto ticket), CADA UM neste formato EXATO — mantém os cabeçalhos "=== ... ===" e as etiquetas, um campo por linha:

=== LOW TICKET ===
Nome: <nome magnético>
Formato: <ebook, template, mini-curso, curso, comunidade, mentoria…>
Transformação: <de X para Y, numa frase>
Preço: <faixa em €, ex.: 27€>
Para quem: <dentro do meu público>
Porque vende: <a dor/desejo que resolve>

=== MÉDIO TICKET ===
Nome: ...
Formato: ...
Transformação: ...
Preço: ...
Para quem: ...
Porque vende: ...

=== ALTO TICKET ===
Nome: ...
Formato: ...
Transformação: ...
Preço: ...
Para quem: ...
Porque vende: ...

Depois dos 3 blocos, diz numa linha por qual começar e porquê. ${REGRAS}`;
}

// Distribui o resultado do prompt de ideias pelos 3 níveis (nome/formato/transformação/preço).
export function parseEsteiraIdeias(texto: string): Record<NivelKey, Partial<ProdutoNivel>> {
  const t = (texto || "").replace(/\r/g, "");
  const idx = (re: RegExp) => { const m = t.match(re); return m && m.index != null ? m.index : -1; };
  const pontos = ([
    { key: "low" as NivelKey, i: idx(/low[\s-]*ticket/i) },
    { key: "medio" as NivelKey, i: idx(/m[ée]dio[\s-]*ticket/i) },
    { key: "alto" as NivelKey, i: idx(/alto[\s-]*ticket/i) },
  ]).filter((p) => p.i >= 0).sort((a, b) => a.i - b.i);

  const campo = (bloco: string, re: RegExp) => { const m = bloco.match(re); return m ? m[1].split("\n")[0].trim() : ""; };
  const out: Record<NivelKey, Partial<ProdutoNivel>> = { low: {}, medio: {}, alto: {} };
  pontos.forEach((p, n) => {
    const bloco = t.slice(p.i, n + 1 < pontos.length ? pontos[n + 1].i : t.length);
    out[p.key] = {
      nome: campo(bloco, /nome\s*[:\-]\s*(.+)/i),
      formato: campo(bloco, /formato\s*[:\-]\s*(.+)/i),
      transformacao: campo(bloco, /transforma[çc][ãa]o\s*[:\-]\s*(.+)/i),
      preco: campo(bloco, /pre[çc]o\s*[:\-]\s*(.+)/i),
    };
  });
  return out;
}

// Separa o resultado dos posts de feed por fase do funil (topo/meio/fundo).
export function parsePostsFunil(texto: string): { topo: string; meio: string; fundo: string } {
  const t = (texto || "").replace(/\r/g, "");
  const idx = (re: RegExp) => { const m = t.match(re); return m && m.index != null ? m.index : -1; };
  const pontos = ([
    { k: "topo" as const, i: idx(/topo\s*de\s*funil|===\s*topo/i) },
    { k: "meio" as const, i: idx(/meio\s*de\s*funil|===\s*meio/i) },
    { k: "fundo" as const, i: idx(/fundo\s*de\s*funil|===\s*fundo/i) },
  ]).filter((p) => p.i >= 0).sort((a, b) => a.i - b.i);
  const res: { topo: string; meio: string; fundo: string } = { topo: "", meio: "", fundo: "" };
  pontos.forEach((p, n) => {
    const bloco = t.slice(p.i, n + 1 < pontos.length ? pontos[n + 1].i : t.length);
    res[p.k] = bloco.replace(/^.*(?:\n|$)/, "").trim(); // tira a linha do cabeçalho
  });
  return res;
}

export function promptLandingPage(d: DocState, rotulo: string, p: ProdutoNivel): string {
  return `Age como copywriter de resposta direta. Escreve o TEXTO COMPLETO de uma página de vendas (landing page) para este produto da minha esteira, pronta a copiar.

${contextoDoc(d)}

${contextoProduto(rotulo, p)}

Entrega cada secção já com o texto pronto:
1. Título (promessa forte) + subtítulo
2. O problema (espelha a dor do público)
3. A viragem / a nova forma de resolver
4. O que é o produto + o que inclui (bullets)
5. A transformação (antes → depois)
6. Para quem é / para quem NÃO é
7. Prova e autoridade (deixa [DEPOIMENTO] para eu preencher)
8. A oferta + preço + bónus
9. Garantia
10. FAQ (5 perguntas com resposta)
11. CTA final

Entrega só o texto da página, pronto a colar (sem comentários antes nem depois). ${REGRAS}`;
}

export function promptStories(d: DocState, rotulo: string, p: ProdutoNivel): string {
  return `Age como a Cat.IA, especialista em conteúdo e vendas no Instagram (método: Reels atraem → Carrosséis educam → Stories convertem → Direct fecha). Cria uma SEQUÊNCIA DE STORIES para lançar e vender este produto da minha esteira, pronta a gravar.

${contextoDoc(d)}

${contextoProduto(rotulo, p)}

Entrega 3 dias de stories (5 a 7 por dia):
- Dia 1 — Aquecer: identificação com a dor + agitação (ainda sem falar do produto).
- Dia 2 — Doutrinar: a nova forma + prova/bastidores + quebra de objeções.
- Dia 3 — Vender: abre a oferta, mostra o produto, urgência real, CTA para o Direct ("manda a palavra [PALAVRA]").

Para CADA story: o que MOSTRAR + o TEXTO/legenda + o CTA. Usa enquetes/caixas de pergunta onde fizer sentido.

Entrega só a sequência, pronta a colar (sem comentários antes nem depois). ${REGRAS}`;
}

export function promptPostsFunil(d: DocState, rotulo: string, p: ProdutoNivel): string {
  return `Age como a Cat.IA, especialista em conteúdo para Instagram. Cria POSTS DE FEED para promover este produto da minha esteira, organizados pelas 3 fases do funil.

${contextoDoc(d)}

${contextoProduto(rotulo, p)}

Entrega os posts SEPARADOS por fase, com um cabeçalho bem claro para cada (=== TOPO ===, === MEIO ===, === FUNDO ===) para eu poder copiar cada bloco:

=== TOPO DE FUNIL === (atrair pessoas novas — alcance, dor, identificação): 2 posts
=== MEIO DE FUNIL === (nutrir quem já segue — autoridade, prova, educação, quebra de objeções): 2 posts
=== FUNDO DE FUNIL === (vender — oferta, urgência, CTA direto): 2 posts

Para CADA post entrega:
- Formato (Reel, carrossel ou imagem única) e porquê
- Gancho (1ª linha que trava o scroll)
- Legenda completa no método PAS (Problema → Agitação → Solução), pronta a copiar
- CTA (salvar / comentar palavra / ir ao Direct)
- Se for carrossel: o texto slide a slide
${REGRAS}`;
}
