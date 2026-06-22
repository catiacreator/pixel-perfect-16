export type Aula = {
  slug: string;
  numero: string; // ex: "1.1"
  titulo: string;
  resumo: string;
  especial?: boolean; // ex: instalar-skills
};

export type Modulo = {
  titulo: string;
  aulas: Aula[];
};

export type Tool = {
  slug: string;
  nome: string;
  modulos: Modulo[];
};

export const TOOLS: Tool[] = [
  {
    slug: "chatgpt",
    nome: "ChatGPT",
    modulos: [
      {
        titulo: "Começando com o ChatGPT",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "ChatGPT no desktop", resumo: "Botões principais, como entregar contexto, anexar arquivos (PDF, planilha, docs, imagens), criar imagens e usar o histórico de conversas." },
          { slug: "1-2", numero: "1.2", titulo: "Conversa em tempo real com ChatGPT no Desktop", resumo: "Usos práticos: simular entrevista ou cliente, estudar, treinar apresentações e receber feedback em tempo real." },
          { slug: "1-3", numero: "1.3", titulo: "Como Criar Projetos no ChatGPT", resumo: "O que são Projetos e como usar um prompt personalizado a partir do Documento Mestre para sugerir 5 a 8 projetos prontos." },
          { slug: "1-4", numero: "1.4", titulo: "Como agendar tarefas no ChatGPT", resumo: "Como configurar tarefas recorrentes para o ChatGPT executar sozinho, sem precisares de abrir o chat todos os dias." },
        ],
      },
      {
        titulo: "Criando Robôs Agentes de IA",
        aulas: [
          { slug: "2-1", numero: "2.1", titulo: "Detectar Gargalos do Especialista", resumo: "Como identificar os pontos onde travas mais, para depois automatizar exatamente essas tarefas." },
          { slug: "2-2", numero: "2.2", titulo: "Criar Robôs que Ajudam seus Clientes", resumo: "Como desenvolver robôs (GPTs) especializados que atendem ou ajudam diretamente os teus clientes." },
          { slug: "2-3", numero: "2.3", titulo: "Robô que Cria Robôs", resumo: "Um robô que te ajuda a criar novos robôs — automatiza a própria criação de automações." },
        ],
      },
      {
        titulo: "ChatGPT no celular",
        aulas: [
          { slug: "3-1", numero: "3.1", titulo: "ChatGPT no celular", resumo: "Quando usar no celular vs no desktop: voz, visão em tempo real, enviar imagens, melhorar mensagens e roteiros de Reels." },
        ],
      },
      {
        titulo: "Utilidades do ChatGPT",
        aulas: [
          { slug: "4-1", numero: "4.1", titulo: "Criando Slides com ChatGPT e Canva", resumo: "Gerar imagens de slides com personagem consistente, corrigir erros, importar para o Canva e exportar em PPT." },
        ],
      },
    ],
  },
  {
    slug: "claude",
    nome: "Claude",
    modulos: [
      {
        titulo: "Começando com o Claude",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Conhecendo e configurando o Claude", resumo: "Mapa da interface (Projetos, Artefatos, Conectores), como configurar o Claude para te conhecer e ligar Gmail/Drive/Canva." },
          { slug: "1-2", numero: "1.2", titulo: "Como organizar Projetos no Claude", resumo: "Criar um projeto do zero com instruções e ficheiros, entender Skills e como invocá-las com \"/\"." },
          { slug: "1-3", numero: "1.3", titulo: "Gerenciando Documentos na Base de Conhecimento", resumo: "Adicionar, organizar e atualizar documentos no Project Knowledge do Claude." },
          { slug: "1-4", numero: "1.4", titulo: "Como criar Skills no Claude", resumo: "Como criar as tuas próprias Skills a partir do zero." },
          { slug: "instalar-skills", numero: "1.5", titulo: "Instalando Skills no seu Claude", resumo: "Página especial: as 15 skills gerais e as 6 skills de mercado, prontas a descarregar e instalar.", especial: true },
          { slug: "1-6", numero: "1.6", titulo: "Entendendo as Skills Básicas", resumo: "Conhecer as skills fundamentais da mentoria e quando usar cada uma." },
          { slug: "1-7", numero: "1.7", titulo: "Artefatos", resumo: "Usar os Artifacts do Claude para criar documentos, código e visualizações lado a lado com a conversa." },
          { slug: "1-8", numero: "1.8", titulo: "Claude in Chrome", resumo: "Instalar a extensão, analisar o teu Instagram, limpar e-mail, preencher formulários e usar \"perguntar antes de agir\"." },
          { slug: "1-9", numero: "1.9", titulo: "Claude Desktop: Aprendendo Cowork", resumo: "O que é o Claude Desktop, a diferença entre Chat / Cowork / Code, e como usar o Cowork na prática." },
          { slug: "1-10", numero: "1.10", titulo: "Exemplo de como usar o Cowork para achar clientes", resumo: "Caso prático: usar o Cowork para encontrar e organizar potenciais clientes." },
          { slug: "1-11", numero: "1.11", titulo: "Aplicativo do Claude no Celular", resumo: "Login, botões principais, voz e os primeiros prompts no telemóvel." },
          { slug: "1-12", numero: "1.12", titulo: "Extensão Granola no Claude", resumo: "Transcrever reuniões automaticamente e gerar um PDF de resumo de mentoria." },
          { slug: "1-14", numero: "1.14", titulo: "Claude Design", resumo: "Criar um Design System completo — paleta, tipografia e estilo — para portfólios, páginas e carrosséis." },
          { slug: "1-15", numero: "1.15", titulo: "Analisar Planilhas no Claude", resumo: "Como o Claude lê, interpreta e cruza dados diretamente de uma folha de cálculo." },
        ],
      },
      {
        titulo: "Aulão de Mentoria",
        aulas: [
          { slug: "2-1", numero: "2.1", titulo: "Super Aulão sobre Claude", resumo: "Mergulho completo, reunindo tudo o que foi visto nas aulas anteriores." },
        ],
      },
    ],
  },
  {
    slug: "gemini",
    nome: "Gemini / NotebookLM",
    modulos: [
      {
        titulo: "Começando com Gemini",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Explorando o Gemini", resumo: "Interface, Gems, criar conteúdo de Instagram a partir do Doc Mestre, Deep Research, e quando usar Gemini vs ChatGPT vs Claude." },
          { slug: "1-2", numero: "1.2", titulo: "NotebookLM", resumo: "Transformar fontes em podcasts, vídeos e apresentações." },
        ],
      },
    ],
  },
  {
    slug: "notebooklm",
    nome: "NotebookLM",
    modulos: [
      {
        titulo: "Começando com o NotebookLM",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Pesquise, estude e crie conteúdo com IA do Google", resumo: "Criar notebook, adicionar fontes e gerar resumo em áudio, debate, apresentação ou mapa mental." },
          { slug: "1-2", numero: "1.2", titulo: "Podcasts e Vídeos", resumo: "Gerar podcasts e vídeos a partir das fontes carregadas." },
          { slug: "1-3", numero: "1.3", titulo: "Apresentações", resumo: "Criar apresentações com slides organizados a partir do conhecimento carregado." },
        ],
      },
    ],
  },
  {
    slug: "grok",
    nome: "Grok",
    modulos: [
      {
        titulo: "Começando com o Grok",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Funções do Grok no Desktop", resumo: "Interface do grok.com, modos, pesquisa em tempo real e primeiros prompts." },
          { slug: "1-2", numero: "1.2", titulo: "Grok no Celular", resumo: "Instalação, login e uso no dia a dia." },
        ],
      },
    ],
  },
  {
    slug: "lovable",
    nome: "Lovable",
    modulos: [
      {
        titulo: "Começando com o Lovable",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Como criar sites no Lovable", resumo: "Créditos, mockup do ChatGPT, Plan x Build, publicar e ligar domínio." },
          { slug: "1-2", numero: "1.2", titulo: "Criando seu domínio no Registro.br", resumo: "Conta no Registro.br, pesquisar domínio disponível e ligar ao Lovable." },
          { slug: "1-3", numero: "1.3", titulo: "Go Full Page", resumo: "Extensão do Chrome para tirar um screenshot completo da tua página." },
          { slug: "1-4", numero: "1.4", titulo: "Ideias de apps no ChatGPT para criar no Lovable", resumo: "Robô GPT para gerar ideias de app e estruturar um MVP." },
          { slug: "1-5", numero: "1.5", titulo: "Integrar Lovable no Claude Code", resumo: "Levar o teu app do Lovable para o Claude Code via GitHub." },
        ],
      },
    ],
  },
  {
    slug: "tella",
    nome: "Tella",
    modulos: [
      {
        titulo: "Criando Tutoriais com Tella",
        aulas: [
          { slug: "1-1", numero: "1.1", titulo: "Como criar tutoriais profissionais com o Tella", resumo: "Gravar tela e câmera, editar, cortar e publicar com link partilhável." },
        ],
      },
    ],
  },
];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAula(toolSlug: string, aulaSlug: string) {
  const tool = getTool(toolSlug);
  if (!tool) return undefined;
  for (const modulo of tool.modulos) {
    const aula = modulo.aulas.find((a) => a.slug === aulaSlug);
    if (aula) return { tool, modulo, aula };
  }
  return undefined;
}

export function flatAulas(tool: Tool) {
  return tool.modulos.flatMap((m) => m.aulas.map((a) => ({ ...a, modulo: m.titulo })));
}
