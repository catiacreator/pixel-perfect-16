// Gate de conteúdo para os alunos. Combina DUAS regras:
//  1) Bloqueios globais "Em breve" (geridos em /admin/estrutura) — escondem de todos.
//  2) Turma do aluno (gerida em /admin/turmas) — se o aluno pertence a uma turma,
//     só vê o que essa turma tem permissão (grant). Sem turma → sem restrição.
//
// Um nó fica bloqueado se ele próprio OU um antecessor estiver "Em breve", ou se
// o aluno estiver restrito por turma e nem o nó nem um antecessor for concedido.
// Combina-se sempre com useBloqueadoParaAlunos(): o admin (vista admin) vê tudo.

import { useEffect, useState } from "react";
import { getBloqueios, setBloqueios, getMinhaTurmaAcessos } from "@/lib/admin.functions";
import { ESTRUTURA, BLOQUEIOS_PADRAO, type Nodo } from "@/lib/estrutura";
import { getPreviewTurma } from "@/lib/admin-view";

const EVENT = "leveza:bloqueios";
let cacheGlobal: Set<string> | null = null;
let cacheTurma: { restrito: boolean; grants: Set<string>; categoria: string | null } | null = null;
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
    const [ids, turma] = await Promise.all([
      getBloqueios().catch(() => null),
      getMinhaTurmaAcessos().catch(() => ({ restrito: false, acessos: [] as string[], categoria: null as string | null })),
    ]);
    cacheGlobal = new Set(ids ?? BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: !!turma?.restrito, grants: new Set(turma?.acessos ?? []), categoria: (turma as { categoria?: string | null })?.categoria ?? null };
  } catch {
    cacheGlobal = new Set(BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: false, grants: new Set(), categoria: null };
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
    ? { restrito: true, grants: new Set(preview.acessos), categoria: (preview as { categoria?: string | null }).categoria ?? null }
    : (cacheTurma ?? { restrito: false, grants: new Set<string>(), categoria: null });

  const antep = (id: string) => ANCESTRAIS[id] ?? [];
  const desc = (id: string) => DESCENDENTES[id] ?? [];
  const emBreve = (id: string) => global.has(id) || antep(id).some((a) => global.has(a));
  // Concedido se o próprio nó OU algum descendente estiver concedido (permite
  // escolher página a página; um módulo fica acessível se tiver alguma página ligada).
  const turmaConcede = (id: string) => turma.grants.has(id) || desc(id).some((d) => turma.grants.has(d));

  // Bloqueado para o aluno: "Em breve" global OU (restrito por turma e sem grant).
  const isBloqueado = (id: string) => emBreve(id) || (turma.restrito && !turmaConcede(id));

  return { carregado: !!cacheGlobal, isBloqueado, isBloqueadoRaw: (id: string) => global.has(id), ids: [...global], categoriaTurma: turma.categoria ?? null };
}

// Guarda a nova lista de bloqueios globais (admin) e atualiza a cache local.
export async function guardarBloqueios(ids: string[]) {
  await setBloqueios({ data: { ids } });
  cacheGlobal = new Set(ids);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}
