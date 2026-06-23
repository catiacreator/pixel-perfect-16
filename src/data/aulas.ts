// Catálogo de aulas do Pilar 1 — fonte única de dados.
// Editar aqui actualiza o hub, os hubs por IA e as páginas de aula.

export type AulaLink = { label: string; href: string };

export type Aula = {
  id: string;            // ex.: "1-1"
  modulo: string;        // ex.: "1 · Começando com o ChatGPT"
  titulo: string;
  resumo?: string;
  videoUrl?: string;
  topicos?: string[];
  links?: AulaLink[];
  promptPersonalizado?: {
    label?: string;       // ex.: "Cole dentro do seu Projeto no ChatGPT"
    template: string;     // usa placeholders [NOME], [PROFISSÃO], etc.
  };
};

export type Tool = {
  slug: string;
  nome: string;
  descricao: string;
  cor: string;            // classe tailwind para o gradiente / chip
  inicial: string;        // letra mostrada no card quando não há imagem
  aulas: Aula[];
};

// ----------------- Prompts -----------------

const PROMPT_PROJETOS_CHATGPT = `Você é minha consultora de produtividade e organização com IA.
Conhece profundamente meu negócio e meu jeito de trabalhar.

Aqui está o meu contexto (do meu Documento Mestre):
• Nome: [NOME]
• Profissão: [PROFISSÃO]
• O que eu faço: [O QUE FAZ]
• Como eu resolvo: [COMO RESOLVE]
• Público que atendo: [PÚBLICO]
• Principais dores do meu público: [5 DORES]
• Desejos do meu público: [5 DESEJOS]
• Produtos atuais: [PRODUTOS]
• Ticket médio: [TICKET MÉDIO]
• Tom de comunicação: [TOM DE VOZ]
• Método: [NOME DO MÉTODO] — [PROMESSA]
• Pilares do método: [PILARES]
• Horas que trabalho por dia: [HORAS/DIA]
• Dias que trabalho por semana: [DIAS/SEMANA]

Sua missão:
Me sugira de 5 a 8 ideias de PROJETOS dentro do ChatGPT que eu posso criar para OTIMIZAR MEU TEMPO no dia a dia do negócio.

Para cada projeto, me entregue no formato:
1. Nome do Projeto (claro e direto)
2. Para que serve (1 frase)
3. Quanto tempo isso me economiza por semana (estimativa)
4. Instruções sugeridas para colocar no Projeto (3 a 6 linhas, prontas para colar)
5. Arquivos que devo anexar nesse Projeto
6. Cor sugerida para esse Projeto e por quê

Priorize projetos que:
• Eliminem tarefas repetitivas que eu faço toda semana
• Acelerem criação de conteúdo, propostas e mensagens para clientes
• Mantenham padrão e contexto sem eu precisar explicar tudo de novo
• Sejam realistas para o meu nicho e meu público

Comece listando os projetos. Depois me pergunte qual eu quero estruturar primeiro.`;

const PROMPT_PROJETOS_CLAUDE = `Você é minha consultora estratégica de organização e produtividade com Inteligência Artificial. Conhece profundamente meu negócio e meu jeito de trabalhar.

Aqui está o meu contexto (do meu Documento Mestre):
• Nome: [NOME]
• Profissão: [PROFISSÃO]
• O que eu faço: [O QUE FAZ]
• Como eu resolvo: [COMO RESOLVE]
• Público que atendo: [PÚBLICO]
• Principais dores do meu público: [5 DORES]
• Produtos atuais: [PRODUTOS]
• Tom de comunicação: [TOM DE VOZ]
• Método: [NOME DO MÉTODO] — [PROMESSA]
• Horas que trabalho por dia: [HORAS/DIA]
• Dias que trabalho por semana: [DIAS/SEMANA]

Sua missão:
Me sugira de 5 a 8 ideias de PROJETOS dentro do Claude que eu posso criar para OTIMIZAR MEU TEMPO e manter contexto no dia a dia do negócio.

Para cada projeto, me entregue no formato:
1. Nome do Projeto (claro e direto)
2. Para que serve (1 frase)
3. Quanto tempo isso me economiza por semana (estimativa)
4. Instruções sugeridas para colocar no "Project Instructions" do Projeto (3 a 6 linhas, prontas para colar)
5. Arquivos que devo fazer upload em "Project Knowledge" nesse Projeto
6. Em qual situação do meu dia a dia vou abrir esse Projeto

Priorize projetos que:
• Eliminem tarefas repetitivas que eu faço toda semana
• Acelerem criação de conteúdo, propostas e mensagens para clientes
• Mantenham padrão e contexto sem eu precisar explicar tudo de novo do zero
• Se encaixem no meu nicho e sirvam ao meu público

Comece listando os projetos do mais prioritário ao menos prioritário. Depois me pergunte qual eu quero estruturar primeiro.`;

// ----------------- Tools -----------------

export const TOOLS: Tool[] = [
  {
    slug: "chatgpt",
    nome: "ChatGPT",
    descricao: "Aulas, prompts e exemplos para dominar o ChatGPT no seu dia a dia.",
    cor: "from-emerald-500/20 to-emerald-700/10",
    inicial: "G",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Começando com o ChatGPT",
        titulo: "ChatGPT no desktop",
        topicos: [
          "Conhecendo os botões principais: Nova conversa, campo de mensagem, histórico, anexar ficheiros, criar imagens, personalizar e configurações",
          "Entregando contexto: explica quem és e o que fazes",
          "Anexar ficheiros: PDF, planilhas, documentos, imagens",
          "Criar imagens: como pedir uma imagem",
          "Histórico de conversas: como encontrar conversas antigas",
        ],
      },
      {
        id: "1-2",
        modulo: "1 · Começando com o ChatGPT",
        titulo: "Conversa em tempo real com ChatGPT no Desktop",
        topicos: [
          "Simulação de entrevista — treina perguntas e respostas em voz alta",
          "Simulação com cliente — ensaia atendimentos, vendas e objecções na hora",
          "Mostrar como funciona a parte de voz a alguém ao vivo",
          "Educação — explicações em voz alta, inclusive infantil",
          "Treinar apresentações, aulas e falas importantes",
          "Conversar enquanto caminhas ou fazes outra tarefa",
          "Pedir feedback sobre clareza, tom e argumentação em tempo real",
        ],
      },
      {
        id: "1-3",
        modulo: "1 · Começando com o ChatGPT",
        titulo: "Como criar Projetos no ChatGPT",
        topicos: [
          "O que são Projetos: espaços organizados dentro do ChatGPT",
          "Servem para separar temas, clientes, produtos ou áreas do negócio",
          "Guardam conversas, ficheiros e contexto no mesmo lugar",
          "Funcionam como uma 'sala interna' para trabalhar com mais direção",
        ],
        promptPersonalizado: {
          label: "Cole dentro do seu Projeto no ChatGPT",
          template: PROMPT_PROJETOS_CHATGPT,
        },
      },
      {
        id: "1-4",
        modulo: "1 · Começando com o ChatGPT",
        titulo: "Como agendar tarefas no ChatGPT",
      },
      {
        id: "2-1",
        modulo: "2 · Criando Robôs Agentes de IA",
        titulo: "Detectar Gargalos do Especialista",
        resumo:
          "Identifica os pontos de travamento no teu negócio que podem ser automatizados.",
        links: [
          {
            label: "Abrir Robô Detector de Gargalos",
            href: "https://chatgpt.com/g/g-680af6be406c81919a6023e518e0c5c2-robo-detector-de-gargalos-do-especialista",
          },
        ],
      },
      {
        id: "2-2",
        modulo: "2 · Criando Robôs Agentes de IA",
        titulo: "Criar Robôs que ajudam os teus Clientes",
        resumo:
          "Desenvolve robôs especializados que agregam valor direto aos teus clientes.",
        links: [
          { label: "Criar GPT", href: "https://chatgpt.com/gpts" },
          {
            label: "Robô: Criador de ideias de robôs",
            href: "https://chatgpt.com/g/g-3fsASHqlq-criador-de-ideias-de-robos",
          },
        ],
      },
      {
        id: "2-3",
        modulo: "2 · Criando Robôs Agentes de IA",
        titulo: "Robô que Cria Robôs",
        resumo: "Automatiza o processo de criação de novos robôs especializados.",
        links: [
          {
            label: "Abrir Robô que Cria Robôs",
            href: "https://chatgpt.com/g/g-WYnRFyuvD-robo-que-criar-robo",
          },
        ],
      },
      {
        id: "3-1",
        modulo: "3 · ChatGPT no celular",
        titulo: "ChatGPT no celular",
        links: [
          {
            label: "Android",
            href: "https://play.google.com/store/apps/details?id=com.openai.chatgpt&hl=pt_BR",
          },
          { label: "iPhone", href: "https://apps.apple.com/br/app/chatgpt/id6448311069" },
        ],
        topicos: [
          "Quando usar no celular: ideias rápidas, mensagens, WhatsApp, roteiros, stories, áudios",
          "Botões principais: nova conversa, voz, câmera/visão, imagens, Projetos, configurações",
          "Voz: falar em vez de digitar, organizar pensamento, treinar explicações",
          "Áudio em tempo real: ensaiar venda/aula, simular cliente, pedir feedback",
          "Visão em tempo real: mostrar tela/ambiente pela câmera, pedir análise",
          "Enviar prints e fotos: conversa, anotação, página, perfil ou post",
          "Usos práticos: mensagem para cliente, resposta de WhatsApp, legenda, resumo de print, roteiro de Reels",
          "Como pedir melhor: contexto curto, áudio explicando, resposta curta, mensagem pronta",
          "Quando voltar para o desktop: documentos longos, propostas, slides, planeamento estratégico",
        ],
      },
      {
        id: "4-1",
        modulo: "4 · Utilidades do ChatGPT",
        titulo: "Criando slides com ChatGPT e Canva",
        topicos: [
          "Como usar o ChatGPT para criar imagens de slides personalizados respeitando a identidade visual do cliente — case Sebrae",
          "Como criar uma personagem consistente e contar uma história visual através dos slides",
          "Dicas para corrigir erros das imagens geradas (como o famoso braço a mais)",
          "Como importar as imagens do ChatGPT para o Canva e montar a apresentação final",
          "Como exportar em PowerPoint para entregar ao cliente",
          "Segredo para incorporar a apresentação do Canva num site feito no Lovable",
          "Dica de produtividade: abrir várias abas do ChatGPT para gerar imagens em paralelo",
        ],
      },
    ],
  },

  {
    slug: "claude",
    nome: "Claude",
    descricao: "Como usar o Claude para textos longos, análises e raciocínio profundo.",
    cor: "from-amber-500/20 to-amber-700/10",
    inicial: "C",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Conhecendo e configurando o Claude",
        topicos: [
          "Mapa completo da interface — Projetos, Artefatos, Conectores",
          "O segredo para o Claude te conhecer de verdade",
          "Planos: qual faz sentido para o teu momento",
          "Como conectar Gmail, Google Drive e Canva",
          "WhisperFlow: o truque de microfone no lugar do nativo do Claude",
        ],
      },
      {
        id: "1-2",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Como organizar Projetos no Claude",
        topicos: [
          "Projetos vs conversa solta — porque muda tudo",
          "Como montar um projeto do zero com instruções e ficheiros",
          "Veja na prática: roteiro de palestra para o Sebrae Vitória",
          "Skills: o que são e como invocar com uma barra ( / )",
          "Anatex Brain: como uma skill personaliza qualquer entrega do Claude",
          "Como transformar o trabalho de um projeto numa skill reutilizável",
        ],
        promptPersonalizado: {
          label: "Cole num chat do Claude e descubra os teus Projetos",
          template: PROMPT_PROJETOS_CLAUDE,
        },
      },
      {
        id: "1-3",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Gerenciar Documentos na Base de Conhecimento dos Projetos",
      },
      {
        id: "1-4",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Como criar Skills no Claude",
        resumo:
          "Aprende a criar as tuas próprias Skills no Claude para automatizar tarefas com o teu método.",
      },
      {
        id: "1-5",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Instalando Skills no teu Claude",
        resumo:
          "Página de referência com download das skills da Mentoria. Abre na rota dedicada.",
        links: [
          {
            label: "Abrir página de instalação de skills",
            href: "/metodo/pilar-1/aprenda-ia/claude/instalar-skills",
          },
        ],
      },
      {
        id: "1-6",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Entendendo as Skills Básicas",
      },
      {
        id: "1-7",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Artefatos",
        resumo:
          "Usa os Artifacts do Claude para criar documentos, código e visualizações lado a lado com a conversa.",
      },
      {
        id: "1-8",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Claude in Chrome: o Claude dentro do navegador",
        links: [{ label: "Conhecer Claude for Chrome", href: "https://claude.com/claude-for-chrome" }],
        topicos: [
          "O que é a extensão Claude in Chrome e como instalar",
          "Como liberar o acesso e conectar o Claude ao teu navegador",
          "Na prática: pedir ao Claude para analisar o teu Instagram e gerar relatório de métricas",
          "Apagar spam do e-mail, preencher formulários, coletar links",
          "Ensinar o Claude a executar tarefas que já fazes — novas habilidades personalizadas",
          "Função 'Perguntar antes de agir': mantém o controlo de tudo",
        ],
      },
      {
        id: "1-9",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Claude Desktop: aprendendo Cowork",
        links: [{ label: "Download Claude Desktop", href: "https://claude.com/download" }],
        topicos: [
          "O que é o Claude Desktop e porque precisa de conta paga",
          "As três funções: Chat, Cowork e Code",
          "Cowork na prática: acessar o computador, organizar pastas, renomear e deletar duplicados",
          "Permissões de acesso com segurança",
          "Casos de uso reais: desktop bagunçado, renomear notas fiscais, criar planilha",
        ],
      },
      {
        id: "1-10",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Exemplo de como usar o Cowork para achar clientes",
      },
      {
        id: "1-11",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Aplicativo do Claude no celular",
        resumo:
          "Claude no bolso — login, principais botões, voz e primeiros prompts no app do celular.",
      },
      {
        id: "1-12",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Extensão Granola no Claude: transcrevendo reuniões",
        topicos: [
          "O que é o Granola, plano gratuito vs pago",
          "Download, conectar ao Claude pelos Conectores e login",
          "Como o Granola grava tudo no teu computador — sem entrar no Zoom ou Meet",
          "Pedir ao Claude para buscar transcrições direto do Granola",
          "Caso real: PDF de resumo de mentoria com próximos passos",
          "Porque usar Granola dentro do Claude é melhor",
        ],
      },
      {
        id: "1-14",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Claude Design — design profissional com consistência de marca",
        resumo:
          "Usa o Claude Design para criar materiais visuais profissionais com consistência. Design System completo (paleta, tipografia, estilo, referências), portfólios, páginas, apresentações, carrosséis alinhados ao teu negócio. Transforma o Claude num verdadeiro diretor de arte.",
      },
      {
        id: "1-15",
        modulo: "1 · Conhecendo o Claude",
        titulo: "Analisar planilhas no Claude",
      },
      {
        id: "2-1",
        modulo: "2 · Aulão de Mentoria",
        titulo: "Super Aulão sobre Claude",
        resumo:
          "Aulão de Mentoria: um mergulho completo no Claude reunindo tudo o que precisas para dominar a ferramenta.",
      },
    ],
  },

  {
    slug: "lovable",
    nome: "Lovable",
    descricao: "Construir sites e mini-apps sem código — do mockup à publicação.",
    cor: "from-pink-500/20 to-rose-700/10",
    inicial: "L",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Lovable na prática",
        titulo: "Como criar sites no Lovable",
        links: [{ label: "Aceder ao Lovable", href: "https://lovable.dev" }],
        topicos: [
          "O que é o Lovable e porque é ideal para criar páginas sem programar",
          "Login, créditos e diferença entre conta gratuita e paga",
          "Usar um mockup do ChatGPT como modelo para criar a tua página",
          "Visualizar e ajustar a página para celular, tablet e computador em tempo real",
          "Plan vs Build: a diferença e como economizar créditos ao editar",
          "Publicar a página, gerar link e conectar um domínio personalizado",
          "Renomear projeto, tirar o logo do Lovable, botão de WhatsApp e formulário",
        ],
      },
      {
        id: "1-2",
        modulo: "1 · Lovable na prática",
        titulo: "Criar o teu domínio no Registro.br",
        links: [{ label: "Abrir Registro.br", href: "https://registro.br" }],
        topicos: [
          "Como criar conta no Registro.br para comprar domínios",
          "Pesquisar se o domínio que queres está disponível",
          "Dicas para escolher um bom domínio (nome, nicho, ferramenta)",
          "Como conectar o domínio ao site criado no Lovable",
          "Autenticar e finalizar a conexão via CPF e código por e-mail",
        ],
      },
      {
        id: "1-3",
        modulo: "1 · Lovable na prática",
        titulo: "Go Full Page — capturando a página inteira",
        resumo:
          "Instala e usa a extensão Go Full Page no Chrome para tirar screenshot completo do teu app ou página criada no Lovable — do topo até ao rodapé, num clique.",
        links: [
          {
            label: "Instalar Go Full Page",
            href: "https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl",
          },
        ],
      },
      {
        id: "1-4",
        modulo: "1 · Lovable na prática",
        titulo: "Criar ideias de apps no ChatGPT para construir no Lovable",
        topicos: [
          "Usar um robô GPT para gerar ideias de apps com base na tua área e gargalos",
          "Na prática: transformar uma ideia de app de RH em MVP com telas, funcionalidades e prompt pronto para colar no Lovable",
          "O que é MVP e porque começar pequeno é a estratégia certa",
          "Como economizar créditos do Lovable conectando o projeto ao GitHub e continuando no Claude Code",
          "Exemplos reais de apps criados",
        ],
      },
      {
        id: "1-5",
        modulo: "1 · Lovable na prática",
        titulo: "Conteúdo em breve",
        resumo: "Esta aula ainda não tem conteúdo cadastrado. Volta em breve.",
      },
    ],
  },

  {
    slug: "gemini",
    nome: "Gemini",
    descricao: "O ecossistema Google: Gemini, Canvas, Deep Research e mais.",
    cor: "from-sky-500/20 to-indigo-700/10",
    inicial: "G",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Explorando o Gemini",
        titulo: "Explorando o Gemini",
        topicos: [
          "O que é o Gemini e como navegar pela interface: conversas, Gems, NotebookLM e ferramentas extras",
          "Criar conteúdo de Instagram a partir do teu Documento Mestre",
          "Criação de imagens e vídeos curtos — inclusive animar uma foto tua a falar",
          "Canvas: escrever, editar e exportar textos colaborativos dentro do Gemini",
          "Deep Research: pesquisas profundas de mercado, concorrência e tendências com fontes",
          "Outras funcionalidades: aprendizagem guiada e criação de músicas curtas",
          "Gemini, ChatGPT ou Claude: quando usar cada um",
        ],
      },
      {
        id: "1-2",
        modulo: "1 · Explorando o Gemini",
        titulo: "NotebookLM (dentro de Gemini)",
        resumo:
          "Aprende a usar o NotebookLM do Google para transformar as tuas fontes em podcasts, vídeos, apresentações e respostas baseadas no teu próprio conteúdo.",
        links: [
          {
            label: "Instalar extensão YouTube → NotebookLM",
            href: "https://chrome.google.com/webstore/search/youtube%20notebooklm",
          },
        ],
      },
    ],
  },

  {
    slug: "notebooklm",
    nome: "NotebookLM",
    descricao: "Estuda, pesquisa e cria conteúdo a partir das tuas fontes.",
    cor: "from-violet-500/20 to-purple-700/10",
    inicial: "N",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · NotebookLM",
        titulo: "NotebookLM: pesquisa, estuda e cria conteúdo com IA do Google",
        topicos: [
          "O que é o NotebookLM e como aceder",
          "Criar um notebook, adicionar fontes da web, Google Drive e YouTube",
          "O que dá para gerar: resumo em áudio, debate, apresentação, vídeo com slides, infográfico e mapa mental",
          "Dica: plugin YouTube → NotebookLM importa transcrições com um clique",
          "Conversar com o Gemini dentro do NotebookLM",
        ],
      },
      {
        id: "1-2",
        modulo: "1 · NotebookLM",
        titulo: "NotebookLM — Podcasts e Vídeos",
        resumo:
          "Aprende a usar o NotebookLM para gerar podcasts e vídeos a partir das tuas fontes — material original na voz da IA.",
      },
      {
        id: "1-3",
        modulo: "1 · NotebookLM",
        titulo: "NotebookLM — Apresentações",
        resumo:
          "Cria apresentações profissionais direto no NotebookLM usando os teus documentos como base.",
      },
    ],
  },

  {
    slug: "grok",
    nome: "Grok",
    descricao: "A IA do X em desktop e celular — pesquisa em tempo real.",
    cor: "from-slate-500/20 to-slate-800/10",
    inicial: "X",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Grok",
        titulo: "Funções do Grok no Desktop",
        resumo:
          "Conhece as principais funções do Grok no computador — interface, modos, pesquisa em tempo real e primeiros prompts.",
        links: [{ label: "Aceder ao Grok", href: "https://grok.com" }],
      },
      {
        id: "1-2",
        modulo: "1 · Grok",
        titulo: "Grok no celular",
        resumo:
          "Usa o Grok no celular: instalação, login, principais botões e como aproveitar a IA em qualquer lugar.",
        links: [{ label: "Aceder ao Grok", href: "https://grok.com" }],
      },
    ],
  },

  {
    slug: "tella",
    nome: "Tella",
    descricao: "Gravar vídeos profissionais sem complicação.",
    cor: "from-rose-500/20 to-red-700/10",
    inicial: "T",
    aulas: [
      {
        id: "1-1",
        modulo: "1 · Tella",
        titulo: "Conteúdo em breve",
        resumo: "Esta aula ainda não tem conteúdo cadastrado. Volta em breve.",
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAula(slug: string, aulaId: string): Aula | undefined {
  return getTool(slug)?.aulas.find((a) => a.id === aulaId);
}
