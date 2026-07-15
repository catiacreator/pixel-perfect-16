// "Criar Produto e Enriquecer" — reutiliza o Documento Mestre e gera prompts
// prontos a colar no ChatGPT ou Claude: ideias de produto, landing page,
// sequência de stories e posts (método Cat.IA). Lógica pura, sem React.

import type { DocState } from "@/lib/doc-mestre";

export type ProdutoExtra = {
  nomeProduto: string;
  formato: string; // ex.: ebook, mini-curso, curso, mentoria, comunidade, kit/template
  transformacao: string; // o resultado que entrega (de X para Y)
  preco: string; // faixa de preço / ticket
};

export const PRODUTO_EXTRA_EMPTY: ProdutoExtra = { nomeProduto: "", formato: "", transformacao: "", preco: "" };
export const PRODUTO_EXTRA_KEY = "leveza.criar-produto.v1";

export function loadProdutoExtra(): ProdutoExtra {
  if (typeof window === "undefined") return { ...PRODUTO_EXTRA_EMPTY };
  try {
    const raw = window.localStorage.getItem(PRODUTO_EXTRA_KEY);
    if (!raw) return { ...PRODUTO_EXTRA_EMPTY };
    return { ...PRODUTO_EXTRA_EMPTY, ...(JSON.parse(raw) as Partial<ProdutoExtra>) };
  } catch {
    return { ...PRODUTO_EXTRA_EMPTY };
  }
}

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

function contextoProduto(p: ProdutoExtra): string {
  return `O PRODUTO:
Nome (se já tenho): ${p.nomeProduto || "(a definir)"}
Formato: ${p.formato || "(a definir)"}
Transformação que entrega (de X para Y): ${p.transformacao || "(a definir)"}
Preço / faixa: ${p.preco || "(a definir)"}`;
}

const REGRAS = `Regras: usa a minha voz e o meu tom de marca; português de Portugal; linguagem simples e específica; SEM clichês ("fórmula mágica", "segredo revelado", "guia definitivo"). Entrega tudo pronto a copiar.`;

export function promptIdeiasProduto(d: DocState): string {
  return `Age como estratega de produtos digitais para experts e mentores. Com base no meu Documento Mestre, dá-me 5 IDEIAS de produtos digitais que eu poderia criar e vender ao meu público — do mais simples (low ticket) ao mais completo (alto valor).

${contextoDoc(d)}

Para CADA ideia entrega:
- Nome sugerido (magnético)
- Formato (ebook, mini-curso, curso, mentoria em grupo, comunidade, template/kit…)
- Transformação em 1 frase ("de X para Y")
- Para quem é (dentro do meu público)
- Faixa de preço sugerida (em €)
- Porque vende (a dor/desejo que resolve)

Ordena da mais fácil de criar para a mais completa. No fim, recomenda por qual começar e porquê. ${REGRAS}`;
}

export function promptLandingPage(d: DocState, p: ProdutoExtra): string {
  return `Age como copywriter de resposta direta. Escreve o TEXTO COMPLETO de uma página de vendas (landing page) para o meu produto, pronta a copiar.

${contextoDoc(d)}

${contextoProduto(p)}

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

export function promptStories(d: DocState, p: ProdutoExtra): string {
  return `Age como a Cat.IA, especialista em conteúdo e vendas no Instagram (método: Reels atraem → Carrosséis educam → Stories convertem → Direct fecha). Cria uma SEQUÊNCIA DE STORIES para lançar e vender o meu produto, pronta a gravar.

${contextoDoc(d)}

${contextoProduto(p)}

Entrega 3 dias de stories (5 a 7 por dia):
- Dia 1 — Aquecer: identificação com a dor + agitação (ainda sem falar do produto).
- Dia 2 — Doutrinar: a nova forma + prova/bastidores + quebra de objeções.
- Dia 3 — Vender: abre a oferta, mostra o produto, urgência real, CTA para o Direct ("manda a palavra [PALAVRA]").

Para CADA story: o que MOSTRAR + o TEXTO/legenda + o CTA. Usa enquetes/caixas de pergunta onde fizer sentido. ${REGRAS}`;
}

export function promptPosts(d: DocState, p: ProdutoExtra): string {
  return `Age como a Cat.IA, especialista em conteúdo para Instagram. Cria 5 POSTS de feed para promover o meu produto sem soar a anúncio — que geram autoridade e desejo.

${contextoDoc(d)}

${contextoProduto(p)}

Para CADA post entrega:
- Formato (Reel, carrossel ou imagem única) e porquê
- Gancho (1ª linha que trava o scroll)
- Legenda completa no método PAS (Problema → Agitação → Solução), pronta a copiar
- CTA (salvar / comentar palavra / ir ao Direct)
- Se for carrossel: o texto slide a slide

Varia os ângulos (dor, desejo, objeção, prova, bastidores). ${REGRAS}`;
}
