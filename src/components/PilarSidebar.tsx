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
  BookOpen,
  Book,
  Heart,
  CircleDot,
  Zap,
  FileText,
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

type PilarDef = {
  pilar: 1 | 2 | 3 | 4;
  title: string;
  items: Item[];
  enabled: boolean;
};

const PILARES: Record<number, PilarDef> = {
  1: {
    pilar: 1,
    title: "Recuperar Seu Tempo",
    enabled: true,
    items: [
      { num: 1, label: "Preencha seu Documento Mestre", to: "/doc-mestre", icon: FileText },
      {
        num: 2,
        label: "Domine as Práticas",
        to: "/metodo/pilar-1/aprenda-ia",
        icon: BookOpen,
        badge: "AULAS",
        children: [
          { label: "ChatGPT", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
          { label: "Claude", to: "/metodo/pilar-1/aprenda-ia/claude" },
          { label: "Gemini", to: "/metodo/pilar-1/aprenda-ia/gemini" },
          { label: "Grok", to: "/metodo/pilar-1/aprenda-ia/grok" },
          { label: "NotebookLM", to: "/metodo/pilar-1/aprenda-ia/notebooklm" },
          { label: "Lovable", to: "/metodo/pilar-1/aprenda-ia/lovable" },
          { label: "Tella", to: "/metodo/pilar-1/aprenda-ia/tella" },
        ],
      },
      { num: 3, label: "Detetive do Tempo", to: "/metodo/pilar-1/detetive-do-tempo", icon: Clock },
      { num: 4, label: "Relatório do tempo", to: "/metodo/pilar-1/detetive-do-tempo/relatorio", icon: FileText },
      { num: 5, label: "Revise e celebre", to: "/metodo/pilar-1/conclusao", icon: Trophy },
    ],
  },
  2: {
    pilar: 2,
    title: "Criar Autoridade",
    enabled: true,
    items: [
      { num: 1, label: "Pesquisa de Mercado", to: "/metodo/pilar-2/pesquisa-mercado", icon: Search },
      { num: 2, label: "Esboço do Método", to: "/metodo/pilar-2/metodo", icon: Compass },
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
      { num: 4, label: "Redes Sociais", to: "/metodo/pilar-2/redes-sociais", icon: MessageSquare },
      { num: 5, label: "Vídeos", to: "/metodo/pilar-2/videos", icon: Video },
      { num: 6, label: "Conclusão Pilar 2", to: "/metodo/pilar-2/conclusao", icon: Trophy },
    ],
  },
  3: { pilar: 3, title: "Criar Soluções", enabled: false, items: [] },
  4: { pilar: 4, title: "Aprender a Vender", enabled: false, items: [] },
};

const PILAR_SHORT: Record<number, string> = {
  1: "Recuperar Seu Tempo",
  2: "Criar Autoridade",
  3: "Criar Soluções",
  4: "Aprender a Vender",
};

function SidebarBody({ pilar, onNavigate }: { pilar: 1 | 2; onNavigate?: () => void }) {
  const def = PILARES[pilar];
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");
  const activeParent = def.items.find(
    (i) => i.children && (isActive(i.to) || i.children.some((c) => isActive(c.to))),
  );
  const [openId, setOpenId] = useState<string | null>(activeParent?.to ?? null);

  return (
    <div className="h-full flex flex-col bg-cream-warm/60 border-r border-[var(--color-border)]">
      {/* Header */}
      <div className="px-6 pt-7 pb-5 border-b border-[var(--color-border)]">
        <div className="text-[10px] tracking-[0.32em] uppercase text-terracotta font-medium">
          Pilar {def.pilar}
        </div>
        <div className="mt-2 font-display text-xl tracking-[0.04em] uppercase text-ink">
          {def.title}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-terracotta text-xs">✦</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
      </div>

      {/* Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {def.items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            const hasChildren = !!item.children?.length;
            const open = openId === item.to || (hasChildren && active);

            return (
              <li key={item.to}>
                <div
                  className={`flex items-stretch rounded-full transition-colors ${
                    active || open
                      ? "bg-[#f3e4d0]"
                      : "hover:bg-ink/5"
                  }`}
                >
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className="flex-1 flex items-center gap-2.5 pl-3 pr-2 py-2 text-[13px] text-ink min-w-0"
                  >
                    <Icon size={15} strokeWidth={1.75} className="text-ink/70 shrink-0" />
                    <span className="truncate flex-1 font-medium">
                      {item.num}. {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-1 text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full bg-terracotta text-cream font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setOpenId(open ? null : item.to)}
                      className="px-2.5 text-ink/55 hover:text-ink transition-colors"
                      aria-label="Expandir"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && open && (
                  <ul className="mt-1 mb-1 space-y-0.5 pl-3">
                    {item.children!.map((c) => {
                      const cActive = isActive(c.to);
                      return (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            onClick={onNavigate}
                            className={`flex items-center gap-2 pl-3 pr-3 py-2 rounded-full text-[12.5px] transition-colors ${
                              cActive
                                ? "bg-[#f3e4d0] text-ink font-medium"
                                : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                            }`}
                          >
                            {(() => {
                              const ToolIcon = TOOL_ICONS[c.label];
                              if (ToolIcon) return <ToolIcon size={13} className="text-terracotta shrink-0" />;
                              if (c.label === "Tom de Voz") return <Mic size={12} className="text-terracotta shrink-0" />;
                              if (c.label === "Identidade Visual") return <Palette size={12} className="text-terracotta shrink-0" />;
                              return <Shirt size={12} className="text-terracotta shrink-0" />;
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
      <div className="border-t border-[var(--color-border)] px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-terracotta text-xs">✦</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-ink/45 mb-3">
          Ir para outro pilar
        </div>
        <ul className="space-y-1.5">
          {[1, 2, 3, 4].map((n) => {
            const def = PILARES[n];
            const active = n === pilar;
            const disabled = !def.enabled;
            const content = (
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-[11px] tracking-[0.18em] uppercase ${
                  active
                    ? "border-terracotta/60 bg-terracotta/10 text-terracotta"
                    : disabled
                      ? "border-[var(--color-border)] text-ink/30"
                      : "border-[var(--color-border)] text-ink/70 hover:border-ink/30 hover:text-ink"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[12px] tabular-nums ${
                    active ? "bg-terracotta text-cream" : "bg-cream border border-[var(--color-border)] text-ink/60"
                  }`}
                >
                  {n}
                </span>
                <span className="flex-1 truncate">{PILAR_SHORT[n]}</span>
                {disabled && <span className="text-[9px] text-ink/35">Em breve</span>}
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

        <Link
          to="/metodo"
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-2 text-[12px] text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft size={13} /> Voltar para Trilha
        </Link>
      </div>
    </div>
  );
}

export default function PilarSidebar({ pilar }: { pilar: 1 | 2 }) {
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
          <div className="relative w-[280px] max-w-[85vw] h-full bg-cream">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-ink"
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
