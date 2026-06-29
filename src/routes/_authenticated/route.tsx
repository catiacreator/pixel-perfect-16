import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail } from "@/lib/access";
import { readStoredSession } from "@/lib/session";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Lê a sessão do storage (síncrono) — getUser() faz round-trip e pode pendurar.
    const user = readStoredSession()?.user;
    if (!user) {
      throw redirect({ to: "/auth" });
    }

    // Admins (por email) entram sempre — mesmo sem perfil/esquema na BD.
    if (isAdminEmail(user.email)) {
      return { user };
    }

    // Verifica aprovação. Se não der para verificar (tabela ainda não existe),
    // não tranca em /pending — degrada com segurança.
    let aprovado = true;
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", user.id)
        .maybeSingle();
      if (!error && profile) aprovado = !!profile.approved;
    } catch {
      // esquema ainda não existe → deixa passar
    }
    if (!aprovado) {
      throw redirect({ to: "/pending" });
    }
    return { user };
  },
  component: () => <Outlet />,
});
