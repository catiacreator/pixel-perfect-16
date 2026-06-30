import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail, type ModuleKey } from "@/lib/access";
import { readStoredSession } from "@/lib/session";

const ALL: ModuleKey[] = ["jornada", "academia", "redes"];

/**
 * Verifica que módulos a pessoa tem desbloqueados.
 * - Admin (mentora) → tudo desbloqueado (não fica trancada fora).
 * - Restantes → módulos comprados (tabela `module_purchases`, alimentada pelo webhook da Hotmart).
 * Degrada com segurança: sem login ou sem compras → tudo bloqueado.
 */
export function useAccess() {
  const [unlocked, setUnlocked] = useState<Set<ModuleKey>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Salvaguarda: nunca deixar o ecrã preso em "A verificar acesso…".
    const safety = setTimeout(() => { if (active) setLoading(false); }, 4000);
    (async () => {
      try {
        // Lê a sessão direto do storage (síncrono, nunca pendura) — getSession()/getUser() podem bloquear.
        const user = readStoredSession()?.user;
        if (!user) {
          if (active) { setSignedIn(false); setLoading(false); }
          return;
        }
        if (active) setSignedIn(true);

        // Admin por email — vê SEMPRE tudo, de imediato e sem tocar na BD.
        if (isAdminEmail(user.email)) {
          if (active) { setIsAdmin(true); setUnlocked(new Set(ALL)); setLoading(false); }
          return;
        }

        // Admin/moderador por papel — lê user_roles diretamente (RLS permite ler os próprios).
        try {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);
          const staff = (roles ?? []).some(
            (r) => (r.role as string) === "admin" || (r.role as string) === "moderator",
          );
          if (staff) {
            if (active) { setIsAdmin(true); setUnlocked(new Set(ALL)); setLoading(false); }
            return;
          }
        } catch {
          // tabela ainda não existe → segue para compras
        }

        // Compras por módulo (webhook da Hotmart preenche esta tabela).
        try {
          const { data: rows } = await (supabase as any)
            .from("module_purchases")
            .select("module_key")
            .eq("status", "active")
            .ilike("email", user.email ?? "");
          if (active) {
            setUnlocked(new Set((rows ?? []).map((r: { module_key: ModuleKey }) => r.module_key)));
          }
        } catch {
          // tabela ainda não existe / erro → tudo bloqueado
        }
      } finally {
        clearTimeout(safety);
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; clearTimeout(safety); };
  }, []);

  // Produto único: ter QUALQUER compra ativa desbloqueia TODOS os módulos.
  const hasAny = isAdmin || unlocked.size > 0;
  const has = (_k: ModuleKey) => hasAny;
  return { loading, has, hasAny, isAdmin, signedIn };
}
