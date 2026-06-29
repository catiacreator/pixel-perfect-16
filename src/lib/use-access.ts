import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail, type ModuleKey } from "@/lib/access";

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
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (active) { setSignedIn(false); setLoading(false); }
          return;
        }
        if (active) setSignedIn(true);

        // Admin por email — vê SEMPRE tudo (não depende do papel na BD)
        if (isAdminEmail(user.email)) {
          if (active) { setIsAdmin(true); setUnlocked(new Set(ALL)); setLoading(false); }
          return;
        }

        // Admin por papel na base de dados
        const { data: adm } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (adm) {
          if (active) { setIsAdmin(true); setUnlocked(new Set(ALL)); setLoading(false); }
          return;
        }

        // Compras por módulo (webhook da Hotmart preenche esta tabela).
        // Procura pelo email do utilizador (a compra fica ligada ao email do comprador).
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
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const has = (k: ModuleKey) => isAdmin || unlocked.has(k);
  return { loading, has, isAdmin, signedIn };
}
