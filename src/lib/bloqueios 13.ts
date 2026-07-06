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

const EVENT = "leveza:bloqueios";
let cacheGlobal: Set<string> | null = null;
let cacheTurma: { restrito: boolean; grants: Set<string> } | null = null;
let loading = false;

// mapa id -> ids dos antecessores (para propagar bloqueio/grant aos filhos)
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

async function ensureLoaded() {
  if ((cacheGlobal && cacheTurma) || loading || typeof window === "undefined") return;
  loading = true;
  try {
    const [ids, turma] = await Promise.all([
      getBloqueios().catch(() => null),
      getMinhaTurmaAcessos().catch(() => ({ restrito: false, acessos: [] as string[] })),
    ]);
    cacheGlobal = new Set(ids ?? BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: !!turma?.restrito, grants: new Set(turma?.acessos ?? []) };
  } catch {
    cacheGlobal = new Set(BLOQUEIOS_PADRAO);
    cacheTurma = { restrito: false, grants: new Set() };
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
    return () => window.removeEventListener(EVENT, on);
  }, []);

  // Enquanto não carrega, usa os defaults para não "piscar" conteúdo bloqueado.
  const global = cacheGlobal ?? new Set(BLOQUEIOS_PADRAO);
  const turma = cacheTurma ?? { restrito: false, grants: new Set<string>() };

  const antep = (id: string) => ANCESTRAIS[id] ?? [];
  const emBreve = (id: string) => global.has(id) || antep(id).some((a) => global.has(a));
  const turmaConcede = (id: string) => turma.grants.has(id) || antep(id).some((a) => turma.grants.has(a));

  // Bloqueado para o aluno: "Em breve" global OU (restrito por turma e sem grant).
  const isBloqueado = (id: string) => emBreve(id) || (turma.restrito && !turmaConcede(id));

  return { carregado: !!cacheGlobal, isBloqueado, isBloqueadoRaw: (id: string) => global.has(id), ids: [...global] };
}

// Guarda a nova lista de bloqueios globais (admin) e atualiza a cache local.
export async function guardarBloqueios(ids: string[]) {
  await setBloqueios({ data: { ids } });
  cacheGlobal = new Set(ids);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}
