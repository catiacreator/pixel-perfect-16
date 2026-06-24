import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error("Falha ao validar permissão");
  if (!data) throw new Error("Forbidden");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

// ---------- Métricas / Visão geral ----------
export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const seteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const [{ count: totalMentoradas }, { data: pontosMes }, { count: ativas7d }, { data: top5 }, { data: atividade }] =
      await Promise.all([
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("pontos_log").select("delta").gte("created_at", inicioMes),
        supabaseAdmin
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("ultima_atividade", seteDias),
        supabaseAdmin
          .from("profiles")
          .select("id, nome, tier, pontos")
          .order("pontos", { ascending: false })
          .limit(5),
        supabaseAdmin
          .from("pontos_log")
          .select("id, delta, motivo, created_at, user_id, profiles:user_id(nome)")
          .order("created_at", { ascending: false })
          .limit(15),
      ]);

    const pontosDistribuidos = (pontosMes ?? []).reduce(
      (acc: number, r: { delta: number }) => acc + r.delta,
      0,
    );

    return {
      totalMentoradas: totalMentoradas ?? 0,
      pontosDistribuidos,
      ativas7d: ativas7d ?? 0,
      top5: top5 ?? [],
      atividade: atividade ?? [],
    };
  });

// ---------- Mentoradas ----------
export const listMentoradas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, email, tier, pontos, sequencia, ultima_atividade, created_at, approved")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const setApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; approved: boolean }) =>
    z.object({ userId: z.string().uuid(), approved: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ approved: data.approved })
      .eq("id", data.userId);
    if (error) throw error;
    return { ok: true };
  });

export const getMentorada = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: perfil }, { data: log }, { data: conquistas }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", data.id).single(),
      supabaseAdmin
        .from("pontos_log")
        .select("*")
        .eq("user_id", data.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("mentorada_conquistas")
        .select("id, desbloqueada_em, conquista:conquista_id(id, nome, emoji, descricao, pontos)")
        .eq("user_id", data.id),
    ]);
    return { perfil, log: log ?? [], conquistas: conquistas ?? [] };
  });

export const adjustPoints = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; delta: number; motivo: string }) =>
    z
      .object({
        userId: z.string().uuid(),
        delta: z.number().int(),
        motivo: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("pontos")
      .eq("id", data.userId)
      .single();
    const novoTotal = Math.max(0, (profile?.pontos ?? 0) + data.delta);

    await supabaseAdmin.from("profiles").update({ pontos: novoTotal }).eq("id", data.userId);
    await supabaseAdmin.from("pontos_log").insert({
      user_id: data.userId,
      delta: data.delta,
      motivo: data.motivo,
      criado_por: context.userId,
    });
    return { ok: true, novoTotal };
  });

export const updateTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; tier: string }) =>
    z.object({ userId: z.string().uuid(), tier: z.string().min(1).max(40) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ tier: data.tier }).eq("id", data.userId);
    return { ok: true };
  });

export const deleteMentorada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Ranking & Conquistas ----------
export const resetRanking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ pontos: 0, sequencia: 0 }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("pontos_log").insert({
      user_id: context.userId,
      delta: 0,
      motivo: "Reset de ranking",
      criado_por: context.userId,
    });
    return { ok: true };
  });

export const updateSequencia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; sequencia: number }) =>
    z.object({ userId: z.string().uuid(), sequencia: z.number().int().min(0) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ sequencia: data.sequencia }).eq("id", data.userId);
    return { ok: true };
  });

export const listConquistas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("conquistas").select("*").order("ordem");
    return data ?? [];
  });

export const grantConquista = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; conquistaId: string }) =>
    z.object({ userId: z.string().uuid(), conquistaId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("mentorada_conquistas")
      .upsert({ user_id: data.userId, conquista_id: data.conquistaId });
    return { ok: true };
  });

export const revokeConquista = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; conquistaId: string }) =>
    z.object({ userId: z.string().uuid(), conquistaId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("mentorada_conquistas")
      .delete()
      .eq("user_id", data.userId)
      .eq("conquista_id", data.conquistaId);
    return { ok: true };
  });

// ---------- Conteúdo dos pilares ----------
export const listPilares = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: pilares } = await supabaseAdmin.from("pilares").select("*").order("ordem");
    const { data: etapas } = await supabaseAdmin.from("etapas").select("*").order("ordem");
    return { pilares: pilares ?? [], etapas: etapas ?? [] };
  });

export const upsertPilar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { id?: string; slug: string; titulo: string; descricao?: string; ordem: number }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          slug: z.string().min(1),
          titulo: z.string().min(1),
          descricao: z.string().optional(),
          ordem: z.number().int(),
        })
        .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      await supabaseAdmin.from("pilares").update(data).eq("id", data.id);
    } else {
      await supabaseAdmin.from("pilares").insert(data);
    }
    return { ok: true };
  });

export const upsertEtapa = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      id?: string;
      pilar_id: string;
      slug: string;
      titulo: string;
      descricao?: string;
      video_url?: string;
      ordem: number;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          pilar_id: z.string().uuid(),
          slug: z.string().min(1),
          titulo: z.string().min(1),
          descricao: z.string().optional(),
          video_url: z.string().optional(),
          ordem: z.number().int(),
        })
        .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      await supabaseAdmin.from("etapas").update(data).eq("id", data.id);
    } else {
      await supabaseAdmin.from("etapas").insert(data);
    }
    return { ok: true };
  });

export const deleteEtapa = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("etapas").delete().eq("id", data.id);
    return { ok: true };
  });

// ---------- Ranking ----------
export const listRanking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, tier, pontos, sequencia")
      .order("pontos", { ascending: false })
      .limit(50);
    return data ?? [];
  });
