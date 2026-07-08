import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  Search,
  Compass,
  Sparkles,
  Sparkle,
  Mic,
  Palette,
  Shirt,
  MessageSquare,
  Video,
  Trophy,
  Clock,
  Book,
  Heart,
  CircleDot,
  Zap,
  FileText,
  LayoutGrid,
  AlignLeft,
  CalendarDays,
  UserCircle2,
  FolderOpen,
  CalendarClock,
  Instagram,
  Wrench,
  Monitor,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";

const TOOL_ICONS: Record<string, LucideIcon> = {
  ChatGPT: CircleDot,
  Claude: Sparkle,
  Gemini: Sparkles,
  Grok: Zap,
  NotebookLM: Book,
  Lovable: Heart,
  Tella: Video,
  "Linha Editorial": AlignLeft,
  "Calendário Editorial": CalendarDays,
  "Bio": UserCircle2,
  "Projeto de Postagens": FolderOpen,
  "Como agendar": CalendarClock,
  "Instagram": Instagram,
  "OBS": Monitor,
  "Notion": FileText,
  "↳ Carrossel": LayoutGrid,
  "↳ Stories": CircleDot,
  "↳ Reels": Video,
  "1 · Carrosséis no ChatGPT": LayoutGrid,
  "2 · Infográficos, livros e imagens": Palette,
  "3 · Carrosséis c/ info externa": FileText,
  "Agentes Creator": Sparkles,
};

type SubItem = { label: string; to: string; badge?: string };
type Item = {
  num: number;
  label: string;
  to: string;
  icon: LucideIcon;
  enBreve?: boolean;
  badge?: string;
  children?: SubItem[];
  id?: string; // id na ESTRUTURA — se bloqueado no painel, alunos veem "Em breve"
};

type SidebarKey = 1 | 2 | 3 | 4 | "academia" | "redes" | "conteudo-ia";

type PilarDef = {
  pilar: SidebarKey;
  title: string;
  items: Item[];
  enabled: boolean;
};

const PILARES: Record<string | number, PilarDef> = {
  "conteudo-ia": {
    pilar: "conteudo-ia",
    title: "Curso · Conteúdo com IA",
    enabled: true,
    items: [
      { num: 0, label: "Introdução", to: "/conteudo-ia", icon: Compass },
      { num: 1, label: "NotebookLM", to: "/conteudo-ia?aula=m1", icon: Search },
      { num: 2, label: "Grok", to: "/conteudo-ia?aula=m2", icon: Zap },
      { num: 3, label: "Claude", to: "/conteudo-ia?aula=m3", icon: Sparkles },
      {
        num: 4, label: "ChatGPT", to: "/conteudo-ia?aula=m4", icon: Video,
        children: [
          { label: "1 · Carrosséis no ChatGPT", to: "/conteudo-ia?aula=m4b" },
          { label: "2 · Infográficos, livros e imagens", to: "/conteudo-ia?aula=m4c" },
          { label: "3 · Carrosséis c/ info externa", to: "/conteudo-ia?aula=m4d" },
          { label: "Agentes Creator", to: "/agentes-creator", badge: "Bónus" },
        ],
      },
      { num: 5, label: "Fluxo + projeto final", to: "/conteudo-ia?aula=m5", icon: Wrench },
      { num: 6, label: "Automação", to: "/conteudo-ia?aula=m6", icon: CalendarClock, badge: "Bónus" },
      { num: 7, label: "Banco de prompts", to: "/conteudo-ia?aula=bonus", icon: Book },
    ],
  },
  academia: {
    pilar: "academia",
    title: "Domine as principais IAs",
    enabled: true,
    items: [
      {
        num: 1,
        id: "academia.principais",
        label: "Principais IAs",
        to: "/metodo/pilar-1/aprenda-ia/principais-ias",
        icon: Sparkles,
        children: [
          { label: "ChatGPT", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
          { label: "Claude", to: "/metodo/pilar-1/aprenda-ia/claude" },
          { label: "Gemini", to: "/metodo/pilar-1/aprenda-ia/gemini" },
          { label: "Grok", to: "/metodo/pilar-1/aprenda-ia/grok" },
          { label: "NotebookLM", to: "/metodo/pilar-1/aprenda-ia/notebooklm" },
          { label: "Lovable", to: "/metodo/pilar-1/aprenda-ia/lovable" },
        ],
      },
      { num: 2, id: "academia.videos", label: "Vídeos profissionais com IA", to: "/metodo/pilar-1/aprenda-ia/videos", icon: Video },
      {
        num: 3,
        id: "academia.produtividade",
        label: "Ferramentas de produtividade",
        to: "/metodo/pilar-1/aprenda-ia/produtividade",
        icon: Wrench,
        children: [
          { label: "Tella", to: "/metodo/pilar-1/aprenda-ia/tella" },
          { label: "OBS", to: "/metodo/pilar-1/aprenda-ia/produtividade" },
          { label: "Notion", to: "/metodo/pilar-1/aprenda-ia/produtividade" },
        ],
      },
    ],
  },
  redes: {
    pilar: "redes",
    title: "Criar para o Instagram",
    enabled: true,
    items: [
      { num: 1, id: "redes.boas-vindas", label: "Boas-vindas", to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas", icon: Compass },
      { num: 2, id: "redes.bio", label: "Posicionamento e Bio", to: "/metodo/pilar-2/redes-sociais?aba=bio", icon: UserCircle2 },
      {
        num: 3, id: "redes.formatos", label: "Formatos de Conteúdo", to: "/metodo/pilar-2/redes-sociais?aba=formatos", icon: Book,
        children: [
          { label: "↳ Roteiros simples", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=roteiros" },
          { label: "↳ Reels virais", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=reels" },
          { label: "↳ Carrosséis que vendem", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=carrossel" },
          { label: "↳ Stories que vendem", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=stories" },
        ],
      },
      { num: 4, id: "redes.criar", label: "Criar Conteúdo", to: "/metodo/pilar-2/redes-sociais?aba=criar", icon: Sparkle },
      { num: 5, id: "redes.plano", label: "Plano de Posts", to: "/metodo/pilar-2/redes-sociais?aba=plano", icon: CalendarDays },
      { num: 6, id: "redes.desafio", label: "30 posts em 30 dias", to: "/metodo/pilar-2/redes-sociais?aba=desafio", icon: Zap },
      { num: 7, id: "redes.assistente", label: "Assistente Cat.IA", to: "/metodo/pilar-2/redes-sociais?aba=assistente", icon: Sparkles, badge: "IA" },
      { num: 8, id: "redes.agendar", label: "Publicar", to: "/metodo/pilar-2/redes-sociais?aba=agendar", icon: CalendarClock },
    ],
  },
  1: {
    pilar: 1,
    title: "Crie com Leveza sem roubar o seu tempo",
    enabled: true,
    items: [
      { num: 1, id: "pilar-1.doc", label: "Preencha seu Documento Mestre", to: "/doc-mestre", icon: FileText },
      { num: 2, id: "pilar-1.conclusao", label: "Revise e celebre", to: "/metodo/pilar-1/conclusao", icon: Trophy },
    ],
  },
  2: {
    pilar: 2,
    title: "Criar Autoridade",
    enabled: true,
    items: [
      { num: 1, id: "pilar-2.pesquisa", label: "Pesquisa de Mercado", to: "/metodo/pilar-2/pesquisa-mercado", icon: Search },
      { num: 2, id: "pilar-2.metodo", label: "Crie o seu método", to: "/metodo/pilar-2/metodo", icon: Compass },
      {
        num: 3,
        id: "pilar-2.identidade",
        label: "Identidade de Marca",
        to: "/metodo/pilar-2/identidade",
        icon: Sparkles,
        children: [
          { label: "Tom de Voz", to: "/metodo/pilar-2/tom-de-voz" },
          { label: "Identidade Visual", to: "/metodo/pilar-2/identidade-visual" },
          { label: "Consultoria de Imagem", to: "/metodo/pilar-2/consultoria-imagem" },
        ],
      },
      { num: 4, id: "pilar-2.conclusao", label: "Conclusão Pilar 2", to: "/metodo/pilar-2/conclusao", icon: Trophy },
    ],
  },
  3: {
    pilar: 3,
    title: "Criar Soluções Digitais",
    enabled: true,
    items: [
      { num: 1, id: "pilar-3.descobrir", label: "Descobrir soluções", to: "/metodo/pilar-3/descobrir", icon: Search },
      { num: 2, id: "pilar-3.como-entregar", label: "Como entregar", to: "/metodo/pilar-3/como-entregar", icon: Compass },
      { num: 3, id: "pilar-3.criar-produto", label: "Criar o produto", to: "/metodo/pilar-3/criar-produto", icon: Wrench },
      { num: 4, id: "pilar-3.validar-produto", label: "Validar o produto", to: "/metodo/pilar-3/validar-produto", icon: CircleDot },
      { num: 5, id: "pilar-3.pagina-vendas", label: "Página de vendas", to: "/metodo/pilar-3/pagina-vendas", icon: FileText },
      { num: 6, id: "pilar-3.conclusao", label: "Revise e celebre", to: "/metodo/pilar-3/conclusao", icon: Trophy },
    ],
  },
  4: {
    pilar: 4,
    title: "Aprender a Vender",
    enabled: true,
    items: [
      { num: 1, label: "Escolha seu Caminho", to: "/metodo/pilar-4", icon: Compass },
      { num: 2, id: "pilar-4.fundacao", label: "Fundação da Venda", to: "/metodo/pilar-4/fundacao", icon: CircleDot },
      { num: 3, id: "pilar-4.alto-ticket", label: "Alto Ticket", to: "/metodo/pilar-4/alto-ticket", icon: Zap },
      { num: 4, id: "pilar-4.lancamentos", label: "Lançamentos", to: "/metodo/pilar-4/lancamentos", icon: Sparkles },
      { num: 5, id: "pilar-4.low-ticket", label: "Low Ticket", to: "/metodo/pilar-4/low-ticket", icon: CircleDot, enBreve: true },
      { num: 6, id: "pilar-4.eventos", label: "Eventos Presenciais", to: "/metodo/pilar-4/eventos-presenciais", icon: CalendarDays },
      { num: 7, id: "pilar-4.copy", label: "Copy de Venda", to: "/metodo/pilar-4/copy", icon: FileText },
      { num: 8, id: "pilar-4.trafego", label: "Tráfego Pago", to: "/metodo/pilar-4/trafego-pago", icon: Zap, enBreve: true },
      { num: 9, id: "pilar-4.conclusao", label: "Revise e celebre", to: "/metodo/pilar-4/conclusao", icon: Trophy },
    ],
  },
};

const PILAR_SHORT: Record<number, string> = {
  1: "Crie com Leveza sem roubar o seu tempo",
  2: "Criar Autoridade",
  3: "Criar Soluções Digitais",
  4: "Aprender a Vender",
};

function SidebarBody({ pilar, onNavigate }: { pilar: SidebarKey; onNavigate?: () => void }) {
  const def = PILARES[pilar];
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const { isBloqueado } = useBloqueios();
  const location = useLocation();
  const pathname = location.pathname;
  // location.search can be an object in TanStack Router
  const searchStr = typeof location.search === "string"
    ? location.search
    : Object.keys(location.search as Record<string,string>).length > 0
      ? "?" + new URLSearchParams(location.search as Record<string,string>).toString()
      : "";

  const isActive = (to: string) => {
    // Agentes Creator: subpágina do curso — ativa em toda a secção (índice + detalhes)
    if (to === "/agentes-creator") return pathname === "/agentes-creator";
    const [toPath, toQuery] = to.split("?");
    const cur = new URLSearchParams(searchStr.replace(/^\?/, ""));
    if (toQuery) {
      if (pathname !== toPath) return false;
      const tgt = new URLSearchParams(toQuery);
      if (cur.get("aba") !== tgt.get("aba")) return false;
      if (cur.get("aula") !== tgt.get("aula")) return false;
      if (cur.get("agente") !== tgt.get("agente")) return false;
      // se o alvo tem um sub-formato (fmt), exige correspondência exata
      if (tgt.get("fmt")) return cur.get("fmt") === tgt.get("fmt");
      return true;
    }
    // sem query: ativo só se não houver aba/aula/agente selecionada (página de introdução)
    if (pathname === toPath) return !cur.get("aba") && !cur.get("aula") && !cur.get("agente");
    return pathname.startsWith(toPath + "/");
  };
  const activeParent = def.items.find(
    (i) => i.children && (isActive(i.to) || i.children.some((c) => isActive(c.to))),
  );
  const [openId, setOpenId] = useState<string | null>(activeParent?.to ?? null);

  const kicker =
    def.pilar === "academia" ? "Academia de IA"
      : def.pilar === "redes" ? "Redes Sociais"
      : def.pilar === "conteudo-ia" ? "Curso Conteúdo-IA"
      : `Pilar ${def.pilar}`;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-terracotta to-terracotta-dark text-white border-r border-black/10">
      {/* Header */}
      <div className="px-5 pt-7 pb-5 border-b border-white/15">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-1.5 h-9 rounded-full bg-white/55 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/70 font-semibold">
              {kicker}
            </div>
            <div className="mt-1.5 font-display text-[1.05rem] leading-[1.15] tracking-[0.02em] uppercase text-white">
              {def.title}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {def.items.map((item) => {
            const Icon = item.icon;
            const locked = !!item.id && isBloqueado(item.id) && bloqueadoParaAlunos;

            // Item bloqueado para alunos — mostra "Em breve", sem link nem submenu.
            if (locked) {
              return (
                <li key={item.to}>
                  <div className="flex items-center gap-3 pl-2 pr-2 py-2 text-[13px] rounded-2xl opacity-70 cursor-not-allowed select-none">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/10 text-white/60">
                      <Lock size={14} strokeWidth={2} />
                    </span>
                    <span className="truncate flex-1 font-medium leading-tight text-white/60">
                      <span className="text-white/40">{item.num}.</span> {item.label}
                    </span>
                    <span className="ml-1 text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full font-semibold bg-white/15 text-white/70">
                      Em breve
                    </span>
                  </div>
                </li>
              );
            }

            // Em vista admin, sinaliza (sem bloquear) o que está "Em breve" p/ alunos.
            const emBreveAlunos = !bloqueadoParaAlunos && !!item.id && isBloqueado(item.id);
            const active = isActive(item.to);
            const hasChildren = !!item.children?.length;
            // Abre se for o pai ativo OU se uma filha for a página atual (reativo à rota).
            const childActive = hasChildren && item.children!.some((c) => isActive(c.to));
            const open = openId === item.to || active || childActive;

            return (
              <li key={item.to}>
                <div
                  className={`group flex items-stretch rounded-2xl transition-all duration-200 ${
                    active
                      ? "bg-[#ffffff] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)]"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex-1 flex items-center gap-3 pl-2 pr-2 py-2 text-[13px] min-w-0 ${active ? "text-terracotta" : "text-white"}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        active ? "bg-terracotta/10 text-terracotta" : "bg-white/15 text-white"
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.9} />
                    </span>
                    <span className="truncate flex-1 font-medium leading-tight">
                      <span className={active ? "text-terracotta/55" : "text-white/55"}>{item.num}.</span> {item.label}
                    </span>
                    {item.badge && (
                      <span className={`ml-1 text-[8.5px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        active
                          ? "bg-terracotta/10 text-terracotta"
                          : item.badge === "Bónus"
                            ? "bg-amber-400/25 text-amber-200"
                            : "bg-white/20 text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {emBreveAlunos && (
                      <span
                        title="Em breve para os alunos (você, admin, continua a ver)"
                        className="ml-1 inline-flex items-center gap-1 text-[8.5px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full font-semibold bg-amber-400/25 text-amber-200 shrink-0"
                      >
                        <Lock size={9} strokeWidth={2.5} /> Alunos
                      </span>
                    )}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setOpenId(open ? null : item.to)}
                      className={`px-2.5 transition-colors ${active ? "text-terracotta/70 hover:text-terracotta" : "text-white/70 hover:text-white"}`}
                      aria-label="Expandir"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && open && (
                  <ul className="mt-1 mb-1.5 ml-[1.4rem] pl-3 border-l border-white/25 space-y-0.5">
                    {item.children!.map((c) => {
                      const cActive = isActive(c.to);
                      return (
                        <li key={c.label}>
                          <Link
                            to={c.to}
                            onClick={onNavigate}
                            className={`flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-lg text-[12.5px] transition-colors ${
                              cActive
                                ? "bg-[#ffffff] text-terracotta font-semibold"
                                : "text-white/75 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {(() => {
                              const ToolIcon = TOOL_ICONS[c.label];
                              const cls = `shrink-0 ${cActive ? "text-terracotta" : "text-white/60"}`;
                              if (ToolIcon) return <ToolIcon size={13} className={cls} />;
                              if (c.label === "Tom de Voz") return <Mic size={12} className={cls} />;
                              if (c.label === "Identidade Visual") return <Palette size={12} className={cls} />;
                              return <Shirt size={12} className={cls} />;
                            })()}
                            <span className="flex-1 truncate">{c.label}</span>
                            {c.badge && (
                              <span className={`ml-1 text-[8.5px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0 ${cActive ? "bg-terracotta/10 text-terracotta" : "bg-amber-400/25 text-amber-200"}`}>
                                {c.badge}
                              </span>
                            )}
                            {cActive && !c.badge && (
                              <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: switch pilar */}
      <div className="border-t border-white/15 px-4 py-4">
        {typeof pilar === "number" && (
        <>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-2.5 px-1">
          Ir para outro pilar
        </div>
        <ul className="space-y-1 mb-4">
          {[1, 2, 3, 4].map((n) => {
            const def = PILARES[n];
            const active = n === pilar;
            const disabled = !def.enabled;
            const content = (
              <div
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-[11px] tracking-[0.16em] uppercase transition-all ${
                  active
                    ? "bg-[#ffffff] text-terracotta shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)]"
                    : disabled
                      ? "text-white/35"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[12px] tabular-nums shrink-0 ${
                    active ? "bg-terracotta/10 text-terracotta" : "bg-white/15 text-white"
                  }`}
                >
                  {n}
                </span>
                <span className="flex-1 truncate">{PILAR_SHORT[n]}</span>
                {disabled && <span className="text-[9px] text-white/40 normal-case tracking-normal">Em breve</span>}
              </div>
            );
            if (disabled || active) return <li key={n}>{content}</li>;
            return (
              <li key={n}>
                <Link to={`/metodo/pilar-${n}`} onClick={onNavigate}>
                  {content}
                </Link>
              </li>
            );
          })}
        </ul>
        </>
        )}

        <Link
          to={typeof pilar === "number" ? "/metodo" : "/"}
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-[12px] text-white/75 hover:text-white transition-colors px-1"
        >
          <ArrowLeft size={13} /> {typeof pilar === "number" ? "Voltar para Jornada" : "Voltar para Início"}
        </Link>
      </div>
    </div>
  );
}

export default function PilarSidebar({ pilar }: { pilar: SidebarKey }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-ink text-cream shadow-lg flex items-center justify-center"
        aria-label="Abrir menu do pilar"
      >
        <Menu size={18} />
      </button>

      {/* Desktop fixed sidebar */}
      <aside
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] z-30"
        aria-label={`Navegação Pilar ${pilar}`}
      >
        <SidebarBody pilar={pilar} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
            <SidebarBody pilar={pilar} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
