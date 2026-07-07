import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import {
  calcularPontos,
  tierFor,
  mesCorrente,
  contarPor,
  chaveMes,
  type MapaTarefas,
  type PostPublicado,
  type TipoTarefa,
} from "@/lib/gamificacao";

const TAREFAS_KEY = "__tarefas__";
const POSTS_KEY = "__posts__";
const PREMIOS_KEY = "__premios-mes__"; // meses vencidos por este aluno
const DOC_KEY = "leveza.doc-mestre.v1";

// ── Helpers por aluno (linha master_documents do próprio) ──
type Blob = Record<string, unknown>;

async function readBlob(supabaseAdmin: any, userId: string): Promise<Blob> {
  const { data } = await supabaseAdmin
    .from("master_documents")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  return (data?.data as Blob) ?? {};
}

async function writeBlob(supabaseAdmin: any, userId: string, patch: Blob): Promise<Blob> {
  const atual = await readBlob(supabaseAdmin, userId);
  const merged = { ...atual, ...patch };
  const { error } = await supabaseAdmin.from("master_documents").upsert(
    { user_id: userId, data: merged, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) throw error;
  return merged;
}

// Conta campos preenchidos do Documento Mestre (paridade com a lógica antiga).
function contarCamposDoc(blob: Blob): number {
  const doc = (blob[DOC_KEY] as Record<string, any>) ?? {};
  const campos = ["nome", "profissao", "oQueFaz", "comoResolve", "publico", "tomDeVoz"];
  let n = 0;
  for (const c of campos) if (typeof doc[c] === "string" && doc[c].trim()) n++;
  if (Array.isArray(doc.dores)) n += doc.dores.filter((d: any) => typeof d === "string" && d.trim()).length;
  return n;
}

// Soma dos pontos das conquistas atribuídas ao aluno.
async function pontosConquistas(supabaseAdmin: any, userId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from("mentorada_conquistas")
    .select("conquista_id, conquistas(pontos)")
    .eq("user_id", userId);
  if (!Array.isArray(data)) return 0;
  return data.reduce((s: number, r: any) => s + (r.conquistas?.pontos ?? 0), 0);
}

// Recalcula os pontos do aluno a partir do estado e grava em profiles.
async function recomputar(supabaseAdmin: any, userId: string, blob?: Blob): Promise<number> {
  const b = blob ?? (await readBlob(supabaseAdmin, userId));
  const tarefas = (b[TAREFAS_KEY] as MapaTarefas) ?? {};
  const posts = (b[POSTS_KEY] as PostPublicado[]) ?? [];
  const premios = Array.isArray(b[PREMIOS_KEY]) ? (b[PREMIOS_KEY] as string[]) : [];
  const total = calcularPontos({
    tarefas,
    posts,
    camposDocMestre: contarCamposDoc(b),
    pontosConquistas: await pontosConquistas(supabaseAdmin, userId),
    bonusVencedor: premios.length * 300,
  });
  await supabaseAdmin
    .from("profiles")
    .update({ pontos: total, tier: tierFor(total).label, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return total;
}

// ── Ler o meu progresso (tarefas + posts + pontos) ──
export const getMeuProgresso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await readBlob(supabaseAdmin, context.userId);
    const tarefas = (blob[TAREFAS_KEY] as MapaTarefas) ?? {};
    const posts = (blob[POSTS_KEY] as PostPublicado[]) ?? [];
    const pontos = await recomputar(supabaseAdmin, context.userId, blob);
    return { tarefas, posts, pontos };
  });

// ── Marcar / desmarcar tarefa ──
export const marcarTarefa = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; tipo: TipoTarefa; feito: boolean }) =>
    z
      .object({
        id: z.string().min(1).max(200),
        tipo: z.enum(["aula", "etapa", "celebrar"]),
        feito: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await readBlob(supabaseAdmin, context.userId);
    const tarefas: MapaTarefas = { ...((blob[TAREFAS_KEY] as MapaTarefas) ?? {}) };
    if (data.feito) tarefas[data.id] = { tipo: data.tipo, data: new Date().toISOString() };
    else delete tarefas[data.id];
    const novo = await writeBlob(supabaseAdmin, context.userId, { [TAREFAS_KEY]: tarefas });
    const pontos = await recomputar(supabaseAdmin, context.userId, novo);
    return { ok: true, pontos, tarefas };
  });

// ── Registar / remover post publicado ──
export const registarPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { data: string; titulo?: string; formato?: string }) =>
    z
      .object({
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        titulo: z.string().max(200).optional(),
        formato: z.string().max(60).optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await readBlob(supabaseAdmin, context.userId);
    const posts: PostPublicado[] = [...((blob[POSTS_KEY] as PostPublicado[]) ?? [])];
    const novoPost: PostPublicado = {
      id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      data: data.data,
      titulo: data.titulo,
      formato: data.formato,
    };
    posts.push(novoPost);
    const novo = await writeBlob(supabaseAdmin, context.userId, { [POSTS_KEY]: posts });
    const pontos = await recomputar(supabaseAdmin, context.userId, novo);
    return { ok: true, pontos, posts, novo: novoPost };
  });

export const removerPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blob = await readBlob(supabaseAdmin, context.userId);
    const posts = ((blob[POSTS_KEY] as PostPublicado[]) ?? []).filter((p) => p.id !== data.id);
    const novo = await writeBlob(supabaseAdmin, context.userId, { [POSTS_KEY]: posts });
    const pontos = await recomputar(supabaseAdmin, context.userId, novo);
    return { ok: true, pontos, posts };
  });

// ── Competição mensal: ranking por nº de posts no mês corrente ──
export const getRankingMes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const mes = mesCorrente(new Date());
    // Lê todos os alunos (perfis) e os respetivos posts do mês.
    const { data: docs } = await supabaseAdmin.from("master_documents").select("user_id, data");
    const { data: perfis } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, avatar_url");
    const nomePorId = new Map(
      (perfis ?? []).map((p: any) => [p.id, { nome: p.nome || "Aluno", avatar: p.avatar_url || undefined }]),
    );
    const linhas = (docs ?? [])
      .map((row: any) => {
        const posts = (row.data?.[POSTS_KEY] as PostPublicado[]) ?? [];
        const doMes = contarPor(posts, chaveMes)[mes] ?? 0;
        const info = nomePorId.get(row.user_id);
        return { userId: row.user_id, nome: info?.nome ?? "Aluno", avatar: info?.avatar, posts: doMes };
      })
      .filter((l) => l.posts > 0 && nomePorId.has(l.userId))
      .sort((a, b) => b.posts - a.posts);
    return {
      mes,
      lider: linhas[0] ?? null,
      ranking: linhas.slice(0, 20).map((l, i) => ({
        pos: i + 1,
        nome: l.nome,
        avatar: l.avatar,
        posts: l.posts,
        isMe: l.userId === context.userId,
      })),
    };
  });
