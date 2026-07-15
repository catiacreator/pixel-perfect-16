// "Criar Produto e Enriquecer" — reutiliza o Documento Mestre e monta uma
// ESTEIRA de produtos (low / médio / alto ticket). Para cada nível gera prompts
// (método Cat.IA) e guarda os resultados que a pessoa cola de volta: página de
// vendas, sequência de stories e posts de feed (topo/meio/fundo de funil).
// Lógica pura, sem React.

import type { DocState } from "@/lib/doc-mestre";

export type NivelKey = "low" | "medio" | "alto";

export const NIVEIS: { key: NivelKey; rotulo: string; etiqueta: string; dica: string; cor: string }[] = [
  { key: "low", rotulo: "Low ticket", etiqueta: "Porta de entrada", dica: "Barato e de decisão fácil — ebook, template, mini-aula (≈ 7€ a 47€).", cor: "#C88A4E" },
  { key: "medio", rotulo: "Médio ticket", etiqueta: "Produto principal", dica: "O teu produto central — curso, comunidade, programa (≈ 97€ a 497€).", cor: "#A9683C" },
  { key: "alto", rotulo: "Alto ticket", etiqueta: "Premium", dica: "Acompanhamento próximo — mentoria, consultoria (≈ 800€+).", cor: "#6B3F2A" },
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
export function promptIdeiasEsteira(d: DocState): string {
  return `Age como estratega de produtos digitais para experts e mentores. Com base no meu Documento Mestre, desenha-me uma ESTEIRA DE PRODUTOS completa (uma "escada de valor") com 3 níveis para o meu público.

${contextoDoc(d)}

Entrega EXATAMENTE 3 produtos, um por nível:

1) LOW TICKET (porta de entrada — barato, decisão fácil, ≈ 7€ a 47€)
2) MÉDIO TICKET (produto principal, ≈ 97€ a 497€)
3) ALTO TICKET (premium / acompanhamento próximo, ≈ 800€+)

Para CADA nível entrega:
- Nome sugerido (magnético)
- Formato (ebook, template, mini-curso, curso, comunidade, mentoria…)
- Transformação em 1 frase ("de X para Y")
- Para quem é (dentro do meu público)
- Preço sugerido (em €)
- Porque vende (a dor/desejo que resolve)
- Como liga ao nível seguinte (a jornada do cliente entre eles)

No fim, diz por qual devo começar e porquê. ${REGRAS}`;
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
${REGRAS}`;
}

export function promptStories(d: DocState, rotulo: string, p: ProdutoNivel): string {
  return `Age como a Cat.IA, especialista em conteúdo e vendas no Instagram (método: Reels atraem → Carrosséis educam → Stories convertem → Direct fecha). Cria uma SEQUÊNCIA DE STORIES para lançar e vender este produto da minha esteira, pronta a gravar.

${contextoDoc(d)}

${contextoProduto(rotulo, p)}

Entrega 3 dias de stories (5 a 7 por dia):
- Dia 1 — Aquecer: identificação com a dor + agitação (ainda sem falar do produto).
- Dia 2 — Doutrinar: a nova forma + prova/bastidores + quebra de objeções.
- Dia 3 — Vender: abre a oferta, mostra o produto, urgência real, CTA para o Direct ("manda a palavra [PALAVRA]").

Para CADA story: o que MOSTRAR + o TEXTO/legenda + o CTA. Usa enquetes/caixas de pergunta onde fizer sentido. ${REGRAS}`;
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
