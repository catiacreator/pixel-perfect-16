// ─────────────────────────────────────────────────────────────────────────────
// PLANO LEVEZA — limite de utilizações.
//
// Gerar um plano de 90 dias é pesado para quem o corre (é a IA da própria
// aluna a escrever centenas de peças), por isso limita-se a 2 por mês.
//
// A contagem vive na linha master_documents da própria aluna, sob
// "__plano-leveza__": { "2026-07": 2 }. Fica no servidor de propósito — no
// localStorage bastava limpar o browser para contornar.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const USOS_KEY = "__plano-leveza__";
export const LIMITE_MENSAL = 2;

/** "2026-07" — o mês a que a contagem diz respeito. */
function mesAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function lerBlob(supabaseAdmin: any, userId: string): Promise<Record<string, unknown>> {
  const { data } = await supabaseAdmin
    .from("master_documents")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  return (data?.data as Record<string, unknown>) ?? {};
}

function contarNoMes(blob: Record<string, unknown>): number {
  const mapa = (blob[USOS_KEY] as Record<string, number>) ?? {};
  return Number(mapa[mesAtual()] ?? 0);
}

export const getUsosPlanoLeveza = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await lerBlob(supabaseAdmin, context.userId);
    const usados = contarNoMes(blob);
    return { usados, limite: LIMITE_MENSAL, restantes: Math.max(0, LIMITE_MENSAL - usados), mes: mesAtual() };
  });

/**
 * Regista mais uma utilização. Só deve ser chamado quando o prompt é mesmo
 * entregue à aluna — é aí que o custo existe.
 */
export const registarUsoPlanoLeveza = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await lerBlob(supabaseAdmin, context.userId);
    const usados = contarNoMes(blob);
    if (usados >= LIMITE_MENSAL) {
      throw new Error(
        `Já usaste os ${LIMITE_MENSAL} planos deste mês. O contador reinicia no dia 1.`,
      );
    }

    const mapa = { ...((blob[USOS_KEY] as Record<string, number>) ?? {}), [mesAtual()]: usados + 1 };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      {
        user_id: context.userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { ...blob, [USOS_KEY]: mapa } as any,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;

    const novoTotal = usados + 1;
    return { usados: novoTotal, limite: LIMITE_MENSAL, restantes: Math.max(0, LIMITE_MENSAL - novoTotal) };
  });
