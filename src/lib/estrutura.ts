// ─────────────────────────────────────────────────────────────────────────────
// ESTRUTURA DA PLATAFORMA — fonte única de verdade da navegação
//
// Aqui está TODA a estrutura: módulos → pilares → páginas → subpáginas.
// A página de admin "Estrutura" lê daqui para permitir bloquear/desbloquear
// ("Em breve") cada nó. Os menus e páginas leem os bloqueios (ver lib/bloqueios).
//
// IMPORTANTE (manutenção): sempre que se cria ou remove um módulo, pilar, página
// ou subpágina na app, atualizar esta árvore — é o que alimenta o painel de admin.
// ─────────────────────────────────────────────────────────────────────────────

export type NodoTipo = "modulo" | "pilar" | "pagina" | "subpagina";

export type Nodo = {
  id: string; // estável — NÃO mudar depois de usado (os bloqueios guardam ids)
  label: string;
  tipo: NodoTipo;
  to?: string; // rota (quando aplicável)
  filhos?: Nodo[];
};

export const ESTRUTURA: Nodo[] = [
  {
    id: "redes",
    label: "Conteúdo Todo Dia",
    tipo: "modulo",
    to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas",
    filhos: [
      { id: "redes.boas-vindas", label: "Boas-vindas", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas" },
      { id: "redes.bio", label: "Posicionamento e Bio", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=bio" },
      { id: "maquina-analises", label: "Máquina de Análises", tipo: "pagina", to: "/maquina-analises" },
      {
        id: "redes.formatos",
        label: "Formatos de Conteúdo",
        tipo: "pagina",
        to: "/metodo/pilar-2/redes-sociais?aba=formatos",
        filhos: [
          { id: "redes.formatos.reels-serie", label: "Cria a tua série", tipo: "subpagina", to: "/metodo/pilar-2/reels-em-serie" },
          { id: "redes.formatos.roteiros", label: "Yap Content", tipo: "subpagina", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=roteiros" },
          { id: "redes.formatos.reels", label: "Reels virais", tipo: "subpagina", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=reels" },
          { id: "redes.formatos.carrossel", label: "Carrosséis que vendem", tipo: "subpagina", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=carrossel" },
          { id: "redes.formatos.stories", label: "Stories que vendem", tipo: "subpagina", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=stories" },
        ],
      },
      { id: "redes.criar", label: "Criar Conteúdo", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=criar" },
      { id: "redes.plano", label: "Plano de Posts", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=plano" },
      { id: "redes.desafio", label: "30 posts em 30 dias", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=desafio" },
      { id: "redes.assistente", label: "Assistente Cat.IA", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=assistente" },
      { id: "redes.agendar", label: "Publicar", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=agendar" },
      { id: "redes.automacao", label: "Automação para mensagens automáticas", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=automacao" },
      { id: "redes.carousel-snap", label: "Carousel Snap", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=carousel-snap" },
    ],
  },
  {
    id: "jornada",
    label: "A tua jornada",
    tipo: "modulo",
    to: "/metodo",
    filhos: [
      { id: "doc-mestre", label: "Documento Mestre", tipo: "pagina", to: "/doc-mestre" },
      {
        id: "pilar-1",
        label: "Pilar 1 — Crie com Leveza",
        tipo: "pilar",
        to: "/metodo/pilar-1",
        filhos: [
          { id: "pilar-1.conclusao", label: "Revise e celebre", tipo: "pagina", to: "/metodo/pilar-1/conclusao" },
        ],
      },
      {
        id: "pilar-2",
        label: "Pilar 2 — Criar Autoridade",
        tipo: "pilar",
        to: "/metodo/pilar-2",
        filhos: [
          { id: "pilar-2.pesquisa", label: "Pesquisa de Mercado", tipo: "pagina", to: "/metodo/pilar-2/pesquisa-mercado" },
          { id: "pilar-2.metodo", label: "Crie o seu método", tipo: "pagina", to: "/metodo/pilar-2/metodo" },
          {
            id: "pilar-2.identidade",
            label: "Identidade de Marca",
            tipo: "pagina",
            to: "/metodo/pilar-2/identidade",
            filhos: [
              { id: "pilar-2.tom", label: "Tom de Voz", tipo: "subpagina", to: "/metodo/pilar-2/tom-de-voz" },
              { id: "pilar-2.visual", label: "Identidade Visual", tipo: "subpagina", to: "/metodo/pilar-2/identidade-visual" },
              { id: "pilar-2.consultoria-imagem", label: "Consultoria de Imagem", tipo: "subpagina", to: "/metodo/pilar-2/consultoria-imagem" },
            ],
          },
          { id: "pilar-2.conclusao", label: "Conclusão Pilar 2", tipo: "pagina", to: "/metodo/pilar-2/conclusao" },
        ],
      },
      {
        id: "pilar-3",
        label: "Pilar 3 — Criar Soluções Digitais",
        tipo: "pilar",
        to: "/metodo/pilar-3",
        filhos: [
          { id: "pilar-3.descobrir", label: "Descobrir soluções", tipo: "pagina", to: "/metodo/pilar-3/descobrir" },
          { id: "pilar-3.como-entregar", label: "Como entregar", tipo: "pagina", to: "/metodo/pilar-3/como-entregar" },
          { id: "pilar-3.criar-produto", label: "Criar o produto", tipo: "pagina", to: "/metodo/pilar-3/criar-produto" },
          { id: "pilar-3.validar-produto", label: "Validar o produto", tipo: "pagina", to: "/metodo/pilar-3/validar-produto" },
          { id: "pilar-3.pagina-vendas", label: "Página de vendas", tipo: "pagina", to: "/metodo/pilar-3/pagina-vendas" },
          { id: "pilar-3.conclusao", label: "Revise e celebre", tipo: "pagina", to: "/metodo/pilar-3/conclusao" },
        ],
      },
      {
        id: "pilar-4",
        label: "Pilar 4 — Aprender a Vender",
        tipo: "pilar",
        to: "/metodo/pilar-4",
        filhos: [
          { id: "pilar-4.fundacao", label: "Fundação da Venda", tipo: "pagina", to: "/metodo/pilar-4/fundacao" },
          { id: "pilar-4.alto-ticket", label: "Alto Ticket", tipo: "pagina", to: "/metodo/pilar-4/alto-ticket" },
          { id: "pilar-4.lancamentos", label: "Lançamentos", tipo: "pagina", to: "/metodo/pilar-4/lancamentos" },
          { id: "pilar-4.low-ticket", label: "Low Ticket", tipo: "pagina", to: "/metodo/pilar-4/low-ticket" },
          { id: "pilar-4.eventos", label: "Eventos Presenciais", tipo: "pagina", to: "/metodo/pilar-4/eventos-presenciais" },
          { id: "pilar-4.copy", label: "Copy de Venda", tipo: "pagina", to: "/metodo/pilar-4/copy" },
          { id: "pilar-4.trafego", label: "Tráfego Pago", tipo: "pagina", to: "/metodo/pilar-4/trafego-pago" },
          { id: "pilar-4.conclusao", label: "Revise e celebre", tipo: "pagina", to: "/metodo/pilar-4/conclusao" },
        ],
      },
      { id: "consultoria", label: "Consultoria de IA", tipo: "pagina", to: "/metodo/consultoria-ia" },
      { id: "saude", label: "Área da Saúde", tipo: "pagina", to: "/saude" },
    ],
  },
  {
    id: "academia",
    label: "Academia de IA",
    tipo: "modulo",
    to: "/metodo/pilar-1/aprenda-ia",
    filhos: [
      {
        id: "academia.principais",
        label: "Principais IAs",
        tipo: "pagina",
        to: "/metodo/pilar-1/aprenda-ia/principais-ias",
        filhos: [
          { id: "academia.chatgpt", label: "ChatGPT", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
          { id: "academia.claude", label: "Claude", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/claude" },
          { id: "academia.gemini", label: "Gemini", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/gemini" },
          { id: "academia.grok", label: "Grok", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/grok" },
          { id: "academia.notebooklm", label: "NotebookLM", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/notebooklm" },
          { id: "academia.lovable", label: "Lovable", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/lovable" },
        ],
      },
      { id: "academia.videos", label: "Vídeos profissionais com IA", tipo: "pagina", to: "/metodo/pilar-1/aprenda-ia/videos" },
      {
        id: "academia.produtividade",
        label: "Ferramentas de produtividade",
        tipo: "pagina",
        to: "/metodo/pilar-1/aprenda-ia/produtividade",
        filhos: [
          { id: "academia.tella", label: "Tella", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/tella" },
          { id: "academia.obs", label: "OBS", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/produtividade" },
          { id: "academia.notion", label: "Notion", tipo: "subpagina", to: "/metodo/pilar-1/aprenda-ia/produtividade" },
        ],
      },
    ],
  },
  {
    id: "conteudo-ia",
    label: "Primeiro Mês de Posts (Mini-curso)",
    tipo: "modulo",
    to: "/conteudo-ia",
    filhos: [
      { id: "conteudo-ia.intro", label: "Introdução", tipo: "pagina", to: "/conteudo-ia" },
      {
        id: "conteudo-ia.m1", label: "Módulo 1 · NotebookLM", tipo: "pagina", to: "/conteudo-ia?aula=m1",
        filhos: [
          { id: "conteudo-ia.m1b", label: "Apresentações", tipo: "subpagina", to: "/conteudo-ia?aula=m1b" },
        ],
      },
      { id: "conteudo-ia.m2", label: "Módulo 2 · Grok", tipo: "pagina", to: "/conteudo-ia?aula=m2" },
      {
        id: "conteudo-ia.m3", label: "Módulo 3 · Claude", tipo: "pagina", to: "/conteudo-ia?aula=m3",
        filhos: [
          { id: "conteudo-ia.m3b", label: "Criar conteúdo no Claude", tipo: "subpagina", to: "/conteudo-ia?aula=m3b" },
          { id: "conteudo-ia.m3c", label: "Carrosséis visuais", tipo: "subpagina", to: "/conteudo-ia?aula=m3c" },
          { id: "conteudo-ia.m3d", label: "Criar artefactos", tipo: "subpagina", to: "/conteudo-ia?aula=m3d" },
        ],
      },
      {
        id: "conteudo-ia.m4", label: "Módulo 4 · ChatGPT", tipo: "pagina", to: "/conteudo-ia?aula=m4",
        filhos: [
          { id: "conteudo-ia.m4b", label: "Carrosséis no ChatGPT", tipo: "subpagina", to: "/conteudo-ia?aula=m4b" },
          { id: "conteudo-ia.m4c", label: "Imagens e infográficos", tipo: "subpagina", to: "/conteudo-ia?aula=m4c" },
          { id: "conteudo-ia.m4d", label: "Carrosséis c/ info externa", tipo: "subpagina", to: "/conteudo-ia?aula=m4d" },
        ],
      },
      { id: "conteudo-ia.m5", label: "Módulo 5 · Fluxo + projeto final", tipo: "pagina", to: "/conteudo-ia?aula=m5" },
      { id: "conteudo-ia.m6", label: "Automações que geram ideias (Bónus)", tipo: "pagina", to: "/conteudo-ia?aula=m6" },
      { id: "conteudo-ia.bonus", label: "Banco de prompts", tipo: "pagina", to: "/conteudo-ia?aula=bonus" },
      { id: "conteudo-ia.final", label: "O teu próximo passo", tipo: "pagina", to: "/conteudo-ia?aula=final" },
    ],
  },
  {
    id: "encontros",
    label: "Encontros (Mentoria)",
    tipo: "modulo",
    to: "/encontros",
    filhos: [
      { id: "encontros.sessoes", label: "Sessões ao vivo", tipo: "pagina", to: "/encontros" },
    ],
  },
  {
    id: "criar-produto",
    label: "Criar Produto",
    tipo: "modulo",
    to: "/criar-produto",
    filhos: [
      { id: "criar-produto.documento", label: "Documento Mestre", tipo: "pagina", to: "/criar-produto?aba=documento" },
      { id: "criar-produto.esteira", label: "A tua esteira", tipo: "pagina", to: "/criar-produto?aba=esteira" },
    ],
  },
  {
    id: "vendas-apps",
    label: "Página de vendas e aplicações profissionais",
    tipo: "modulo",
    to: "/vendas-apps",
    filhos: [
      { id: "vendas-apps.intro", label: "Introdução", tipo: "pagina", to: "/vendas-apps" },
    ],
  },
];

// Bloqueios "Em breve" por defeito (enquanto a mentora não mexer no painel).
// Reflete o estado atual da app: estes nós aparecem como "Em breve" aos alunos.
export const BLOQUEIOS_PADRAO: string[] = [
  // Dentro de "Formatos de Conteúdo" só "Cria a tua série" está livre;
  // os restantes formatos ficam "Em breve" (bloqueio por sub-item, não no pai).
  "redes.formatos.roteiros",
  "redes.formatos.reels",
  "redes.formatos.carrossel",
  "redes.formatos.stories",
  "redes.criar",
  "redes.plano",
  "redes.desafio",
  "pilar-3",
  "pilar-4",
  "academia",
  "consultoria",
  "saude",
  // Produtos novos: bloqueados por defeito (aparecem "Em breve" aos alunos).
  "criar-produto",
  "vendas-apps",
  "maquina-analises",
];

// Modo de bloqueio por defeito de cada nó (quando a admin ainda não mexeu no
// painel). "oculto" = nem aparece aos alunos; "em-breve"/"bloqueado" = ver
// lib/bloqueios. Produtos novos entram "oculto" (só-admin, invisíveis).
export const MODO_PADRAO: Record<string, string> = {
  "criar-produto": "oculto",
  "vendas-apps": "oculto",
  "maquina-analises": "oculto",
};

// Lista achatada (útil para procurar por id / validar).
export function achatarEstrutura(nodos: Nodo[] = ESTRUTURA): Nodo[] {
  const out: Nodo[] = [];
  const walk = (ns: Nodo[]) => {
    for (const n of ns) {
      out.push(n);
      if (n.filhos) walk(n.filhos);
    }
  };
  walk(nodos);
  return out;
}

// Dado um caminho (pathname), devolve o id do nó mais específico que lhe
// corresponde — para bloquear a PÁGINA (não só o menu). Ignora nós com query
// (?aba=…, como o "redes"), que têm o seu próprio guarda interno.
export function nodeIdParaRota(pathname: string): string | null {
  let best: { id: string; len: number } | null = null;
  for (const n of achatarEstrutura()) {
    if (!n.to || n.to.includes("?")) continue;
    const p = n.to;
    if (pathname === p || pathname.startsWith(p + "/")) {
      if (!best || p.length > best.len) best = { id: n.id, len: p.length };
    }
  }
  return best?.id ?? null;
}
