// Prompts das "Ideias da rotina" (pop-up ✨ nas Postagens da jornada).
// Cada prompt usa os marcadores [entre_colchetes] que o PromptCard/fillPilar2Prompt
// preenche com o Documento Mestre + Esboço do Método da aluna.

export type IdeiaCard = {
  categoria: string;
  nome: string;
  objetivo: string;
  prompt: string;
};

// Bloco de contexto comum (preenchido com o Documento Mestre).
const CONTEXTO = `Você é meu estrategista de conteúdo para Instagram. Use SEMPRE o meu contexto abaixo.

📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público: [publico]
- Dores do público:
[dores_lista]
- Método (promessa): [promessa]
- Tom de voz: [tom_de_voz]
- Palavras a usar: [palavras_usar]
- Palavras a evitar: [palavras_evitar]`;

// Sequência obrigatória de 5 Stories + passo final DALL-E (cards 1–3).
const SEQUENCIA_5 = `Depois crie uma SEQUÊNCIA OBRIGATÓRIA de 5 Stories:
- Story 1 (Tensão): frase que abre uma dor, erro ou pergunta forte
- Story 2 (Identificação): cena que faz a audiência se reconhecer
- Story 3 (Clareza): microensino ou distinção de percepção
- Story 4 (Prova/Exemplo): caso, bastidor, analogia ou demonstração
- Story 5 (Convite): ação simples — palavra-chave, pergunta ou link

PASSO FINAL AUTOMÁTICO: depois de eu aprovar a sequência, gere uma imagem (DALL-E) para a capa do Story 1 — formato vertical 9:16, fundo escuro elegante, a frase do Story 1 em destaque, estilo minimalista profissional.`;

const card1: IdeiaCard = {
  categoria: "Semana 4 — Convite e decisão",
  nome: "Stories de convite e decisão",
  objetivo: "Conduzir para mensagem direta, aplicação ou compra.",
  prompt: `${CONTEXTO}

🎯 CONTEXTO DO DIA
Tema estratégico: Convite e decisão.
Objetivo: conduzir para mensagem direta, aplicação ou compra.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Qual tipo de Story prefere hoje? (a) Microdiagnóstico, (b) Bastidor de método, (c) Convite para conversa
2. Tem algum caso de cliente, resultado ou situação recente para usar? (sim/não)
3. Vai aparecer em: (a) Vídeo falado, (b) Texto/print estático, (c) Mistura dos dois

${SEQUENCIA_5}`,
};

const card2: IdeiaCard = {
  categoria: "Interação",
  nome: "Caixinha estratégica ou enquete",
  objetivo: "Coletar dúvidas e identificar quem está mais perto de contratar.",
  prompt: `${CONTEXTO}

🎯 CONTEXTO DO DIA
Hoje quero criar Stories de interação e diagnóstico.
Objetivo: coletar dúvidas e identificar quem está mais próxima de contratar.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Qual tipo de Story prefere hoje? (a) Caixinha de perguntas, (b) Enquete de maturidade, (c) Pergunta direta
2. Tem caso de cliente ou situação recente? (sim/não)
3. Vai aparecer em: (a) Vídeo falado, (b) Texto/print estático, (c) Mistura dos dois

Ao criar, inclua: uma abertura que justifique por que está a perguntar, o recurso interativo (caixinha/enquete), como vai usar as respostas, e um convite para quem quer ir além.

${SEQUENCIA_5}`,
};

const card3: IdeiaCard = {
  categoria: "Autoridade",
  nome: "Bastidor de método ou caso real",
  objetivo: "Mostrar profundidade e resultado do seu trabalho.",
  prompt: `${CONTEXTO}

🎯 CONTEXTO DO DIA
Hoje quero criar Stories de autoridade e prova.
Objetivo: mostrar que domino o que faço e que já ajudei outras pessoas.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Qual tipo de Story prefere hoje? (a) Bastidor de método, (b) Miniestudo de caso, (c) Opinião polêmica
2. Tem caso de cliente ou situação recente? (sim/não)
3. Vai aparecer em: (a) Vídeo falado, (b) Texto/print estático, (c) Mistura dos dois

${SEQUENCIA_5}`,
};

const card4: IdeiaCard = {
  categoria: "Áudio Stories",
  nome: "Liga o som — story em áudio",
  objetivo: "Imagem de fundo + ondas sonoras + texto a pedir para ligar o som.",
  prompt: `${CONTEXTO}

🎙️ FORMATO — ÁUDIO STORY
A pessoa vê uma imagem de fundo; aparece a figurinha de ondas sonoras indicando que tem áudio; um texto curto pede "🔊 liga o som"; o conteúdo principal é entregue pela voz em até 60 segundos.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Qual tema quer abordar? (a) Opinião direta sobre o nicho, (b) Bastidor ou reflexão do dia, (c) Dica rápida e prática
2. Qual o tom do áudio? (a) Íntimo e próximo, (b) Direto e objetivo, (c) Provocador
3. Já tem a frase de abertura ou quer que eu crie?

Depois entregue 3 elementos:
- ROTEIRO DO ÁUDIO (máx. 60s): Abertura + Desenvolvimento + Fechamento
- IMAGEM DE FUNDO (DALL-E, 9:16): gradiente suave, sem pessoas, sem texto, tons elegantes, minimalista
- TEXTO OVERLAY para colocar sobre a imagem: linha superior "🔊 liga o som", sugestão de figurinha de ondas, e uma frase-gancho opcional`,
};

const carrossel: IdeiaCard = {
  categoria: "Carrossel",
  nome: "Carrossel que ensina e converte",
  objetivo: "Um carrossel que entrega valor e leva à ação.",
  prompt: `${CONTEXTO}

🎯 CONTEXTO DO DIA
Hoje quero criar um POST DE CARROSSEL.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Objetivo do carrossel? (a) Ensinar/educar, (b) Gerar conexão, (c) Conduzir para venda
2. Tem caso, dado ou exemplo para usar? (sim/não)
3. Quantos slides prefere? (6 a 10)

Depois entregue:
- Slide 1 (Capa): título-gancho que para o scroll
- Slides 2–(N-1): desenvolvimento, 1 ideia por slide, linguagem simples
- Último slide: CTA claro (comentário, salvar, DM ou link)
- Legenda pronta + 5 hashtags do nicho
- Sugestão de imagem (DALL-E 4:5) para a capa, estilo minimalista profissional`,
};

const reels: IdeiaCard = {
  categoria: "Reels",
  nome: "Reels com gancho forte",
  objetivo: "Um roteiro de Reels curto, com retenção e CTA.",
  prompt: `${CONTEXTO}

🎯 CONTEXTO DO DIA
Hoje quero criar um REELS.

Antes de criar, faça-me APENAS estas 3 perguntas (uma de cada vez):
1. Objetivo do Reels? (a) Alcance/viral, (b) Autoridade, (c) Conversão
2. Vai aparecer falando ou só com texto/B-roll?
3. Tem um tema ou dor específica para abordar hoje?

Depois entregue:
- GANCHO (3 primeiros segundos): frase que prende
- ROTEIRO (15–30s): falas curtas, ritmo rápido
- TEXTO NA TELA por cena
- CTA final (comentar palavra, seguir, DM)
- Sugestão de áudio/trend e 5 hashtags do nicho`,
};

export const IDEIAS_ROTINA: Record<string, { titulo: string; cards: IdeiaCard[] }> = {
  stories: { titulo: "Ideias de Stories", cards: [card1, card2, card3, card4] },
  carrossel: { titulo: "Ideias de Carrossel", cards: [carrossel] },
  reels: { titulo: "Ideias de Reels", cards: [reels] },
};
