// Curso "Criação de Conteúdo com IA" — a tua equipa de 4 IAs para viralizar e
// vender no Instagram. Conteúdo baseado no documento do curso da Cátia.
// videoUrl: por preencher (a Cátia coloca o vídeo de cada aula).

export type Secao = { titulo?: string; paragrafos?: string[]; lista?: string[] };
export type Aula = {
  id: string;
  numero: string;
  titulo: string;
  subtitulo?: string;
  videoUrl?: string; // embed (YouTube/Vimeo) — a preencher
  secoes: Secao[];
};

export const CURSO_INTRO = {
  titulo: "Criação de Conteúdo com IA",
  subtitulo: "A tua equipa de 4 IAs para viralizar e vender no Instagram",
  ferramentas: "Claude · ChatGPT · NotebookLM · Grok",
  nivel: "Nível: Iniciante · 6 módulos + projeto final",
  paragrafos: [
    "Criar conteúdo bom para o Instagram, todos os dias, é exaustivo. Tens de pesquisar o que está a bombar, ter ideias, escrever o roteiro, fazer as artes e ainda a legenda. É trabalho de uma equipa inteira — e normalmente fazes tudo sozinha.",
    "A proposta é simples: em vez de fazeres tudo sozinha, vais montar uma equipa de quatro assistentes de inteligência artificial. Cada um faz uma parte do trabalho pesado, e tu ficas com o papel mais importante — a direção criativa e a tua voz.",
    "Não precisas de saber nada de tecnologia. Não precisas de programar. Se sabes mandar mensagem no WhatsApp, consegues fazer este curso. Tudo é feito a conversar com a IA em português, como num chat.",
  ],
  metodo: "A grande sacada não é usar a ferramenta “melhor”. É usar a ferramenta certa para cada etapa. Pensa num restaurante: há quem compra os ingredientes, quem cria o prato, quem cozinha e quem monta o prato bonito. É a mesma lógica.",
  requisitos: [
    "Um computador ou telemóvel com internet — todas as ferramentas funcionam no navegador (e a maioria tem app).",
    "Uma conta em cada ferramenta — todas têm versão gratuita para começar.",
    "Um nicho definido — sobre o que é o teu perfil? Se ainda não tens, o Módulo 1 ajuda.",
    "30 a 60 minutos por dia nas primeiras semanas para praticar. Depois é muito mais rápido.",
  ],
};

export const AULAS: Aula[] = [
  {
    id: "m1",
    numero: "Módulo 1",
    titulo: "NotebookLM: inteligência do teu nicho",
    subtitulo: "A tua ferramenta de pesquisa e inteligência.",
    secoes: [
      {
        titulo: "1.1 O que é o NotebookLM",
        paragrafos: [
          "É uma ferramenta gratuita do Google. Pensa nele como um assistente de estudos que só sabe aquilo que TU lhe entregas. Metes lá dentro vídeos do YouTube, PDFs, textos e sites, e ele lê tudo por ti e responde às tuas perguntas com base APENAS nesse material.",
          "Porque importa para conteúdo? Porque ele não “inventa”. Resume, compara e encontra padrões dentro das referências reais do teu nicho.",
          "Recurso-chave: além de resumir em texto, cria resumos em áudio (tipo um podcast do teu material), mapas mentais, resumos em vídeo curtos na vertical e até quizzes — tudo a partir das tuas fontes.",
        ],
      },
      {
        titulo: "1.2 Passo a passo: criar o teu primeiro caderno",
        lista: [
          "Acede a notebooklm.google.com e entra com a tua conta Google.",
          "Clica em “Criar novo” (New notebook).",
          "Clica em “Adicionar fontes”: colar link do YouTube, subir PDF, colar texto ou link de site.",
          "Cola os links dos vídeos mais virais do teu nicho. Podes adicionar vários.",
          "Espera alguns segundos enquanto ele lê tudo. Pronto — agora é só perguntar no chat.",
        ],
      },
      {
        titulo: "1.3 A jogada principal: dissecar vídeos virais do teu nicho",
        paragrafos: [
          "É a técnica mais valiosa do módulo. Em vez de veres 20 vídeos a tentar perceber porque deram certo, deixas o NotebookLM fazê-lo e entregar-te o padrão pronto.",
          "Como escolher: no YouTube, procura temas do teu nicho e ordena por visualizações. Pega em 5 a 10 vídeos com muitas views (Reels/Shorts são ideais) e adiciona os links como fonte.",
          "Guarda essa análise — vira o teu mapa. No Módulo 3 entregas esses padrões ao Claude para escrever roteiros com a fórmula que já provou funcionar.",
        ],
      },
      {
        titulo: "1.4 Outros usos poderosos",
        lista: [
          "Base de conhecimento do teu nicho: sobe e-books, PDFs e artigos e pergunta o que quiseres.",
          "Resumo em áudio para estudar: ouve enquanto fazes outra coisa.",
          "Transformar o teu conteúdo: sobe a legenda de um post que foi bem e pede 10 variações.",
        ],
      },
    ],
  },
  {
    id: "m2",
    numero: "Módulo 2",
    titulo: "Grok: surfar as tendências em tempo real",
    subtitulo: "A tua ferramenta de tendência e timing.",
    secoes: [
      {
        titulo: "2.1 O que é o Grok e porque é diferente",
        paragrafos: [
          "É a IA da xAI, integrada à rede X (antigo Twitter). Consegue ler, em tempo real, o que as pessoas estão a postar e comentar neste momento.",
          "Enquanto o NotebookLM olha para o passado (o que já viralizou), o Grok olha para o presente: qual o assunto do momento, que notícia saiu, o que gera debate.",
          "Recurso-chave: o modo DeepSearch. Faz uma pesquisa profunda cruzando as conversas do X com notícias e sites, e devolve um resumo organizado com as fontes.",
        ],
      },
      {
        titulo: "2.2 Passo a passo: a tua primeira pesquisa de tendência",
        lista: [
          "Acede a grok.com (ou o app do X, na aba do Grok) e faz login.",
          "Ativa o modo “DeepSearch” quando quiseres uma pesquisa mais completa.",
          "Escreve a tua pergunta em português, de forma específica.",
          "Lê o resumo e clica nas fontes que ele cita para confirmar antes de usar.",
        ],
      },
      {
        titulo: "2.3 Prompts para caçar temas quentes",
        paragrafos: [
          "Quando falas usando exatamente as palavras do teu público, o conteúdo parece que “leu a mente” da pessoa — aumenta muito o engajamento. Essas frases viram ganchos no Módulo 3.",
        ],
      },
      {
        titulo: "2.4 Cuidado importante: confirma sempre",
        paragrafos: [
          "O Grok é rápido e atual, mas a internet tem muita informação errada. Antes de transformar um dado em post, clica nas fontes e confirma. Tu és a editora responsável — a IA é a estagiária de pesquisa, não a chefe.",
        ],
      },
    ],
  },
  {
    id: "m3",
    numero: "Módulo 3",
    titulo: "Claude: o roteirista da tua marca",
    subtitulo: "A tua ferramenta de escrita e roteiro.",
    secoes: [
      {
        titulo: "3.1 Porquê o Claude para escrever",
        paragrafos: [
          "O Claude, da Anthropic, escreve textos mais naturais, com nuance e boa capacidade de seguir instruções longas. Para roteiro, legenda e copy — onde a voz e o ritmo importam — é o parceiro ideal.",
          "Recurso que muda o jogo — Projetos: cria um “Projeto” e guarda lá instruções fixas sobre a tua marca (tom de voz, público, temas). Toda a conversa dentro desse projeto já sai com a tua cara.",
        ],
      },
      {
        titulo: "3.2 Primeiro passo: ensina a tua voz ao Claude",
        paragrafos: [
          "Antes de pedir qualquer roteiro, gasta 10 minutos a ensinar o Claude a falar como tu. É a diferença entre um texto genérico e um texto que parece teu.",
        ],
      },
      {
        titulo: "3.3 Ganchos: os 3 segundos que decidem tudo",
        paragrafos: [
          "O gancho é a primeira frase (ou os primeiros 3 segundos). Se não prender, ninguém vê o resto. Pede sempre várias opções e escolhe a melhor.",
        ],
      },
      {
        titulo: "3.4 Roteiro de Reels completo",
        paragrafos: [
          "Dica de ouro: junta tudo o que trouxeste dos módulos anteriores. Cola no Claude os padrões do NotebookLM (Módulo 1) e as dores do Grok (Módulo 2). Assim o roteiro nasce sobre dados reais.",
        ],
      },
      {
        titulo: "3.5 Estrutura de carrossel (slide a slide)",
        paragrafos: [
          "O Claude escreve o conteúdo do carrossel; no Módulo 4 o ChatGPT transforma em imagem. Aqui defines o que cada slide diz.",
        ],
      },
      { titulo: "3.6 Legenda que converte", paragrafos: ["Fecha o post com uma legenda que leva à ação (comentar, guardar, chamar no Direct)."] },
    ],
  },
  {
    id: "m4",
    numero: "Módulo 4",
    titulo: "ChatGPT: transformar texto em arte",
    subtitulo: "A tua ferramenta de criação visual.",
    secoes: [
      {
        titulo: "4.1 Porquê o ChatGPT para a parte visual",
        paragrafos: [
          "O ChatGPT, da OpenAI, tem geração de imagem forte e integrada ao chat. Descreves a imagem em português e ele cria. Permite ainda usar “GPTs” — versões especializadas, muitos feitos para montar carrosséis de Instagram.",
          "Importante: cada slide do carrossel é uma imagem separada (tamanho ideal 1080 x 1350, retrato). Geras uma de cada vez, com o texto certo em cada uma.",
        ],
      },
      {
        titulo: "4.2 Caminho 1 (mais simples): GPTs prontos de carrossel",
        paragrafos: ["A forma mais fácil para iniciantes — GPTs que já cuidam do layout e do design."],
        lista: [
          "No ChatGPT, clica em “Explorar GPTs”.",
          "Procura “carousel”, “Instagram carousel” ou “carrossel”.",
          "Escolhe um bem avaliado.",
          "Abre o GPT e cola o texto slide a slide que o Claude escreveu no Módulo 3.",
          "Pede para gerar no formato 1080 x 1350 e ajusta cores/estilo a conversar.",
        ],
      },
      { titulo: "4.3 Caminho 2: gerar as imagens tu mesma (mais controlo)", paragrafos: ["Para controlo total do visual, gera slide a slide direto no chat e define a identidade da tua marca."] },
      { titulo: "4.4 Caminho 3: agentes e automação (quando evoluíres)", paragrafos: ["Mais à frente dá para montar um agente que recebe o tema e devolve o carrossel quase pronto. Primeiro domina o fluxo manual; a automação vem depois."] },
      { titulo: "4.5 Levar para o Canva (opcional, recomendado)", paragrafos: ["Usa as imagens da IA como base e finaliza no Canva: logo, texto, identidade. A IA acelera 80% e tu dás o acabamento nos 20% finais."] },
    ],
  },
  {
    id: "m5",
    numero: "Módulo 5",
    titulo: "O fluxo completo e o teu projeto final",
    secoes: [
      { titulo: "5.1 A linha de produção completa", paragrafos: ["O processo inteiro, da ideia ao post. Depois de praticares, leva menos de uma hora por conteúdo — e cada vez mais rápido."] },
      {
        titulo: "5.2 Rotina semanal sugerida",
        lista: [
          "Segunda (30 min) — Pesquisa: NotebookLM + Grok. Sai com 5 temas e as dores do público.",
          "Terça (45 min) — Escrita: no Claude, gera os roteiros e legendas da semana de uma vez.",
          "Quarta (45 min) — Arte: no ChatGPT, cria os carrosséis e finaliza no Canva.",
          "Quinta — Gravação: grava os Reels com os roteiros.",
          "Sexta — Agendamento: agenda os posts da semana seguinte.",
        ],
        paragrafos: ["Concentras cada tipo de tarefa num dia. É muito mais produtivo do que fazer tudo post a post, todos os dias."],
      },
      { titulo: "5.3 Projeto final", paragrafos: ["Aplica o fluxo completo e cria o teu primeiro conteúdo de ponta a ponta com a tua equipa de IAs."] },
      {
        titulo: "5.4 Erros comuns de iniciante (e como evitar)",
        lista: [
          "Aceitar a primeira resposta da IA. Pede variações e edita — a magia está na conversa.",
          "Prompt vago. Quanto mais contexto (nicho, público, tom, objetivo), melhor. Sê específica.",
          "Conteúdo genérico. Adiciona a tua história, opinião e exemplos. A IA dá a estrutura; a personalidade é tua.",
          "Não confirmar informação. Especialmente com o Grok. Verifica as fontes antes de publicar.",
          "Querer automatizar cedo demais. Domina o fluxo manual primeiro.",
        ],
      },
    ],
  },
  {
    id: "m6",
    numero: "Módulo 6",
    titulo: "Automação: notícias e conteúdo no piloto automático",
    secoes: [
      {
        titulo: "6.1 O que é uma automação (tarefa agendada)",
        paragrafos: [
          "Escreves o pedido UMA vez, defines o horário (ex.: todos os dias às 7h) e a IA executa sozinha e entrega o resultado pronto — como um jornal personalizado do teu nicho a chegar de manhã.",
          "Em vez de gastares 30 minutos toda a manhã a caçar o que está a bombar, abres o telemóvel e o resumo já lá está. É a diferença entre correr atrás do conteúdo e o conteúdo vir até ti.",
        ],
      },
      {
        titulo: "6.2 Automação no ChatGPT (Tarefas Agendadas)",
        paragrafos: ["O ChatGPT tem “Tarefas Agendadas”. Corre um prompt no horário que escolheres, com navegação web — perfeito para notícias frescas."],
        lista: [
          "Na barra lateral do ChatGPT, abre “Tarefas” / “Scheduled”.",
          "Cria nova tarefa (ou descreve numa conversa o que queres e com que frequência).",
          "Cola o prompt, define o horário (ex.: 7h) e guarda.",
          "Na mesma página podes pausar, editar ou apagar qualquer tarefa.",
        ],
      },
      {
        titulo: "6.3 Automação no Claude (Tarefas Recorrentes no Cowork)",
        paragrafos: ["No Claude Desktop, no Cowork, há “Tarefas Recorrentes”. A vantagem: a tarefa tem acesso às tuas ferramentas, skills e plugins — entrega um resultado mais trabalhado."],
        lista: [
          "No Claude Desktop, abre o Cowork e vai a tarefas agendadas / recorrentes.",
          "Escreve o prompt uma vez e escolhe a frequência (por hora, diária, dias de semana ou semanal).",
          "Guarda. O Claude corre sozinho e entrega o resultado a cada ciclo.",
        ],
      },
      { titulo: "6.4 Qual usar para quê", paragrafos: ["Não precisas de escolher só um — o ideal é ter os dois a trabalhar para ti."] },
      {
        titulo: "6.5 Regras de ouro da automação",
        lista: [
          "Começa com UMA tarefa. Só o briefing matinal primeiro; quando virar hábito, adiciona outras.",
          "Escolhe um horário que realmente lês.",
          "Refina com o tempo (“mais curto”, “só Brasil”, “foca em X”).",
          "Continua a conferir as fontes.",
          "A automação entrega matéria-prima; o toque humano e a tua opinião são o teu diferencial.",
        ],
      },
    ],
  },
];

export const CURSO_BONUS = {
  titulo: "Bónus — Banco de prompts rápidos",
  intro: "Cola e adapta trocando o que está entre [colchetes]. Guarda este banco à mão.",
  blocos: ["Ideias em série", "Reaproveitar conteúdo", "Calendário editorial", "Análise de concorrente"],
  fecho: "Agora é contigo. Começa hoje pelo Módulo 1 — uma ferramenta de cada vez, um post de cada vez. A constância vale mais que a perfeição.",
};
