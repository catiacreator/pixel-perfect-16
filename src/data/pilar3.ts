// Estrutura de dados do Pilar 3 — Criar Soluções Digitais.
// Conduz as páginas (hub, etapas e subpáginas) de forma data-driven.

export type Status = "ativo" | "breve";

// ---------- Etapas (hub + sidebar) ----------
export const ETAPAS = [
  { num: 1, slug: "descobrir", tipo: "Descoberta", titulo: "Descobrir soluções", sub: "Escolha que solução digital vai criar para o seu público." },
  { num: 2, slug: "como-entregar", tipo: "Entrega", titulo: "Como entregar", sub: "O formato em que a sua solução chega ao cliente — a entrega define o valor." },
  { num: 3, slug: "criar-produto", tipo: "Construção", titulo: "Criar o produto", sub: "Escolha a plataforma e construa a sua solução." },
  { num: 4, slug: "validar-produto", tipo: "Validação", titulo: "Validar o produto", sub: "Teste com pessoas reais antes de lançar — e converta quem testou." },
  { num: 5, slug: "pagina-vendas", tipo: "Venda", titulo: "Página de vendas", sub: "Prompt orquestrador + modelo no Lovable para vender." },
  { num: 6, slug: "conclusao", tipo: "Fechar", titulo: "Revise e celebre", sub: "Veja tudo o que construiu neste pilar." },
] as const;

// ---------- Etapa 1 — Descobrir: formatos de solução ----------
export const FORMATOS_SOLUCAO: {
  nome: string; desc: string; status: Status; slug?: string;
}[] = [
  { nome: "Robô/Agente no ChatGPT", desc: "Um robô no ChatGPT que resolve uma dor do seu público 24/7.", status: "ativo", slug: "robo-gpt" },
  { nome: "Gem no Gemini", desc: "Um Gem do Gemini com o conhecimento do seu nicho.", status: "ativo", slug: "gem-gemini" },
  { nome: "Agente na Hotmart", desc: "Agente de IA criado dentro da Hotmart para os seus produtos.", status: "ativo", slug: "agente-hotmart" },
  { nome: "Apps no Lovable", desc: "Gera ideias de app por pilar do método e ajuda a desenvolver.", status: "breve" },
  { nome: "Soluções com Claude", desc: "Skill ou Projeto no Claude calibrado com o seu nicho.", status: "breve" },
  { nome: "Automações", desc: "Fluxos automáticos que trabalham por si enquanto dorme.", status: "breve" },
  { nome: "Kit de Ferramentas/Documentos", desc: "Pacote de templates, checklists e documentos do seu método.", status: "breve" },
  { nome: "Ebooks Interativos", desc: "Material rico com exercícios, prompts e interação.", status: "breve" },
];

// ---------- Subpáginas de ferramentas (Descobrir) ----------
export const FERRAMENTAS: Record<string, {
  slug: string; nome: string; agente: string; descricao: string; status: Status;
  conteudo: string[]; prev?: string; next?: string;
}> = {
  "robo-gpt": {
    slug: "robo-gpt",
    nome: "Robô/Agente no ChatGPT",
    agente: "Custom GPT · ChatGPT",
    descricao: "Crie um robô personalizado no ChatGPT, com instruções específicas, que resolve uma dor do seu público 24/7.",
    status: "ativo",
    conteudo: [
      "GPTs são robôs personalizados criados dentro do ChatGPT, com instruções (prompt) específicas para resolver uma dor do público — funcionam 24/7.",
      "Como criar: escreve as instruções no ChatGPT, testa e carrega ficheiros com o teu conteúdo.",
      "Como entregar: uma folha com nome/tipo/link, ou um portal com vídeos explicativos.",
      "Diferencial: GPT + vídeo explicativo (estudo de caso: Vanessa faturou +R$300 mil a vender robôs de ChatGPT).",
      "Parte 2 — Robôs sob medida (personalizados para cada cliente).",
    ],
    next: "gem-gemini",
  },
  "gem-gemini": {
    slug: "gem-gemini",
    nome: "Gem no Gemini",
    agente: "Gem · Google Gemini",
    descricao: "Estruture um Gem do Gemini com instrução e base de conhecimento do seu nicho. O prompt entrevista-o e devolve especialidade, instrução base, ficheiros para upload, nome e estratégia de entrega.",
    status: "ativo",
    conteudo: [
      "Gems são os agentes do Gemini — funcionam como os GPTs do ChatGPT, mas no ecossistema Google.",
      "Como criar: descreve o que o Gem faz, cola as instruções, adiciona a base de conhecimento, guarda e partilha o link.",
      "Plano B obrigatório: se o ChatGPT ficar em baixo e vendeste um agente, o Gem é o backup.",
      "Diferencial do Gemini: cria imagens rapidamente — vantagem para Gems de criação visual (anúncios, posts, produtos).",
    ],
    prev: "robo-gpt",
    next: "agente-hotmart",
  },
  "agente-hotmart": {
    slug: "agente-hotmart",
    nome: "Agente na Hotmart",
    agente: "Agente de IA · Hotmart",
    descricao: "Crie um agente de IA dentro da Hotmart que atende alunos, tira dúvidas e melhora o resultado do cliente sem precisar da sua presença. O prompt entrega função, persona, instruções e os primeiros passos para ativar.",
    status: "ativo",
    conteudo: [
      "Agente de IA dentro da Hotmart, integrado nos teus produtos digitais.",
      "Atende alunos e tira dúvidas 24/7, aumentando o resultado do cliente sem a tua presença.",
      "O prompt entrega função, persona, instruções e os primeiros passos para ativar.",
    ],
    prev: "gem-gemini",
  },
};

// ---------- Etapa 2 — Como entregar: formatos ----------
export const FORMATOS_ENTREGA: Record<string, {
  slug: string; nome: string; status: Status; intro: string; prompt: string; prev?: string; next?: string;
}> = {
  "mentoria-grupo": {
    slug: "mentoria-grupo", nome: "Mentoria em Grupo", status: "ativo",
    intro: "Descubra como estruturar a sua Mentoria em Grupo. O prompt já vem preenchido com os dados do seu Documento Mestre.",
    prompt: "Vais ajudar-me a estruturar uma MENTORIA EM GRUPO a partir do meu Documento Mestre. Entrevista-me com uma pergunta de cada vez e, no fim, entrega: formato, estrutura (módulos/encontros), duração, ticket sugerido e 3 nomes prontos.",
    next: "consultoria-individual",
  },
  "consultoria-individual": {
    slug: "consultoria-individual", nome: "Consultoria Individual", status: "ativo",
    intro: "Descubra como estruturar a sua Consultoria Individual. O prompt já vem preenchido com os dados do seu Documento Mestre.",
    prompt: "Vais ajudar-me a estruturar uma CONSULTORIA INDIVIDUAL a partir do meu Documento Mestre. Entrevista-me com uma pergunta de cada vez e, no fim, entrega: formato, estrutura das sessões, duração, ticket sugerido e 3 nomes prontos.",
    prev: "mentoria-grupo", next: "curso-workshop",
  },
  "curso-workshop": {
    slug: "curso-workshop", nome: "Curso Online / Workshop", status: "ativo",
    intro: "Descubra como estruturar o seu Curso Online / Workshop. O prompt começa por perguntar a sua preferência (curso gravado escalável ou workshop ao vivo) e depois estrutura o produto completo.",
    prompt: "Vais ajudar-me a estruturar um CURSO ONLINE ou WORKSHOP a partir do meu Documento Mestre. Começa por perguntar se prefiro curso gravado escalável ou workshop ao vivo. Depois estrutura: promessa, módulos/agenda, ticket e nome.",
    prev: "consultoria-individual",
  },
};

// ---------- Etapa 3 — Criar o produto: aulas ----------
export const CRIAR_PRODUTO_AULAS: Record<string, {
  slug: string; nome: string; n: number; status: Status; desc: string; prev?: string; next?: string;
}> = {
  hotmart: { slug: "hotmart", nome: "Criar produto na Hotmart", n: 1, status: "ativo", desc: "Passo a passo para hospedar e vender o seu produto digital na Hotmart — cadastro, checkout, área de membros e configuração de preço.", next: "eduzz" },
  eduzz: { slug: "eduzz", nome: "Criar produto na Eduzz", n: 2, status: "ativo", desc: "Configure o seu produto na Eduzz: produtor, afiliados, página de obrigado e integrações com automação de e-mail.", prev: "hotmart", next: "precificacao" },
  precificacao: { slug: "precificacao", nome: "Precificação inteligente", n: 3, status: "breve", desc: "Como precificar o seu produto digital pelo valor que entrega — não pelo tempo gasto. Faixas, ancoragem e ofertas.", prev: "eduzz" },
};

// ---------- Etapa 5 — Página de vendas: aulas ----------
export const PAGINA_VENDAS_AULAS: Record<string, {
  slug: string; nome: string; n: number; status: Status; desc: string;
  agente?: string; cta?: { label: string; url: string }; prev?: string; next?: string;
}> = {
  "aula-1": { slug: "aula-1", nome: "Robô de Página de Vendas", n: 1, status: "ativo", desc: "O robô que estrutura e escreve a copy da sua página de vendas, pronta para converter.", agente: "Mestre das Páginas — por Ana · ChatGPT", cta: { label: "Abrir Robô (ChatGPT)", url: "https://chat.openai.com" }, next: "aula-2" },
  "aula-2": { slug: "aula-2", nome: "Página de Vendas no Lovable", n: 2, status: "ativo", desc: "Crie páginas de vendas de alta conversão usando o Lovable — sem precisar programar.", cta: { label: "Abrir Lovable", url: "https://lovable.dev" }, prev: "aula-1", next: "aula-3" },
  "aula-3": { slug: "aula-3", nome: "Copy de Venda", n: 3, status: "ativo", desc: "Escreva a copy que converte — os elementos essenciais da sua página de vendas.", agente: "Robô que Ensina e Adapta Copywriting · ChatGPT", cta: { label: "Abrir Robô de Copy (ChatGPT)", url: "https://chat.openai.com" }, prev: "aula-2" },
};

// ---------- Etapa 6 — Conclusão: checklist ----------
export const CHECKLIST_PILAR3 = [
  { label: "Defini que soluções vou criar para o meu público", to: "/metodo/pilar-3/descobrir" },
  { label: "Escolhi como vou entregar o meu produto em alto valor", to: "/metodo/pilar-3/como-entregar" },
  { label: "Criei e publiquei o meu produto na Hotmart ou Eduzz", to: "/metodo/pilar-3/criar-produto" },
  { label: "Validei o meu produto com pessoas reais antes de lançar", to: "/metodo/pilar-3/validar-produto" },
  { label: "Criei ou esbocei a minha página de vendas", to: "/metodo/pilar-3/pagina-vendas" },
];
