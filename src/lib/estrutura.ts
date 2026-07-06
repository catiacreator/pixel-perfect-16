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
    label: "Criar para o Instagram",
    tipo: "modulo",
    to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas",
    filhos: [
      { id: "redes.boas-vindas", label: "Boas-vindas", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas" },
      { id: "redes.bio", label: "Posicionamento e Bio", tipo: "pagina", to: "/metodo/pilar-2/redes-sociais?aba=bio" },
      {
        id: "redes.formatos",
        label: "Formatos de Conteúdo",
        tipo: "pagina",
        to: "/metodo/pilar-2/redes-sociais?aba=formatos",
        filhos: [
          { id: "redes.formatos.roteiros", label: "Roteiros simples", tipo: "subpagina", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=roteiros" },
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
    ],
  },
  {
    id: "jornada",
    label: "Jornada",
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
];

// Bloqueios "Em breve" por defeito (enquanto a mentora não mexer no painel).
// Reflete o estado atual da app: estes nós aparecem como "Em breve" aos alunos.
export const BLOQUEIOS_PADRAO: string[] = [
  "redes.formatos",
  "redes.criar",
  "redes.plano",
  "redes.desafio",
  "pilar-3",
  "pilar-4",
  "academia",
  "consultoria",
  "saude",
];

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
