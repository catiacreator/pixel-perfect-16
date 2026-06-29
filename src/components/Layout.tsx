import { Link } from "@/lib/router-compat";
import { useLocation, useRouter } from "@tanstack/react-router";
import { FileText, Mail, Map, Bot, Database, Award, Menu, X, ArrowUpRight, ArrowLeft, Trophy, Shield, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initMasterDocSync } from "@/lib/master-doc-sync";
import { readStoredSession } from "@/lib/session";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import ModulePaywall from "@/components/ModulePaywall";
import { useAccess } from "@/lib/use-access";
import type { ModuleKey } from "@/lib/access";

const NAV = [
  { to: "/", label: "Início", icon: Map },
  { to: "/assistente", label: "Assistente IA", icon: Bot, gated: true },
  { to: "/metodo/pilar-1/aprenda-ia/claude/instalar-skills", label: "Skills", icon: Award },
  { to: "/minha-base", label: "A minha jornada", icon: Database, gated: true },
  { to: "/agenda", label: "A minha Agenda", icon: CalendarDays, gated: true },
  { to: "/conquistas", label: "Vitórias", icon: Trophy, gated: true },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    async function load(uid: string | null) {
      if (!active) return;
      setSignedIn(!!uid);
      if (uid) {
        void initMasterDocSync();
        // Lê os papéis direto da tabela (RLS permite ler os próprios) — has_role tem EXECUTE revogado.
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        const isStaff = (roles ?? []).some(
          (r) => (r.role as string) === "admin" || (r.role as string) === "moderator",
        );
        if (active) setIsAdmin(isStaff);
      } else {
        setIsAdmin(false);
      }
    }
    // Leitura síncrona do storage — instantânea e não pendura.
    load(readStoredSession()?.user?.id ?? null);
    // Reage a login/logout.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      load(session?.user?.id ?? readStoredSession()?.user?.id ?? null),
    );
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
  const redes = path.startsWith("/metodo/pilar-2/redes-sociais");
  const jornada = !academia && !redes && (path.startsWith("/metodo") || path.startsWith("/doc-mestre"));
  const roxo = path.startsWith("/minha-base") || path.startsWith("/agenda") || path.startsWith("/conquistas");
  const headerMod = academia ? "academia" : redes ? "redes" : jornada ? "jornada" : roxo ? "roxo" : "default";

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
          {/* Logótipo */}
          <Link to="/" className="flex items-center gap-2.5 leading-none shrink-0 group">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_14px_2px_rgba(184,121,74,0.45)]" />
            <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">
              Leveza<span className="hidden sm:inline"> no Digital</span>
            </span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV.map((item) => {
              const active = isActive(item.to);
              // Sem login: itens visíveis mas desativados.
              if (!signedIn) {
                return (
                  <span
                    key={item.to}
                    title="Entra para aceder"
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
            {signedIn && (
              <Link
                to="/doc-mestre"
                className="hidden md:inline-flex items-center gap-1.5 text-[13px] pl-4 pr-3 py-2 bg-ink text-cream rounded-full font-medium transition-all hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <FileText size={13} strokeWidth={2.25} /> Documento
                <ArrowUpRight size={13} strokeWidth={2.25} />
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 text-[13px] px-3 py-2 border border-ink/15 rounded-full text-ink/70 hover:bg-ink/5 transition-colors"
                aria-label="Admin"
              >
                <Shield size={13} strokeWidth={2.25} /> Admin
              </Link>
            )}
            <ThemeToggle />
            {signedIn && (
              <Link
                to="/mensagens"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors"
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
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Navegação mobile */}
        {open && (
          <nav className="lg:hidden border-t border-[var(--color-border)] bg-white px-5 py-3 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              if (!signedIn) {
                return (
                  <span
                    key={item.to}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-ink/30 cursor-not-allowed"
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    {item.label}
                  </span>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                    active ? "bg-ink/10 text-ink" : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="flex-1 w-full">
        {gateModule && accessLoading ? (
          <div className="px-5 py-20 text-center text-ink/45 text-sm">A verificar acesso…</div>
        ) : blocked && gateModule ? (
          <ModulePaywall module={gateModule} signedIn={hasAccessSignedIn} />
        ) : (
          children
        )}
      </main>

      <footer className="w-full border-t border-[var(--color-border)] mt-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
              <p className="font-sans font-semibold text-base text-ink">Leveza no Digital</p>
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
    </div>
  );
}
