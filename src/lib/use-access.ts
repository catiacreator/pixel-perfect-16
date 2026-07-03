import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail, type ModuleKey } from "@/lib/access";
import { readStoredSession } from "@/lib/session";

/**
 * Acesso à plataforma.
 * Modelo: acesso é gerido pela mentora (painel admin adiciona as alunas).
 * - Com login (conta criada pela mentora) → acesso a TUDO.
 * - Sem login → convidado a entrar.
 * - `isAdmin` marca quem é admin/moderador (por email ou papel na BD).
 */
export function useAccess() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const safety = setTimeout(() => { if (active) setLoading(false); }, 4000);
    (async () => {
      try {
        // Lê a sessão direto do storage (síncrono, nunca pendura).
        const user = readStoredSession()?.user;
        if (!user) {
          if (active) { setSignedIn(false); setLoading(false); }
          return;
        }
        if (active) setSignedIn(true);

        // Admin por email — imediato, sem tocar na BD.
        if (isAdminEmail(user.email)) {
          if (active) { setIsAdmin(true); setLoading(false); }
          return;
        }

        // Admin/moderador por papel (lê os próprios papéis via RLS).
        try {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);
          const staff = (roles ?? []).some(
            (r) => (r.role as string) === "admin" || (r.role as string) === "moderator",
          );
          if (active && staff) setIsAdmin(true);
        } catch {
          // tabela ainda não existe → segue (continua com acesso de aluna)
        }
      } finally {
        clearTimeout(safety);
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; clearTimeout(safety); };
  }, []);

  // Com login → acesso total (a mentora controla quem tem conta).
  const has = (_k: ModuleKey) => signedIn;
  const hasAny = signedIn;
  return { loading, has, hasAny, isAdmin, signedIn };
}
