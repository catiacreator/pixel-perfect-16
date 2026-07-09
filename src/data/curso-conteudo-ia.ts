// Curso "Criação de Conteúdo com IA" — método Cat.IA (funil, ganchos, PAS).
// videoUrl por preencher (a Cátia coloca o vídeo de cada aula).

export type Bloco =
  | { t: "p"; texto: string } // parágrafo (suporta **negrito**)
  | { t: "sub"; titulo: string } // subtítulo (Passo X)
  | { t: "ul"; itens: string[] } // lista com check
  | { t: "ol"; itens: string[] } // passos numerados
  | { t: "prompt"; agente: string; nome: string; texto: string; textoBr?: string } // texto = PT-PT; textoBr = PT-BR
  | { t: "nota"; v: "warn" | "info"; texto: string }
  | { t: "tabela"; cab: string[]; linhas: string[][] }
  | { t: "funil"; niveis: { titulo: string; desc: string }[] }
  | { t: "downloads"; itens: { nome: string; desc?: string; url: string }[] } // botões de descarregar ficheiros
  | { t: "aulas"; itens: { titulo: string; desc: string; aula: string }[] } // cartões-link para sub-aulas (?aula=id)
  | { t: "video"; url: string; titulo?: string }; // vídeo inline (.mp4 direto ou embed)

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
  // URL do vídeo de boas-vindas: aceita embed (YouTube/Vimeo/Tella) ou ficheiro .mp4 direto
  videoUrl: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/intro.mp4?v=2",
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
          ["ChatGPT", "Produz: carrosséis, infográficos, e-books e imagens.", "4. Produzir"],
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
    videoUrl: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/notebooklm.mp4",
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
          { t: "prompt", agente: "NotebookLM", nome: "Encontrar o padrão dos virais", texto: `És um analista de conteúdo viral. Analisa todos os vídeos
que adicionei como fontes. São os mais vistos do meu
nicho de [O TEU NICHO]. Diz-me:
1. Quais os 3 tipos de gancho (primeiros 3 segundos) mais usados
2. Que estrutura de guião se repete entre eles
3. Que assuntos/dores aparecem mais
4. Que emoções o conteúdo desperta (curiosidade, medo, etc.)
5. As 5 DORES do público que mais aparecem, nas palavras dele
6. Uma lista de 10 ideias de conteúdo que seguem esse padrão`, textoBr: `Você é um analista de conteúdo viral. Analise todos os vídeos
que adicionei como fontes. Eles são os mais vistos do meu
nicho de [SEU NICHO]. Me diga:
1. Quais os 3 tipos de gancho (primeiros 3 segundos) mais usados
2. Que estrutura de roteiro se repete entre eles
3. Quais assuntos/dores aparecem mais
4. Que emoções o conteúdo desperta (curiosidade, medo, etc.)
5. As 5 DORES do público que mais aparecem, nas palavras dele
6. Uma lista de 10 ideias de conteúdo que seguem esse padrão` },
          { t: "p", texto: "**O que fazer com a resposta:** copia a análise inteira (botão de copiar na resposta do NotebookLM). É esse texto que vais colar nas outras ferramentas — a secção seguinte tem um prompt pronto para cada uma." },
          { t: "nota", v: "warn", texto: "**Exercício:** cria um caderno com 5–10 vídeos virais, corre o prompt e guarda os 3 ganchos mais comuns + as 10 ideias. Terminas com um banco de ideias validadas para a semana." },
        ],
      },
      {
        titulo: "1.4 Leva a análise para a ferramenta seguinte",
        blocos: [
          { t: "p", texto: "O NotebookLM **analisa**, mas não escreve o teu conteúdo. O output dele é a matéria-prima das outras IAs. Copia a análise e cola no lugar marcado a amarelo — há um prompt para cada destino:" },
          { t: "prompt", agente: "Claude", nome: "Colar a análise no Claude (escrever conteúdo)", texto: `Vais escrever conteúdo de Instagram para o meu nicho de
[O TEU NICHO], com base numa análise real de vídeos virais
que fiz no NotebookLM. Aqui está a análise completa:

[COLA AQUI A ANÁLISE DO NOTEBOOKLM]

Com base APENAS nesses padrões reais:
1. Escolhe as 3 ideias com mais potencial e explica porquê
2. Para cada uma, dá-me 3 ganchos no estilo especialista
3. Diz que formato serve melhor a cada uma (Reel ou carrossel)`, textoBr: `Você vai escrever conteúdo de Instagram para o meu nicho de
[SEU NICHO], com base em uma análise real de vídeos virais
que fiz no NotebookLM. Aqui está a análise completa:

[COLE AQUI A ANÁLISE DO NOTEBOOKLM]

Com base APENAS nesses padrões reais:
1. Escolha as 3 ideias com mais potencial e explique por quê
2. Para cada uma, me dê 3 ganchos no estilo especialista
3. Diga que formato serve melhor para cada uma (Reel ou carrossel)` },
          { t: "prompt", agente: "ChatGPT", nome: "Colar a análise no ChatGPT (escrever conteúdo)", texto: `Vais ser o meu criador de conteúdo de Instagram.
Fiz esta análise de vídeos virais do meu nicho
[O TEU NICHO] no NotebookLM:

[COLA AQUI A ANÁLISE DO NOTEBOOKLM]

Com base nesses padrões:
1. Escolhe as 3 melhores ideias e explica porquê
2. Dá-me 3 ganchos para cada uma, no estilo especialista
3. Sugere o formato ideal (Reel ou carrossel) para cada ideia`, textoBr: `Você vai ser o meu criador de conteúdo de Instagram.
Fiz esta análise de vídeos virais do meu nicho
[SEU NICHO] no NotebookLM:

[COLE AQUI A ANÁLISE DO NOTEBOOKLM]

Com base nesses padrões:
1. Escolha as 3 melhores ideias e explique por quê
2. Me dê 3 ganchos para cada uma, no estilo especialista
3. Sugira o formato ideal (Reel ou carrossel) para cada ideia` },
          { t: "prompt", agente: "Grok", nome: "Colar a análise no Grok (validar o que está quente)", texto: `Fiz esta análise de vídeos virais do meu nicho
[O TEU NICHO] no NotebookLM. As 10 ideias estão no fim:

[COLA AQUI A ANÁLISE DO NOTEBOOKLM]

Usa o DeepSearch e diz-me: quais destas ideias estão
a ser faladas AGORA no X e nas notícias? Ordena da mais
quente para a mais fria e cita as fontes.`, textoBr: `Fiz esta análise de vídeos virais do meu nicho
[SEU NICHO] no NotebookLM. As 10 ideias estão no final:

[COLE AQUI A ANÁLISE DO NOTEBOOKLM]

Use o DeepSearch e me diga: quais dessas ideias estão
sendo faladas AGORA no X e nas notícias? Ordene da mais
quente para a mais fria e cite as fontes.` },
          { t: "nota", v: "info", texto: "**O fluxo é sempre este:** uma ferramenta produz → copias o output → colas no prompt da seguinte, no lugar marcado `[COLA AQUI…]`. Vais ver o mesmo padrão nos módulos do Grok, do Claude e do ChatGPT." },
        ],
      },
    ],
  },
  {
    id: "m2",
    numero: "Módulo 2",
    titulo: "Grok: surfando as tendências em tempo real",
    objetivo: "Descobrir o que o público fala e sente AGORA para criar conteúdo em cima de assuntos quentes antes de toda a gente.",
    videoUrl: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/grok.mp4",
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
          { t: "prompt", agente: "Grok", nome: "Radar de tendências do nicho", texto: `Usa o DeepSearch. Pesquisa no X e em notícias recentes:
quais são os assuntos, dúvidas e debates em alta HOJE
sobre [O TEU NICHO]. Lista os 5 temas mais comentados,
explica porque estão em alta e cita as fontes.`, textoBr: `Use o DeepSearch. Pesquise no X e em notícias recentes:
quais são os assuntos, dúvidas e debates em alta HOJE
sobre [SEU NICHO]. Liste os 5 temas mais comentados,
explique por que estão em alta e cite as fontes.` },
          { t: "prompt", agente: "Grok", nome: "Descobrir a dor do público", texto: `Pesquisa no X o que as pessoas estão a RECLAMAR ou
a PERGUNTAR sobre [TEMA DO TEU NICHO]. Quero perceber
as dores reais, com as palavras que elas usam. Lista as
10 frases/reclamações mais comuns.`, textoBr: `Pesquise no X o que as pessoas estão RECLAMANDO ou
PERGUNTANDO sobre [TEMA DO SEU NICHO]. Quero entender
as dores reais, com as palavras que elas usam. Liste as
10 frases/reclamações mais comuns.` },
          { t: "prompt", agente: "Grok", nome: "Aproveitar uma notícia (newsjacking)", texto: `Saiu esta notícia/tendência: [DESCREVE]. Dá-me 5 ângulos
de conteúdo para o Instagram do meu nicho [O TEU NICHO],
ligando essa novidade ao meu público.`, textoBr: `Saiu a notícia/tendência: [DESCREVA]. Me dê 5 ângulos
de conteúdo para o Instagram do meu nicho [SEU NICHO]
conectando essa novidade com o meu público.` },
          { t: "nota", v: "info", texto: "**Porque “as palavras que elas usam” importa:** falar com as palavras exatas do público faz o conteúdo parecer que leu a mente da pessoa. Essas frases viram ganchos no Módulo 3." },
          { t: "nota", v: "warn", texto: "**Exercício:** corre o “Radar de tendências” e escolhe 1 tema quente. Corre “Descobrir a dor” e guarda as 5 melhores frases." },
        ],
      },
      {
        titulo: "2.4 Leva o tema quente para quem escreve",
        blocos: [
          { t: "p", texto: "O Grok encontrou o tema e as dores — agora copia a resposta dele e cola no Claude (ou no ChatGPT) para transformar em conteúdo:" },
          { t: "prompt", agente: "Claude", nome: "Colar o resultado do Grok no Claude", texto: `Pesquisei no Grok o que o meu público está a falar
AGORA sobre [TEMA/NICHO]. Aqui está o resultado, com
as dores e as frases reais das pessoas:

[COLA AQUI O RESULTADO DO GROK]

Com base nisso:
1. Escolhe o tema com mais potencial para esta semana
2. Dá-me 5 ganchos usando as PALAVRAS EXATAS do público
3. Sugere 1 Reel e 1 carrossel sobre esse tema`, textoBr: `Pesquisei no Grok o que o meu público está falando
AGORA sobre [TEMA/NICHO]. Aqui está o resultado, com
as dores e as frases reais das pessoas:

[COLE AQUI O RESULTADO DO GROK]

Com base nisso:
1. Escolha o tema com mais potencial para esta semana
2. Me dê 5 ganchos usando as PALAVRAS EXATAS do público
3. Sugira 1 Reel e 1 carrossel sobre esse tema` },
          { t: "prompt", agente: "ChatGPT", nome: "Colar o resultado do Grok no ChatGPT", texto: `Pesquisei no Grok as tendências e dores do meu nicho
[O TEU NICHO]. Aqui está o resultado:

[COLA AQUI O RESULTADO DO GROK]

Com base nisso:
1. Escolhe o melhor tema para publicar esta semana
2. Dá-me 5 ganchos com as palavras exatas do público
3. Esboça 1 carrossel de 7 slides sobre esse tema`, textoBr: `Pesquisei no Grok as tendências e dores do meu nicho
[SEU NICHO]. Aqui está o resultado:

[COLE AQUI O RESULTADO DO GROK]

Com base nisso:
1. Escolha o melhor tema para publicar esta semana
2. Me dê 5 ganchos com as palavras exatas do público
3. Esboce 1 carrossel de 7 slides sobre esse tema` },
        ],
      },
    ],
  },
  {
    id: "m3",
    numero: "Módulo 3",
    titulo: "Criar conteúdo com o Claude",
    objetivo: "Dominar o Claude como o teu estúdio criativo: escrita na tua voz, carrosséis visuais prontos a exportar e peças interativas partilháveis por link.",
    links: [{ nome: "Abrir Claude", url: "https://claude.ai" }],
    secoes: [
      {
        titulo: "3.1 Porque o Claude",
        blocos: [
          { t: "p", texto: "Escreve textos naturais, com nuance, e segue instruções longas muito bem. Usa os **Projetos** para guardar as instruções fixas da tua marca — toda a conversa já sai com a tua cara. E com os **artefactos**, não fica pelo texto: desenha carrosséis visuais e cria peças interativas." },
        ],
      },
      {
        titulo: "3.2 As três aulas deste capítulo",
        blocos: [
          { t: "aulas", itens: [
            { titulo: "1 · Criar conteúdo no Claude", desc: "A voz da marca, ganchos, roteiros de Reels, carrosséis e legendas — o fluxo completo de escrita.", aula: "m3b" },
            { titulo: "2 · Carrosséis visuais no Claude", desc: "O Claude desenha os slides prontos a exportar (1080x1350), com a tua marca — sem gerador de imagens.", aula: "m3c" },
            { titulo: "3 · Criar artefactos no Claude", desc: "Quizzes, checklists e mini-páginas interativas — criadas na conversa e partilhadas por link.", aula: "m3d" },
          ] },
          { t: "nota", v: "info", texto: "**Qual escolher?** Queres escrever posts → Aula 1. Queres o carrossel já desenhado, slide a slide → Aula 2. Queres uma peça interativa (quiz, checklist, página) → Aula 3." },
        ],
      },
    ],
  },
  {
    id: "m4",
    numero: "Módulo 4",
    titulo: "Criar conteúdo com o ChatGPT",
    objetivo: "Dominar o ChatGPT como ferramenta de produção: carrosséis completos, infográficos, e-books e imagens — a partir de uma ideia tua ou de material que já tens.",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        titulo: "4.1 Porque o ChatGPT para produzir",
        blocos: [
          { t: "p", texto: "É a ferramenta mais completa da etapa de **produção**: escreve o texto final dos slides, sugere o design e gera imagens no próprio chat — tudo em português, sem precisares de saber design. O tamanho ideal para Instagram é **1080 x 1350 px** (retrato)." },
        ],
      },
      {
        titulo: "4.2 As três aulas deste capítulo",
        blocos: [
          { t: "aulas", itens: [
            { titulo: "1 · Carrosséis no ChatGPT", desc: "Cria um carrossel completo do zero: estrutura, texto final, design, legenda e montagem.", aula: "m4b" },
            { titulo: "2 · Imagens e infográficos", desc: "Imagens fotográficas realistas, infográficos e slides de apresentação — cada um com o seu prompt.", aula: "m4c" },
            { titulo: "3 · Carrosséis com informação externa", desc: "Transforma um texto, documento, ideia ou os resultados do Grok/NotebookLM num carrossel.", aula: "m4d" },
          ] },
          { t: "nota", v: "info", texto: "**Qual escolher?** Tens só um tema na cabeça → Aula 1. Queres outro formato (infográfico, e-book, imagem) → Aula 2. Já tens matéria-prima (texto, documento, pesquisa do M1/M2 ou estrutura do M3) → Aula 3." },
          { t: "nota", v: "info", texto: "**Bónus do capítulo:** os **Agentes Creator** (no menu lateral) são GPTs prontos que fazem parte deste trabalho por ti." },
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
            ["4. Produção", "ChatGPT", "Produz o carrossel: texto final, design e imagens."],
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
      { nome: "Abrir InstaScript", url: "https://instascript.metodoturbox.com.br/" },
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
          { t: "prompt", agente: "ChatGPT", nome: "Briefing diário de notícias", texto: `Todos os dias às 7h, pesquisa na web as notícias e
novidades mais relevantes das últimas 24h sobre
[O TEU NICHO]. Entrega-me:
- As 5 principais manchetes, com 1 frase de resumo cada
- Porque é que cada uma importa para o meu público
- 3 ideias de post inspiradas nessas notícias
Formato curto e escaneável, em português de Portugal.`, textoBr: `Todos os dias às 7h, pesquise na web as notícias e
novidades mais relevantes das últimas 24h sobre
[SEU NICHO]. Me entregue:
- As 5 principais manchetes, com 1 frase de resumo cada
- Por que cada uma importa para o meu público
- 3 ideias de post inspiradas nessas notícias
Formato curto e escaneável, em português do Brasil.` },
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
          { t: "prompt", agente: "Claude", nome: "Radar diário de conteúdo", texto: `Todos os dias de semana às 7h, faz o meu briefing de
criadora de conteúdo do nicho [O TEU NICHO]:
1. Resume as 5 notícias/tendências mais quentes das
   últimas 24h e porque importam para o meu público
2. Sugere 3 ganchos de Reels prontos sobre esses temas
3. Sugere 1 tema de carrossel com os 5 slides esboçados
Entrega em texto curto, no meu tom: [DESCREVE O TOM].`, textoBr: `Todos os dias de semana às 7h, faça meu briefing de
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
        titulo: "6.4 Vigiar concorrentes específicos no Instagram",
        blocos: [
          { t: "p", texto: "Além das notícias, podes pôr a IA a acompanhar **perfis concretos** do teu nicho. Troca os [@…] pelos perfis que queres seguir — funciona como tarefa agendada (ChatGPT) ou recorrente (Claude)." },
          { t: "prompt", agente: "ChatGPT", nome: "Vigia de concorrentes (tarefa diária)", texto: `Todos os dias às 8h, pesquisa na web o que estes perfis
de Instagram publicaram nas últimas 24h:
[@CONCORRENTE1], [@CONCORRENTE2], [@CONCORRENTE3]
Entrega-me:
- O que cada um publicou (formato: Reel, carrossel, estático)
- Os ganchos/títulos que usaram
- Que temas se repetem entre eles
- 2 ideias para eu tratar o mesmo tema com um ângulo
  diferente e a minha voz
Formato curto, em português de Portugal.`, textoBr: `Todos os dias às 8h, pesquise na web o que estes perfis
de Instagram publicaram nas últimas 24h:
[@CONCORRENTE1], [@CONCORRENTE2], [@CONCORRENTE3]
Me entregue:
- O que cada um publicou (formato: Reel, carrossel, estático)
- Os ganchos/títulos que usaram
- Quais temas se repetem entre eles
- 2 ideias para eu tratar o mesmo tema com um ângulo
  diferente e a minha voz
Formato curto, em português do Brasil.` },
          { t: "prompt", agente: "Claude", nome: "Relatório semanal de concorrência", texto: `Todas as segundas às 8h, faz o meu relatório de
concorrência no Instagram. Perfis a vigiar:
[@CONCORRENTE1], [@CONCORRENTE2], [@CONCORRENTE3]
1. Que temas e formatos cada um usou na última semana
2. Que ganchos se destacaram (e porquê)
3. Que lacuna ficou aberta — assuntos que o meu público
   quer e eles não cobriram
4. 3 ideias de post para eu ocupar essa lacuna, no meu tom`, textoBr: `Todas as segundas às 8h, faça meu relatório de
concorrência no Instagram. Perfis para vigiar:
[@CONCORRENTE1], [@CONCORRENTE2], [@CONCORRENTE3]
1. Quais temas e formatos cada um usou na última semana
2. Quais ganchos se destacaram (e por quê)
3. Qual lacuna ficou aberta — assuntos que o meu público
   quer e eles não cobriram
4. 3 ideias de post para eu ocupar essa lacuna, no meu tom` },
          { t: "nota", v: "warn", texto: "**Nota honesta:** as IAs nem sempre conseguem ver o Instagram por dentro — o relatório pode vir incompleto. Quando quiseres estudar um post específico a fundo, usa a secção seguinte: transcreve-o no InstaScript e trabalha com o texto real." },
        ],
      },
      {
        titulo: "6.5 Transcrever carrosséis e vídeos (InstaScript)",
        blocos: [
          { t: "p", texto: "O **InstaScript** transforma um link de Reel ou carrossel na transcrição completa do conteúdo. É a forma mais fiável de estudar um post concreto — trabalhas com o texto real, não com a memória da IA." },
          { t: "ol", itens: [
            "Guarda os links dos Reels/carrosséis que queres estudar (do relatório de concorrentes, ou ao navegar).",
            "Abre o InstaScript (botão no topo desta página) e entra com o teu acesso.",
            "Cola o link do post e gera a transcrição.",
            "Copia a transcrição e cola no Claude ou no ChatGPT com o prompt abaixo — escolhe o formato que queres criar.",
          ] },
          { t: "prompt", agente: "Claude · ChatGPT", nome: "Da transcrição ao teu conteúdo (escolhe o formato)", texto: `Transcrevi um conteúdo viral de um concorrente do meu
nicho [O TEU NICHO]. Aqui está a transcrição:

[COLA AQUI A TRANSCRIÇÃO DO INSTASCRIPT]

Quero criar a MINHA versão em formato
[ESCOLHE: Reel / carrossel / stories / legenda].
Regras:
1. Identifica o gancho, a estrutura e porque funciona
2. NÃO copies frases — extrai a fórmula e recria com a
   minha voz, o meu exemplo e a minha experiência
3. Muda o ângulo: acrescenta algo que o original não disse
4. Entrega no formato escolhido, pronto a produzir`, textoBr: `Transcrevi um conteúdo viral de um concorrente do meu
nicho [SEU NICHO]. Aqui está a transcrição:

[COLE AQUI A TRANSCRIÇÃO DO INSTASCRIPT]

Quero criar a MINHA versão no formato
[ESCOLHA: Reel / carrossel / stories / legenda].
Regras:
1. Identifique o gancho, a estrutura e por que funciona
2. NÃO copie frases — extraia a fórmula e recrie com a
   minha voz, o meu exemplo e a minha experiência
3. Mude o ângulo: acrescente algo que o original não disse
4. Entregue no formato escolhido, pronto para produzir` },
          { t: "nota", v: "warn", texto: "**Inspiração ≠ cópia:** a transcrição serve para aprenderes a estrutura e o gancho — nunca para republicar o texto de outra pessoa. O prompt já obriga a recriar com a tua voz e o teu exemplo; garante que o resultado final é teu." },
        ],
      },
      {
        titulo: "6.6 Qual usar para quê",
        blocos: [
          { t: "tabela", cab: ["Ferramenta", "Melhor para", "Frequências"], linhas: [
            ["ChatGPT (Tarefas)", "Briefing de notícias frescas com navegação na web, direto e rápido.", "Diária, semanal ou personalizada"],
            ["Claude (Recorrentes)", "Briefing mais elaborado, já com ganchos no teu tom, usando conexões e skills.", "Por hora, diária, dias de semana, semanal"],
          ] },
        ],
      },
      {
        titulo: "6.7 Regras de ouro da automação",
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
    id: "m1b",
    numero: "NotebookLM · Apresentações",
    titulo: "Apresentações",
    objetivo: "Criar slides de apresentação prontos a usar — capa, tópicos e conclusão — todos com o mesmo estilo visual.",
    videoUrl: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/apresentacoes.mp4",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        blocos: [
          { t: "p", texto: "Transforma o teu conteúdo numa **apresentação** completa — capa, slides de conteúdo e conclusão, todos com a mesma identidade visual. Formato 16:9 (1920x1080)." },
          { t: "prompt", agente: "ChatGPT", nome: "Slides de apresentação", texto: `Cria uma apresentação sobre [TEMA] para [PÚBLICO],
em [Nº] slides no formato 16:9 (1920x1080).
Para cada slide: título curto + 3 a 4 tópicos, mesmo
estilo visual, cores [PALETA], muito espaço em branco.
Slide 1 = capa; último slide = conclusão + CTA.`, textoBr: `Crie uma apresentação sobre [TEMA] para [PÚBLICO],
em [Nº] slides no formato 16:9 (1920x1080).
Para cada slide: título curto + 3 a 4 tópicos, mesmo
estilo visual, cores [PALETA], muito espaço em branco.
Slide 1 = capa; último slide = conclusão + CTA.` },
          { t: "nota", v: "warn", texto: "**Confere o texto:** os slides têm muito texto e os geradores erram acentos. Revê tudo; se falhar, pede de novo ou corrige no Canva, PowerPoint ou Google Slides." },
        ],
      },
    ],
  },
  {
    id: "m4b",
    numero: "ChatGPT · Aula 1",
    titulo: "Carrosséis no ChatGPT",
    objetivo: "Criar um carrossel completo dentro do ChatGPT — da estrutura ao texto final, design, legenda e montagem — a partir de um tema teu.",
    videoUrl: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/carrosseis-chatgpt.mp4",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        blocos: [
          { t: "nota", v: "info", texto: "**Aula 1 do capítulo ChatGPT.** Aqui partes de um **tema** e fazes tudo numa só conversa. Se já tens matéria-prima de outras ferramentas (texto, documento, Grok, NotebookLM ou Claude), usa a **Aula 3 · Carrosséis com informação externa**." },
        ],
      },
      {
        titulo: "1. O fluxo do carrossel no ChatGPT",
        blocos: [
          { t: "p", texto: "Cinco passos, sempre na **mesma conversa** — assim ele lembra-se do que já fez e mantém a coerência:" },
          { t: "tabela", cab: ["Passo", "O que recebes"], linhas: [
            ["1 · Estrutura", "O esqueleto: 7 slides com título e texto de apoio."],
            ["2 · Texto final", "Cada slide pronto a publicar, otimizado para o telemóvel."],
            ["3 · Design", "Paleta, estilo visual e ideia de imagem por slide."],
            ["4 · Legenda", "Legenda com gancho na 1ª linha + 12 hashtags."],
            ["5 · Montagem", "No Canva — ou imagens geradas no próprio ChatGPT."],
          ] },
        ],
      },
      {
        titulo: "2. Passo 1 · Estrutura do carrossel",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Estruturar o carrossel a partir do tema", texto: `Cria a estrutura de um carrossel de Instagram com 7 slides
sobre [TEMA], para o público [QUEM SEGUE].
Para cada slide indica:
- Título curto (máx. 6 palavras)
- Texto de apoio (1 a 2 frases)
Slide 1 = capa com gancho forte. Último slide = call-to-action.
Tom envolvente, frases curtas, fáceis de ler no telemóvel.`, textoBr: `Crie a estrutura de um carrossel de Instagram com 7 slides
sobre [TEMA], para o público [QUEM SEGUE].
Para cada slide indique:
- Título curto (máx. 6 palavras)
- Texto de apoio (1 a 2 frases)
Slide 1 = capa com gancho forte. Último slide = call-to-action.
Tom envolvente, frases curtas, fáceis de ler no celular.` },
        ],
      },
      {
        titulo: "3. Passo 2 · Texto final dos slides",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Gerar o texto final dos slides", texto: `Agora transforma cada slide desta estrutura em texto final
pronto a publicar, otimizado para Instagram: frases curtas,
com impacto, fáceis de ler no telemóvel. Mantém a coerência
de tom entre todos os slides.`, textoBr: `Agora transforme cada slide dessa estrutura em texto final
pronto para publicar, otimizado para Instagram: frases curtas,
com impacto, fáceis de ler no celular. Mantenha a coerência
de tom entre todos os slides.` },
        ],
      },
      {
        titulo: "4. Passo 3 · Design e ideias visuais",
        blocos: [
          { t: "p", texto: "Na mesma conversa (ele já conhece o carrossel), pede as sugestões visuais:" },
          { t: "prompt", agente: "ChatGPT", nome: "Sugestões de design e imagem", texto: `Para este carrossel, sugere para cada slide:
- paleta de cores
- estilo visual
- uma ideia de imagem ou ícone
No fim, dá-me 3 prompts de imagem que eu possa
usar num gerador de imagens.`, textoBr: `Para este carrossel, sugira para cada slide:
- paleta de cores
- estilo visual
- uma ideia de imagem ou ícone
No final, me dê 3 prompts de imagem que eu possa
usar em um gerador de imagens.` },
        ],
      },
      {
        titulo: "5. Passo 4 · Legenda + hashtags",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Legenda com gancho + hashtags", texto: `Escreve a legenda para este carrossel: gancho na
primeira linha, desenvolvimento com quebras de linha
e CTA no fim. Depois sugere 12 hashtags (mistura de
grandes, médias e de nicho) em português.`, textoBr: `Escreva a legenda para este carrossel: gancho na
primeira linha, desenvolvimento com quebras de linha
e CTA no final. Depois sugira 12 hashtags (mistura de
grandes, médias e de nicho) em português.` },
        ],
      },
      {
        titulo: "6. Passo 5 · Montar o visual",
        blocos: [
          { t: "ol", itens: [
            "Abre o Canva (ou a tua app de design) e escolhe um modelo 1080 x 1350.",
            "Cola o texto final de cada slide (Passo 2) e aplica o design sugerido (Passo 3).",
            "Confere letras, acentos e o contraste do texto.",
            "Publica com a legenda e as hashtags do Passo 4.",
          ] },
          { t: "nota", v: "info", texto: "**Porquê o Canva no fim:** o conteúdo já vem pensado e estruturado — aqui só dás a cara final. A IA acelera 80%; tu dás o acabamento nos 20% finais." },
        ],
      },
      {
        titulo: "7. Opcional · Gerar as imagens no próprio ChatGPT",
        blocos: [
          { t: "p", texto: "Se preferires que o próprio ChatGPT desenhe os slides (em vez de montares no Canva), fixa primeiro o estilo e pede depois um slide de cada vez:" },
          { t: "prompt", agente: "ChatGPT", nome: "Definir o estilo do carrossel", texto: `Vou criar um carrossel de Instagram. O texto de cada slide
já foi escrito no Claude; vou colar um de cada vez.
Guarda este estilo para TODAS as imagens desta conversa:
- Formato: retrato 1080 x 1350
- Paleta de cores: [ex.: roxo e amarelo, fundo claro]
- Estilo: minimalista, muito espaço em branco, texto grande
- Fonte: sem serifa, moderna e legível no telemóvel
- Mesma identidade visual em todos os slides
Confirma e aguarda o texto de cada slide.`, textoBr: `Vou criar um carrossel de Instagram. O texto de cada slide
já foi escrito no Claude; vou colar um de cada vez.
Guarde este estilo para TODAS as imagens desta conversa:
- Formato: retrato 1080 x 1350
- Paleta de cores: [ex.: roxo e amarelo, fundo claro]
- Estilo: minimalista, muito espaço em branco, texto grande
- Fonte: sem serifa, moderna e legível no celular
- Mesma identidade visual em todos os slides
Confirme e aguarde o texto de cada slide.` },
          { t: "prompt", agente: "ChatGPT", nome: "Gerar cada slide (um de cada vez)", texto: `Slide 1 (capa). Cria a imagem 1080x1350 no estilo definido,
com este texto em destaque:
"[COLA AQUI O TEXTO DO SLIDE 1 — do Passo 2]"
Texto grande, centrado, altíssimo contraste.

(Repete para cada slide: 'Agora o Slide 2 com o texto: …'
No último, pede espaço para adicionares o teu @ e o logótipo.)`, textoBr: `Slide 1 (capa). Crie a imagem 1080x1350 no estilo definido,
com este texto em destaque:
"[COLE AQUI O TEXTO DO SLIDE 1 — do Passo 2]"
Texto grande, centralizado, altíssimo contraste.

(Repita para cada slide: 'Agora o Slide 2 com o texto: …'
No último, peça espaço para adicionar o seu @ e a logo.)` },
          { t: "nota", v: "warn", texto: "**Atenção ao texto na imagem:** geradores às vezes erram letras e acentos. Confere cada slide; se sair errado, pede de novo ou escreve por cima no Canva." },
        ],
      },
      {
        titulo: "8. Checklist antes de publicar",
        blocos: [
          { t: "ul", itens: [
            "A capa faz parar de rolar sozinha? (lê só o slide 1 — dá vontade de deslizar?)",
            "Uma ideia por slide, sem parágrafos longos.",
            "Mesma paleta, fonte e margens em todos os slides.",
            "Texto legível no telemóvel (grande e com contraste).",
            "Último slide convida a guardar/partilhar.",
            "A legenda abre com gancho e fecha com CTA.",
          ] },
          { t: "nota", v: "warn", texto: "**Exercício:** escolhe um tema, corre os 5 passos numa só conversa e publica. Depois marca a tarefa como completa." },
        ],
      },
    ],
  },
  {
    id: "m4c",
    numero: "ChatGPT · Aula 2",
    titulo: "Imagens e infográficos",
    objetivo: "Usar a geração de imagem do ChatGPT para imagens fotográficas realistas e para infográficos e slides de apresentação — cada um com o seu prompt.",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        blocos: [
          { t: "nota", v: "info", texto: "**Regra que vale para tudo:** pede **um formato de cada vez**, indica sempre o **tamanho** e a **paleta**, e corrige com **uma alteração por mensagem**. Para texto por cima, pede a imagem **sem texto** e escreve tu no Canva (evita erros de letras)." },
        ],
      },
      {
        titulo: "3.1 Imagens fotográficas",
        blocos: [
          { t: "p", texto: "Imagens realistas, com ar de fotografia — para posts, fundos de stories, capas de Reels ou mockups de produto. Descreves a cena em português e o ChatGPT cria." },
          { t: "video", url: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/imagens-fotograficas.mp4", titulo: "Gerar imagens fotográficas" },
          { t: "prompt", agente: "ChatGPT", nome: "Imagem fotográfica", texto: `Cria uma imagem fotográfica realista de: [DESCREVE A CENA].
- Formato: [1080x1350 retrato / 1080x1080 quadrado / 1080x1920 story]
- Luz: [ex.: natural suave, luz de manhã junto à janela]
- Ambiente/cores: [PALETA ou descrição]
- Enquadramento: [ex.: primeiro plano, cima para baixo (flat lay)]
Sem texto na imagem — o texto ponho eu depois.`, textoBr: `Crie uma imagem fotográfica realista de: [DESCREVA A CENA].
- Formato: [1080x1350 retrato / 1080x1080 quadrado / 1080x1920 story]
- Luz: [ex.: natural suave, luz da manhã perto da janela]
- Ambiente/cores: [PALETA ou descrição]
- Enquadramento: [ex.: primeiro plano, de cima para baixo (flat lay)]
Sem texto na imagem — o texto eu coloco depois.` },
          { t: "nota", v: "info", texto: "**Mais realismo:** diz o tipo de luz, a hora do dia e detalhes concretos (“chávena de café a fumegar, mesa de madeira”). Pede **3 variações** e corrige **uma coisa de cada vez** (“muda só o fundo para…”)." },
        ],
      },
      {
        titulo: "3.2 Infográficos e thumbnails",
        blocos: [
          { t: "p", texto: "Infográfico = o teu método ou um processo **visualizado**. É dos formatos que mais gera guardados, porque a pessoa quer voltar a consultar." },
          { t: "video", url: "https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/infograficos.mp4", titulo: "Infográficos e thumbnails" },
          { t: "prompt", agente: "ChatGPT", nome: "Infográfico", texto: `Cria um infográfico vertical 1080x1350 sobre [TEMA].
Conteúdo (por esta ordem):
[LISTA OS 3 A 5 PASSOS OU DADOS]
Estilo: limpo, fundo claro, cores [PALETA], títulos grandes,
ícones simples, numeração visível. Texto em português correto
e legível no telemóvel. Deixa espaço no rodapé para o meu @.`, textoBr: `Crie um infográfico vertical 1080x1350 sobre [TEMA].
Conteúdo (nesta ordem):
[LISTE OS 3 A 5 PASSOS OU DADOS]
Estilo: limpo, fundo claro, cores [PALETA], títulos grandes,
ícones simples, numeração visível. Texto em português correto
e legível no celular. Deixe espaço no rodapé para o meu @.` },
          { t: "nota", v: "warn", texto: "**Confere números e letras:** infográficos têm muito texto e os geradores erram acentos. Revê tudo; se falhar, pede de novo ou corrige por cima no Canva." },
          { t: "nota", v: "warn", texto: "**Exercício:** cria 1 imagem fotográfica para um post e 1 infográfico com os passos do teu método. Um de cada tipo." },
        ],
      },
    ],
  },
  {
    id: "m4d",
    numero: "ChatGPT · Aula 3",
    titulo: "Carrosséis com informação externa",
    objetivo: "Transformar material que já existe — um texto, um documento, uma ideia, os resultados do Grok ou do NotebookLM — num carrossel pronto a publicar.",
    links: [{ nome: "Abrir ChatGPT", url: "https://chatgpt.com" }],
    secoes: [
      {
        titulo: "1. Não partas da folha em branco",
        blocos: [
          { t: "p", texto: "O melhor carrossel raramente nasce do nada — nasce de **matéria-prima real**. Qualquer uma destas fontes serve; para cada uma há um prompt pronto abaixo:" },
          { t: "tabela", cab: ["Fonte", "De onde vem"], linhas: [
            ["Texto ou artigo", "Blog, newsletter, transcrição do InstaScript (M6)."],
            ["Documento", "PDF ou Word — anexas diretamente na conversa."],
            ["Ideia solta", "A tua cabeça — 1 ou 2 frases chegam."],
            ["Análise de virais", "NotebookLM (Módulo 1)."],
            ["Tema quente + dores", "Grok (Módulo 2)."],
            ["Estrutura pronta", "Claude (Módulo 3)."],
          ] },
        ],
      },
      {
        titulo: "2. De um texto ou artigo",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Texto → carrossel", texto: `Transforma este texto num carrossel de 7 slides:

[COLA AQUI O TEXTO / ARTIGO / TRANSCRIÇÃO]

- Slide 1: capa com gancho forte (faz parar de rolar)
- Slides 2 a 6: uma ideia por slide, texto curto
- Slide 7: CTA (guardar/partilhar)
Escreve na MINHA voz: [DESCREVE O TOM] — não copies
frases do original. No fim: legenda + 10 hashtags.`, textoBr: `Transforme este texto em um carrossel de 7 slides:

[COLE AQUI O TEXTO / ARTIGO / TRANSCRIÇÃO]

- Slide 1: capa com gancho forte (faz parar de rolar)
- Slides 2 a 6: uma ideia por slide, texto curto
- Slide 7: CTA (salvar/compartilhar)
Escreva na MINHA voz: [DESCREVA O TOM] — não copie
frases do original. No final: legenda + 10 hashtags.` },
        ],
      },
      {
        titulo: "3. De um documento (PDF, Word)",
        blocos: [
          { t: "ol", itens: [
            "Na conversa, clica no clipe 📎 e anexa o documento.",
            "Cola o prompt abaixo e envia.",
          ] },
          { t: "prompt", agente: "ChatGPT", nome: "Documento → carrossel", texto: `Lê o documento em anexo e cria um carrossel de 7 slides
com as ideias mais fortes para o meu público [PÚBLICO].
Capa com gancho, uma ideia por slide, CTA no fim.
Na minha voz: [DESCREVE O TOM].
Depois entrega a legenda + 10 hashtags.`, textoBr: `Leia o documento em anexo e crie um carrossel de 7 slides
com as ideias mais fortes para o meu público [PÚBLICO].
Capa com gancho, uma ideia por slide, CTA no final.
Na minha voz: [DESCREVA O TOM].
Depois entregue a legenda + 10 hashtags.` },
        ],
      },
      {
        titulo: "4. De uma ideia solta",
        blocos: [
          { t: "prompt", agente: "ChatGPT", nome: "Ideia → carrossel", texto: `Tenho esta ideia: [ESCREVE A IDEIA EM 1–2 FRASES].
Desenvolve-a num carrossel de 7 slides para [PÚBLICO]:
capa com gancho, uma ideia por slide, CTA no fim.
Sugere também 2 ângulos alternativos para o mesmo tema.`, textoBr: `Tenho esta ideia: [ESCREVA A IDEIA EM 1–2 FRASES].
Desenvolva em um carrossel de 7 slides para [PÚBLICO]:
capa com gancho, uma ideia por slide, CTA no final.
Sugira também 2 ângulos alternativos para o mesmo tema.` },
        ],
      },
      {
        titulo: "5. Da pesquisa do NotebookLM ou do Grok (M1 · M2)",
        blocos: [
          { t: "p", texto: "É aqui que o fluxo do curso se fecha: a pesquisa que fizeste nos Módulos 1 e 2 vira conteúdo publicável." },
          { t: "prompt", agente: "ChatGPT", nome: "Pesquisa → carrossel", texto: `Aqui está uma pesquisa que fiz noutra ferramenta
(NotebookLM ou Grok) sobre o meu nicho [NICHO]:

[COLA AQUI A ANÁLISE / O RESULTADO]

Escolhe a ideia com mais potencial e transforma-a num
carrossel de 7 slides: capa com gancho (usa as palavras
reais do público), uma ideia por slide, CTA no fim.
Depois entrega a legenda + 10 hashtags.`, textoBr: `Aqui está uma pesquisa que fiz em outra ferramenta
(NotebookLM ou Grok) sobre o meu nicho [NICHO]:

[COLE AQUI A ANÁLISE / O RESULTADO]

Escolha a ideia com mais potencial e transforme em um
carrossel de 7 slides: capa com gancho (use as palavras
reais do público), uma ideia por slide, CTA no final.
Depois entregue a legenda + 10 hashtags.` },
        ],
      },
      {
        titulo: "6. Da estrutura escrita no Claude (M3)",
        blocos: [
          { t: "p", texto: "Se seguiste o fluxo completo do curso, o Claude terminou o M3 com a estrutura do carrossel. Cola-a aqui para o ChatGPT produzir o texto final:" },
          { t: "prompt", agente: "ChatGPT", nome: "Estrutura do Claude → texto final", texto: `Tenho esta estrutura de carrossel, escrita no Claude:

[COLA AQUI A ESTRUTURA DO CARROSSEL (M3)]

Transforma cada slide em texto final pronto a publicar,
otimizado para Instagram: frases curtas, com impacto,
fáceis de ler no telemóvel. Mantém a coerência de tom.
Depois continua com o design e a legenda (Aula 1, Passos 3 e 4).`, textoBr: `Tenho esta estrutura de carrossel, escrita no Claude:

[COLE AQUI A ESTRUTURA DO CARROSSEL (M3)]

Transforme cada slide em texto final pronto para publicar,
otimizado para Instagram: frases curtas, com impacto,
fáceis de ler no celular. Mantenha a coerência de tom.
Depois continue com o design e a legenda (Aula 1, Passos 3 e 4).` },
          { t: "nota", v: "warn", texto: "**Material dos outros = inspiração, nunca cópia.** Quando a fonte não é tua (artigo, transcrição de concorrente), extrai a estrutura e recria com a tua voz e os teus exemplos — o prompt já obriga, garante tu que o resultado final é teu." },
          { t: "nota", v: "warn", texto: "**Exercício:** pega num artigo que gostes OU na tua análise do Módulo 1 e gera um carrossel completo. Publica e marca a tarefa como completa." },
        ],
      },
    ],
  },
  {
    id: "m3b",
    numero: "Claude · Aula 1",
    titulo: "Criar conteúdo no Claude",
    objetivo: "Transformar temas em ganchos, roteiros de Reels, carrosséis e legendas que soam como TU — não como um robô.",
    links: [{ nome: "Abrir Claude", url: "https://claude.ai" }],
    secoes: [
      {
        blocos: [
          { t: "nota", v: "info", texto: "**Como usar este módulo (importante):** os prompts NÃO são para escolher um. São uma **sequência**, na mesma conversa do Claude: **Passo 1** prepara a voz (uma vez só) → **Passo 2** gera os ganchos (escolhes o melhor) → **Passo 3** escreve o roteiro/carrossel → **Passo 4** fecha com a legenda. É como uma receita: um passo puxa o outro." },
        ],
      },
      {
        blocos: [
          { t: "sub", titulo: "Passo 1 · Ensina a tua voz (faz uma vez, no Projeto)" },
          { t: "prompt", agente: "Claude", nome: "Configurar a voz da marca", texto: `Vais ser o meu roteirista e copywriter de Instagram.
Contexto da minha marca:
- Nicho: [O TEU NICHO]
- O meu público e as 5 dores dele: [LISTA as dores]
- O meu tom de voz: [ex.: leve, direto, acolhedor]
- Palavras que uso / que NUNCA uso: [lista]
- A minha oferta e objetivo: [ex.: vender mentoria]
Regras: escreve como ESPECIALISTA (nunca "hoje vou dar dicas"),
frases curtas, português de Portugal. NUNCA uses "fórmula mágica",
"segredo revelado" ou "guia definitivo". Confirma que entendeste.`, textoBr: `Você é o meu roteirista e copywriter de Instagram.
Contexto da minha marca:
- Nicho: [SEU NICHO]
- Meu público e as 5 dores dele: [LISTE as dores]
- Meu tom de voz: [ex.: leve, direto, acolhedor]
- Palavras que eu uso / que eu NUNCA uso: [liste]
- Minha oferta e objetivo: [ex.: vender mentoria]
Regras: escreva como ESPECIALISTA (nunca "hoje vou dar dicas"),
frases curtas, português do Brasil. NUNCA use "fórmula mágica",
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
          { t: "prompt", agente: "Claude", nome: "Fábrica de ganchos", texto: `Tema: [TEMA]. Usa as dores do meu perfil.
Dá-me 15 ganchos para Reels, no estilo ESPECIALISTA
(abrir uma lacuna ou tocar numa dor específica, nunca anunciar
o tema). Mistura os 4 tipos: quebra de expectativa,
dor silenciosa, curiosidade/polémica e promessa de recompensa.
Frases curtas, impacto imediato.`, textoBr: `Tema: [TEMA]. Use as dores do meu perfil.
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
          { t: "p", texto: "**Dica de ouro:** antes de pedires o roteiro, cola na conversa os padrões do NotebookLM (M1) e as dores do Grok (M2). O roteiro nasce de dados reais." },
          { t: "prompt", agente: "Claude", nome: "Roteiro de Reels (atração)", texto: `Cria um guião de Reels de até 45 segundos sobre [TEMA].
Usa este gancho: [COLA O GANCHO ESCOLHIDO].
Estrutura: gancho -> problema -> viragem/solução -> prova -> CTA.
Formato de entrega, bloco a bloco:
- FALA: o que eu digo (frases curtas, à minha maneira)
- ECRÃ: o texto que aparece escrito no ecrã
- CENA: sugestão do que gravar
No fim, 3 ganchos alternativos + 3 CTAs (seguir, guardar, Direct).`, textoBr: `Crie um roteiro de Reels de até 45 segundos sobre [TEMA].
Use este gancho: [COLE O GANCHO ESCOLHIDO].
Estrutura: gancho -> problema -> virada/solução -> prova -> CTA.
Formato de entrega, bloco a bloco:
- FALA: o que eu digo (frases curtas, do meu jeito)
- TELA: o texto que aparece escrito na tela
- CENA: sugestão do que gravar
No fim, 3 ganchos alternativos + 3 CTAs (seguir, salvar, Direct).` },
          { t: "prompt", agente: "Claude", nome: "Carrossel (autoridade · gera salvamentos)", texto: `Cria um carrossel de 7 slides sobre [TEMA] (formato
checklist ou passo a passo, para gerar salvamentos).
- Slide 1: capa = gancho forte (faz parar de rolar)
- Slides 2 a 6: uma ideia por slide, texto curto e escaneável
- Slide 7: CTA + convite para guardar/partilhar
Para cada slide: TÍTULO, texto e sugestão de imagem/visual.`, textoBr: `Crie um carrossel de 7 slides sobre [TEMA] (formato
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
          { t: "prompt", agente: "Claude", nome: "Legenda PAS", texto: `Escreve a legenda deste conteúdo:

[COLA AQUI O GUIÃO/CARROSSEL QUE ESCREVESTE ACIMA]

usando o método PAS:
- 1ª linha (headline): vende o CLIQUE para a 2ª linha, toca
  numa dor — não anuncia o produto
- Problema -> Agitação (com lógica, não medo) -> Solução
  (a lógica do meu método)
- CTA: interação, guardar ou "manda-me X no Direct"
Dá 2 opções de headline, 2 de CTA e 8 a 10 hashtags do nicho.`, textoBr: `Escreva a legenda deste conteúdo:

[COLE AQUI O ROTEIRO/CARROSSEL QUE VOCÊ ESCREVEU ACIMA]

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
          { t: "prompt", agente: "Claude", nome: "Sequência de 5 stories", texto: `Cria uma sequência de 5 stories de venda sobre [TEMA/OFERTA]:
1. Identificação (sondagem/pergunta que toca na dor)
2. Agitação (porque é que ele está preso no problema)
3. Prova (caso/testemunho — marca como MODELO p/ eu trocar)
4. Convite/CTA ("manda-me a palavra X no Direct")
5. Reforço (última chamada)
Diz o elemento interativo de cada ecrã (sondagem, caixinha, link).`, textoBr: `Crie uma sequência de 5 stories de venda sobre [TEMA/OFERTA]:
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
      {
        titulo: "Atalho · Skills prontas a instalar",
        blocos: [
          { t: "p", texto: "Uma **skill** é uma capacidade que instalas no Claude uma vez — depois basta pedires “faz-me um carrossel sobre X” ou “roteiro de Reel sobre Y” e ela já sabe a estrutura toda (gancho, um ponto por slide, CTA, legenda, hashtags), sem colares prompt nenhum. Preparei duas:" },
          { t: "downloads", itens: [
            { nome: "Gerador de Carrosséis", desc: "Carrossel slide a slide + legenda + hashtags", url: "/skills/gerador-carrosseis.skill" },
            { nome: "Gerador de Roteiros", desc: "Roteiro de Reel com fala + imagem + CTA", url: "/skills/gerador-roteiros.skill" },
          ] },
          { t: "ol", itens: [
            "Descarrega os dois ficheiros .skill acima.",
            "No Claude, abre Definições → Capacidades/Skills → “Adicionar skill” e carrega o ficheiro.",
            "Numa conversa nova, pede: “faz-me um carrossel sobre [TEMA]” ou “roteiro de Reel sobre [TEMA]”.",
          ] },
          { t: "nota", v: "info", texto: "**Skills + voz da marca:** se configuraste o Passo 1 num Projeto, usa as skills dentro desse Projeto — o carrossel já sai com o teu tom. Os prompts deste módulo continuam úteis para quando quiseres controlar cada passo à mão." },
        ],
      },
    ],
  },
  {
    id: "m3c",
    numero: "Claude · Aula 2",
    titulo: "Carrosséis visuais no Claude",
    objetivo: "Pôr o Claude a desenhar o teu carrossel — slides 1080 x 1350 com a tua marca, texto sempre correto e ajustes slide a slide — sem gerador de imagens.",
    links: [{ nome: "Abrir Claude", url: "https://claude.ai" }],
    secoes: [
      {
        titulo: "1. Desenhar em vez de gerar",
        blocos: [
          { t: "p", texto: "O ChatGPT **gera** imagens (e às vezes erra letras). O Claude **desenha** os slides como um designer: constrói cada um num artefacto visual, com as tuas cores e fontes exatas." },
          { t: "ul", itens: [
            "**Texto sempre correto** — é texto real, não letras “desenhadas” por IA.",
            "**A tua marca exata** — cor HEX, fonte e logótipo iguais em todos os slides.",
            "**Ajustes cirúrgicos** — “muda só o título do slide 3” e ele muda só isso.",
            "**Pronto para o Instagram** — slides 4:5, exportáveis em 1080 x 1350.",
          ] },
        ],
      },
      {
        titulo: "2. Caminho 1 · Com a skill (recomendado)",
        blocos: [
          { t: "p", texto: "A skill **Criador de Carrosséis** já sabe o processo todo: pergunta os dados da marca, escreve o copy, desenha os slides com barra de progresso e seta de swipe, mostra a pré-visualização e exporta os PNG." },
          { t: "downloads", itens: [
            { nome: "Criador de Carrosséis (skill)", desc: "Carrosséis visuais completos, prontos a exportar", url: "/skills/criador-de-carrosseis.skill" },
          ] },
          { t: "ol", itens: [
            "Descarrega e instala a skill (Definições → Capacidades/Skills → Adicionar).",
            "Pede: “cria um carrossel sobre [TEMA]”.",
            "Responde às perguntas da marca (nome, @, cor, fonte, tom).",
            "Vê a pré-visualização e diz que slides queres ajustar.",
            "Aprova (“pode exportar”) e recebe os PNG 1080 x 1350.",
          ] },
          { t: "nota", v: "info", texto: "**Onde funciona melhor:** no Claude Desktop (Cowork), a skill exporta os PNG sozinha. Na web vês a pré-visualização na mesma e podes pedir os ficheiros dos slides." },
        ],
      },
      {
        titulo: "3. Caminho 2 · Sem skill, com um prompt",
        blocos: [
          { t: "prompt", agente: "Claude", nome: "Carrossel visual como artefacto", texto: `Cria um carrossel visual de Instagram como artefacto
(pré-visualização deslizável), com 7 slides 4:5 prontos
a exportar em 1080 x 1350.
Tema: [TEMA]
Marca: [NOME] · @[UTILIZADOR] · cor principal [HEX]
Tom: [ex.: próximo e direto]
Regras:
- Slide 1: capa com gancho forte (nunca o nome da marca)
- Fundos claros e escuros alternados, mesma identidade
- Barra de progresso em todos; último slide = CTA, sem seta
No fim, pergunta-me que slides quero ajustar.`, textoBr: `Crie um carrossel visual de Instagram como artefato
(pré-visualização deslizável), com 7 slides 4:5 prontos
para exportar em 1080 x 1350.
Tema: [TEMA]
Marca: [NOME] · @[USUÁRIO] · cor principal [HEX]
Tom: [ex.: próximo e direto]
Regras:
- Slide 1: capa com gancho forte (nunca o nome da marca)
- Fundos claros e escuros alternados, mesma identidade
- Barra de progresso em todos; último slide = CTA, sem seta
No final, me pergunte quais slides quero ajustar.` },
        ],
      },
      {
        titulo: "4. Os dados que ele vai pedir",
        blocos: [
          { t: "tabela", cab: ["Dado", "Exemplo"], linhas: [
            ["Nome da marca e @", "Cátia Creator · @catiacreator"],
            ["Cor principal (HEX)", "#7C56C9"],
            ["Estilo/fonte", "moderno e limpo · editorial · arredondado"],
            ["Tom", "próximo e direto"],
            ["Formato", "padrão (7 slides) · lista · tutorial · comparação"],
          ] },
        ],
      },
      {
        titulo: "5. Formatos de sequência",
        blocos: [
          { t: "tabela", cab: ["Formato", "Quando usar", "Sequência"], linhas: [
            ["Padrão (7 slides)", "Tema completo", "gancho → problema → solução → o que ganhas → detalhes → passos → CTA"],
            ["Lista (5–10)", "“X erros”, “X ferramentas”", "gancho → um item por slide → CTA"],
            ["Tutorial (7)", "Ensinar um processo", "gancho → porquê → passos 1-3 → resultado → CTA"],
            ["Comparação (5)", "A vs. B", "gancho → opção A → opção B → veredicto → CTA"],
          ] },
          { t: "nota", v: "info", texto: "**Regras dos slides:** capa que para o scroll (nunca o nome da marca como título), fundos claros/escuros alternados, e o último slide sem seta, com barra completa e CTA." },
          { t: "nota", v: "warn", texto: "**Exercício:** cria um carrossel visual sobre a maior dor do teu público (usa o texto do carrossel da Aula 1, se já o tens), pede um ajuste num slide e exporta." },
        ],
      },
    ],
  },
  {
    id: "m3d",
    numero: "Claude · Aula 3",
    titulo: "Criar artefactos no Claude",
    objetivo: "Criar peças interativas na conversa — quizzes, checklists, mini-páginas e ferramentas — e partilhá-las com o teu público por link.",
    links: [{ nome: "Abrir Claude", url: "https://claude.ai" }],
    secoes: [
      {
        titulo: "1. O que é um artefacto",
        blocos: [
          { t: "p", texto: "Quando pedes algo “construível”, o Claude abre uma janela ao lado da conversa e cria a peça **a funcionar**: uma página, um quiz, uma checklist, uma calculadora. Vês o resultado na hora, pedes ajustes, e no fim **publicas com um link** que qualquer pessoa abre no navegador — sem instalar nada." },
        ],
      },
      {
        titulo: "2. Para que servem a uma criadora",
        blocos: [
          { t: "tabela", cab: ["Peça", "Para quê"], linhas: [
            ["Quiz", "Interação + qualificar o público (“que tipo de criadora és?”)."],
            ["Checklist interativa", "Lead magnet: entregas no Direct em troca do contacto."],
            ["Calculadora", "Autoridade: “calcula quanto tempo poupas por semana com IA”."],
            ["Mini-página", "Link na bio com os teus destaques e ofertas."],
            ["Carrossel visual", "Slides desenhados — é a Aula 2 deste capítulo."],
          ] },
        ],
      },
      {
        titulo: "3. Prompts prontos",
        blocos: [
          { t: "prompt", agente: "Claude", nome: "Quiz para o teu público", texto: `Cria um quiz interativo como artefacto: "[TÍTULO DO QUIZ]",
para o meu público [PÚBLICO].
- 5 perguntas de escolha múltipla sobre [TEMA]
- No fim, um resultado personalizado por perfil de resposta
  (2 a 3 perfis), com uma dica prática para cada
- Visual limpo, cores [PALETA], bom no telemóvel`, textoBr: `Crie um quiz interativo como artefato: "[TÍTULO DO QUIZ]",
para o meu público [PÚBLICO].
- 5 perguntas de múltipla escolha sobre [TEMA]
- No final, um resultado personalizado por perfil de resposta
  (2 a 3 perfis), com uma dica prática para cada
- Visual limpo, cores [PALETA], bom no celular` },
          { t: "prompt", agente: "Claude", nome: "Checklist interativa (lead magnet)", texto: `Cria uma checklist interativa como artefacto:
"[TÍTULO — ex.: Checklist do post perfeito]".
- 8 a 12 itens sobre [TEMA], que eu possa marcar
- Barra de progresso no topo
- No fim, mensagem de parabéns com o meu @ e um CTA
  para me seguir
- Visual limpo, cores [PALETA], bom no telemóvel`, textoBr: `Crie uma checklist interativa como artefato:
"[TÍTULO — ex.: Checklist do post perfeito]".
- 8 a 12 itens sobre [TEMA], que eu possa marcar
- Barra de progresso no topo
- No final, mensagem de parabéns com o meu @ e um CTA
  para me seguir
- Visual limpo, cores [PALETA], bom no celular` },
          { t: "prompt", agente: "Claude", nome: "Mini-página “link na bio”", texto: `Cria uma mini-página "link na bio" como artefacto para
a minha marca [NOME · @UTILIZADOR].
- Topo: nome + 1 frase de posicionamento
- 3 a 5 botões: [LISTA — ex.: mini-curso, mentoria, Direct]
- Cores [PALETA], simples e rápida no telemóvel`, textoBr: `Crie uma mini-página "link na bio" como artefato para
a minha marca [NOME · @USUÁRIO].
- Topo: nome + 1 frase de posicionamento
- 3 a 5 botões: [LISTA — ex.: mini-curso, mentoria, Direct]
- Cores [PALETA], simples e rápida no celular` },
        ],
      },
      {
        titulo: "4. Publicar e partilhar",
        blocos: [
          { t: "ol", itens: [
            "Com o artefacto aberto, clica em “Publicar/Partilhar”.",
            "Copia o link público.",
            "Usa-o no link da bio, nos stories ou envia no Direct.",
          ] },
          { t: "nota", v: "info", texto: "**Ajustes:** pede uma alteração de cada vez (“muda a cor para…”, “acrescenta uma pergunta”). O artefacto atualiza-se à tua frente." },
          { t: "nota", v: "warn", texto: "**Exercício:** cria uma checklist interativa sobre a maior dor do teu público, publica e testa o link no telemóvel. Depois marca a tarefa como completa." },
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
    { agente: "Claude · Grok", nome: "Mapear as 5 dores do público", texto: `O meu nicho é [NICHO] e o meu público é [PÚBLICO].
Lista as 5 maiores dores dele — as frustrações que ele sente
mas raramente verbaliza — escritas COM AS PALAVRAS DELE.
Para cada dor, dá 1 gancho de Reel no estilo especialista.`, textoBr: `Meu nicho é [NICHO] e meu público é [PÚBLICO].
Liste as 5 maiores dores dele — as frustrações que ele sente
mas raramente verbaliza — escritas COM AS PALAVRAS DELE.
Para cada dor, dê 1 gancho de Reel no estilo especialista.` },
    { agente: "Claude", nome: "30 ideias de uma vez", texto: `Com base no meu nicho [NICHO] e público [PÚBLICO], dá-me
30 ideias de conteúdo divididas em: educativo, inspiracional,
bastidores, prova social e venda. Uma linha cada.`, textoBr: `Com base no meu nicho [NICHO] e público [PÚBLICO], me dê
30 ideias de conteúdo divididas em: educativo, inspiracional,
bastidores, prova social e venda. Uma linha cada.` },
    { agente: "Claude", nome: "1 Reels vira 5 conteúdos", texto: `Pega neste guião [COLA] e transforma em: 1 carrossel,
3 ideias de stories, 1 legenda de post estático e
3 frases para publicar no X.`, textoBr: `Pegue este roteiro [COLE] e transforme em: 1 carrossel,
3 ideias de stories, 1 legenda de post estático e
3 frases para postar no X.` },
    { agente: "Claude", nome: "Calendário de 1 mês", texto: `Monta um calendário de conteúdo de 4 semanas para o meu
nicho [NICHO], com 3 posts por semana, variando os formatos
(Reels, carrossel, estático) e os objetivos. Em formato de tabela.`, textoBr: `Monte um calendário de conteúdo de 4 semanas para meu
nicho [NICHO], com 3 posts por semana, variando os formatos
(Reels, carrossel, estático) e os objetivos. Em formato de tabela.` },
    { agente: "NotebookLM", nome: "Estudar um perfil de referência", texto: `Adicionei como fontes as legendas/vídeos de um perfil de
referência. Analisa: que estratégia de conteúdo usa,
com que frequência publica cada formato e o que eu podia
fazer diferente para me destacar.`, textoBr: `Adicionei como fontes as legendas/vídeos de um perfil de
referência. Analise: que estratégia de conteúdo ele usa,
com que frequência posta cada formato e o que eu poderia
fazer diferente para me destacar.` },
  ],
  fecho: "Agora é contigo. Começa pelo Módulo 1. Uma ferramenta de cada vez, um post de cada vez. A constância vale mais que a perfeição.",
};
