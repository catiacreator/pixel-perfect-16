import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "@/lib/access";
import { achatarEstrutura } from "@/lib/estrutura";
import { mesCorrente, chaveMes, contarPor, type PostPublicado } from "@/lib/gamificacao";
import { recomputarPontos, BONUS_KEY } from "@/lib/gamificacao.functions";
import { z } from "zod";

// A administradora principal (dona) — só ela pode adicionar/eliminar alunos e atribuir papéis.
const OWNER_EMAILS = ["catiasmgon@gmail.com"];

function emailFromContext(context: any): string {
  return String(context?.claims?.email ?? "").trim().toLowerCase();
}

/** Papéis de um utilizador (lidos via service role, ignora RLS/grants). */
async function rolesOf(supabaseAdmin: any, userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r: { role: string }) => r.role);
}

/** Pode entrar no painel: admin (por email) OU papel admin/moderador. */
async function assertAdmin(context: any) {
  const email = emailFromContext(context);
  if (isAdminEmail(email) || OWNER_EMAILS.includes(email)) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const roles = await rolesOf(supabaseAdmin, context.userId);
  if (!roles.includes("admin") && !roles.includes("moderator")) throw new Error("Forbidden");
}

/** Só a dona — ações sensíveis (adicionar/eliminar/atribuir papéis). */
async function assertOwner(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("profiles").select("email").eq("id", userId).single();
  const email = (data?.email ?? "").trim().toLowerCase();
  if (!OWNER_EMAILS.includes(email)) {
    throw new Error("Apenas a administradora principal pode fazer isto.");
  }
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Porta do painel — NÃO depende da service role (usa o email do token + papéis via RLS),
    // para o shell carregar mesmo antes de a service role estar configurada.
    const email = emailFromContext(context);
    if (isAdminEmail(email) || OWNER_EMAILS.includes(email)) {
      return { isAdmin: true, canAccess: true, isOwner: OWNER_EMAILS.includes(email) };
    }
    let canAccess = false;
    try {
      const { data: roles } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId);
      canAccess = (roles ?? []).some(
        (r: { role: string }) => r.role === "admin" || r.role === "moderator",
      );
    } catch {
      // tabela ainda não existe
    }
    return { isAdmin: canAccess, canAccess, isOwner: false };
  });

// Estado de configuração do painel (não depende da service role).
export const getAdminConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const serviceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    let schema = false;
    if (serviceRole) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("profiles").select("id").limit(1);
        schema = !error;
      } catch {
        schema = false;
      }
    }
    return { serviceRole, schema };
  });

// ---------- Métricas / Visão geral ----------
export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data, error }, { data: roles }, { data: docs }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, nome, email, tier, pontos, sequencia, ultima_atividade, created_at, approved")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("master_documents").select("user_id, data"),
    ]);
    if (error) throw error;

    // Quem já preencheu o Documento Mestre (para o botão verde/vermelho).
    const docPreenchidoSet = new Set<string>();
    for (const d of (docs ?? []) as { user_id: string; data: Record<string, unknown> }[]) {
      const doc = ((d.data?.["leveza.doc-mestre.v1"] as Record<string, unknown>) ?? {});
      const nome = String(doc.nome ?? "").trim();
      const publico = String(doc.publico ?? "").trim();
      const dores = Array.isArray(doc.dores) ? doc.dores.filter((x) => String(x ?? "").trim()).length : 0;
      if (nome && (publico || dores >= 1)) docPreenchidoSet.add(d.user_id);
    }
    // Papel "mais forte" por utilizador: admin > moderator > user.
    const rank = (r: string) => (r === "admin" ? 3 : r === "moderator" ? 2 : 1);
    const roleByUser = new Map<string, string>();
    for (const r of roles ?? []) {
      const cur = roleByUser.get(r.user_id);
      if (!cur || rank(r.role) > rank(cur)) roleByUser.set(r.user_id, r.role);
    }
    // Código de registo usado por cada aluno (guardado na linha da dona).
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const mapaCodigos = (blob["__codigo-aluno__"] as Record<string, string>) ?? {};
    return (data ?? []).map((m: { id: string }) => ({
      ...m,
      role: roleByUser.get(m.id) ?? "user",
      codigo: mapaCodigos[m.id] ?? null,
      docPreenchido: docPreenchidoSet.has(m.id),
    }));
  });

export const setApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; approved: boolean }) =>
    z.object({ userId: z.string().uuid(), approved: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
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
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Persiste em __bonus__ (sobrevive ao recomputar) em vez de escrever direto
    // em profiles.pontos — senão o próximo recálculo do aluno apagava o ajuste.
    const { data: row } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", data.userId).maybeSingle();
    const blob = ((row?.data as Record<string, unknown>) ?? {});
    const merged = { ...blob, [BONUS_KEY]: Math.trunc(Number(blob[BONUS_KEY]) || 0) + data.delta };
    const up = await supabaseAdmin.from("master_documents").upsert(
      { user_id: data.userId, data: merged, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (up.error) throw up.error;
    await supabaseAdmin.from("pontos_log").insert({
      user_id: data.userId,
      delta: data.delta,
      motivo: data.motivo,
      criado_por: context.userId,
    });
    const novoTotal = await recomputarPontos(data.userId);
    return { ok: true, novoTotal };
  });

export const updateTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; tier: string }) =>
    z.object({ userId: z.string().uuid(), tier: z.string().min(1).max(40) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ tier: data.tier }).eq("id", data.userId);
    return { ok: true };
  });

export const deleteMentorada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw error;
    return { ok: true };
  });

// Repor a palavra-passe de um aluno (só a dona). Útil quando o aluno se esquece
// e o e-mail de recuperação não é prático — a mentora define uma password e
// partilha-a com o aluno, que a pode mudar depois.
export const resetAlunoPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; password: string }) =>
    z.object({ userId: z.string().uuid(), password: z.string().min(6).max(72) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertOwner(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Adicionar aluno (só a dona). Cria a conta já confirmada; o trigger cria o perfil.
export const createMentorada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; nome: string; password: string }) =>
    z
      .object({
        email: z.string().email(),
        nome: z.string().min(1).max(120),
        password: z.string().min(6).max(72),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertOwner(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.nome },
    });
    if (error) throw new Error(error.message);
    // O trigger handle_new_user cria o perfil; garante nome + aprovação.
    if (created.user) {
      await supabaseAdmin
        .from("profiles")
        .update({ nome: data.nome, approved: true })
        .eq("id", created.user.id);
    }
    return { ok: true };
  });

// Atribuir papel (só a dona): admin | moderator | user. Substitui os papéis existentes.
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: "admin" | "moderator" | "user" }) =>
    z.object({ userId: z.string().uuid(), role: z.enum(["admin", "moderator", "user"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertOwner(context.userId);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Não pode remover o seu próprio acesso de administradora.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    // O enum em types.ts ainda não lista "moderator" (acrescentado por migração) — cast seguro.
    await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role } as any);
    // Quem tem privilégios entra já aprovado.
    if (data.role === "admin" || data.role === "moderator") {
      await supabaseAdmin.from("profiles").update({ approved: true }).eq("id", data.userId);
    }
    return { ok: true };
  });

// ---------- Ranking & Conquistas ----------
export const resetRanking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ sequencia: data.sequencia }).eq("id", data.userId);
    return { ok: true };
  });

export const listConquistas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("mentorada_conquistas")
      .upsert({ user_id: data.userId, conquista_id: data.conquistaId });
    const pontos = await recomputarPontos(data.userId);
    return { ok: true, pontos };
  });

export const revokeConquista = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; conquistaId: string }) =>
    z.object({ userId: z.string().uuid(), conquistaId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("mentorada_conquistas")
      .delete()
      .eq("user_id", data.userId)
      .eq("conquista_id", data.conquistaId);
    const pontos = await recomputarPontos(data.userId);
    return { ok: true, pontos };
  });

// ── Criar / apagar prémios (conquistas) — só admin ──
export const criarConquista = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { nome: string; emoji?: string; descricao?: string; pontos: number }) =>
    z.object({
      nome: z.string().min(1).max(80),
      emoji: z.string().max(8).optional(),
      descricao: z.string().max(300).optional(),
      pontos: z.number().int().min(0).max(100000),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const base = data.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "premio";
    const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    const { data: max } = await supabaseAdmin.from("conquistas").select("ordem").order("ordem", { ascending: false }).limit(1).maybeSingle();
    const ordem = ((max?.ordem as number) ?? 0) + 1;
    const { error } = await supabaseAdmin.from("conquistas").insert({
      slug, nome: data.nome, emoji: data.emoji || "🏆", descricao: data.descricao || "", pontos: data.pontos, ordem,
    });
    if (error) throw error;
    return { ok: true };
  });

export const apagarConquista = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // apaga também as atribuições (FK ON DELETE CASCADE trata disso)
    const { error } = await supabaseAdmin.from("conquistas").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ── Prémio geral da plataforma (visível a todos) ──
const PREMIO_GERAL_KEY = "__premio-geral__";
type PremioGeral = { titulo: string; descricao: string; emoji: string; ativo: boolean };

export const getPremioGeral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const p = (blob[PREMIO_GERAL_KEY] as Partial<PremioGeral>) ?? {};
    return {
      titulo: typeof p.titulo === "string" ? p.titulo : "",
      descricao: typeof p.descricao === "string" ? p.descricao : "",
      emoji: typeof p.emoji === "string" && p.emoji ? p.emoji : "🏆",
      ativo: p.ativo === true,
    } as PremioGeral;
  });

export const setPremioGeral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { titulo: string; descricao: string; emoji: string; ativo: boolean }) =>
    z.object({
      titulo: z.string().max(120),
      descricao: z.string().max(600),
      emoji: z.string().max(8),
      ativo: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const cfg: PremioGeral = { titulo: data.titulo.trim(), descricao: data.descricao.trim(), emoji: data.emoji.trim() || "🏆", ativo: data.ativo };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: { ...blob, [PREMIO_GERAL_KEY]: cfg }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ---------- Conteúdo dos pilares ----------
export const listPilares = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
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
    await assertAdmin(context);
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
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("etapas").delete().eq("id", data.id);
    return { ok: true };
  });

// ---------- Ranking ----------
export const listRanking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, tier, pontos, sequencia")
      .order("pontos", { ascending: false })
      .limit(50);
    return data ?? [];
  });

// ─────────── Gamificação (qualquer aluno autenticado) ───────────
// Grava os pontos do próprio aluno no perfil (para o ranking valer entre todos).
export const setMyPoints = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { pontos: number }) => z.object({ pontos: z.number().int().min(0).max(10000000) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("profiles").update({ pontos: data.pontos }).eq("id", context.userId);
    if (error) throw error;
    return { ok: true };
  });

// ─── Documento Mestre por servidor (o cliente não consegue ler/escrever aqui) ───
export const getMyMasterDoc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", context.userId)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data?.data ?? null) as any;
  });

// A dona lê o Documento Mestre de qualquer aluno (para descarregar).
export const getMasterDocDeAluno = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", data.userId)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (row?.data ?? null) as any;
  });

export const saveMyMasterDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .inputValidator((blob: any) => blob)
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Merge com o que já existe — preserva chaves que o cliente não envia
    // (ex.: a config global "__bloqueios__" guardada na linha da dona).
    const { data: existing } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", context.userId)
      .maybeSingle();
    const merged = { ...((existing?.data as Record<string, unknown>) ?? {}), ...(data ?? {}) };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: context.userId, data: merged, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ───────── Bloqueios globais ("Em breve") — geridos pela dona no painel ─────────
// Guardados na linha master_documents da dona, sob a chave "__bloqueios__".
// Lidos por QUALQUER aluno autenticado (via service role) para saber o que ocultar.
const BLOQUEIOS_KEY = "__bloqueios__";

async function ownerUserId(supabaseAdmin: any): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", OWNER_EMAILS[0])
    .maybeSingle();
  return data?.id ?? null;
}

// POST (não GET) de propósito: respostas GET podem ser cacheadas pelo
// browser/CDN em produção — o que faria os alunos verem bloqueios desatualizados.
export const getBloqueios = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) return null;
    const { data } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", uid)
      .maybeSingle();
    const blob = (data?.data as Record<string, unknown>) ?? {};
    const ids = blob[BLOQUEIOS_KEY];
    // null = nunca configurado (cliente usa os defaults); array = configurado.
    return Array.isArray(ids) ? (ids as string[]) : null;
  });

export const setBloqueios = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ids: string[] }) =>
    z.object({ ids: z.array(z.string()).max(2000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) throw new Error("Conta principal não encontrada.");
    const { data: existing } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", uid)
      .maybeSingle();
    const blob = { ...((existing?.data as Record<string, unknown>) ?? {}), [BLOQUEIOS_KEY]: data.ids };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: blob, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ── Geral ativo: interruptor mestre. Se desligado, os bloqueios "Em breve"
// globais deixam de se aplicar (só as turmas mandam). Default ligado.
const GERAL_KEY = "__geral-ativo__";

export const getGeralAtivo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) return true;
    const { data } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
    const blob = (data?.data as Record<string, unknown>) ?? {};
    return blob[GERAL_KEY] !== false; // default true
  });

export const setGeralAtivo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ativo: boolean }) => z.object({ ativo: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) throw new Error("Conta principal não encontrada.");
    const { data: existing } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
    const blob = { ...((existing?.data as Record<string, unknown>) ?? {}), [GERAL_KEY]: data.ativo };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: blob, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ── Modo de bloqueio por módulo: "em-breve" (nada a fazer) ou "bloqueado"
// (mostra o contacto da Cátia). Guardado em "__modo-bloqueio__" na conta dona.
const MODO_KEY = "__modo-bloqueio__";

export const getModoBloqueio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) return {} as Record<string, string>;
    const { data } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
    const blob = (data?.data as Record<string, unknown>) ?? {};
    const m = blob[MODO_KEY];
    return (m && typeof m === "object" ? m : {}) as Record<string, string>;
  });

export const setModoBloqueio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { modos: Record<string, string> }) =>
    // "livre" = decisão explícita de libertar um nó que nasce bloqueado por
    // defeito (ver MODO_PADRAO). Os restantes são estados de bloqueio.
    z.object({ modos: z.record(z.string(), z.enum(["livre", "em-breve", "bloqueado", "oculto"])) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = await ownerUserId(supabaseAdmin);
    if (!uid) throw new Error("Conta principal não encontrada.");
    const { data: existing } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
    const blob = { ...((existing?.data as Record<string, unknown>) ?? {}), [MODO_KEY]: data.modos };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: blob, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ───────── Códigos de acesso — a mentora cria; usados para criar conta ─────────
const CODIGOS_KEY = "__codigos__";

export const getCodigos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const c = blob[CODIGOS_KEY];
    return Array.isArray(c) ? c : [];
  });

export const setCodigos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { codigos: unknown[] }) =>
    z.object({
      codigos: z.array(z.object({
        codigo: z.string().min(1).max(60),
        ativo: z.boolean(),
        nota: z.string().max(200).optional(),
        turmaId: z.string().max(120).optional(),
      })).max(1000),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const next = { ...blob, [CODIGOS_KEY]: data.codigos };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// Validação pública (sem sessão) — usada na página de registo antes de criar conta.
export const validarCodigo = createServerFn({ method: "POST" })
  .inputValidator((d: { codigo: string }) => z.object({ codigo: z.string().min(1).max(60) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const codigos = (Array.isArray(blob[CODIGOS_KEY]) ? blob[CODIGOS_KEY] : []) as { codigo: string; ativo: boolean }[];
    const alvo = data.codigo.trim().toLowerCase();
    const valido = codigos.some((c) => c.ativo && String(c.codigo).trim().toLowerCase() === alvo);
    return { valido };
  });

// Registo público com código: valida o código (ativo), cria a conta (já confirmada)
// e, se o código tiver turma, mete o novo aluno nessa turma. Tudo no servidor.
export const registarComCodigo = createServerFn({ method: "POST" })
  .inputValidator((d: { codigo: string; email: string; nome: string; password: string }) =>
    z.object({
      codigo: z.string().min(1).max(60),
      email: z.string().email(),
      nome: z.string().min(1).max(120),
      password: z.string().min(6).max(72),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const codigos = (Array.isArray(blob[CODIGOS_KEY]) ? blob[CODIGOS_KEY] : []) as { codigo: string; ativo: boolean; turmaId?: string }[];
    const alvo = data.codigo.trim().toLowerCase();
    const codigo = codigos.find((c) => c.ativo && String(c.codigo).trim().toLowerCase() === alvo);
    if (!codigo) return { ok: false as const, erro: "codigo" };

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.nome },
    });
    if (error) return { ok: false as const, erro: error.message };
    const novoId = created.user?.id;
    if (novoId) {
      await supabaseAdmin.from("profiles").update({ nome: data.nome, approved: true }).eq("id", novoId);
      // Regista o código usado + atribui à turma do código — numa só escrita.
      const mapaCodigos = { ...((blob["__codigo-aluno__"] as Record<string, string>) ?? {}), [novoId]: codigo.codigo };
      let turmas = (Array.isArray(blob["__turmas__"]) ? blob["__turmas__"] : []) as { id: string; membros: string[] }[];
      if (codigo.turmaId) {
        turmas = turmas.map((t) =>
          t.id === codigo.turmaId ? { ...t, membros: Array.from(new Set([...(t.membros || []), novoId])) } : t,
        );
      }
      await supabaseAdmin.from("master_documents").upsert(
        { user_id: uid, data: { ...blob, ["__turmas__"]: turmas, ["__codigo-aluno__"]: mapaCodigos }, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
    }
    return { ok: true as const };
  });

// ───────── Turmas — grupos de alunos com permissões próprias ─────────
// Guardadas na linha da dona, sob "__turmas__": [{ id, nome, cor, membros[], acessos[] }].
// `acessos` = ids da ESTRUTURA que a turma PODE ver (grant; herda para os filhos).
const TURMAS_KEY = "__turmas__";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readOwnerBlob(supabaseAdmin: any): Promise<{ uid: string; blob: Record<string, unknown> }> {
  const uid = await ownerUserId(supabaseAdmin);
  if (!uid) throw new Error("Conta principal não encontrada.");
  const { data } = await supabaseAdmin.from("master_documents").select("data").eq("user_id", uid).maybeSingle();
  return { uid, blob: (data?.data as Record<string, unknown>) ?? {} };
}

export const getTurmas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const t = blob[TURMAS_KEY];
    return Array.isArray(t) ? t : [];
  });

// ───────── Papéis — permissões por nível (Aluno / Moderador) ─────────
// Admin vê sempre tudo (não guardado). Guardado em "__papeis__": { aluno, moderador }.
const PAPEIS_KEY = "__papeis__";
// Por defeito: TODOS os nós (acesso a tudo). Acesso é por nó (página/subpágina).
const PAPEIS_PADRAO: string[] = achatarEstrutura().map((n) => n.id);

export const getPapeis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const p = (blob[PAPEIS_KEY] as { aluno?: string[]; moderador?: string[] }) ?? {};
    return {
      aluno: Array.isArray(p.aluno) ? p.aluno : [...PAPEIS_PADRAO],
      moderador: Array.isArray(p.moderador) ? p.moderador : [...PAPEIS_PADRAO],
    };
  });

export const setPapeis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { aluno: string[]; moderador: string[] }) =>
    z.object({ aluno: z.array(z.string()).max(2000), moderador: z.array(z.string()).max(2000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const next = { ...blob, [PAPEIS_KEY]: { aluno: data.aluno, moderador: data.moderador } };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

export const setTurmas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { turmas: unknown[] }) =>
    z.object({
      turmas: z.array(z.object({
        id: z.string(),
        nome: z.string().max(120),
        cor: z.string().max(16).optional(),
        categoria: z.string().max(30).optional(),
        membros: z.array(z.string()).max(5000),
        acessos: z.array(z.string()).max(2000),
        modos: z.record(z.string(), z.string()).optional(),
      })).max(500),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const next = { ...blob, [TURMAS_KEY]: data.turmas };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// O aluno lê o que pode ver. Regra: Papel é a base, Turma é exceção.
//  - admin           → vê tudo (sem restrição)
//  - moderador       → permissões do papel Moderador
//  - aluno numa turma→ permissões dessa turma (sobrepõe o papel)
//  - aluno sem turma → permissões do papel Aluno (o "Iniciante" por defeito)
// POST de propósito (evita cache de GET em produção — ver getBloqueios).
export const getMinhaTurmaAcessos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roles = await rolesOf(supabaseAdmin, context.userId);
    if (roles.includes("admin")) return { restrito: false, acessos: [] as string[], categoria: null as string | null, modos: {} as Record<string, string> };

    const { blob } = await readOwnerBlob(supabaseAdmin);
    const papeis = (blob[PAPEIS_KEY] as { aluno?: string[]; moderador?: string[] }) ?? {};

    if (roles.includes("moderator")) {
      return { restrito: true, acessos: Array.isArray(papeis.moderador) ? papeis.moderador : [...PAPEIS_PADRAO], categoria: null as string | null, modos: {} as Record<string, string> };
    }

    // Aluno: turma(s) explícita(s) sobrepõem o papel. Um aluno pode estar em VÁRIAS
    // turmas → o acesso é a UNIÃO dos acessos de todas elas (a mais permissiva vence).
    const turmas = (Array.isArray(blob[TURMAS_KEY]) ? blob[TURMAS_KEY] : []) as {
      membros?: string[]; acessos?: string[]; categoria?: string; modos?: Record<string, string>;
    }[];
    const minhas = turmas.filter((t) => Array.isArray(t.membros) && t.membros.includes(context.userId));
    if (minhas.length > 0) {
      const acessos = Array.from(new Set(minhas.flatMap((t) => (Array.isArray(t.acessos) ? t.acessos : []))));
      // modos: um nó concedido por qualquer turma fica livre; para os restantes, junta
      // os modos (o "bloqueado" — que mostra contacto — vence o "em-breve").
      const modos: Record<string, string> = {};
      for (const t of minhas) for (const [id, m] of Object.entries(t.modos ?? {})) {
        if (modos[id] !== "bloqueado") modos[id] = m;
      }
      // categoria: se qualquer turma NÃO restringe os links do topo, não restringe (null).
      const categoria = minhas.every((t) => t.categoria === minhas[0].categoria) ? (minhas[0].categoria ?? null) : null;
      return { restrito: true, acessos, categoria, modos };
    }
    return { restrito: true, acessos: Array.isArray(papeis.aluno) ? papeis.aluno : [...PAPEIS_PADRAO], categoria: null as string | null, modos: {} as Record<string, string> };
  });

// ───────── Mensagens da mentora — a admin escreve; os alunos leem ─────────
// Guardadas em "__mensagens__" (array na linha da dona). Cada mensagem pode ser
// para "todas" as turmas ou dirigida a uma turma específica.
const MENSAGENS_KEY = "__mensagens__";

type MensagemRow = {
  id: string;
  titulo: string;
  corpo: string;
  turmaId: string; // "todas" ou o id de uma turma
  data: string; // ISO
  autor: string;
};

// Resolve a turma (id) do utilizador atual, se for aluno numa turma.
// Todas as turmas (ids) de que o utilizador é membro (pode ser mais que uma).
function turmasDoUtilizador(blob: Record<string, unknown>, userId: string): string[] {
  const turmas = (Array.isArray(blob[TURMAS_KEY]) ? blob[TURMAS_KEY] : []) as {
    id?: string; membros?: string[];
  }[];
  return turmas.filter((x) => Array.isArray(x.membros) && x.membros.includes(userId) && x.id).map((x) => x.id as string);
}

function ordenarMensagens(ms: MensagemRow[]): MensagemRow[] {
  return [...ms].sort((a, b) => (b.data || "").localeCompare(a.data || ""));
}

// Qualquer aluno autenticado lê as mensagens que lhe são dirigidas.
// POST de propósito (evita cache de GET em produção — ver getBloqueios).
export const getMensagens = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const todas = (Array.isArray(blob[MENSAGENS_KEY]) ? blob[MENSAGENS_KEY] : []) as MensagemRow[];
    const roles = await rolesOf(supabaseAdmin, context.userId);
    // Admin/owner recebe todas (para gerir).
    if (roles.includes("admin")) return ordenarMensagens(todas);
    const minhasTurmas = turmasDoUtilizador(blob, context.userId);
    const visiveis = todas.filter(
      (m) => m.turmaId === "todas" || minhasTurmas.includes(m.turmaId),
    );
    return ordenarMensagens(visiveis);
  });

// A admin grava a lista completa de mensagens (adiciona/edita/remove no cliente).
export const setMensagens = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { mensagens: unknown[] }) =>
    z.object({
      mensagens: z.array(z.object({
        id: z.string(),
        titulo: z.string().max(200),
        corpo: z.string().max(8000),
        turmaId: z.string().max(80),
        data: z.string().max(40),
        autor: z.string().max(120),
      })).max(1000),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const next = { ...blob, [MENSAGENS_KEY]: data.mensagens };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ───────── Competição mensal de posts (admin) ─────────
const POSTS_KEY_G = "__posts__";
const PREMIOS_KEY_G = "__premios-mes__";

// Vencedor do mês + se deve alertar a admin (a partir do dia 30).
export const getAlertaVencedor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const agora = new Date();
    const mes = mesCorrente(agora);
    const dia = agora.getDate();
    const { data: docs } = await supabaseAdmin.from("master_documents").select("user_id, data");
    const { data: perfis } = await supabaseAdmin.from("profiles").select("id, nome");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role").in("role", ["admin", "moderator"]);
    const excluir = new Set((roles ?? []).map((r: { user_id: string }) => r.user_id));
    const nomePorId = new Map((perfis ?? []).map((p: { id: string; nome: string | null }) => [p.id, p.nome || "Aluno"]));
    const linhas = (docs ?? [])
      .map((row: { user_id: string; data: Record<string, unknown> }) => {
        const posts = (row.data?.[POSTS_KEY_G] as PostPublicado[]) ?? [];
        const n = contarPor(posts, chaveMes)[mes] ?? 0;
        const premios = row.data?.[PREMIOS_KEY_G];
        const jaPremiado = Array.isArray(premios) && premios.includes(mes);
        return { userId: row.user_id, nome: nomePorId.get(row.user_id) ?? "Aluno", posts: n, jaPremiado };
      })
      .filter((l) => l.posts > 0 && nomePorId.has(l.userId) && !excluir.has(l.userId))
      .sort((a, b) => b.posts - a.posts);
    const lider = linhas[0] ?? null;
    return {
      mes,
      dia,
      alertar: dia >= 30 && !!lider && !lider.jaPremiado,
      lider,
      ranking: linhas.slice(0, 10),
    };
  });

// Premiar o vencedor do mês: marca o mês, soma +300 e regista no log.
export const premiarVencedor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; mes: string }) =>
    z.object({ userId: z.string().uuid(), mes: z.string().regex(/^\d{4}-\d{2}$/) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("master_documents")
      .select("data")
      .eq("user_id", data.userId)
      .maybeSingle();
    const blob = (row?.data as Record<string, unknown>) ?? {};
    const premios = Array.isArray(blob[PREMIOS_KEY_G]) ? (blob[PREMIOS_KEY_G] as string[]) : [];
    if (premios.includes(data.mes)) return { ok: true, jaPremiado: true };
    premios.push(data.mes);
    await supabaseAdmin.from("master_documents").upsert(
      { user_id: data.userId, data: { ...blob, [PREMIOS_KEY_G]: premios }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    // Soma +300 já (a recompute do aluno mantém o total consistente: base + prémios×300).
    const { data: prof } = await supabaseAdmin.from("profiles").select("pontos").eq("id", data.userId).maybeSingle();
    const novo = (prof?.pontos ?? 0) + 300;
    await supabaseAdmin.from("profiles").update({ pontos: novo, updated_at: new Date().toISOString() }).eq("id", data.userId);
    await supabaseAdmin.from("pontos_log").insert({
      user_id: data.userId,
      delta: 300,
      motivo: `Vencedor do mês ${data.mes} — sessão de 30 min`,
      criado_por: context.userId,
    });
    return { ok: true, novoTotal: novo };
  });

// Ranking visível a qualquer aluno autenticado (top 50 por pontos).
export const getRanking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, tier, pontos, avatar_url")
      .order("pontos", { ascending: false })
      .limit(50);
    return (data ?? []).map((r: { id: string; nome: string | null; tier: string | null; pontos: number | null; avatar_url: string | null }, i: number) => ({
      pos: i + 1,
      nome: r.nome || "Aluno",
      tier: r.tier || "Início",
      pontos: r.pontos ?? 0,
      avatar: r.avatar_url || undefined,
      isMe: r.id === context.userId,
    }));
  });

// ───────── Encontros (mentoria ao vivo) — galeria de vídeos + materiais ─────────
// Guardado em "__encontros__": Encontro[]. Ler: qualquer autenticado. Escrever: admin.
const ENCONTROS_KEY = "__encontros__";

export const getEncontros = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const e = blob[ENCONTROS_KEY];
    return Array.isArray(e) ? e : [];
  });

export const setEncontros = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { encontros: unknown[] }) =>
    z.object({
      encontros: z.array(z.object({
        id: z.string(),
        titulo: z.string().max(200),
        data: z.string().max(120).optional(),
        videoUrl: z.string().max(2000).optional(),
        descricao: z.string().max(20000).optional(),
        links: z.array(z.object({ nome: z.string().max(200), url: z.string().max(2000) })).max(50).optional(),
        ficheiros: z.array(z.object({ nome: z.string().max(300), url: z.string().max(2000), tipo: z.string().max(120).optional() })).max(50).optional(),
      })).max(300),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const next = { ...blob, [ENCONTROS_KEY]: data.encontros };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// Cria um URL assinado para o browser fazer upload direto ao Storage (evita o limite
// de ~4.5MB dos server functions da Vercel). Devolve { path, token, publicUrl }.
export const criarUploadEncontro = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { nome: string }) =>
    z.object({ nome: z.string().min(1).max(300) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safe = data.nome.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-120) || "ficheiro";
    const path = `materiais/${Date.now()}-${safe}`;
    const { data: signed, error } = await supabaseAdmin.storage.from("encontros").createSignedUploadUrl(path);
    if (error || !signed) throw error ?? new Error("Falha ao criar URL de upload.");
    const { data: pub } = supabaseAdmin.storage.from("encontros").getPublicUrl(path);
    return { path: signed.path, token: signed.token, publicUrl: pub.publicUrl };
  });

// ── Códigos de ferramentas (ex.: cupão de desconto) — editáveis pelo admin ──
// Guardado no blob da conta principal, em "__ferramentas_codigos__": { chave: codigo }.
const FERRAMENTA_CODIGOS_KEY = "__ferramentas_codigos__";

export const getFerramentaCodigo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { chave: string }) => z.object({ chave: z.string().max(80) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const mapa = (blob[FERRAMENTA_CODIGOS_KEY] as Record<string, string>) ?? {};
    return { codigo: typeof mapa[data.chave] === "string" ? mapa[data.chave] : "" };
  });

export const setFerramentaCodigo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { chave: string; codigo: string }) =>
    z.object({ chave: z.string().max(80), codigo: z.string().max(200) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const mapa = { ...((blob[FERRAMENTA_CODIGOS_KEY] as Record<string, string>) ?? {}), [data.chave]: data.codigo };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: { ...blob, [FERRAMENTA_CODIGOS_KEY]: mapa }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ───────── Cat.IA (agente no ChatGPT): link + palavra-passe, editáveis ─────────
// Guardado na conta dona sob "__cat_ia__". Lido por qualquer aluno autenticado
// (para mostrar o link e a palavra-passe onde o Cat.IA principal aparece).
const CAT_IA_KEY = "__cat_ia__";
export const CAT_IA_URL_DEFAULT = "https://chatgpt.com/g/g-6a56643a8dbc8191a122f9580a3e7edf-cat-ia";
export const CAT_IA_PASS_DEFAULT = "VIRAL26";

export const getCatIaConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const c = (blob[CAT_IA_KEY] as { url?: string; password?: string }) ?? {};
    return {
      url: typeof c.url === "string" && c.url.trim() ? c.url.trim() : CAT_IA_URL_DEFAULT,
      password: typeof c.password === "string" ? c.password : CAT_IA_PASS_DEFAULT,
    };
  });

export const setCatIaConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { url: string; password: string }) =>
    z.object({ url: z.string().max(500), password: z.string().max(120) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const cfg = { url: data.url.trim(), password: data.password.trim() };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: { ...blob, [CAT_IA_KEY]: cfg }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ── Comentários dos Encontros — mural partilhado (todos os alunos comentam) ──
// Guardado no blob da conta principal, sob "__encontros_coment__": Comentario[].
const COMENT_KEY = "__encontros_coment__";
type ComentarioBlob = { id: string; encontroId: string; userId: string; nome: string; avatar?: string; texto: string; ts: string };

export const getComentarios = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { encontroId: string }) => z.object({ encontroId: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const all = Array.isArray(blob[COMENT_KEY]) ? (blob[COMENT_KEY] as ComentarioBlob[]) : [];
    return all
      .filter((c) => c.encontroId === data.encontroId)
      .sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
  });

export const addComentario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { encontroId: string; texto: string }) =>
    z.object({ encontroId: z.string().max(120), texto: z.string().trim().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId as string;
    const { data: prof } = await supabaseAdmin.from("profiles").select("nome, avatar_url").eq("id", uid).maybeSingle();
    const { uid: ownerUid, blob } = await readOwnerBlob(supabaseAdmin);
    const all = Array.isArray(blob[COMENT_KEY]) ? [...(blob[COMENT_KEY] as ComentarioBlob[])] : [];
    const novo: ComentarioBlob = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      encontroId: data.encontroId,
      userId: uid,
      nome: prof?.nome || "Aluno",
      avatar: prof?.avatar_url || undefined,
      texto: data.texto,
      ts: new Date().toISOString(),
    };
    all.push(novo);
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: ownerUid, data: { ...blob, [COMENT_KEY]: all }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return novo;
  });

export const removerComentario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().max(120) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid: ownerUid, blob } = await readOwnerBlob(supabaseAdmin);
    const all = Array.isArray(blob[COMENT_KEY]) ? (blob[COMENT_KEY] as ComentarioBlob[]) : [];
    const alvo = all.find((c) => c.id === data.id);
    if (!alvo) return { ok: true };
    // Só o autor do comentário ou um admin/moderador pode apagar.
    if (alvo.userId !== context.userId) await assertAdmin(context);
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: ownerUid, data: { ...blob, [COMENT_KEY]: all.filter((c) => c.id !== data.id) }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// ───────── Permissões de USO dos agentes (ex.: Cat.IA) ─────────
// Quem pode usar cada agente: por turma(s) e/ou aluno(s) específico(s).
// Guardado no blob da conta principal, em "__agente_perms__": { agenteId: { turmas, alunos } }.
const AGENTE_PERMS_KEY = "__agente_perms__";
type AgentePerms = { turmas: string[]; alunos: string[] };

function lerAgentePerms(blob: Record<string, unknown>, agente: string): AgentePerms {
  const mapa = (blob[AGENTE_PERMS_KEY] as Record<string, AgentePerms>) ?? {};
  const p = mapa[agente] ?? { turmas: [], alunos: [] };
  return { turmas: Array.isArray(p.turmas) ? p.turmas : [], alunos: Array.isArray(p.alunos) ? p.alunos : [] };
}

export const getAgentePerms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { agente: string }) => z.object({ agente: z.string().max(60) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { blob } = await readOwnerBlob(supabaseAdmin);
    return lerAgentePerms(blob, data.agente);
  });

export const setAgentePerms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { agente: string; turmas: string[]; alunos: string[] }) =>
    z.object({
      agente: z.string().max(60),
      turmas: z.array(z.string()).max(500),
      alunos: z.array(z.string()).max(5000),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { uid, blob } = await readOwnerBlob(supabaseAdmin);
    const mapa = { ...((blob[AGENTE_PERMS_KEY] as Record<string, AgentePerms>) ?? {}), [data.agente]: { turmas: data.turmas, alunos: data.alunos } };
    const { error } = await supabaseAdmin.from("master_documents").upsert(
      { user_id: uid, data: { ...blob, [AGENTE_PERMS_KEY]: mapa }, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

// Qualquer autenticado verifica se pode usar o agente. Admin/moderador sempre podem.
export const podeUsarAgente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { agente: string }) => z.object({ agente: z.string().max(60) }).parse(d))
  .handler(async ({ context, data }) => {
    const email = emailFromContext(context);
    if (isAdminEmail(email) || OWNER_EMAILS.includes(email)) return { pode: true, admin: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roles = await rolesOf(supabaseAdmin, context.userId);
    if (roles.includes("admin") || roles.includes("moderator")) return { pode: true, admin: roles.includes("admin") };
    const { blob } = await readOwnerBlob(supabaseAdmin);
    const perms = lerAgentePerms(blob, data.agente);
    if (perms.alunos.includes(context.userId)) return { pode: true, admin: false };
    const turmas = (Array.isArray(blob[TURMAS_KEY]) ? blob[TURMAS_KEY] : []) as { id?: string; membros?: string[] }[];
    const minhas = new Set(turmas.filter((t) => Array.isArray(t.membros) && t.membros.includes(context.userId)).map((t) => t.id));
    return { pode: perms.turmas.some((tid) => minhas.has(tid)), admin: false };
  });
