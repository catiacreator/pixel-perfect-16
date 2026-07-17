// Gate de conteúdo para os alunos. Combina DUAS regras:
//  1) Bloqueios globais "Em breve" (geridos em /admin/estrutura) — escondem de todos.
//  2) Turma do aluno (gerida em /admin/turmas) — se o aluno pertence a uma turma,
//     só vê o que essa turma tem permissão (grant). Sem turma → sem restrição.
//
// Um nó fica bloqueado se ele próprio OU um antecessor estiver "Em breve", ou se
// o aluno estiver restrito por turma e nem o nó nem um antecessor for concedido.
// Combina-se sempre com useBloqueadoParaAlunos(): o admin (vista admin) vê tudo.

import { useEffect, useState } from "react";
import { getBloqueios, setBloqueios, getMinhaTurmaAcessos, getModoBloqueio, getGeralAtivo } from "@/lib/admin.functions";
import { ESTRUTURA, BLOQUEIOS_PADRAO, MODO_PADRAO, type Nodo } from "@/lib/estrutura";
import { getPreviewTurma } from "@/lib/admin-view";

const EVENT = "leveza:bloqueios";
let cacheGlobal: Set<string> | null = null;
let cacheTurma: { restrito: boolean; grants: Set<string>; categoria: string | null; modos: Record<string, string> } | null = null;
let cacheModo: Record<string, string> = {};
let cacheGeralAtivo = true;
let loading = false;

// mapa id -> ids dos antecessores (para propagar o "Em breve" aos filhos)
const ANCESTRAIS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  const walk = (ns: Nodo[], parents: string[]) => {
    for (const n of ns) {
      map[n.id] = parents;
      if (n.filhos) walk(n.filhos, [...parents, n.id]);
    }
  };
  walk(ESTRUTURA, []);
  return map;
})();

// mapa id -> ids dos descendentes (para o acesso por turma/papel, escolhido
// página a página: um nó é concedido se ele próprio OU algo dentro dele o for).
const DESCENDENTES: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  const colher = (n: Nodo): string[] => {
    const ids: string[] = [];
    for (const f of n.filhos ?? []) { ids.push(f.id, ...colher(f)); }
    return ids;
  };
  for (const n of ESTRUTURA) {
    map[n.id] = colher(n);
    for (const d of achatarNode(n)) map[d.id] = colher(d);
  }
  return map;
})();

function achatarNode(n: Nodo): Nodo[] {
  const out: Nodo[] = [];
  const walk = (x: Nodo) => { out.push(x); (x.filhos ?? []).forEach(walk); };
  walk(n);
  return out;
}

async function ensureLoaded() {
  if ((cacheGlobal && cacheTurma) || loading || typeof window === "undefined") return;
  loading = true;
  try {
    const [ids, turma, modos, geral] = await Promise.all([
      getBloqueios().catch(() => null),
      getMinhaTurmaAcessos().catch(() => ({ restrito: false, acessos: [] as string[], categoria: null as string | null })),
      getModoBloqueio().catch(() => ({} as Record<string, string>)),
      getGeralAtivo().catch(() => true),
    ]);
    cacheGlobal = new Set(ids ?? BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: !!turma?.restrito, grants: new Set(turma?.acessos ?? []), categoria: (turma as { categoria?: string | null })?.categoria ?? null, modos: (turma as { modos?: Record<string, string> })?.modos ?? {} };
    cacheModo = modos ?? {};
    cacheGeralAtivo = geral !== false;
  } catch {
    cacheGlobal = new Set(BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: false, grants: new Set(), categoria: null, modos: {} };
  } finally {
    loading = false;
    window.dispatchEvent(new Event(EVENT));
  }
}

export function useBloqueios() {
  const [, force] = useState(0);
  useEffect(() => {
    void ensureLoaded();
    const on = () => force((n) => n + 1);
    window.addEventListener(EVENT, on);
    window.addEventListener("leveza:preview-turma", on);
    return () => { window.removeEventListener(EVENT, on); window.removeEventListener("leveza:preview-turma", on); };
  }, []);

  // Enquanto não carrega, usa os defaults para não "piscar" conteúdo bloqueado.
  const global = cacheGlobal ?? new Set(BLOQUEIOS_PADRAO);
  // Se a admin está a pré-visualizar uma turma específica, usa os acessos dela.
  const preview = getPreviewTurma();
  const turma = preview
    ? { restrito: true, grants: new Set(preview.acessos), categoria: (preview as { categoria?: string | null }).categoria ?? null, modos: (preview as { modos?: Record<string, string> }).modos ?? {} }
    : (cacheTurma ?? { restrito: false, grants: new Set<string>(), categoria: null, modos: {} as Record<string, string> });

  const antep = (id: string) => ANCESTRAIS[id] ?? [];
  const desc = (id: string) => DESCENDENTES[id] ?? [];
  // Se o Geral estiver desligado, os bloqueios "Em breve" globais não se aplicam.
  const emBreve = (id: string) => cacheGeralAtivo && (global.has(id) || antep(id).some((a) => global.has(a)));
  // Concedido se o próprio nó OU algum descendente estiver concedido (permite
  // escolher página a página; um módulo fica acessível se tiver alguma página ligada).
  const turmaConcede = (id: string) => turma.grants.has(id) || desc(id).some((d) => turma.grants.has(d));
  const moduloDe = (id: string) => antep(id)[0] ?? id;

  // Decisão explícita da admin sobre o nó: está na lista global "Em breve" OU tem
  // um modo guardado (o próprio ou o do módulo). Sem qualquer decisão, aplica-se o
  // MODO_PADRAO — é o que garante que um produto NOVO nasce só-admin (oculto),
  // mesmo que já exista uma lista de bloqueios guardada que não o mencione.
  const temDecisao = (id: string) =>
    global.has(id) || cacheModo[id] != null || cacheModo[moduloDe(id)] != null;
  const padraoBloqueado = (id: string) => {
    const m = MODO_PADRAO[id] ?? MODO_PADRAO[moduloDe(id)];
    return !!m && m !== "livre" && !temDecisao(id);
  };

  // Decisão explícita FORTE da admin: pôr um módulo em "oculto" ou "bloqueado" é
  // uma escolha por nó que tem de valer sempre — mesmo com o "Geral" desligado ou
  // sem o nó na lista global. (Sem isto, o "oculto" guardava mas não se aplicava.)
  const modoForte = (id: string) => {
    const m = turma.modos?.[id] ?? cacheModo[id] ?? cacheModo[moduloDe(id)];
    return m === "oculto" || m === "bloqueado";
  };

  // Bloqueado para o aluno. Ordem de precedência (do mais específico ao default):
  //  1) Modo definido PARA A TURMA neste nó (a admin decidiu para esta turma) → vence.
  //  2) "Em breve" global (lista) = porta de lançamento → PREDOMINA mesmo sobre grants.
  //  3) Turma restrita: um grant explícito ao nó MOSTRA-o, vencendo o oculto/bloqueado
  //     e o default (MODO_PADRAO) do Geral. É o que permite libertar uma ferramenta
  //     para turmas específicas sem a tirar do oculto para as outras.
  //  4) Contexto sem turma restrita (ex.: pré-visualização/aberto): defaults do Geral.
  const isBloqueado = (id: string) => {
    const tm = turma.modos?.[id];
    if (tm === "oculto" || tm === "bloqueado" || tm === "em-breve") return true;
    if (tm === "livre") return false;
    if (emBreve(id)) return true;
    if (turma.restrito) return !turmaConcede(id);
    return modoForte(id) || padraoBloqueado(id);
  };
  const norm = (v?: string): "em-breve" | "bloqueado" | "oculto" =>
    v === "bloqueado" ? "bloqueado" : v === "oculto" ? "oculto" : "em-breve";
  const modoBloqueio = (id: string): "em-breve" | "bloqueado" | "oculto" => {
    const t = turma.modos?.[id];
    if (t === "bloqueado" || t === "em-breve" || t === "oculto") return t;
    return norm(cacheModo[id] ?? cacheModo[moduloDe(id)] ?? MODO_PADRAO[id] ?? MODO_PADRAO[moduloDe(id)]);
  };

  return { carregado: !!cacheGlobal, isBloqueado, isBloqueadoRaw: (id: string) => global.has(id), ids: [...global], categoriaTurma: turma.categoria ?? null, modoBloqueio };
}

// Guarda a nova lista de bloqueios globais (admin) e atualiza a cache local.
export async function guardarBloqueios(ids: string[]) {
  await setBloqueios({ data: { ids } });
  cacheGlobal = new Set(ids);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}
