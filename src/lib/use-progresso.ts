// Hook cliente do progresso/gamificação do próprio aluno.
// Carrega uma vez do servidor, mantém cache de módulo e sincroniza componentes
// por evento (mesmo padrão do useBloqueios). Atualizações otimistas.

import { useEffect, useState } from "react";
import {
  getMeuProgresso,
  marcarTarefa,
  registarPost,
  removerPost,
} from "@/lib/gamificacao.functions";
import type { MapaTarefas, PostPublicado, TipoTarefa } from "@/lib/gamificacao";

const EVENT = "leveza:progresso";

type Estado = { tarefas: MapaTarefas; posts: PostPublicado[]; pontos: number };
let cache: Estado | null = null;
let loading = false;

const VAZIO: Estado = { tarefas: {}, posts: [], pontos: 0 };

function emitir() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

async function ensureLoaded() {
  if (cache || loading || typeof window === "undefined") return;
  loading = true;
  try {
    cache = (await getMeuProgresso()) as Estado;
  } catch {
    cache = { ...VAZIO };
  } finally {
    loading = false;
    emitir();
  }
}

export function useProgresso() {
  const [, force] = useState(0);
  useEffect(() => {
    void ensureLoaded();
    const on = () => force((n) => n + 1);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  const estado = cache ?? VAZIO;

  const isFeita = (id: string) => !!estado.tarefas[id];

  const marcar = async (id: string, tipo: TipoTarefa, feito: boolean) => {
    const anterior = cache;
    // otimista
    const tarefas: MapaTarefas = { ...(cache?.tarefas ?? {}) };
    if (feito) tarefas[id] = { tipo, data: new Date().toISOString() };
    else delete tarefas[id];
    cache = { ...(cache ?? VAZIO), tarefas };
    emitir();
    try {
      const res = await marcarTarefa({ data: { id, tipo, feito } });
      cache = { tarefas: res.tarefas as MapaTarefas, posts: cache?.posts ?? [], pontos: res.pontos };
    } catch {
      cache = anterior; // reverte
    }
    emitir();
  };

  const registar = async (dataYMD: string, titulo?: string, formato?: string): Promise<string | undefined> => {
    try {
      const res = await registarPost({ data: { data: dataYMD, titulo, formato } });
      cache = { tarefas: cache?.tarefas ?? {}, posts: res.posts as PostPublicado[], pontos: res.pontos };
      emitir();
      return (res as { novo?: { id: string } }).novo?.id;
    } catch {
      return undefined;
    }
  };

  const remover = async (id: string) => {
    try {
      const res = await removerPost({ data: { id } });
      cache = { tarefas: cache?.tarefas ?? {}, posts: res.posts as PostPublicado[], pontos: res.pontos };
      emitir();
    } catch {
      /* ignora */
    }
  };

  return {
    carregado: !!cache,
    tarefas: estado.tarefas,
    posts: estado.posts,
    pontos: estado.pontos,
    isFeita,
    marcar,
    registar,
    remover,
    recarregar: () => {
      cache = null;
      return ensureLoaded();
    },
  };
}
