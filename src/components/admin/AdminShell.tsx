import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Users, Trophy, FileText, LogOut, Eye, KeyRound, Home, ChevronDown, ChevronLeft, ListTree, GraduationCap, ShieldCheck, Ticket, Link2, Mail, Bot, Gift } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getAdminConfig } from "@/lib/admin.functions";
import { setAdminView } from "@/lib/admin-view";
import { readStoredSession } from "@/lib/session";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const ITEMS: NavItem[] = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/mentoradas", label: "Alunos", icon: Users },
  { to: "/admin/mensagens", label: "Mensagens", icon: Mail },
  { to: "/admin/turmas", label: "Turmas", icon: GraduationCap },
  { to: "/admin/codigos", label: "Códigos de acesso", icon: Ticket },
  { to: "/admin/estrutura", label: "Estrutura", icon: ListTree },
  { to: "/admin/papeis", label: "Papéis", icon: ShieldCheck },
  { to: "/admin/links", label: "Links", icon: Link2 },
  { to: "/admin/cat-ia", label: "Cat.IA", icon: Bot },
  { to: "/admin/premios", label: "Prémios", icon: Gift },
  { to: "/admin/ranking", label: "Ranking", icon: Trophy },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
];

export function AdminShell() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const configFn = useServerFn(getAdminConfig);
  const { data } = useSuspenseQuery({
    queryKey: ["admin-check"],
    queryFn: () => check(),
  });
  const { data: config } = useSuspenseQuery({
    queryKey: ["admin-config"],
    queryFn: () => configFn(),
  });

  useEffect(() => {
    if (!data.isAdmin) navigate({ to: "/" });
  }, [data.isAdmin, navigate]);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!data.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-ink">
        Sem permissão.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-display">
      {/* Cabeçalho — mesmo estilo (gradiente pastel) da app */}
      <header className="app-header sticky top-0 z-40 text-ink border-b border-black/5 shadow-[0_4px_24px_-16px_rgba(0,0,0,0.35)]">
        <div className="px-5 md:px-8 h-16 md:h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/70 px-3 py-1.5 rounded-full border border-ink/15 bg-white/50 hover:bg-white transition-colors shrink-0"
              title="Voltar à página anterior"
            >
              <ChevronLeft size={15} /> Voltar
            </button>
            <Link to="/" className="flex items-center gap-2.5 leading-none shrink-0 group">
              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_14px_2px_rgba(184,121,74,0.45)]" />
              <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none hidden sm:inline">Leveza no Digital</span>
              <span className="text-[9px] tracking-[0.24em] uppercase text-ink/50 font-semibold border border-ink/15 rounded-full px-2 py-0.5 sm:ml-1">Admin</span>
            </Link>
          </div>
          <AdminTopbarActions onLogout={logout} />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Barra lateral — cream, com pills arredondadas ao estilo da app */}
        <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-white/60 backdrop-blur-sm hidden md:flex flex-col">
          <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
            {ITEMS.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to as "/admin"}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${
                    active
                      ? "bg-terracotta text-cream font-semibold shadow-[0_10px_24px_-14px_var(--color-terracotta)]"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <Icon size={15} strokeWidth={active ? 2.1 : 1.75} />
                  {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[var(--color-border)] flex flex-col gap-1">
            <button
              onClick={() => { setAdminView("aluno"); window.location.assign("/"); }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-ink/70 hover:bg-ink/5 hover:text-ink text-left transition-colors"
            >
              <Eye size={15} strokeWidth={1.75} />
              Vista de aluno
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors"
            >
              <LogOut size={15} strokeWidth={1.75} />
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-auto">
          {/* Nav horizontal em ecrã pequeno (a barra lateral esconde-se) */}
          <nav className="md:hidden flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-[var(--color-border)] bg-white/60">
            {ITEMS.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to as "/admin"}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-colors ${active ? "bg-terracotta text-cream font-semibold" : "text-ink/70 bg-ink/5"}`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>

          {!config.serviceRole ? (
            <SetupCard
              titulo="Falta configurar a chave de serviço"
              descricao="O painel precisa da Service Role Key do Supabase para gerir contas (ver alunos, adicionar, eliminar, atribuir papéis)."
              passos={[
                "No Supabase: Settings → API → service_role → Reveal → Copy.",
                "Abre o ficheiro .env do projeto e cola depois de SUPABASE_SERVICE_ROLE_KEY=.",
                "Guarda (o servidor reinicia) e recarrega esta página.",
              ]}
              nota="⚠️ É uma chave secreta — fica só no servidor (o .env não vai para o git)."
            />
          ) : !config.schema ? (
            <SetupCard
              titulo="Falta criar as tabelas (correr o SQL)"
              descricao="A chave de serviço já está OK, mas a base de dados do projeto novo ainda está vazia — faltam as tabelas (profiles, user_roles, etc.)."
              passos={[
                "No Supabase: SQL Editor → New query.",
                "Abre scripts/setup-supabase.sql, copia tudo, cola e clica Run.",
                "Recarrega esta página.",
              ]}
              nota="Isto também te torna admin e aprovada automaticamente."
            />
          ) : (
            <div className="fade-up">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function AdminTopbarActions({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sess = readStoredSession();
  const email = sess?.user?.email ?? "";
  const nome = (sess?.user?.user_metadata?.full_name as string) || email.split("@")[0] || "Conta";
  const inicial = (nome || email || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <a
        href="/"
        className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/75 px-3.5 py-2 rounded-full border border-ink/15 bg-white/50 hover:bg-white transition-colors"
      >
        <Home size={14} /> Ir para o site
      </a>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-ink/15 bg-white/50 hover:bg-white transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-terracotta/12 text-terracotta flex items-center justify-center text-sm font-semibold">{inicial}</span>
          <span className="text-[13px] font-medium text-ink max-w-[120px] truncate hidden sm:inline">{nome}</span>
          <ChevronDown size={14} className={`text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-60 bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] p-2 z-50">
            <div className="px-3 py-2.5 border-b border-[var(--color-border)] mb-1">
              <p className="text-sm font-medium text-ink truncate">{nome}</p>
              {email && <p className="text-xs text-ink/50 truncate">{email}</p>}
            </div>
            <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors">
              <Home size={16} strokeWidth={1.75} /> Ir para o site
            </a>
            <button
              onClick={() => { setAdminView("aluno"); window.location.assign("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
            >
              <Eye size={16} strokeWidth={1.75} /> Vista de aluno
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.75} /> Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SetupCard({
  titulo,
  descricao,
  passos,
  nota,
}: {
  titulo: string;
  descricao: string;
  passos: string[];
  nota?: string;
}) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center gap-2.5 text-amber-700">
          <KeyRound size={18} />
          <h1 className="text-lg font-semibold">{titulo}</h1>
        </div>
        <p className="text-sm text-ink/70 mt-3 leading-relaxed">{descricao}</p>
        <ol className="text-sm text-ink/70 mt-4 space-y-2 list-decimal pl-5">
          {passos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
        {nota && <p className="text-xs text-ink/45 mt-4">{nota}</p>}
      </div>
    </div>
  );
}
