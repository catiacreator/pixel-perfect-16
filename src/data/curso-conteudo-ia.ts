// Curso "Criação de Conteúdo com IA" — método Cat.IA (funil, ganchos, PAS).
// videoUrl por preencher (a Cátia coloca o vídeo de cada aula).

export type Bloco =
  | { t: "p"; texto: string } // parágrafo (suporta **negrito**)
  | { t: "sub"; titulo: string } // subtítulo (Passo X)
  | { t: "ul"; itens: string[] } // lista com check
  | { t: "ol"; itens: string[] } // passos numerados
  | { t: "prompt"; agente: string; nome: string; texto: string }
  | { t: "nota"; v: "warn" | "info"; texto: string }
  | { t: "tabela"; cab: string[]; linhas: string[][] }
  | { t: "funil"; niveis: { titulo: string; desc: string }[] };

export type Secao = { label?: string; titulo?: string; blocos: Bloco[] };
export type Aula = {
  id: string;
  numero: string;
  titulo: string;
  subtitulo?: string;
  objetivo?: string;
  videoUrl?: string;
  links?: { nome: string; url: string }[]; // botões para abrir a(s) ferramenta(s)
  secoes: Secao[];
};

export const CURSO_INTRO = {
  titulo: "Criação de Conteúdo com Inteligência Artificial",
  subtitulo: "A tua equipa de 4 IAs para viralizar e vender no Instagram. Cada ferramenta faz uma parte do trabalho pesado — tu ficas com a direção criativa e a tua voz.",
  ferramentas: "NotebookLM · pesquisa · Grok · tendências · Claude · roteiros · ChatGPT · arte",
  nivel: "Nível: Iniciante · 6 módulos + projeto final",
  secoes: [
    {
      label: "Como funciona o método",
      titulo: "Cada IA tem uma função",
      blocos: [
        { t: "p", texto: "A sacada não é usar uma ferramenta “melhor”, e sim a ferramenta certa para cada etapa. Escreves os prompts em português, como num chat — não precisas de saber nada de tecnologia." },
        { t: "tabela", cab: ["Ferramenta", "Função", "Etapa"], linhas: [
          ["NotebookLM", "Inteligência de nicho: resume vídeos virais e revela padrões.", "1. Pesquisar"],
          ["Grok", "Tendências em tempo real no X e em notícias.", "2. Tema quente"],
          ["Claude", "Ganchos, roteiros de Reels, carrosséis e legendas na tua voz.", "3. Escrever"],
          ["ChatGPT", "Transforma o texto em imagens de carrossel.", "4. Criar arte"],
        ] },
        { t: "nota", v: "info", texto: "O **NotebookLM** dá-te inteligência, o **Grok** dá-te o tema quente, o **Claude** escreve e o **ChatGPT** vira arte. Tu aprovas e publicas." },
      ],
    },
    {
      label: "O método",
      titulo: "O funil de conteúdo: cada formato tem um papel",
      blocos: [
        { t: "p", texto: "Autoridade não vem do número de seguidores — vem de **clareza de comunicação**. O melhor comunicador vence o mais capacitado que fica escondido. E todo o conteúdo serve ao seguidor **antes** de servir ao teu negócio. Cada formato move a pessoa por uma etapa:" },
        { t: "funil", niveis: [
          { titulo: "Reels", desc: "atraem · topo — trazem gente nova" },
          { titulo: "Carrosséis", desc: "educam/doutrinam · meio — constroem autoridade" },
          { titulo: "Stories", desc: "convertem · fundo — aquecem para a oferta" },
          { titulo: "Direct", desc: "fecha — o diagnóstico antes da venda" },
        ] },
        { t: "nota", v: "info", texto: "**Métrica-ouro:** prioriza **salvamentos** e **partilhas** acima de gostos. Salvamento = autoridade máxima; partilha = viralidade orgânica (“isto é a minha cara”). Conteúdo consultável (checklist, passo a passo) gera os dois." },
      ],
    },
    {
      label: "O método",
      titulo: "A voz da especialista",
      blocos: [
        { t: "p", texto: "O jeito de escrever separa quem é ignorado de quem é seguido. A regra é simples: o **amador anuncia o tema**; a **especialista abre uma lacuna** ou toca uma dor específica." },
        { t: "tabela", cab: ["❌ Amador", "✅ Especialista"], linhas: [
          ["“Hoje vou dar dicas de marketing.”", "“O motivo invisível que faz os teus posts floparem e ninguém te conta.”"],
          ["“Dicas de alimentação para ti.”", "“O ‘saudável’ do teu pequeno-almoço está a deixar-te com fome às 10h.”"],
        ] },
        { t: "nota", v: "warn", texto: "**Tom de voz:** conversa profissional num café — sóbria, específica, analítica. Usa números concretos em vez de termos vagos. E **nunca** uses “fórmula mágica”, “segredo revelado” ou “guia definitivo”: público qualificado tem alergia a isso." },
      ],
    },
  ],
};

export const AULAS: Aula[] = [
  {
    id: "m1",
    numero: "Módulo 1",
    titulo: "NotebookLM: inteligência do teu nicho",
    objetivo: "Transformar vídeos virais, PDFs e referências do teu nicho num “cérebro” que revela o que faz o público parar de rolar o feed.",
    links: [{ nome: "Abrir NotebookLM", url: "https://notebooklm.google.com" }],
    secoes: [
      {
        titulo: "1.1 O que é o NotebookLM",
        blocos: [
          { t: "p", texto: "Ferramenta gratuita do Google. Metes lá dentro vídeos do YouTube, PDFs e sites, e ele lê tudo e responde às tuas perguntas com base **apenas** nesse material. Não inventa — resume, compara e acha padrões reais do teu nicho. Em 2026 também cria resumos em áudio, mapas mentais e vídeos curtos a partir das tuas fontes." },
        ],
      },
      {
        titulo: "1.2 Passo a passo",
        blocos: [
          { t: "ol", itens: [
            "Acede a notebooklm.google.com e entra com a tua conta Google.",
            "Clica em “Criar novo”.",
            "Em “Adicionar fontes”, cola os links dos vídeos virais do teu nicho (podes adicionar vários).",
            "Espera ele ler e pergunta na caixa de chat.",
          ] },
        ],
      },
      {
        titulo: "1.3 A jogada principal: dissecar os virais",
        blocos: [
          { t: "p", texto: "No YouTube, procura temas do teu nicho, ordena por visualizações e pega em 5 a 10 vídeos com muitas views. Adiciona como fontes e corre o prompt:" },
          { t: "prompt", agente: "NotebookLM", nome: "Encontrar o padrão dos virais", texto: `Você é um analista de conteúdo viral. Analise todos os vídeos
que adicionei como fontes. Eles são os mais vistos do meu
nicho de [SEU NICHO]. Me diga:
1. Quais os 3 tipos de gancho (primeiros 3 segundos) mais usados
2. Que estrutura de roteiro se repete entre eles
3. Quais assuntos/dores aparecem mais
4. Que emoções o conteúdo desperta (curiosidade, medo, etc.)
5. As 5 DORES do público que mais aparecem, nas palavras dele
6. Uma lista de 10 ideias de conteúdo que seguem esse padrão` },
          { t: "p", texto: "**O que fazer com a resposta:** guarda a análise. Vira o teu mapa — no Módulo 3 entregas esses padrões ao Claude para escrever roteiros com a fórmula que já funciona." },
          { t: "nota", v: "warn", texto: "**Exercício:** cria um caderno com 5–10 vídeos virais, corre o prompt e guarda os 3 ganchos mais comuns + as 10 ideias. Terminas com um banco de ideias validadas para a semana." },
        ],
      },
    ],
  },
  {
    id: "m2",
    numero: "Módulo 2",
    titulo: "Grok: surfando as tendências em tempo real",
    objetivo: "Descobrir o que o público fala e sente AGORA para criar conteúdo em cima de assuntos quentes antes de toda a gente.",
    links: [{ nome: "Abrir Grok", url: "https://grok.com" }],
    secoes: [
      {
        titulo: "2.1 Porque o Grok é diferente",
        blocos: [
          { t: "p", texto: "É a IA da xAI, integrada à rede X. Lê, em tempo real, o que as pessoas estão a postar neste momento. Enquanto o NotebookLM olha o passado, o Grok olha o presente. Usa o modo **DeepSearch** para cruzar conversas do X com notícias e sites, com as fontes citadas." },
        ],
      },
      {
        titulo: "2.2 Passo a passo",
        blocos: [
          { t: "ol", itens: [
            "Acede a grok.com (ou a aba do Grok no X) e faz login.",
            "Ativa o “DeepSearch” para pesquisas mais completas.",
            "Escreve a tua pergunta em português, específica.",
            "Clica nas fontes citadas para confirmar antes de usar.",
          ] },
        ],
      },
      {
        titulo: "2.3 Prompts para caçar temas quentes",
        blocos: [
          { t: "prompt", agente: "Grok", nome: "Radar de tendências do nicho", texto: `Use o DeepSearch. Pesquise no X e em notícias recentes:
quais são os assuntos, dúvidas e debates em alta HOJE
sobre [SEU NICHO]. Liste os 5 temas mais comentados,
explique por que estão em alta e cite as fontes.` },
          { t: "prompt", agente: "Grok", nome: "Descobrir a dor do público", texto: `Pesquise no X o que as pessoas estão RECLAMANDO ou
PERGUNTANDO sobre [TEMA DO SEU NICHO]. Quero entender
as dores reais, com as palavras que elas usam. Liste as
10 frases/reclamações mais comuns.` },
          { t: "prompt", agente: "Grok", nome: "Aproveitar uma notícia (newsjacking)", texto: `Saiu a notícia/tendência: [DESCREVA]. Me dê 5 ângulos
de conteúdo para o Instagram do meu nicho [SEU NICHO]
conectando essa novidade com o meu público.` },
          { t: "nota", v: "info", texto: "**Porque “as palavras que elas usam” importa:** falar com as palavras exatas do público faz o conteúdo parecer que leu a mente da pessoa. Essas frases viram ganchos no Módulo 3." },
          { t: "nota", v: "warn", texto: "**Exercício:** corre o “Radar de tendências” e escolhe 1 tema quente. Corre “Descobrir a dor” e guarda as 5 melhores frases." },
        ],
      },
    ],
  },
  {
    id: "m3",
    numero: "Módulo 3",
    titulo: "Claude: o roteirista da tua marca",
    objetivo: "Transformar temas em ganchos, roteiros de Reels, carrosséis e legendas que soam como TU — não como um robô.",
    links: [{ nome: "Abrir Claude", url: "https://claude.ai" }],
    secoes: [
      {
        blocos: [
          { t: "nota", v: "info", texto: "**Como usar este módulo (importante):** os prompts NÃO são para escolher um. São uma **sequência**, na mesma conversa do Claude: **Passo 1** prepara a voz (uma vez só) → **Passo 2** gera os ganchos (escolhes o melhor) → **Passo 3** escreve o roteiro/carrossel → **Passo 4** fecha com a legenda. É como uma receita: um passo puxa o outro." },
        ],
      },
      {
        titulo: "3.1 Porque o Claude para escrever",
        blocos: [
          { t: "p", texto: "Escreve textos naturais, com nuance, e segue instruções longas muito bem. Usa os **Projetos** para guardar as instruções fixas da tua marca — aí toda a conversa já sai com a tua cara, sem reexplicar nada." },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Passo 1 · Ensina a tua voz (faz uma vez, no Projeto)" },
          { t: "prompt", agente: "Claude", nome: "Configurar a voz da marca", texto: `Você é o meu roteirista e copywriter de Instagram.
Contexto da minha marca:
- Nicho: [SEU NICHO]
- Meu público e as 5 dores dele: [LISTE as dores]
- Meu tom de voz: [ex.: leve, direto, acolhedor]
- Palavras que eu uso / que eu NUNCA uso: [liste]
- Minha oferta e objetivo: [ex.: vender mentoria]
Regras: escreva como ESPECIALISTA (nunca "hoje vou dar dicas"),
frases curtas, português. NUNCA use "fórmula mágica",
"segredo revelado" ou "guia definitivo". Confirme que entendeu.` },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Passo 2 · Ganchos: os 3 segundos que decidem tudo" },
          { t: "p", texto: "A atenção é ganha ou perdida nos 3 primeiros segundos. Existem 4 tipos de gancho que funcionam — pede os quatro e escolhe o melhor:" },
          { t: "ul", itens: [
            "**Quebra de expectativa** — contradiz o senso comum (“O problema pode ser tu — mas não como pensas”).",
            "**Dor silenciosa** — o que ele sente mas nunca disse (“Parece que falas com a parede no Instagram?”).",
            "**Curiosidade/polémica** — pega boleia num assunto do momento com a tua ótica.",
            "**Promessa de recompensa** — “Como eu fiz X em Y tempo” ou “O erro que destrói a tua conta”.",
          ] },
          { t: "prompt", agente: "Claude", nome: "Fábrica de ganchos", texto: `Tema: [TEMA]. Use as dores do meu perfil.
Me dê 15 ganchos para Reels, no estilo ESPECIALISTA
(abrir lacuna ou tocar uma dor específica, nunca anunciar
o tema). Misture os 4 tipos: quebra de expectativa,
dor silenciosa, curiosidade/polêmica e promessa de recompensa.
Frases curtas, impacto imediato.` },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Passo 3 · Escreve o conteúdo (Reel ou carrossel)" },
          { t: "p", texto: "**Dica de ouro:** cola aqui os padrões do NotebookLM (M1) e as dores do Grok (M2). O roteiro nasce de dados reais." },
          { t: "prompt", agente: "Claude", nome: "Roteiro de Reels (atração)", texto: `Crie um roteiro de Reels de até 45 segundos sobre [TEMA].
Use este gancho: [COLE O GANCHO ESCOLHIDO].
Estrutura: gancho -> problema -> virada/solução -> prova -> CTA.
Formato de entrega, bloco a bloco:
- FALA: o que eu digo (frases curtas, do meu jeito)
- TELA: o texto que aparece escrito na tela
- CENA: sugestão do que gravar
No fim, 3 ganchos alternativos + 3 CTAs (seguir, salvar, Direct).` },
          { t: "prompt", agente: "Claude", nome: "Carrossel (autoridade · gera salvamentos)", texto: `Crie um carrossel de 7 slides sobre [TEMA] (formato
checklist ou passo a passo, para gerar salvamentos).
- Slide 1: capa = gancho forte (faz parar de rolar)
- Slides 2 a 6: uma ideia por slide, texto curto e escaneável
- Slide 7: CTA + convite para salvar/compartilhar
Para cada slide: TÍTULO, texto e sugestão de imagem/visual.` },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Passo 4 · Legenda que converte (método PAS)" },
          { t: "p", texto: "PAS = **Problema** (espelha a dor: “sei o que passas”) → **Agitação** (o custo de não resolver, com lógica) → **Solução** (a lógica do teu método, não “compra de mim”)." },
          { t: "prompt", agente: "Claude", nome: "Legenda PAS", texto: `Escreva a legenda deste conteúdo [COLE O ROTEIRO/TEMA]
usando o método PAS:
- 1ª linha (headline): vende o CLIQUE para a 2ª linha, toca
  uma dor — não anuncia o produto
- Problema -> Agitação (com lógica, não medo) -> Solução
  (a lógica do meu método)
- CTA: engajamento, salvar ou "me manda X no Direct"
Dê 2 opções de headline, 2 de CTA e 8 a 10 hashtags do nicho.` },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Bónus · Stories de venda (5 telas · conversão)" },
          { t: "prompt", agente: "Claude", nome: "Sequência de 5 stories", texto: `Crie uma sequência de 5 stories de venda sobre [TEMA/OFERTA]:
1. Identificação (enquete/pergunta que toca a dor)
2. Agitação (por que ele está preso no problema)
3. Prova (caso/depoimento — marque como MODELO p/ eu trocar)
4. Convite/CTA ("me manda a palavra X no Direct")
5. Reforço (última chamada)
Diga o elemento interativo de cada tela (enquete, caixinha, link).` },
        ],
      },
      {
        blocos: [
          { t: "nota", v: "info", texto: "**Pede edições:** a 1ª versão nunca é a final. “Deixa mais curto”, “tira o clichê”, “essa parte ficou robótica, reescreve”. É assim que o texto vira teu." },
          { t: "nota", v: "warn", texto: "**Revisão antes de postar:** corta o excesso, lê em voz alta (se tropeças, o leitor também) e confirma que o texto cumpre a promessa do gancho." },
          { t: "nota", v: "warn", texto: "**Exercício:** configura a voz (Passo 1), pega 1 dor do perfil e gera 15 ganchos → 1 roteiro de Reel → 1 legenda PAS. Um post completo, de ponta a ponta." },
        ],
      },
    ],
  },
  {
    id: "m4",
    numero: "Módulo 4",
    titulo: "ChatGPT: transformando texto em arte",
    objetivo: "Pegar o texto do carrossel (M3) e transformar em imagens prontas para postar, usando a geração de imagem e os GPTs do ChatGPT.",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        titulo: "4.1 Porque o ChatGPT para o visual",
        blocos: [
          { t: "p", texto: "Geração de imagem forte e integrada ao chat: descreves em português e ele cria. Cada slide é uma imagem separada — o tamanho ideal para Instagram é **1080 x 1350 px** (retrato). Gera uma de cada vez, com o texto certo em cada." },
        ],
      },
      {
        titulo: "4.2 Caminho 1 (mais simples): GPTs prontos",
        blocos: [
          { t: "ol", itens: [
            "No ChatGPT, clica em “Explorar GPTs”.",
            "Procura “carousel”, “Instagram carousel” ou “carrossel”.",
            "Escolhe um bem avaliado (ex.: “CarouselGen”, “InstaCarousel”).",
            "Cola o texto slide a slide que o Claude escreveu no M3.",
            "Pede as imagens em 1080 x 1350 e ajusta cores a conversar.",
          ] },
        ],
      },
      {
        titulo: "4.3 Caminho 2: gerar tu mesma (mais controlo)",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Definir o estilo visual (faz uma vez)", texto: `Vou criar um carrossel de Instagram. Guarde este estilo
para todas as imagens desta conversa:
- Formato: retrato 1080 x 1350
- Paleta de cores: [ex.: roxo e amarelo, fundo claro]
- Estilo: minimalista, muito espaço em branco, texto grande
- Fonte: sem serifa, moderna e legível no celular
- Mesma identidade em todos os slides
Confirme e aguarde o conteúdo de cada slide.` },
          { t: "prompt", agente: "ChatGPT", nome: "Gerar cada slide", texto: `Slide 1 (capa). Crie a imagem 1080x1350 no estilo definido,
com o texto em destaque: "[TÍTULO DA CAPA]".
Deixe o texto grande, centralizado e fácil de ler.

(Depois repita: 'Agora o Slide 2 com o texto: ...')` },
          { t: "nota", v: "warn", texto: "**Atenção ao texto na imagem:** geradores às vezes erram letras/acentos. Confere cada slide. Se sair errado, pede de novo ou escreve por cima no Canva." },
          { t: "p", texto: "**Canva (recomendado):** usa as imagens da IA como base e finaliza no Canva — logo, ajuste de texto, identidade. A IA acelera 80%, tu dás o acabamento nos 20% finais." },
          { t: "nota", v: "warn", texto: "**Exercício:** pega o carrossel de 7 slides do M3, cria as 7 imagens e finaliza." },
        ],
      },
    ],
  },
  {
    id: "m5",
    numero: "Módulo 5",
    titulo: "O fluxo completo e o teu projeto final",
    objetivo: "Juntar as 4 ferramentas num único fluxo que repetes toda a semana, e produzir uma semana inteira de conteúdo do zero.",
    secoes: [
      {
        titulo: "5.1 A linha de produção completa",
        blocos: [
          { t: "tabela", cab: ["Passo", "Ferramenta", "O que fazes"], linhas: [
            ["1. Inteligência", "NotebookLM", "Analisa virais e gera banco de ideias."],
            ["2. Tema quente", "Grok", "Descobre o assunto do momento e as dores reais."],
            ["3. Roteiro/legenda", "Claude", "Escreve gancho, roteiro/carrossel e legenda na tua voz."],
            ["4. Arte", "ChatGPT", "Transforma o texto em imagens de carrossel."],
            ["5. Acabamento", "Tu / Canva", "Revês, adicionas identidade, agendas e publicas."],
          ] },
          { t: "nota", v: "info", texto: "**Regra de ouro:** as IAs fazem o trabalho pesado, mas a decisão é sempre tua. Tu és a diretora criativa. A IA acelera; tu dás alma." },
        ],
      },
      {
        titulo: "5.2 Rotina semanal sugerida",
        blocos: [
          { t: "ul", itens: [
            "**Segunda (30 min) — Pesquisa:** NotebookLM + Grok. Sais com 5 temas e as dores do público.",
            "**Terça (45 min) — Escrita:** no Claude, geras roteiros e legendas da semana de uma vez.",
            "**Quarta (45 min) — Arte:** no ChatGPT, crias os carrosséis e finalizas no Canva.",
            "**Quinta — Gravação:** gravas os Reels com os roteiros.",
            "**Sexta — Agendamento:** agendas os posts da semana seguinte.",
          ] },
          { t: "nota", v: "info", texto: "**Equilibra o funil na semana:** não postes só um tipo. Uma semana saudável tem **Reels** (para atrair gente nova), pelo menos um **carrossel** (para educar e gerar salvamentos) e **stories** quase todos os dias (para aquecer e converter). Reels enchem o topo; stories fecham no Direct." },
        ],
      },
      {
        titulo: "5.3 Projeto final",
        blocos: [
          { t: "nota", v: "warn", texto: "**Desafio:** produz uma semana completa (3 posts) usando o fluxo inteiro — NotebookLM (3 ideias) → Grok (1 tendência + dores) → Claude (2 roteiros + 1 carrossel + 3 legendas) → ChatGPT (as artes) → finaliza e publica." },
        ],
      },
      {
        titulo: "5.4 Erros comuns de iniciante",
        blocos: [
          { t: "ul", itens: [
            "Aceitar a primeira resposta da IA. Pede variações e edita.",
            "Prompt vago. Quanto mais contexto (nicho, público, tom, objetivo), melhor.",
            "Conteúdo genérico. Adiciona a tua história, opinião e exemplos.",
            "Não confirmar informação. Especialmente com o Grok, verifica as fontes.",
            "Querer automatizar cedo demais. Domina o fluxo manual primeiro.",
          ] },
        ],
      },
    ],
  },
  {
    id: "m6",
    numero: "Bónus",
    titulo: "Automação: notícias e conteúdo no piloto automático",
    objetivo: "Configurar o Claude e o ChatGPT para, todos os dias e sozinhos, te enviarem um resumo das notícias e ideias do teu nicho — sem tu pedires.",
    links: [
      { nome: "Abrir ChatGPT", url: "https://chatgpt.com" },
      { nome: "Abrir Claude", url: "https://claude.ai" },
    ],
    secoes: [
      {
        titulo: "6.1 O que é uma automação (tarefa agendada)",
        blocos: [
          { t: "p", texto: "Escreves o pedido **uma vez**, defines o horário (ex.: todo dia às 7h) e a IA executa sozinha e entrega o resultado pronto — como um jornal do teu nicho a chegar de manhã. Começas o dia com ideias frescas, sem esforço." },
          { t: "nota", v: "warn", texto: "**Importante:** tarefas agendadas são recurso dos **planos pagos** nas duas ferramentas. Na versão grátis, corre os prompts dos Módulos 1 e 2 manualmente toda a manhã." },
        ],
      },
      {
        titulo: "6.2 Automação no ChatGPT (Tarefas Agendadas)",
        blocos: [
          { t: "ol", itens: [
            "Na barra lateral do ChatGPT, abre a página “Tarefas” / “Scheduled”.",
            "Cria uma nova tarefa (ou descreve o que queres e com que frequência).",
            "Cola o prompt abaixo, define o horário e guarda.",
            "Depois dá para pausar, editar ou apagar na mesma página.",
          ] },
          { t: "prompt", agente: "ChatGPT", nome: "Briefing diário de notícias", texto: `Todos os dias às 7h, pesquise na web as notícias e
novidades mais relevantes das últimas 24h sobre
[SEU NICHO]. Me entregue:
- As 5 principais manchetes, com 1 frase de resumo cada
- Por que cada uma importa para o meu público
- 3 ideias de post inspiradas nessas notícias
Formato curto e escaneável, em português.` },
          { t: "nota", v: "info", texto: "**Limites do ChatGPT:** tarefas correm no máximo 1x por hora; usam prompt de texto simples (sem ficheiros, áudio ou GPTs dentro da tarefa); o nº de tarefas ativas depende do plano." },
        ],
      },
      {
        titulo: "6.3 Automação no Claude (Tarefas Recorrentes no Cowork)",
        blocos: [
          { t: "ol", itens: [
            "No Claude Desktop, abre o Cowork e vai a tarefas agendadas/recorrentes.",
            "Escreve o prompt uma vez e escolhe a frequência (por hora, diária, dias de semana, semanal).",
            "Guarda. O Claude corre sozinho e entrega o resultado a cada ciclo.",
          ] },
          { t: "prompt", agente: "Claude", nome: "Radar diário de conteúdo", texto: `Todos os dias de semana às 7h, faça meu briefing de
criadora de conteúdo do nicho [SEU NICHO]:
1. Resuma as 5 notícias/tendências mais quentes das
   últimas 24h e por que importam pro meu público
2. Sugira 3 ganchos de Reels prontos sobre esses temas
3. Sugira 1 tema de carrossel com os 5 slides esboçados
Entregue em texto curto, no meu tom: [DESCREVA O TOM].` },
          { t: "nota", v: "info", texto: "**Dica:** se já configuraste a voz da marca num Projeto (M3), corre a tarefa com esse contexto. Os ganchos já chegam com a tua cara — não é só notícia, é conteúdo quase pronto." },
        ],
      },
      {
        titulo: "6.4 Qual usar para quê",
        blocos: [
          { t: "tabela", cab: ["Ferramenta", "Melhor para", "Frequências"], linhas: [
            ["ChatGPT (Tarefas)", "Briefing de notícias frescas com navegação na web, direto e rápido.", "Diária, semanal ou personalizada"],
            ["Claude (Recorrentes)", "Briefing mais elaborado, já com ganchos no teu tom, usando conexões e skills.", "Por hora, diária, dias de semana, semanal"],
          ] },
        ],
      },
      {
        titulo: "6.5 Regras de ouro da automação",
        blocos: [
          { t: "ul", itens: [
            "Começa com UMA tarefa (o briefing matinal). Depois adiciona outras.",
            "Escolhe um horário que realmente lês.",
            "Refina o prompt com o tempo (“mais curto”, “só Brasil”, “foca em X”).",
            "Continua a conferir as fontes antes de postar.",
            "A automação dá-te matéria-prima; o toque humano continua a ser o teu diferencial.",
          ] },
          { t: "nota", v: "warn", texto: "**Exercício:** configura UMA tarefa de briefing diário, deixa correr 3 dias e ajusta o prompt até ficar como te serve." },
        ],
      },
    ],
  },
];

// Sub-aulas (páginas Bónus penduradas num módulo, via ?aula=id) — não entram
// na grelha de módulos nem no prev/next principal.
export const SUBAULAS: Aula[] = [
  {
    id: "m4b",
    numero: "Bónus · ChatGPT",
    titulo: "Carrosséis no ChatGPT",
    objetivo: "Transformar o texto do teu carrossel (M3) num conjunto de slides prontos a publicar — com identidade consistente e capa que faz parar de rolar.",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        blocos: [
          { t: "nota", v: "info", texto: "Esta é uma **aula bónus** do Módulo 4. Já tens o texto do carrossel escrito no Claude (M3)? Então é aqui que ele vira arte. Se ainda não tens, volta ao Módulo 3 e gera o carrossel primeiro." },
        ],
      },
      {
        titulo: "1. Dois caminhos para o carrossel",
        blocos: [
          { t: "p", texto: "Há duas formas de criar o carrossel no ChatGPT. Escolhe conforme o controlo que queres:" },
          { t: "tabela", cab: ["Caminho", "Quando usar", "Controlo"], linhas: [
            ["GPT pronto de carrossel", "Queres rapidez e um layout já montado.", "Médio"],
            ["Gerar slide a slide", "Queres controlo total do estilo e do texto.", "Total"],
          ] },
        ],
      },
      {
        titulo: "2. Caminho rápido: GPT pronto",
        blocos: [
          { t: "ol", itens: [
            "No ChatGPT, clica em “Explorar GPTs”.",
            "Procura “carousel”, “Instagram carousel” ou “carrossel”.",
            "Escolhe um bem avaliado (ex.: “CarouselGen”, “InstaCarousel”).",
            "Cola o texto slide a slide que o Claude escreveu no Módulo 3.",
            "Pede o formato 1080 x 1350 e ajusta cores e fonte a conversar.",
          ] },
          { t: "nota", v: "info", texto: "**Dica:** diz ao GPT a tua paleta e o teu tom logo na primeira mensagem — assim todos os slides já saem com a tua identidade." },
        ],
      },
      {
        titulo: "3. Caminho com controlo total: slide a slide",
        blocos: [
          { t: "sub", titulo: "Passo 1 · Fixa o estilo (faz uma vez por conversa)" },
          { t: "prompt", agente: "ChatGPT", nome: "Definir o estilo do carrossel", texto: `Vou criar um carrossel de Instagram. Guarde este estilo
para TODAS as imagens desta conversa:
- Formato: retrato 1080 x 1350
- Paleta de cores: [ex.: roxo e amarelo, fundo claro]
- Estilo: minimalista, muito espaço em branco, texto grande
- Fonte: sem serifa, moderna e legível no celular
- Mesma identidade visual em todos os slides
Confirme e aguarde o texto de cada slide.` },
          { t: "sub", titulo: "Passo 2 · Capa que faz parar de rolar" },
          { t: "prompt", agente: "ChatGPT", nome: "Slide 1 · Capa", texto: `Slide 1 (capa). Crie a imagem 1080x1350 no estilo definido,
com o gancho em destaque: "[TÍTULO/GANCHO DA CAPA]".
Texto grande, centralizado, altíssimo contraste. A capa tem
UMA função: fazer a pessoa parar de rolar e deslizar para o lado.` },
          { t: "sub", titulo: "Passo 3 · Os slides de conteúdo" },
          { t: "prompt", agente: "ChatGPT", nome: "Slides 2 a 6 · uma ideia por slide", texto: `Agora o Slide 2, mesmo estilo, com o texto: "[TEXTO DO SLIDE 2]".
Uma ideia só, curta e escaneável.

(Repita para cada slide: 'Agora o Slide 3 com o texto: ...')` },
          { t: "sub", titulo: "Passo 4 · Slide final com CTA" },
          { t: "prompt", agente: "ChatGPT", nome: "Slide final · CTA", texto: `Último slide, mesmo estilo, com o texto: "[CTA]".
Convide a salvar e a partilhar ("guarda para não esqueceres",
"marca alguém que precisa disto"). Deixe espaço para eu
adicionar o meu @ e o logo depois.` },
        ],
      },
      {
        titulo: "4. Antes de publicar",
        blocos: [
          { t: "nota", v: "warn", texto: "**Confere o texto de cada slide:** geradores de imagem às vezes erram letras e acentos. Se sair errado, pede de novo ou escreve por cima no Canva." },
          { t: "p", texto: "**Acabamento no Canva (recomendado):** usa as imagens da IA como base e finaliza no Canva — logo, @, ajuste de texto e identidade. A IA acelera 80%; tu dás o acabamento nos 20% finais." },
          { t: "ul", itens: [
            "A capa faz parar de rolar sozinha? (lê só o slide 1 — dá vontade de deslizar?)",
            "Uma ideia por slide, sem parágrafos longos.",
            "Mesma paleta, fonte e margens em todos os slides.",
            "Texto legível no telemóvel (grande e com contraste).",
            "Último slide convida a salvar/partilhar.",
          ] },
          { t: "nota", v: "warn", texto: "**Exercício:** pega no carrossel de 7 slides que geraste no Módulo 3, cria as 7 imagens aqui e finaliza no Canva. Publica e marca a tarefa como completa." },
        ],
      },
    ],
  },
];

export const CURSO_BONUS = {
  id: "bonus",
  titulo: "Bónus — Banco de prompts rápidos",
  intro: "Cola e adapta trocando o que está entre [colchetes]. Guarda à mão.",
  prompts: [
    { agente: "Claude · Grok", nome: "Mapear as 5 dores do público", texto: `Meu nicho é [NICHO] e meu público é [PÚBLICO].
Liste as 5 maiores dores dele — as frustrações que ele sente
mas raramente verbaliza — escritas COM AS PALAVRAS DELE.
Para cada dor, dê 1 gancho de Reel no estilo especialista.` },
    { agente: "Claude", nome: "30 ideias de uma vez", texto: `Com base no meu nicho [NICHO] e público [PÚBLICO], me dê
30 ideias de conteúdo divididas em: educativo, inspiracional,
bastidores, prova social e venda. Uma linha cada.` },
    { agente: "Claude", nome: "1 Reels vira 5 conteúdos", texto: `Pegue este roteiro [COLE] e transforme em: 1 carrossel,
3 ideias de stories, 1 legenda de post estático e
3 frases para postar no X.` },
    { agente: "Claude", nome: "Calendário de 1 mês", texto: `Monte um calendário de conteúdo de 4 semanas para meu
nicho [NICHO], com 3 posts por semana, variando os formatos
(Reels, carrossel, estático) e os objetivos. Em formato de tabela.` },
    { agente: "NotebookLM", nome: "Estudar um perfil de referência", texto: `Adicionei como fontes as legendas/vídeos de um perfil de
referência. Analise: que estratégia de conteúdo ele usa,
com que frequência posta cada formato e o que eu poderia
fazer diferente para me destacar.` },
  ],
  fecho: "Agora é contigo. Começa pelo Módulo 1. Uma ferramenta de cada vez, um post de cada vez. A constância vale mais que a perfeição.",
};
