import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Users, Trophy, FileText, LogOut, Eye, KeyRound, KeySquare, Home, ChevronDown, Contact } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getAdminConfig } from "@/lib/admin.functions";
import { setAdminView } from "@/lib/admin-view";
import { readStoredSession } from "@/lib/session";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const ITEMS: NavItem[] = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/mentoradas", label: "Alunos", icon: Users },
  { to: "/admin/estudio", label: "Estúdio Creator", icon: Contact },
  { to: "/admin/acessos", label: "Acessos", icon: KeySquare },
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
    <div className="min-h-screen flex bg-cream text-ink font-display">
      <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
            <span className="text-[14px] font-semibold tracking-tight">Admin</span>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-ink/40 mt-1">Cátia Creator</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {ITEMS.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to as "/admin"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${
                  active ? "bg-ink text-cream" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <Icon size={15} strokeWidth={1.75} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)] flex flex-col gap-1">
          <button
            onClick={() => { setAdminView("aluno"); window.location.assign("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-ink/70 hover:bg-ink/5 text-left"
          >
            <Eye size={15} strokeWidth={1.75} />
            Vista de aluno
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-ink/70 hover:bg-ink/5"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <AdminTopbar onLogout={logout} />
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
          <Outlet />
        )}
      </main>
    </div>
  );
}

function AdminTopbar({ onLogout }: { onLogout: () => void }) {
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
    <header className="sticky top-0 z-20 flex items-center justify-end gap-2 px-6 py-3 border-b border-[var(--color-border)] bg-white/85 backdrop-blur-sm">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/70 px-3 py-2 rounded-full border border-[var(--color-border)] hover:bg-ink/5 transition-colors"
      >
        <Home size={14} /> Ir para o site
      </a>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[var(--color-border)] hover:bg-ink/5 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-semibold">{inicial}</span>
          <span className="text-[13px] font-medium text-ink max-w-[120px] truncate">{nome}</span>
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
    </header>
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
