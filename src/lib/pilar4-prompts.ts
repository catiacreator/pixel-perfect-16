// Construtores de prompts do Pilar 4 (Copy de Venda e Eventos).
// Tudo dinâmico — usa o Documento Mestre + Método do utilizador, sem dados fixos.

export type DocMestre = {
  nome?: string;
  profissao?: string;
  oQueFaz?: string;
  comoResolve?: string;
  publico?: string;
  dores?: string[];
  desejos?: string[];
  tomDeVoz?: string;
  produtos?: { nome?: string; descricao?: string; ticketMedio?: string }[];
};

export type MetodoInfo = {
  nomeMetodo: string;
  promessa: string;
  pilares: string;
  posicionamento: string;
  tomDeVoz: string;
};

export function readDocMestre(): DocMestre {
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

function lista(arr?: string[]): string {
  return (arr || []).filter((s) => s && s.trim()).join("; ") || "—";
}

function produtosTexto(doc: DocMestre): string {
  const p = (doc.produtos || []).filter((x) => x?.nome?.trim());
  if (!p.length) return "—";
  return p
    .map((x) => `${x.nome}${x.ticketMedio ? ` (ticket: ${x.ticketMedio})` : ""}`)
    .join("; ");
}

// Bloco de contexto comum (usado em todos os prompts do Pilar 4).
export function perfilContexto(doc: DocMestre, metodo: MetodoInfo): string {
  const tom = metodo.tomDeVoz || doc.tomDeVoz || "—";
  return `PROFISSIONAL: ${doc.nome || "[o teu nome]"}
Profissão: ${doc.profissao || "—"}
O que faz: ${doc.oQueFaz || "—"}
Como resolve: ${doc.comoResolve || "—"}
Público: ${doc.publico || "—"}
Dores do público: ${lista(doc.dores)}
Desejos do público: ${lista(doc.desejos)}
Método: ${metodo.nomeMetodo || "—"}${metodo.promessa ? ` — ${metodo.promessa}` : ""}
Pilares: ${metodo.pilares ? metodo.pilares.replace(/\n/g, " | ") : "—"}
Posicionamento: ${metodo.posicionamento || "—"}
Tom de voz: ${tom}
Produtos atuais: ${produtosTexto(doc)}`;
}

// ---------- Copy de Venda: 7 formatos de oferta ----------

export type FormatoOferta = {
  id: string;
  nome: string;
  faixa: string;
  especialista: string;
  tarefa: string;
};

export const FORMATOS_OFERTA: FormatoOferta[] = [
  {
    id: "consultoria",
    nome: "Consultoria 1-a-1",
    faixa: "R$ 4k – 33k",
    especialista: "ofertas de consultoria de alto ticket",
    tarefa: "OFERTA DE CONSULTORIA",
  },
  {
    id: "mentoria",
    nome: "Mentoria em Grupo",
    faixa: "R$ 2k – 50k / participante",
    especialista: "programas de mentoria em grupo de alto valor",
    tarefa: "OFERTA DE MENTORIA EM GRUPO",
  },
  {
    id: "curso",
    nome: "Curso Online Gravado",
    faixa: "R$ 99 – 997",
    especialista: "cursos online gravados que convertem",
    tarefa: "OFERTA DE CURSO ONLINE",
  },
  {
    id: "workshop-online",
    nome: "Workshop Online",
    faixa: "R$ 9,90 – 99 + oferta",
    especialista: "workshops online de baixo ticket com oferta no fim",
    tarefa: "OFERTA DE WORKSHOP ONLINE",
  },
  {
    id: "workshop-presencial",
    nome: "Workshop Presencial",
    faixa: "R$ 150 – 650 + oferta",
    especialista: "workshops presenciais com oferta de continuidade",
    tarefa: "OFERTA DE WORKSHOP PRESENCIAL",
  },
  {
    id: "produto",
    nome: "Produto Digital / GPT / Skill",
    faixa: "R$ 97 – 497",
    especialista: "produtos digitais (templates, GPTs e skills) de entrada",
    tarefa: "OFERTA DE PRODUTO DIGITAL",
  },
  {
    id: "incompany",
    nome: "In Company / Palestra",
    faixa: "R$ 5k – 50k+",
    especialista: "palestras e treinos in company para empresas",
    tarefa: "OFERTA DE PALESTRA / IN COMPANY",
  },
];

export function buildOfertaPrompt(
  doc: DocMestre,
  metodo: MetodoInfo,
  formato: FormatoOferta,
): string {
  const tom = metodo.tomDeVoz || doc.tomDeVoz || "o teu tom natural";
  return `Você é especialista em criação de ${formato.especialista} para profissionais autônomos.

CONTEXTO DA PROFISSIONAL:
${perfilContexto(doc, metodo)}

TAREFA: Crie uma ${formato.tarefa} completa.

Entregue:
🎯 NOME DA OFERTA
📋 O QUE ESTÁ INCLUÍDO (5–7 entregáveis concretos)
⏱️ DURAÇÃO E FORMATO (sessões, frequência, canal)
💰 SUGESTÃO DE PREÇO (faixa de referência: ${formato.faixa} — com justificativa)
🔥 PROPOSTA DE VALOR (3–4 frases do porquê esta oferta)
❓ PROCESSO SELETIVO / DE ENTRADA (como filtrar ou atrair o cliente certo)
⚠️ PRÓXIMO PASSO (CTA claro)

REGRAS:
- Foco no RESULTADO final do cliente, não nas horas entregues.
- Posicione a oferta como solução definitiva para a dor principal do público.
- Usa a minha voz: ${tom}.
- Não inventes dados que não estão no contexto.`;
}

// ---------- Eventos Presenciais ----------

export function buildEventoPrompt(doc: DocMestre, metodo: MetodoInfo): string {
  return `Você é especialista em criação e monetização de eventos presenciais para profissionais autônomos, mentores e especialistas.

Vou te dar as informações sobre mim e meu negócio. Com base nisso, crie um PROJETO COMPLETO DE EVENTO PRESENCIAL — do conceito à execução.

MINHAS INFORMAÇÕES:
${perfilContexto(doc, metodo)}

Com essas informações, crie um PROJETO DE EVENTO PRESENCIAL completo. Entregue:

🎯 NOME E CONCEITO DO EVENTO (nome memorável + tagline + transformação que promete)
👥 PÚBLICO ALVO (perfil específico, não genérico)
📍 FORMATO (duração ideal — meio dia / dia inteiro / 2 dias — e porquê para o meu nicho)
📋 PROGRAMAÇÃO COMPLETA (blocos com horários: abertura e conexão, conteúdo, atividade prática, coffee, pitch da oferta, encerramento)
🎁 EXPERIÊNCIA DO EVENTO (kit de boas-vindas, atividades, ambiente)
💰 PRECIFICAÇÃO (preço do ingresso + oferta de continuidade + meta de faturamento)
📣 COPY DE DIVULGAÇÃO (texto de 80–120 palavras para Instagram e WhatsApp)
📌 LOGÍSTICA ESSENCIAL (local, capacidade, confirmação de presença, o que levar)
🚀 PRIMEIROS 3 PASSOS PARA EU COMEÇAR HOJE

Usa a minha voz e o meu nicho. Não inventes dados fora do contexto acima.`;
}
