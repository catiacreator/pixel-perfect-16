// ─────────────────────────────────────────────────────────────────────────────
// MÁQUINA DE ANÁLISES — estado e leitura do resultado do prompt.
//
// O passo 2 devolve texto com um formato fixo (ver data/prompts/maquina-analises).
// Aqui traduzimos esse texto nos campos do passo 3, para a pessoa não ter de
// copiar nada à mão — cola uma vez e a plataforma preenche.
// ─────────────────────────────────────────────────────────────────────────────

import type { DocState } from "./doc-mestre";

export type Oferta = { desc: string; preco: string; link: string; /** veio do prompt */ auto?: boolean };

export type FormAnalise = {
  objetivo: string;
  objetivo2: string | null; // null = sem 2º objetivo
  meta: string;
  prazo: string;
  ofertas: Oferta[];
  avatar: string;
  dor: string;
  cta: string;
  promo: string;
};

export const OBJETIVOS = [
  "Crescer audiência (Modo A · diagnóstico)",
  "Atingir um número específico (Modo B · aceleração)",
  "Vender mais o serviço/produto atual",
  "Construir autoridade no nicho",
];

export const FORM_VAZIO: FormAnalise = {
  objetivo: OBJETIVOS[0],
  objetivo2: null,
  meta: "",
  prazo: "",
  ofertas: [{ desc: "", preco: "", link: "" }],
  avatar: "",
  dor: "",
  cta: "",
  promo: "",
};

export const ANALISE_KEY = "leveza.maquina-analises.v1";

export type EstadoAnalise = { saida: string; form: FormAnalise };

export function loadAnalise(): EstadoAnalise {
  if (typeof window === "undefined") return { saida: "", form: FORM_VAZIO };
  try {
    const cru = localStorage.getItem(ANALISE_KEY);
    if (!cru) return { saida: "", form: FORM_VAZIO };
    const d = JSON.parse(cru) as Partial<EstadoAnalise>;
    return { saida: d.saida ?? "", form: { ...FORM_VAZIO, ...(d.form ?? {}) } };
  } catch {
    return { saida: "", form: FORM_VAZIO };
  }
}

export function saveAnalise(e: EstadoAnalise) {
  try {
    localStorage.setItem(ANALISE_KEY, JSON.stringify(e));
  } catch {
    /* sem espaço / modo privado — não vale a pena rebentar por causa disto */
  }
}

/**
 * Monta o prompt final: a metodologia da Cátia + os dados desta conta.
 * A pessoa cola isto no Claude dela (e anexa os screenshots) e recebe os 2
 * documentos. É isto que faz a plataforma não gastar API nenhuma.
 */
export function montarPromptAnalise(dadosPerfil: string, f: FormAnalise): string {
  const modoB = /Modo B/i.test(f.objetivo) || /Modo B/i.test(f.objetivo2 ?? "");
  const ofertas = f.ofertas.filter((o) => o.desc.trim());

  const negocio = [
    `- Objetivo principal (30 dias): ${f.objetivo}`,
    f.objetivo2 ? `- 2º objetivo: ${f.objetivo2}` : "",
    f.meta ? `- Meta concreta: ${f.meta}${f.prazo ? ` em ${f.prazo}` : ""}` : "",
    ...ofertas.map((o) => `- Vende: ${o.desc}${o.preco ? ` | ${o.preco}` : ""}${o.link ? ` | ${o.link}` : ""}`),
    f.avatar ? `- Público-alvo: ${f.avatar}` : "",
    f.dor ? `- Dor principal: ${f.dor}` : "",
    f.cta ? `- Palavra-chave de DM: ${f.cta}` : "",
    f.promo ? `- A promover este mês: ${f.promo}` : "",
  ].filter(Boolean).join("\n");

  return `Age como o analista de perfis de Instagram da Cátia Creator. Anexei os screenshots de um perfil. Produz UM documento de análise completo, em português de Portugal, seguindo o método abaixo à risca. NÃO escrevas roteiros nem carrosséis: isto é só a análise.

═══════════════════════════════════════
DADOS DESTA CONTA
═══════════════════════════════════════
${dadosPerfil.trim() ? dadosPerfil.trim() : "(Sem extração prévia — tira tudo dos screenshots anexados.)"}

NEGÓCIO E OBJETIVOS:
${negocio}

═══════════════════════════════════════
REGRAS ABSOLUTAS (não negociáveis)
═══════════════════════════════════════
- NUNCA inventes views ou métricas. Se não estiverem visíveis nos screenshots, escreve "alcance não disponível nos screenshots" e infere o padrão pelo tipo de conteúdo.
- Sem travessões no corpo de texto. Usa ponto, dois pontos ou vírgula. (Só permitidos em títulos de semana e nos ganchos.)
- Proibido: "conteúdo de valor", "dicas infalíveis", "arrasa", "querida comunidade", "autêntico".
- Tom: consultor honesto e direto, não guru motivacional. A análise pode ser desconfortável: a pessoa quer ouvir a verdade.
- Frases curtas, máximo 3 linhas.
- A primeira observação de cada secção é a MAIS IMPORTANTE, não a mais suave.
- Usa dados reais dos screenshots em todas as secções.

MODO: ${modoB ? "B (ACELERAÇÃO) — a conta tem histórico e há uma meta com prazo" : "A (DIAGNÓSTICO) — o objetivo é crescer"}

PADRÃO CRÍTICO (aprendido em casos reais, procura-o):
O conteúdo pessoal/relatable (que não tem nada a ver com o nicho técnico) tem consistentemente 3 a 10x mais alcance do que o conteúdo educativo. Se isso acontecer nesta conta, nomeia-o sem rodeios.

═══════════════════════════════════════
${modoB ? "ANÁLISE · PLANO DE ACELERAÇÃO" : "ANÁLISE COMPLETA DO PERFIL"}
═══════════════════════════════════════
1. CAPA: kicker, nome, nicho · @handle, linha de dados (seguidores · publicações${modoB ? " · meta" : ""}), e uma frase-chave em itálico (2 linhas máx.) que resuma o diagnóstico central.

2. ${modoB ? "O QUE OS DADOS DIZEM" : "O QUE ESTA ANÁLISE RESOLVE"}: 2 parágrafos de contexto. Depois "O que vi olhando o teu perfil hoje" com 6 a 9 observações. Cada uma: título a negrito (um FACTO, não um julgamento) + 2-4 linhas com dados reais.
   Inclui sempre: bio, produto/serviço visível, formato vencedor, irregularidade, identidade visual, clareza do nicho.

3. A BIO: DIAGNÓSTICO E PROPOSTA. Diagnóstico (1-2 linhas), bio atual, bio proposta, nota do que mudou e porquê.
   A bio proposta tem 4 linhas: (1) nome + credencial; (2) para quem e o que resolve — foca no cliente, não nas ferramentas; (3) prova quantificada — só se for real e visível, senão omite; (4) CTA direto com a palavra-chave de DM.

4. ${modoB ? "OS FORMATOS VENCEDORES" : "O PADRÃO QUE JÁ FUNCIONA"}: parágrafo introdutório + tabela de 3 colunas (Publicação/Gancho | Views | Porque funcionou), 5 a 10 linhas com dados reais, ordenadas do maior para o menor. Última linha: "Resto do conteúdo (média)" com o intervalo. Fecha com a fórmula repetível.

5. AJUSTES IMEDIATOS: 5 ajustes numerados por ordem de impacto. Inclui sempre bio, fixar 3 Reels, destaque de testemunhos e resposta automática de DM.

6. MÉTRICAS A ACOMPANHAR: ${modoB ? "tabela de 5 colunas (Métrica | Semana 1 | 2 | 3 | 4+30)" : "tabela de 4 colunas (Métrica | Mínima | Base | Otimista)"}, 6 a 7 métricas ligadas ao objetivo.

7. CARTA DE FECHO: nome, vírgula. Parágrafo 1: o que já funciona (com dados). Parágrafo 2: o que está a travar, sem suavizar. Parágrafo 3: o que muda em 30 dias, com números do cenário base. Frase-chave em itálico. "Boa sorte." Assinatura: "Cátia Creator".

═══════════════════════════════════════
FORMATO DE ENTREGA
═══════════════════════════════════════
Entrega em TEXTO SIMPLES, pronto a copiar e a guardar como .txt. NÃO faças PDF,
HTML nem artefacto interativo — só texto corrido. É este ficheiro que a pessoa vai
carregar depois no Plano Estratégico, que se encarrega de escrever os posts todos.
Não escrevas roteiros nem carrosséis aqui: para o conteúdo, é o Plano Estratégico.`;
}

// ─── Documento Mestre como fonte ─────────────────────────────────────────────
// Quem já preencheu o Documento Mestre não tem de repetir o público, as dores
// nem os produtos: sai tudo de lá. Só fica a faltar o que é próprio desta
// análise — os screenshots e os objetivos do mês.
//
// Nota: o faturamento fica de fora de propósito. Não entra em nenhum dos dois
// documentos que o prompt produz, e este texto vai ser colado num chat externo.

export type FonteAnalise = "doc" | "zero";

export type DadosDoDoc = {
  /** Campos do passo dos objetivos já preenchidos. */
  campos: Partial<FormAnalise>;
  /** Bloco "DADOS DESTA CONTA" do prompt final. */
  dados: string;
  /** false = Documento Mestre ainda vazio, não vale a pena oferecer. */
  temConteudo: boolean;
};

export function docMestreParaAnalise(d: DocState): DadosDoDoc {
  const dores = d.dores.filter((x) => x.trim());
  const desejos = d.desejos.filter((x) => x.trim());
  const produtos = d.produtos.filter((p) => p.nome.trim() || p.descricao.trim());

  const ofertas: Oferta[] = produtos.map((p) => ({
    desc: [p.nome.trim(), p.descricao.trim()].filter(Boolean).join(" — "),
    preco: p.ticketMedio.trim(),
    link: "",
    auto: true,
  }));

  const campos: Partial<FormAnalise> = {};
  if (ofertas.length) campos.ofertas = ofertas;
  if (d.publico.trim()) campos.avatar = d.publico.trim();
  if (dores.length) campos.dor = dores[0];

  const dados = [
    d.nome.trim() && `- Nome: ${d.nome.trim()}`,
    d.profissao.trim() && `- Profissão: ${d.profissao.trim()}`,
    d.tempoAtuacao.trim() && `- Tempo de atuação: ${d.tempoAtuacao.trim()}`,
    d.localizacao.trim() && `- Localização: ${d.localizacao.trim()}`,
    d.oQueFaz.trim() && `- O que faz: ${d.oQueFaz.trim()}`,
    d.comoResolve.trim() && `- Como resolve: ${d.comoResolve.trim()}`,
    d.publico.trim() && `- Público-alvo: ${d.publico.trim()}`,
    dores.length && `- Dores do público: ${dores.join(" | ")}`,
    desejos.length && `- Desejos do público: ${desejos.join(" | ")}`,
    ...ofertas.map((o) => `- Vende: ${o.desc}${o.preco ? ` | ${o.preco}` : ""}`),
    d.tomDeVoz.trim() && `- Tom de voz: ${d.tomDeVoz.trim()}`,
    (d.horasDia.trim() || d.diasSemana.trim()) &&
      `- Disponibilidade para conteúdo: ${[d.horasDia.trim() && `${d.horasDia.trim()} por dia`, d.diasSemana.trim() && `${d.diasSemana.trim()} dias por semana`].filter(Boolean).join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { campos, dados, temConteudo: !!dados };
}

/** Apanha "Etiqueta: valor" em qualquer linha (com ou sem hífen à frente). */
function campo(txt: string, etiqueta: string): string {
  const re = new RegExp(`(?:^|\\n)\\s*-?\\s*${etiqueta}\\s*:?\\s*(.+)`, "i");
  return txt.match(re)?.[1]?.trim() ?? "";
}

export type LeituraPerfil = {
  ofertas: Oferta[];
  avatar: string;
  dor: string;
  cta: string;
  promo: string;
  /** true se alguma coisa foi mesmo encontrada */
  encontrou: boolean;
};

/** Lê o resultado do prompt e devolve os campos do passo 3 já preenchidos. */
export function lerDadosPerfil(txt: string): LeituraPerfil {
  const linhas = [...txt.matchAll(/(?:^|\n)\s*-?\s*Vende\s*:\s*(.+)/gi)].map((m) => m[1].trim());
  const ofertas: Oferta[] = linhas.map((l) => {
    const p = l.split("|").map((s) => s.trim());
    return { desc: p[0] ?? "", preco: p[1] ?? "", link: p[2] ?? "", auto: true };
  });

  const avatar = campo(txt, "Publico-alvo") || campo(txt, "Público-alvo");
  const dor = campo(txt, "Dor principal");
  const cta = campo(txt, "Palavra-chave");
  // Se houver uma oferta de entrada (desafio/grátis), é a candidata a promover.
  const promo = ofertas.find((o) => /desafio|grat/i.test(o.desc + o.preco))?.desc ?? "";

  return {
    ofertas,
    avatar,
    dor,
    cta,
    promo,
    encontrou: !!(ofertas.length || avatar || dor || cta),
  };
}
