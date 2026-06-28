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
  type LucideIcon,
} from "lucide-react";

const TOOL_ICONS: Record<string, LucideIcon> = {
  ChatGPT: CircleDot,
  Claude: Sparkle,
  Gemini: Sparkles,
  Grok: Zap,
  NotebookLM: Book,
  Lovable: Heart,
  Tella: Video,
  "Modelos de Posts": LayoutGrid,
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
};

type SubItem = { label: string; to: string };
type Item = {
  num: number;
  label: string;
  to: string;
  icon: LucideIcon;
  enBreve?: boolean;
  badge?: string;
  children?: SubItem[];
};

type SidebarKey = 1 | 2 | 3 | 4 | "academia" | "redes";

type PilarDef = {
  pilar: SidebarKey;
  title: string;
  items: Item[];
  enabled: boolean;
};

const PILARES: Record<string | number, PilarDef> = {
  academia: {
    pilar: "academia",
    title: "Domine as principais IAs",
    enabled: true,
    items: [
      {
        num: 1,
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
      { num: 2, label: "Vídeos profissionais com IA", to: "/metodo/pilar-1/aprenda-ia/videos", icon: Video },
      {
        num: 3,
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
    title: "Criando para as Redes Sociais",
    enabled: true,
    items: [
      { num: 1, label: "Modelos de Posts", to: "/metodo/pilar-2/redes-sociais?aba=modelos", icon: LayoutGrid },
      { num: 2, label: "Linha Editorial", to: "/metodo/pilar-2/redes-sociais?aba=linha", icon: AlignLeft },
      { num: 3, label: "Calendário Editorial", to: "/metodo/pilar-2/redes-sociais?aba=calendario", icon: CalendarDays },
      { num: 4, label: "Bio", to: "/metodo/pilar-2/redes-sociais?aba=bio", icon: UserCircle2 },
      { num: 5, label: "Projeto de Postagens", to: "/metodo/pilar-2/redes-sociais?aba=projeto", icon: FolderOpen },
      { num: 6, label: "Como agendar", to: "/metodo/pilar-2/redes-sociais?aba=agendar", icon: CalendarClock },
      {
        num: 7,
        label: "Instagram",
        to: "/metodo/pilar-2/redes-sociais/instagram",
        icon: Instagram,
        children: [
          { label: "↳ Carrossel", to: "/metodo/pilar-2/redes-sociais/instagram/carrossel" },
          { label: "↳ Stories", to: "/metodo/pilar-2/redes-sociais/instagram/stories" },
          { label: "↳ Reels", to: "/metodo/pilar-2/redes-sociais/instagram/reels" },
        ],
      },
    ],
  },
  1: {
    pilar: 1,
    title: "Crie com Leveza sem roubar o seu tempo",
    enabled: true,
    items: [
      { num: 1, label: "Preencha seu Documento Mestre", to: "/doc-mestre", icon: FileText },
      { num: 2, label: "Mapa do Tempo", to: "/metodo/pilar-1/detetive-do-tempo", icon: Clock },
      { num: 3, label: "Relatório do tempo", to: "/metodo/pilar-1/detetive-do-tempo/relatorio", icon: FileText },
      { num: 4, label: "Revise e celebre", to: "/metodo/pilar-1/conclusao", icon: Trophy },
    ],
  },
  2: {
    pilar: 2,
    title: "Criar Autoridade",
    enabled: true,
    items: [
      { num: 1, label: "Pesquisa de Mercado", to: "/metodo/pilar-2/pesquisa-mercado", icon: Search },
      { num: 2, label: "O Seu Método", to: "/metodo/pilar-2/metodo", icon: Compass },
      {
        num: 3,
        label: "Identidade de Marca",
        to: "/metodo/pilar-2/identidade",
        icon: Sparkles,
        children: [
          { label: "Tom de Voz", to: "/metodo/pilar-2/tom-de-voz" },
          { label: "Identidade Visual", to: "/metodo/pilar-2/identidade-visual" },
          { label: "Consultoria de Imagem", to: "/metodo/pilar-2/consultoria-imagem" },
        ],
      },
      { num: 4, label: "Conclusão Pilar 2", to: "/metodo/pilar-2/conclusao", icon: Trophy },
    ],
  },
  3: { pilar: 3, title: "Crie o seu Produto", enabled: false, items: [] },
  4: {
    pilar: 4,
    title: "Aprender a Vender",
    enabled: true,
    items: [
      { num: 1, label: "Escolha seu Caminho", to: "/metodo/pilar-4", icon: Compass },
      { num: 2, label: "Fundação da Venda", to: "/metodo/pilar-4/fundacao", icon: CircleDot },
      { num: 3, label: "Alto Ticket", to: "/metodo/pilar-4/alto-ticket", icon: Zap },
      { num: 4, label: "Lançamentos", to: "/metodo/pilar-4/lancamentos", icon: Sparkles },
      { num: 5, label: "Low Ticket", to: "/metodo/pilar-4/low-ticket", icon: CircleDot, enBreve: true },
      { num: 6, label: "Eventos Presenciais", to: "/metodo/pilar-4/eventos-presenciais", icon: CalendarDays },
      { num: 7, label: "Copy de Venda", to: "/metodo/pilar-4/copy", icon: FileText },
      { num: 8, label: "Tráfego Pago", to: "/metodo/pilar-4/trafego-pago", icon: Zap, enBreve: true },
      { num: 9, label: "Revise e celebre", to: "/metodo/pilar-4/conclusao", icon: Trophy },
    ],
  },
};

const PILAR_SHORT: Record<number, string> = {
  1: "Crie com Leveza sem roubar o seu tempo",
  2: "Criar Autoridade",
  3: "Crie o seu Produto",
  4: "Aprender a Vender",
};

function SidebarBody({ pilar, onNavigate }: { pilar: SidebarKey; onNavigate?: () => void }) {
  const def = PILARES[pilar];
  const location = useLocation();
  const pathname = location.pathname;
  // location.search can be an object in TanStack Router
  const searchStr = typeof location.search === "string"
    ? location.search
    : Object.keys(location.search as Record<string,string>).length > 0
      ? "?" + new URLSearchParams(location.search as Record<string,string>).toString()
      : "";

  const isActive = (to: string) => {
    const [toPath, toQuery] = to.split("?");
    if (toQuery) {
      const currentAba = new URLSearchParams(searchStr.replace(/^\?/, "")).get("aba");
      const targetAba = new URLSearchParams(toQuery).get("aba");
      return pathname === toPath && currentAba === targetAba;
    }
    return pathname === toPath || pathname.startsWith(toPath + "/");
  };
  const activeParent = def.items.find(
    (i) => i.children && (isActive(i.to) || i.children.some((c) => isActive(c.to))),
  );
  const [openId, setOpenId] = useState<string | null>(activeParent?.to ?? null);

  const kicker =
    def.pilar === "academia" ? "Academia de IA" : def.pilar === "redes" ? "Redes Sociais" : `Pilar ${def.pilar}`;

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
            const active = isActive(item.to);
            const hasChildren = !!item.children?.length;
            const open = openId === item.to || (hasChildren && active);

            return (
              <li key={item.to}>
                <div
                  className={`group flex items-stretch rounded-2xl transition-all duration-200 ${
                    active
                      ? "bg-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)]"
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
                      <span className={`ml-1 text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full font-semibold ${active ? "bg-terracotta/10 text-terracotta" : "bg-white/20 text-white"}`}>
                        {item.badge}
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
                                ? "bg-white text-terracotta font-semibold"
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
                            {cActive && (
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
                    ? "bg-white text-terracotta shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)]"
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
