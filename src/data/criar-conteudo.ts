// Módulo "Criar Conteúdo" — 15 prompts prontos (5 formatos × 3 objetivos).
// Cada prompt usa marcadores [entre_colchetes] que o PromptCard/fillPilar2Prompt
// preenche automaticamente com o Documento Mestre + Método da aluna.

export type Objetivo = "autoridade" | "seguidores" | "vendas";

export type ConteudoCard = {
  id: string;
  titulo: string;
  descricao: string;
  prompts: Record<Objetivo, string>;
};

const PREAMBULO = `Você é o meu estrategista de conteúdo para Instagram. Use SEMPRE o meu contexto abaixo e fale na minha voz.`;

const CONTEXTO = `📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público: [publico]
- Dores do público:
[dores_lista]
- Promessa: [promessa]
- Tom de voz: [tom_de_voz]
- Palavras a usar: [palavras_usar]
- Palavras a evitar: [palavras_evitar]`;

// Ordem pensada para a leitura: primeiro o que MUDA com o objetivo (linha de
// objetivo + tarefa), e só no fim o contexto fixo (Documento Mestre). Assim, ao
// trocar Autoridade/Seguidores/Vendas, a diferença aparece logo no topo — e não
// escondida por baixo de um bloco de contexto que é igual em todos os objetivos.
const wrap = (objLine: string, tarefa: string) =>
  `${PREAMBULO}\n\n${objLine}\n\n${tarefa}\n\n${CONTEXTO}`;

const REGRAS_REELS = `Regras: fale na minha voz; uma ideia por frase; números concretos em vez de vagos; nunca use "fórmula mágica", "segredo revelado" nem "guia definitivo"; não invente resultados (use "imagine que..." se não houver dado real).`;

const TAREFA_ROTEIROS = (cta: string) => `🎬 TAREFA — ROTEIRO SIMPLES
Crie 1 roteiro curto e fácil de gravar hoje, ligado a uma dor real do meu público. Entregue:
1. 3 OPÇÕES DE GANCHO (0–3s) — frases fortes que fazem parar o scroll (escolho uma)
2. DESENVOLVIMENTO — 3 a 5 falas curtas, passo a passo (o que digo/mostro)
3. CTA — ${cta}
+ TEXTO NA TELA (1 linha) e 1 DICA DE GRAVAÇÃO.

${REGRAS_REELS}`;

export const CRIAR_CONTEUDO: ConteudoCard[] = [
  {
    id: "roteiros",
    titulo: "Roteiro simples (para gravar já)",
    descricao: "Um roteiro base — gancho, desenvolvimento e chamada — pronto a gravar sem complicar.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize clareza técnica e ponto de vista próprio.",
        TAREFA_ROTEIROS('salvar ("salva para aplicar depois") ou seguir para mais sobre o tema'),
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize identificação imediata e partilha.",
        TAREFA_ROTEIROS('seguir ("me segue para a parte 2") ou marcar alguém que precisa ver'),
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução e um CTA claro para o Direct.",
        TAREFA_ROTEIROS('chamar no Direct ("comenta [PALAVRA] que eu te mando no Direct") — diagnóstico antes de preço'),
      ),
    },
  },
  {
    id: "reels",
    titulo: "Ideias de roteiros para Reels",
    descricao: "5 ideias de Reels com gancho, desenvolvimento e chamada — prontas para gravar.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize clareza técnica, ponto de vista próprio e conteúdo consultável (que se salva).",
        `🎬 TAREFA — ROTEIROS DE REELS
Crie 5 ideias de Reels para esta semana, cada uma ligada a uma dor real do meu público.
Para CADA Reel, entregue:
1. GANCHO (0–3s) — frase forte que faz parar o scroll
2. DESENVOLVIMENTO — 3 a 5 falas curtas (o que digo/mostro, passo a passo)
3. VIRADA — o insight ou a mudança de perspetiva que prova domínio
4. CTA — salvar ("salva para aplicar depois") ou seguir para mais sobre o tema
+ TEXTO NA TELA (1 linha) e 1 DICA DE GRAVAÇÃO por Reel.

${REGRAS_REELS}`,
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize ganchos fortes, identificação imediata e alto potencial de compartilhamento.",
        `🎬 TAREFA — ROTEIROS DE REELS
Crie 5 ideias de Reels para esta semana, cada uma ligada a uma dor real do meu público.
Para CADA Reel, entregue:
1. GANCHO (0–3s) — frase forte, de máxima identificação, que faz parar o scroll
2. DESENVOLVIMENTO — 3 a 5 falas curtas (o que digo/mostro, passo a passo)
3. VIRADA — o insight que faz a pessoa querer partilhar
4. CTA — seguir ("me segue para a parte 2") ou marcar alguém que precisa ver
+ TEXTO NA TELA (1 linha) e 1 DICA DE GRAVAÇÃO por Reel.

${REGRAS_REELS}`,
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução, prova real e um CTA claro para o Direct/oferta.",
        `🎬 TAREFA — ROTEIROS DE REELS
Crie 5 ideias de Reels para esta semana, cada uma ligada a uma dor real do meu público.
Para CADA Reel, entregue:
1. GANCHO (0–3s) — frase forte que faz parar o scroll
2. DESENVOLVIMENTO — 3 a 5 falas curtas com a lógica dor→solução
3. VIRADA — o insight que mostra que existe um caminho (a minha solução)
4. CTA — chamar no Direct ("comenta [PALAVRA] que eu te mando no Direct"); diagnóstico antes de preço
+ TEXTO NA TELA (1 linha) e 1 DICA DE GRAVAÇÃO por Reel.

${REGRAS_REELS}`,
      ),
    },
  },
  {
    id: "stories",
    titulo: "Criar Stories que vendem",
    descricao: "Sequência de 5 Stories que aquece a audiência e conduz à decisão.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize clareza técnica, ponto de vista próprio e prova.",
        `🎬 TAREFA — STORIES
Crie uma sequência de 5 Stories que ensina e prova domínio sobre uma dor do meu público.
Estrutura: 1 IDENTIFICAÇÃO (enquete na dor) · 2 EXPLICAÇÃO TÉCNICA (por que acontece, com lógica) · 3 PROVA (print/depoimento/bastidor/mini-caso) · 4 PONTO DE VISTA (a minha leitura do tema) · 5 CONVITE.
Para cada Story: TEXTO NA TELA (curto), RECURSO INTERATIVO (enquete/pergunta/quiz/deslizante) e OBJETIVO (1 linha).
CTA final: responder a caixa de pergunta ou salvar/seguir para mais.

Regras: fale na minha voz; consultivo, não anúncio; sem "fórmula mágica/segredo/guia definitivo"; não invente prova (se não houver, oriente a coletar ou use bastidor honesto).`,
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize identificação imediata, interação e partilha.",
        `🎬 TAREFA — STORIES
Crie uma sequência de 5 Stories de máxima identificação que gera interação e novos seguidores.
Estrutura: 1 IDENTIFICAÇÃO (enquete/pergunta na dor exata) · 2 "É COM VOCÊ" (descreve a situação em que a pessoa se reconhece) · 3 MINI-VALOR (uma dica rápida e útil) · 4 INTERAÇÃO (quiz/deslizante que dá vontade de responder) · 5 CONVITE a seguir/partilhar.
Para cada Story: TEXTO NA TELA (curto), RECURSO INTERATIVO e OBJETIVO (1 linha).
CTA final: "me segue para o resto" ou "compartilha nos teus stories".

Regras: fale na minha voz; frases curtas; sem "fórmula mágica/segredo/guia definitivo"; não invente dados.`,
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução, prova real e um CTA claro para o Direct/oferta.",
        `🎬 TAREFA — STORIES
Crie uma sequência de 5 Stories que aquece a audiência e conduz à decisão de me chamar no Direct.
Estrutura: 1 IDENTIFICAÇÃO (enquete na dor) · 2 AGITAÇÃO TÉCNICA (por que está preso nesse ciclo, com lógica não medo) · 3 PROVA (print/depoimento/bastidor) · 4 QUEBRA DE OBJEÇÃO (a principal objeção) · 5 CONVITE CONSULTIVO (CTA).
Para cada Story: TEXTO NA TELA, RECURSO INTERATIVO e OBJETIVO (1 linha).
Depois: ROTEIRO DE DIRECT — 2 a 3 mensagens modelo para quando mandarem a palavra [PALAVRA]. Abra com diagnóstico/pergunta, NUNCA com preço.

Regras: fale na minha voz; consultivo, não pitch; sem urgência falsa; diagnóstico antes de oferta; não invente prova nem prometa resultado garantido.`,
      ),
    },
  },
  {
    id: "carrossel",
    titulo: "Criar carrosséis virais",
    descricao: "Carrossel de 7–10 lâminas que ensina, prende e leva à ação.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize conteúdo consultável (que se salva) e clareza técnica.",
        `🎬 TAREFA — CARROSSEL
Crie um carrossel de 7 a 10 lâminas que ensina em profundidade e prova domínio.
Estrutura: LÂMINA 1 CAPA/gancho (dê 2 opções de capa) · MIOLO uma ideia por lâmina (título forte de 5–8 palavras + 1–3 linhas) · PENÚLTIMA VIRADA (a leitura correta do tema) · ÚLTIMA CTA de salvar ("salva para consultar depois").
Entregue também: SUGESTÃO VISUAL (1 linha por lâmina), LEGENDA curta em PAS (Problema→Agitação→Solução) e 5 a 8 HASHTAGS.

Regras: fale na minha voz; uma ideia por lâmina; conteúdo consultável (checklist, erros, passo a passo, comparativo); sem "fórmula mágica/segredo/guia definitivo"; não invente estatísticas (marque como ilustrativo se usar).`,
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize capa magnética, identificação e potencial de compartilhamento.",
        `🎬 TAREFA — CARROSSEL
Crie um carrossel de 7 a 10 lâminas com alto potencial de alcance e compartilhamento.
Estrutura: LÂMINA 1 CAPA/gancho de máximo contraste (dê 2 opções, com "arrasta →") · MIOLO uma ideia por lâmina (título forte + 1–3 linhas, cada uma cria curiosidade pela seguinte) · PENÚLTIMA VIRADA · ÚLTIMA CTA de seguir ou "envia para alguém que precisa".
Entregue também: SUGESTÃO VISUAL (1 linha por lâmina), LEGENDA curta em PAS e 5 a 8 HASHTAGS.

Regras: fale na minha voz; uma ideia por lâmina; a capa vale metade do post (capriche); sem "fórmula mágica/segredo/guia definitivo"; não invente dados.`,
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução, prova e um CTA claro para o Direct/oferta.",
        `🎬 TAREFA — CARROSSEL
Crie um carrossel de 7 a 10 lâminas que doutrina e prepara a venda (sem "compre de mim").
Estrutura: LÂMINA 1 CAPA/gancho (dê 2 opções) · MIOLO uma ideia por lâmina na lógica dor→solução · PENÚLTIMA VIRADA que conecta à lógica da minha oferta ("é assim que se resolve de verdade") · ÚLTIMA CTA para o Direct ("comenta [PALAVRA]" ou "chama no Direct").
Entregue também: SUGESTÃO VISUAL (1 linha por lâmina), LEGENDA em PAS terminando no mesmo CTA e 5 a 8 HASHTAGS.

Regras: fale na minha voz; uma ideia por lâmina; prova o domínio sem vender direto; sem "fórmula mágica/segredo/guia definitivo"; não invente estatísticas nem prometa resultado garantido.`,
      ),
    },
  },
  {
    id: "legendas",
    titulo: "Legendas que convertem",
    descricao: "3 versões de legenda com gancho, história e chamada para o mesmo post.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize ponto de vista e clareza.",
        `🎬 TAREFA — LEGENDAS
Crie 3 versões de legenda para o MESMO post, cada uma com gancho, história e chamada.
Cada versão: 1ª LINHA = gancho que corta o scroll · 2–4 LINHAS de valor/leitura do tema (demonstra domínio) · CTA final de salvar/seguir.
Rotule: (A) Direta · (B) Opinião/ponto de vista · (C) Ensino (mini-passo a passo).

Regras: fale na minha voz; frases curtas; números concretos; sem "fórmula mágica/segredo/guia definitivo"; não invente resultados.`,
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize identificação e partilha.",
        `🎬 TAREFA — LEGENDAS
Crie 3 versões de legenda para o MESMO post, cada uma com gancho, história e chamada.
Cada versão: 1ª LINHA = gancho de máxima identificação · 2–4 LINHAS de micro-história em que a pessoa se reconhece · CTA final de seguir ou marcar/partilhar.
Rotule: (A) Identificação · (B) Storytelling pessoal · (C) Contrária ("todo mundo faz X, mas...").

Regras: fale na minha voz; frases curtas; sem "fórmula mágica/segredo/guia definitivo"; não invente resultados.`,
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize a lógica dor→solução, prova e um CTA claro para o Direct/oferta.",
        `🎬 TAREFA — LEGENDAS
Crie 3 versões de legenda para o MESMO post, cada uma com gancho, história e chamada.
Cada versão: 1ª LINHA = gancho na dor · 2–4 LINHAS em PAS (Problema→Agitação→Solução) com prova ou lógica · CTA final para o Direct ("comenta [PALAVRA]" ou "chama no Direct para o diagnóstico").
Rotule: (A) Direta para venda · (B) Storytelling com prova · (C) Quebra de objeção.

Regras: fale na minha voz; diagnóstico antes de preço; sem urgência falsa; sem "fórmula mágica/segredo/guia definitivo"; não invente prova nem prometa resultado garantido.`,
      ),
    },
  },
  {
    id: "ganchos",
    titulo: "Ganchos que prendem (Hooks)",
    descricao: "20 ganchos de abertura prontos para Reels, Stories e carrosséis.",
    prompts: {
      autoridade: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: AUTORIDADE — demonstrar domínio e gerar confiança. Priorize ganchos de ponto de vista e de ensino.",
        `🎬 TAREFA — GANCHOS (HOOKS)
Crie 20 ganchos de abertura, prontos para Reels, Stories e carrosséis, ligados às dores do meu público.
Organize por tipo: contradição/quebra de crença · erro comum · promessa com número · enumeração/lista · pergunta de dor · ponto de vista.
Marque com ★ os 5 que mais reforçam AUTORIDADE (ensino/ponto de vista).

Regras: fale na minha voz; cada gancho numa linha; concreto e específico; sem "fórmula mágica/segredo/guia definitivo"; não invente números (use marcador tipo [X] se precisar).`,
      ),
      seguidores: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: SEGUIDORES — atrair e reter público novo. Priorize ganchos de identificação e viralização.",
        `🎬 TAREFA — GANCHOS (HOOKS)
Crie 20 ganchos de abertura, prontos para Reels, Stories e carrosséis, ligados às dores do meu público.
Organize por tipo: identificação · contradição/quebra de crença · curiosidade · pergunta de dor · enumeração/lista.
Marque com ★ os 5 com maior potencial de compartilhamento e identificação.

Regras: fale na minha voz; cada gancho numa linha; concreto e específico; sem "fórmula mágica/segredo/guia definitivo"; não invente números (use [X] se precisar).`,
      ),
      vendas: wrap(
        "🎯 OBJETIVO DESTE CONTEÚDO: VENDER — conduzir à decisão. Priorize ganchos que abrem a lógica dor→solução.",
        `🎬 TAREFA — GANCHOS (HOOKS)
Crie 20 ganchos de abertura, prontos para Reels, Stories e carrosséis, ligados às dores do meu público.
Organize por tipo: pergunta de dor · erro comum (custo escondido) · contradição/quebra de crença · promessa de solução com número · objeção antecipada.
Marque com ★ os 5 que melhor abrem para uma oferta (dor→solução→CTA para o Direct).

Regras: fale na minha voz; cada gancho numa linha; concreto e específico; sem "fórmula mágica/segredo/guia definitivo" nem urgência falsa; não invente números (use [X] se precisar).`,
      ),
    },
  },
];
