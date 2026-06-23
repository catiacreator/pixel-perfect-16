import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Users, Trophy, FileText, LogOut, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const ITEMS: NavItem[] = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/mentoradas", label: "Mentoradas", icon: Users },
  { to: "/admin/ranking", label: "Ranking", icon: Trophy },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
];

export function AdminShell() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const { data } = useSuspenseQuery({
    queryKey: ["admin-check"],
    queryFn: () => check(),
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
      <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-cream-warm flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
            <span className="text-[14px] font-semibold tracking-tight">Admin</span>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-ink/40 mt-1">Leveza no Digital</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {ITEMS.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-ink/70 hover:bg-ink/5"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            Voltar ao app
          </Link>
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
        <Outlet />
      </main>
    </div>
  );
}
