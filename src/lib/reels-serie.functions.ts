import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "@/lib/access";

// Limite de séries de Reels geradas por aluno, por mês. Guardado na própria linha
// de master_documents do aluno, em "__reels_serie_uso__": { "YYYY-MM": n }.
export const LIMITE_SERIES_MES = 5;
const KEY = "__reels_serie_uso__";

function mesAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function emailDe(ctx: any): string {
  return String(ctx?.claims?.email ?? "").trim().toLowerCase();
}

async function lerUso(uid: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
  const blob = (data?.data as Record<string, unknown>) ?? {};
  const mapa = (blob[KEY] as Record<string, number>) ?? {};
  return { supabaseAdmin, blob, mapa };
}

export const getUsoReelsSerie = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isAdminEmail(emailDe(context))) {
      return { usados: 0, limite: LIMITE_SERIES_MES, restantes: 999, ilimitado: true };
    }
    const { mapa } = await lerUso(context.userId as string);
    const usados = mapa[mesAtual()] ?? 0;
    return { usados, limite: LIMITE_SERIES_MES, restantes: Math.max(0, LIMITE_SERIES_MES - usados), ilimitado: false };
  });

// Regista +1 série no mês corrente (chamar só depois de gerar uma série NOVA, não
// nas continuações). Devolve ok:false se já não há saldo.
export const consumirReelsSerie = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (isAdminEmail(emailDe(context))) {
      return { ok: true, usados: 0, restantes: 999, limite: LIMITE_SERIES_MES, ilimitado: true };
    }
    const uid = context.userId as string;
    const { supabaseAdmin, blob, mapa } = await lerUso(uid);
    const mes = mesAtual();
    const usados = mapa[mes] ?? 0;
    if (usados >= LIMITE_SERIES_MES) {
      return { ok: false, usados, restantes: 0, limite: LIMITE_SERIES_MES, ilimitado: false };
    }
    const next = { ...blob, [KEY]: { ...mapa, [mes]: usados + 1 } };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true, usados: usados + 1, restantes: Math.max(0, LIMITE_SERIES_MES - (usados + 1)), limite: LIMITE_SERIES_MES, ilimitado: false };
  });
