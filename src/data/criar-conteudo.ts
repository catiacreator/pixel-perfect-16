// Módulo "Criar Conteúdo" — prompts prontos (6 formatos × 3 objetivos).
// Cada prompt usa marcadores [entre_colchetes] que o PromptCard/fillPilar2Prompt
// preenche automaticamente com o Documento Mestre + Método da aluna.
// Os prompts seguem o que cada agente Cat.IA pede e usam SEMPRE o Documento Mestre.

export type Objetivo = "autoridade" | "seguidores" | "vendas";

export type ConteudoCard = {
  id: string;
  titulo: string;
  descricao: string;
  prompts: Record<Objetivo, string>;
};

const PREAMBULO = `Você é o meu estrategista de conteúdo para Instagram. Aja como especialista e use SEMPRE o meu Documento Mestre (abaixo), falando na minha voz e no meu tom.`;

// Todo o Documento Mestre relevante para gerar conteúdo — vai em TODOS os prompts.
const CONTEXTO = `📋 MEU CONTEXTO (Documento Mestre) — usa isto em tudo
- Nome: [nome]
- Especialidade / profissão: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público / cliente ideal: [publico]
- Dor principal do cliente: [dor_principal_cliente]
- Dores do público:
[dores_lista]
- Desejos do público:
[desejos_lista]
- Promessa / oferta: [promessa]
- Prova social: [prova_social]
- Arquétipo da marca: [arquetipo_dominante] (secundário: [arquetipo_secundario])
- Tom de voz: [tom_de_voz]
- Palavras a usar: [palavras_usar]
- Palavras a evitar: [palavras_evitar]`;

// Ordem pensada para a leitura: primeiro o que MUDA com o objetivo, depois a
// tarefa, e só no fim o contexto fixo (Documento Mestre).
const wrap = (objLine: string, tarefa: string) =>
  `${PREAMBULO}\n\n${objLine}\n\n${tarefa}\n\n${CONTEXTO}`;

const REGRAS = `Regras: fale na minha voz e no meu tom; uma ideia por frase; números concretos em vez de vagos; nunca use "fórmula mágica", "segredo revelado" nem "guia definitivo"; não invente resultados nem prometa ganho garantido.`;

const OBJ: Record<Objetivo, string> = {
  autoridade: "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize clareza técnica, ponto de vista próprio e conteúdo consultável (que se salva).",
  seguidores: "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize ganchos fortes, identificação imediata e alto potencial de partilha.",
  vendas: "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução, prova real e um CTA claro para o Direct/oferta.",
};

const CTA: Record<Objetivo, string> = {
  autoridade: `salvar ("salva para consultar depois") ou seguir para mais sobre o tema`,
  seguidores: `seguir ("me segue para a parte 2") ou enviar/marcar alguém que precisa`,
  vendas: `chamar no Direct ("comenta [PALAVRA] que eu te mando no Direct") — diagnóstico antes de preço`,
};

// Cada formato tem uma função tarefa(cta) — o resto (objetivo + contexto) é comum.
type TarefaFn = (cta: string) => string;

const card = (id: string, titulo: string, descricao: string, tarefa: TarefaFn): ConteudoCard => ({
  id,
  titulo,
  descricao,
  prompts: {
    autoridade: wrap(OBJ.autoridade, tarefa(CTA.autoridade)),
    seguidores: wrap(OBJ.seguidores, tarefa(CTA.seguidores)),
    vendas: wrap(OBJ.vendas, tarefa(CTA.vendas)),
  },
});

// ── cat.ia — Yap Content ──
const tYap: TarefaFn = (cta) => `🎤 TAREFA — YAP CONTENT (falar solto para a câmara, até 60s)
Cria o ESQUELETO de um yap: um vídeo em que eu falo direto para a lente, sem ler. NÃO me dês um texto para decorar — dá-me pontos para falar em cima, na minha voz. Um yap precisa de um mapa para falar, não de um guião para ler.
- Tema: escolhe UMA das minhas dores/desejos acima (ou eu digo o tema).
- UM yap = UMA ideia só. Se aparecerem várias, guarda as outras para outros yaps.
Entrega, por esta ordem:
1. GANCHO FALADO (0–3s) — 2 a 3 opções de primeira frase, ditas em voz alta, que cortam o scroll: opinião forte, dor, ou frase que desarma. Sem "hoje vou falar sobre".
2. A IDEIA CENTRAL — em UMA frase, o único ponto deste yap.
3. HISTÓRIA / EXEMPLO — não escrevas a história; dá-me o gatilho para eu preencher com a minha: "conta aqui a tua experiência com ___" ou "o caso da cliente que ___".
4. O ÂNGULO / A VIRADA — a minha opinião, o que ninguém está a dizer sobre isto (1 a 2 linhas de direção, não texto para ler).
5. O CONVITE (CTA) — um só, leve: ${cta}.
+ 1 REGRA DE OURO para este yap (ex.: pausa depois do gancho, energia acima do normal, olhar para a lente e não para ti no ecrã).
Lembra-te: volume acima de perfeição — o objetivo é gravar hoje, não fazer o vídeo perfeito.

${REGRAS}`;

// ── cat.ia — Criação de Reels Virais ──
const tReels: TarefaFn = (cta) => `🎬 TAREFA — REEL VIRAL (ATÉ 40s)
Crie um roteiro com duração MÁXIMA de 40 segundos, otimizado para retenção e crescimento de seguidores.
- Tema: escolha UMA das minhas dores acima (ou eu digo o tema).
- Público-alvo e tom: use o meu contexto.
Entregue:
- 4 OPÇÕES DE GANCHO (0–3s) — SEM introduções tipo "hoje vou falar sobre"
- 2 OPÇÕES DE DESENVOLVIMENTO — densas, sem encher linguiça
- Inclua a frase "Antes de continuar, me segue aí" a MEIO do vídeo
- Termine de forma ABRUPTA e memorável (nada de "beijinhos, até já")
- CTA final: ${cta}
+ TEXTO NA TELA (1 linha) e 1 dica de gravação.
Quanto mais específico o tema/público/objetivo, mais forte fica — use o meu contexto ao máximo.

${REGRAS}`;

// ── cat.ia — Criação de Posts que Vendem (Carrossel) ──
const tCarrossel: TarefaFn = (cta) => `🎬 TAREFA — CARROSSEL QUE VENDE (8 SLIDES)
Crie um carrossel de 8 slides com foco em autoridade, salvamentos e venda indireta (sem "compre de mim").
- Nicho, público e oferta: use o meu contexto.
Estrutura:
- SLIDE 1 — CAPA/GANCHO: dê 2 opções de capa
- SLIDES 2–7 — DESENVOLVIMENTO: 1 ideia por slide (título forte de 5–8 palavras + 1–3 linhas)
- SLIDE 8 — CTA: ${cta}
Entregue também: SUGESTÃO VISUAL (1 linha por slide), LEGENDA em PAS (Problema→Agitação→Solução) e 5–8 HASHTAGS.

${REGRAS}`;

// ── cat.ia — Criação de Stories que Vendem ──
const tStories: TarefaFn = (cta) => `🎬 TAREFA — SEQUÊNCIA DE STORIES QUE VENDE (5 a 7)
Crie uma sequência de 5 a 7 Stories que aquece a audiência e conduz à decisão.
Estrutura: 1) IDENTIFICAÇÃO DA DOR (enquete) → 2) AGITAÇÃO (por que está preso nesse ciclo, com lógica) → 3) PROVA (print/depoimento/bastidor — use a minha prova social) → 4) QUEBRA DE OBJEÇÃO (a principal objeção) → 5 a 7) CTA CONSULTIVO.
Para cada Story: TEXTO NA TELA (curto), RECURSO INTERATIVO (enquete/quiz/caixinha) e OBJETIVO (1 linha).
Depois: ROTEIRO DE DIRECT — 2 a 3 mensagens modelo para quando mandarem a palavra [PALAVRA]. Abra com diagnóstico, NUNCA com preço.
CTA: ${cta}

${REGRAS}`;

// ── Legendas ──
const tLegendas: TarefaFn = (cta) => `🎬 TAREFA — LEGENDAS
Crie 3 versões de legenda para o MESMO post, cada uma com gancho, história e chamada.
Cada versão: 1ª LINHA = gancho que corta o scroll · 2–4 LINHAS de valor/história em que a pessoa se reconhece · CTA final: ${cta}
Rotule: (A) Direta · (B) Storytelling/ponto de vista · (C) Quebra de objeção.

${REGRAS}`;

// ── Ganchos (Hooks) ──
const tGanchos: TarefaFn = (cta) => `🎬 TAREFA — GANCHOS (HOOKS)
Crie 20 ganchos de abertura, prontos para Reels, Stories e carrosséis, ligados às minhas dores/público.
Organize por tipo: quebra de crença · erro comum · promessa com número · pergunta de dor · ponto de vista · identificação.
Marque com ★ os 5 que melhor servem o objetivo acima. Cada gancho numa linha, concreto e específico.
(O CTA típico deste objetivo: ${cta})

${REGRAS}`;

export const CRIAR_CONTEUDO: ConteudoCard[] = [
  card("roteiros", "Yap Content", "O esqueleto de um yap para gravar já — gancho falado, uma ideia só, gatilho de história, o teu ângulo e o convite. Pontos para falar em cima, não texto para ler.", tYap),
  card("reels", "Reels virais", "Roteiro de até 40s com 4 ganchos, 2 desenvolvimentos e 'me segue aí' a meio — para reter e crescer.", tReels),
  card("carrossel", "Carrosséis que vendem", "Carrossel de 8 slides (autoridade + salvamentos + venda indireta), com legenda em PAS e hashtags.", tCarrossel),
  card("stories", "Stories que vendem", "Sequência de 5 a 7 Stories (dor → agitação → prova → objeção → CTA) + roteiro de Direct.", tStories),
  card("legendas", "Legendas que convertem", "3 versões de legenda com gancho, história e chamada para o mesmo post.", tLegendas),
  card("ganchos", "Ganchos que prendem (Hooks)", "20 ganchos de abertura prontos para Reels, Stories e carrosséis.", tGanchos),
];
