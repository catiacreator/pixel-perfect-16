import { Link } from "@/lib/router-compat";
import { useLocation, useRouter } from "@tanstack/react-router";
import { FileText, Mail, Map, Database, Award, Menu, X, ArrowUpRight, ArrowLeft, Trophy, Shield, ChevronDown, Instagram, GraduationCap, Eye, CalendarDays, Sparkles, Package, Rocket, LineChart, Users, Bot, Search, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initMasterDocSync } from "@/lib/master-doc-sync";
import { readStoredSession } from "@/lib/session";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import QuickIdeas from "@/components/QuickIdeas";
import ModulePaywall from "@/components/ModulePaywall";
import PreviewTurmaModal from "@/components/PreviewTurmaModal";
import EmManutencao from "@/components/EmManutencao";
import MarcarEtapa from "@/components/MarcarEtapa";
import NIaTopButton, { N_IA_URL } from "@/components/NIaTopButton";
import BuscaGlobal, { abrirBusca } from "@/components/BuscaGlobal";
import { useAccess } from "@/lib/use-access";
import { useAdminView, setAdminView, abrirPreviewTurma, setPreviewTurma, useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";
import { categoriaDesativaLinks } from "@/lib/turmas";
import { nodeIdParaRota } from "@/lib/estrutura";
import { isAdminEmail, type ModuleKey } from "@/lib/access";
import { abrirPilarMenu, usePilarMenuPresente } from "@/lib/pilar-menu";

// Menu "Cursos": tudo o que existe, por hierarquia — cada grupo separado por
// uma linha fina. Os ids são os do registo da ESTRUTURA: é o que permite
// esconder (ou marcar "Em breve") o que a aluna ainda não pode abrir.
const GRUPOS_CURSOS: {
  titulo: string;
  itens: { id: string; to: string; label: string; sub: string; cor: string; icon: LucideIcon }[];
}[] = [
  {
    titulo: "Cursos",
    itens: [
      { id: "jornada", to: "/protocolo", label: "Leveza no Digital", sub: "Mentoria · Instagram", cor: "#C8487E", icon: Instagram },
      { id: "redes", to: "/metodo/pilar-2/redes-sociais?aba=boas-vindas", label: "Conteúdo Todo Dia", sub: "Método · redes sociais", cor: "#D2547F", icon: CalendarDays },
      { id: "academia", to: "/metodo/pilar-1/aprenda-ia", label: "Academia de IA", sub: "Ferramentas · aulas", cor: "#2E7CB8", icon: GraduationCap },
    ],
  },
  {
    titulo: "Mini-cursos & Ferramentas",
    itens: [
      { id: "conteudo-ia", to: "/conteudo-ia", label: "Primeiro Mês de Posts", sub: "Mini-curso", cor: "#7C56C9", icon: Sparkles },
      { id: "criar-produto", to: "/criar-produto", label: "Criar Produto", sub: "A tua esteira", cor: "#2F9E6E", icon: Package },
      { id: "vendas-apps", to: "/vendas-apps", label: "Páginas de vendas e apps", sub: "Sem programar", cor: "#2E6F9E", icon: Rocket },
      { id: "maquina-analises", to: "/maquina-analises", label: "Máquina de Análises", sub: "Plano de 30 dias", cor: "#C13584", icon: LineChart },
    ],
  },
  {
    titulo: "Mentoria",
    itens: [
      { id: "encontros", to: "/encontros", label: "Encontros", sub: "Sessões ao vivo", cor: "#A2004E", icon: Users },
    ],
  },
];

const NAV = [
  { to: "/", label: "Início", icon: Map },
  { to: "/metodo/pilar-1/aprenda-ia/claude/instalar-skills", label: "Skills", icon: Award },
  { to: "/minha-base", label: "A minha jornada", icon: Database, gated: true },
  { to: "/conquistas", label: "Vitórias", icon: Trophy, gated: true },
];

// Etiquetas curtas para a barra inferior — "A minha jornada" não cabe em 1/4 do ecrã.
const NAV_CURTO: Record<string, string> = {
  "/minha-base": "Jornada",
  "/metodo/pilar-1/aprenda-ia/claude/instalar-skills": "Skills",
};

// Ordem da barra inferior (telemóvel/tablet). Escrita por extenso porque não
// segue a ordem do NAV. Dois slots não são rotas: "menu" abre o painel com os
// cursos e os atalhos; "busca" abre a pesquisa global.
// O Início não está aqui — chega-se lá pelo logótipo do cabeçalho.
const ORDEM_BARRA = [
  "menu",
  "/minha-base",
  "/conquistas",
  "/metodo/pilar-1/aprenda-ia/claude/instalar-skills",
  "busca",
] as const;

/**
 * Lista dos cursos agrupada. Usada no dropdown do desktop e dentro do menu
 * hamburger em telemóvel/tablet — o mesmo markup nos dois sítios, para não
 * divergirem quando se acrescenta um curso.
 */
function ListaCursos({
  bloqueadoParaAlunos,
  isBloqueado,
  modoBloqueio,
  onNavegar,
}: {
  bloqueadoParaAlunos: boolean;
  isBloqueado: (id: string) => boolean;
  modoBloqueio: (id: string) => string;
  onNavegar: () => void;
}) {
  return (
    <>
      {GRUPOS_CURSOS.map((grupo) => {
        // "oculto" desaparece; "Em breve" fica visível, com etiqueta.
        const itens = grupo.itens.filter(
          (it) => !bloqueadoParaAlunos || !isBloqueado(it.id) || modoBloqueio(it.id) !== "oculto",
        );
        if (!itens.length) return null;
        return (
          <div key={grupo.titulo} className="pt-1 first:pt-0 mt-1 first:mt-0 border-t first:border-t-0 border-[var(--color-border)]">
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
              {grupo.titulo}
            </p>
            {itens.map((it) => {
              const emBreve = bloqueadoParaAlunos && isBloqueado(it.id);
              return (
                <Link
                  key={it.id}
                  to={it.to}
                  onClick={onNavegar}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink/5 transition-colors"
                >
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${it.cor}1F`, color: it.cor }}
                  >
                    <it.icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink truncate">{it.label}</span>
                    <span className="block text-[11px] text-ink/50 truncate">{it.sub}</span>
                  </span>
                  {emBreve && (
                    <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-terracotta/80 border border-terracotta/25 rounded-full px-1.5 py-0.5">
                      Em breve
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView] = useAdminView();
  const [signedIn, setSignedIn] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const prodRef = useRef<HTMLDivElement>(null);
  const temMenuCurso = usePilarMenuPresente();

  useEffect(() => {
    if (!prodOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (prodRef.current && !prodRef.current.contains(e.target as Node)) setProdOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [prodOpen]);

  useEffect(() => {
    let active = true;
    async function load(uid: string | null, email: string | null) {
      if (!active) return;
      setSignedIn(!!uid);
      if (!uid) { setIsAdmin(false); return; }
      void initMasterDocSync();
      // Admin por email — imediato, sem tocar na BD (igual ao useAccess).
      if (isAdminEmail(email)) { setIsAdmin(true); return; }
      // Caso contrário, papel admin/moderador na tabela (RLS permite ler os próprios).
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const isStaff = (roles ?? []).some(
        (r) => (r.role as string) === "admin" || (r.role as string) === "moderator",
      );
      if (active) setIsAdmin(isStaff);
    }
    // Leitura síncrona do storage — instantânea e não pendura.
    const u0 = readStoredSession()?.user;
    load(u0?.id ?? null, u0?.email ?? null);
    // Reage a login/logout.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? readStoredSession()?.user;
      load(u?.id ?? null, u?.email ?? null);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const showBack = location.pathname !== "/";
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  // A barra começa na cor do módulo atual e faz degradê para as outras (variantes claras/escuras em styles.css)
  const path = location.pathname;
  const academia = path.startsWith("/metodo/pilar-1/aprenda-ia");
  const redes = path.startsWith("/metodo/pilar-2/redes-sociais") || path.startsWith("/metodo/pilar-2/reels-em-serie");
  const jornada = !academia && !redes && (path.startsWith("/metodo") || path.startsWith("/doc-mestre"));
  const roxo = path.startsWith("/minha-base") || path.startsWith("/agenda") || path.startsWith("/conquistas");
  const headerMod = academia ? "academia" : redes ? "redes" : jornada ? "jornada" : roxo ? "roxo" : "default";

  // Guarda da PÁGINA: se a rota atual corresponde a um nó bloqueado ("Em breve" /
  // sem permissão da turma), esconde o conteúdo e mostra "Em manutenção".
  const { isBloqueado, categoriaTurma, modoBloqueio } = useBloqueios();
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const nodeRota = nodeIdParaRota(path);
  const rotaBloqueada = !!nodeRota && bloqueadoParaAlunos && isBloqueado(nodeRota);

  // Turmas de categoria "Cursos" ou "Mini-cursos": links do topo desativados
  // (só o Início ativo), para verem a plataforma e desejarem o método completo.
  const soMiniCurso = bloqueadoParaAlunos && categoriaDesativaLinks(categoriaTurma);

  // Paywall por módulo: bloqueia o acesso direto às rotas dos produtos.
  const gateModule: ModuleKey | null = academia ? "academia" : redes ? "redes" : jornada ? "jornada" : null;
  const { has, loading: accessLoading, signedIn: hasAccessSignedIn } = useAccess();
  const blocked = !!gateModule && !accessLoading && !has(gateModule);

  return (
    <div className={`min-h-screen w-full flex flex-col bg-cream text-ink font-display${roxo ? " theme-roxo" : ""}`}>
      {/* Cabeçalho */}
      <header
        className={`app-header app-header--${headerMod} w-full sticky top-0 z-40 text-ink border-b border-black/5 dark:border-white/10 shadow-[0_4px_24px_-16px_rgba(0,0,0,0.35)]`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-18 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
          {/* Hamburger do curso atual — só onde há um menu de curso para abrir
              (a PilarSidebar anuncia-se). Fica à esquerda, colado ao logótipo. */}
          <div className="flex items-center gap-2 min-w-0">
            {temMenuCurso && (
              <button
                onClick={abrirPilarMenu}
                className="lg:hidden w-10 h-10 -ml-1 rounded-full border border-ink/15 flex items-center justify-center text-ink shrink-0"
                aria-label="Abrir menu do curso"
              >
                <Menu size={18} />
              </button>
            )}
          {/* Logótipo */}
          <Link to="/" className="flex items-center gap-2.5 leading-none shrink-0 group">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_14px_2px_rgba(184,121,74,0.45)]" />
            {/* Não parte em linhas no telemóvel: o cabeçalho é estreito e a
                marca a três linhas empurrava tudo. */}
            <span className="font-sans font-semibold text-[15px] md:text-[16px] tracking-tight text-ink leading-none whitespace-nowrap">
              Leveza no Digital
            </span>
          </Link>
          </div>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {/* Menu de produtos */}
            <div className="relative mr-1" ref={prodRef}>
              <button
                onClick={() => { if (!soMiniCurso) setProdOpen((v) => !v); }}
                disabled={soMiniCurso}
                title={soMiniCurso ? "Disponível no método completo" : undefined}
                className={`relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-all inline-flex items-center gap-1.5 ${soMiniCurso ? "text-ink/30 cursor-not-allowed" : "text-ink/70 hover:text-ink hover:bg-ink/10"}`}
              >
                Cursos
                <ChevronDown size={13} className={`transition-transform ${prodOpen ? "rotate-180" : ""}`} />
              </button>
              {prodOpen && !soMiniCurso && (
                <div className="absolute left-0 mt-2 w-[19rem] max-h-[75vh] overflow-y-auto bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] p-2 z-50">
                  <ListaCursos
                    bloqueadoParaAlunos={bloqueadoParaAlunos}
                    isBloqueado={isBloqueado}
                    modoBloqueio={modoBloqueio}
                    onNavegar={() => setProdOpen(false)}
                  />
                </div>
              )}
            </div>

            {NAV.map((item) => {
              const active = isActive(item.to);
              // Visíveis mas desativados: sem login, ou turma só mini-curso (exceto Início).
              const disabled = !signedIn || (soMiniCurso && item.to !== "/");
              if (disabled) {
                return (
                  <span
                    key={item.to}
                    title={signedIn ? "Disponível no método completo" : "Entra para aceder"}
                    className="relative px-3.5 py-2 rounded-full text-[13px] text-ink/30 cursor-not-allowed"
                  >
                    {item.label}
                  </span>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3.5 py-2 rounded-full text-[13px] transition-all ${
                    active
                      ? "bg-ink/10 text-ink font-medium"
                      : "text-ink/70 hover:text-ink hover:bg-ink/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Direita */}
          <div className="flex items-center gap-2 justify-end">
            {signedIn && <BuscaGlobal />}
            {signedIn && <NIaTopButton />}
            {signedIn && (
              soMiniCurso ? (
                <span
                  title="Disponível no método completo"
                  className="hidden lg:inline-flex items-center gap-1.5 text-[13px] pl-4 pr-3 py-2 bg-ink/20 text-ink/40 rounded-full font-medium cursor-not-allowed"
                >
                  <FileText size={13} strokeWidth={2.25} /> Documento
                  <ArrowUpRight size={13} strokeWidth={2.25} />
                </span>
              ) : (
                <Link
                  to="/doc-mestre"
                  className="hidden lg:inline-flex items-center gap-1.5 text-[13px] pl-4 pr-3 py-2 bg-ink text-cream rounded-full font-medium transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <FileText size={13} strokeWidth={2.25} /> Documento
                  <ArrowUpRight size={13} strokeWidth={2.25} />
                </Link>
              )
            )}
            {isAdmin && (
              <div className="hidden lg:inline-flex items-center gap-0.5 p-0.5 rounded-full border border-ink/15 bg-white" title="Pré-visualizar como aluno ou admin (só muda a vista)">
                <button
                  onClick={() => abrirPreviewTurma()}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-full transition-colors ${adminView === "aluno" ? "bg-terracotta text-cream" : "text-ink/60 hover:text-ink"}`}
                >
                  <Eye size={12} /> Aluno
                </button>
                <button
                  onClick={() => { setAdminView("admin"); setPreviewTurma(null); }}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-full transition-colors ${adminView === "admin" ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"}`}
                >
                  <Shield size={12} /> Admin
                </button>
              </div>
            )}
            {/* Tema e mensagens saem do cabeçalho em telemóvel/tablet: seis
                ícones não cabem em 375px. Passam para o hamburger. */}
            <span className="hidden lg:inline-flex">
              <ThemeToggle />
            </span>
            {signedIn && (
              <Link
                to="/mensagens"
                className="hidden lg:flex w-10 h-10 rounded-full border border-ink/15 items-center justify-center text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors"
                aria-label="Mensagens"
              >
                <Mail size={15} strokeWidth={1.75} />
              </Link>
            )}
            {signedIn ? (
              <UserMenu />
            ) : (
              <Link
                to="/auth"
                className="inline-flex text-[13px] px-4 py-2 border border-ink/20 text-ink rounded-full hover:bg-ink/5 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Painel dos CURSOS — aberto pelo separador "Cursos" da barra de baixo. */}
        {open && (
          <nav className="lg:hidden fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] top-16 z-40 border-t border-[var(--color-border)] bg-white px-3 py-3 overflow-y-auto">
            {soMiniCurso ? (
              <p className="px-3 py-6 text-center text-sm text-ink/45">
                Os cursos ficam disponíveis no método completo.
              </p>
            ) : (
              <ListaCursos
                bloqueadoParaAlunos={bloqueadoParaAlunos}
                isBloqueado={isBloqueado}
                modoBloqueio={modoBloqueio}
                onNavegar={() => setOpen(false)}
              />
            )}
            {signedIn && !soMiniCurso && (
              <Link
                to="/doc-mestre"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 justify-center px-3 py-3 rounded-xl bg-ink text-cream text-sm font-semibold"
              >
                <FileText size={15} strokeWidth={2.25} /> Documento Mestre
              </Link>
            )}

            {/* Assistente N.IA — o guia da plataforma, no ChatGPT. */}
            <a
              href={N_IA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-2.5 px-3 py-3 rounded-xl border border-ink/15 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
            >
              <Bot size={17} strokeWidth={2} /> Assistente N.IA
              <ArrowUpRight size={15} strokeWidth={2.25} className="ml-auto text-ink/40" />
            </a>

            {/* O que saiu do cabeçalho por falta de espaço. */}
            <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center gap-2">
              {signedIn && (
                <Link
                  to="/mensagens"
                  onClick={() => setOpen(false)}
                  className="flex-1 flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-ink/70 hover:bg-ink/5 transition-colors"
                >
                  <Mail size={17} strokeWidth={1.75} /> Mensagens
                </Link>
              )}
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 w-full">
        {gateModule && accessLoading ? (
          <div className="px-5 py-20 text-center text-ink/45 text-sm">A verificar acesso…</div>
        ) : rotaBloqueada ? (
          <EmManutencao modo={nodeRota ? modoBloqueio(nodeRota) : "em-breve"} />
        ) : blocked && gateModule ? (
          <ModulePaywall module={gateModule} signedIn={hasAccessSignedIn} />
        ) : (
          <>
            {children}
            <MarcarEtapa />
          </>
        )}
      </main>

      {/* Folga para a barra inferior não tapar o fim da página (só onde ela existe). */}
      <footer className="w-full border-t border-[var(--color-border)] mt-24 pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
              <p className="font-sans font-semibold text-base text-ink">Cátia Creator</p>
            </div>
            <p className="text-xs text-ink/50 mt-2 max-w-sm">
              Transforme conhecimento em liberdade. Jornada guiada com Inteligência Artificial.
            </p>
          </div>
          <p className="text-[11px] tracking-wider uppercase text-ink/40 text-right">
            © 2026 · v1.0
          </p>
        </div>
      </footer>

      {/* Barra de navegação inferior (telemóvel/tablet). O menu principal vive
          aqui, ao alcance do polegar; os cursos ficam no hamburger.
          O padding-bottom do <main> compensa a altura desta barra. */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegação principal"
      >
        <div className="grid grid-cols-5">
          {ORDEM_BARRA.map((slot) => {
            const base = "flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[10.5px] font-medium leading-none";

            // Menu abre o painel em vez de navegar.
            if (slot === "menu") {
              return (
                <button
                  key="menu"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  className={`${base} transition-colors ${open ? "text-terracotta" : "text-ink/55 hover:text-ink"}`}
                >
                  {open ? <X size={19} strokeWidth={2.25} /> : <Menu size={19} strokeWidth={1.75} />}
                  Menu
                </button>
              );
            }

            // Lupa: abre a pesquisa global (o componente vive no cabeçalho).
            if (slot === "busca") {
              return (
                <button
                  key="busca"
                  onClick={() => { setOpen(false); abrirBusca(); }}
                  className={`${base} text-ink/55 hover:text-ink transition-colors`}
                >
                  <Search size={19} strokeWidth={1.75} />
                  Pesquisar
                </button>
              );
            }

            const item = NAV.find((n) => n.to === slot);
            if (!item) return null;
            const Icon = item.icon;
            const active = isActive(item.to) && !open;
            const disabled = !signedIn || (soMiniCurso && item.to !== "/");
            const rotulo = NAV_CURTO[item.to] ?? item.label;

            if (disabled) {
              return (
                <span
                  key={item.to}
                  title={signedIn ? "Disponível no método completo" : "Entra para aceder"}
                  className={`${base} text-ink/25 cursor-not-allowed`}
                >
                  <Icon size={19} strokeWidth={1.75} />
                  {rotulo}
                </span>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`${base} transition-colors ${active ? "text-terracotta" : "text-ink/55 hover:text-ink"}`}
              >
                <Icon size={19} strokeWidth={active ? 2.25 : 1.75} />
                {rotulo}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Com o painel dos cursos aberto, o botão flutuante ficaria por cima dele. */}
      {signedIn && !open && <QuickIdeas />}
      {isAdmin && <PreviewTurmaModal />}
    </div>
  );
}
